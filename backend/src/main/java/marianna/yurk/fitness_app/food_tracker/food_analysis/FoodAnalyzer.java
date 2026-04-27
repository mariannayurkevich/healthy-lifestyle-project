package marianna.yurk.fitness_app.food_tracker.food_analysis;

import marianna.yurk.fitness_app.food_tracker.food_analysis.dto.AIPredictionResponse;
import marianna.yurk.fitness_app.food_tracker.food_analysis.dto.FoodAnalysisResult;
import marianna.yurk.fitness_app.food_tracker.food_analysis.dto.NutritionForWeight;
import marianna.yurk.fitness_app.food_tracker.food_analysis.dto.NutritionInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;
import java.util.List;

@Service
public class FoodAnalyzer {

    private final WebClient webClient;

    @Value("${food.analysis.api.url:http://localhost:8000}")
    private String apiBaseUrl;

    @Value("${food.analysis.api.endpoint:/predict}")
    private String apiEndpoint;

    @Value("${food.analysis.timeout:30}")
    private int timeoutSeconds;

    public FoodAnalyzer(WebClient.Builder webClientBuilder) {
        // Configure connection provider to avoid resolver issues
        ConnectionProvider provider = ConnectionProvider.builder("food-analysis")
                .maxConnections(100)
                .build();

        HttpClient httpClient = HttpClient.create(provider)
                .responseTimeout(Duration.ofSeconds(timeoutSeconds));

        this.webClient = webClientBuilder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }


    public Mono<FoodAnalysisResult> analyzeFood(MultipartFile image, double weightGrams) {
        return callLocalAI(image, weightGrams)
                .map(this::toFoodAnalysisResult);
    }

    private Mono<AIPredictionResponse> callLocalAI(MultipartFile image, double weightGrams) {
        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", image.getResource())
                .header(HttpHeaders.CONTENT_DISPOSITION, "form-data; name=file; filename=" + image.getOriginalFilename());
        bodyBuilder.part("weight", weightGrams)
                .header(HttpHeaders.CONTENT_DISPOSITION, "form-data; name=weight");

        String fullUrl = apiBaseUrl + apiEndpoint;

        return webClient.post()
                .uri(fullUrl)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(bodyBuilder.build())
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleApiError)
                .bodyToMono(AIPredictionResponse.class);
    }

    private Mono<Throwable> handleApiError(ClientResponse response) {
        return response.bodyToMono(String.class)
                .flatMap(errorBody -> {
                    String message = String.format("Local AI API error: %s - %s",
                            response.statusCode(), errorBody);
                    return Mono.error(new FoodAnalysisException(message));
                });
    }

    private FoodAnalysisResult toFoodAnalysisResult(AIPredictionResponse response) {
        NutritionInfo dishInfo = getNutritionInfo(response);

        NutritionForWeight totals = response.getNutrition_for_weight();

        return new FoodAnalysisResult(
                List.of(dishInfo),
                Math.round(totals.getCalories()),
                Math.round(totals.getProtein()),
                Math.round(totals.getFat()),
                Math.round(totals.getCarbs()),
                Math.round(totals.getFiber())
        );
    }

    private static NutritionInfo getNutritionInfo(AIPredictionResponse response) {
        NutritionInfo dishInfo = new NutritionInfo();
        dishInfo.setTitle(response.getDish());
        dishInfo.setWeight(response.getWeight_g());
        dishInfo.setKilocalories_per100g(response.getNutrition_per_100g().getCalories_per_100g());
        dishInfo.setProteins_per100g(response.getNutrition_per_100g().getProtein_per_100g());
        dishInfo.setFats_per100g(response.getNutrition_per_100g().getFat_per_100g());
        dishInfo.setCarbohydrates_per100g(response.getNutrition_per_100g().getCarbs_per_100g());
        dishInfo.setFiber_per100g(response.getNutrition_per_100g().getFiber_per_100g());
        return dishInfo;
    }
}