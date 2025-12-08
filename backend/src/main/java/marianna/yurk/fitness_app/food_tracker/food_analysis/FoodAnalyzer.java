package marianna.yurk.fitness_app.food_tracker.food_analysis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class FoodAnalyzer {
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${together.api.key}")
    private String apiKey;

    public FoodAnalyzer(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.together.xyz/v1").build();
        this.objectMapper = new ObjectMapper();
    }

    public Mono<FoodAnalysisResult> analyzeFood(MultipartFile image) {
        try {
            File tempFile = File.createTempFile("food_analysis", ".jpg");
            image.transferTo(tempFile);
            Mono<FoodAnalysisResult> result = analyze(tempFile);
            tempFile.delete();

            return result;

        } catch (Exception e) {
            throw new FoodAnalysisException("Ошибка анализа: " + e.getMessage());
        }
    }


    private Mono<FoodAnalysisResult> analyze(File imageFile) throws IOException {
        String base64Image = encodeImageToBase64(imageFile);

        return sendToTogetherAI(base64Image)
                .map(responseContent -> {
                    List<NutritionInfo> nutritionInfos = parseNutritionResponse(responseContent);

                    return calculateTotalNutrition(nutritionInfos);
                });
    }

    private String encodeImageToBase64(File imageFile) throws IOException {
        byte[] fileContent = Files.readAllBytes(imageFile.toPath());
        return Base64.getEncoder().encodeToString(fileContent);
    }

    private Mono<String> sendToTogetherAI(String base64Image) {
        List<Map<String, Object>> messages = prepareMessageHistory(base64Image);

        return webClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "model", "meta-llama/Llama-4-Scout-17B-16E-Instruct",
                        "messages", messages,
                        "temperature", 0.1,
                        "max_tokens", 2000,
                        "response_format", Map.of("type", "json_object")
                ))
                .retrieve()
                .onStatus(status -> status.isError(), this::handleAPIError)
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(this::extractJsonContent);
    }

    private List<Map<String, Object>> prepareMessageHistory(String base64Image) {
        return List.of(
                Map.of(
                        "role", "user",
                        "content", List.of(
                                Map.of("type", "text", "text", buildNutritionPrompt()),
                                Map.of("type", "image_url", "image_url",
                                        Map.of("url", "data:image/jpeg;base64," + base64Image))
                        )
                )
        );
    }

    private String buildNutritionPrompt() {
        return """
               Ты - очень полезный помощник в определении калорийности и пищевой ценности еды.
                              \s
                               На фотографии изображены пищевые продукты для приема пищи. Определи, какие продукты показаны на фото, и верни их в виде JSON объекта с массивом "products",
                               где каждый элемент массива должен содержать:
                               * "title" - название продукта на русском языке,
                               * "weight" - вес в граммах (примерная оценка),
                               * "kilocalories_per100g" - сколько килокалорий содержится в 100 граммах этого продукта,
                               * "proteins_per100g" - количество белков в 100 граммах этого продукта,
                               * "fats_per100g" - количество жиров в 100 граммах этого продукта,
                               * "carbohydrates_per100g" - количество углеводов в 100 граммах этого продукта,
                               * "fiber_per100g" - количество пищевых волокон в 100 граммах этого продукта
                              \s
                               ВАЖНО:
                               1. Названия продуктов должны быть на русском языке
                               2. Вес указывай в граммах (реалистичная оценка по фото)
                               3. Значения калорийности и БЖУ должны быть реалистичными для данного продукта
                               4. Возвращай ТОЛЬКО валидный JSON без дополнительного текста, объяснений или форматирования markdown
                               5. Если на фото несколько продуктов, верни массив со всеми найденными продуктами
                               6. Используй точные научные данные о пищевой ценности продуктов
                              \s
                               Пример формата ответа:
                               {
                                 "products": [
                                   {
                                     "title": "Яблоко",
                                     "weight": 150,
                                     "kilocalories_per100g": 52,
                                     "proteins_per100g": 0.3,
                                     "fats_per100g": 0.2,
                                     "carbohydrates_per100g": 14,
                                     "fiber_per100g": 2.4
                                   }
                                 ]
                               }
            """;
    }

    private String extractJsonContent(Map<String, Object> response) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                if (message != null) {
                    String content = (String) message.get("content");

                    return content.replace("```json", "").replace("```", "").trim();
                }
            }
            throw new FoodAnalysisException("Invalid response format from AI");
        } catch (Exception e) {
            throw new FoodAnalysisException("Failed to extract content from AI response", e);
        }
    }

    private Mono<Throwable> handleAPIError(ClientResponse response) {
        return response.bodyToMono(String.class)
                .flatMap(body -> {
                    String errorMsg = "Ошибка Together AI API: " + response.statusCode() + " - " + body;
                    System.err.println(errorMsg);
                    return Mono.error(new FoodAnalysisException(errorMsg));
                });
    }

    private List<NutritionInfo> parseNutritionResponse(String responseContent) {
        try {
            JsonNode jsonNode = objectMapper.readTree(responseContent);

            if (jsonNode.has("products") && jsonNode.get("products").isArray()) {
                JsonNode productsArray = jsonNode.get("products");
                return objectMapper.convertValue(productsArray, new TypeReference<List<NutritionInfo>>() {});
            }
            else if (jsonNode.isArray()) {
                return objectMapper.convertValue(jsonNode, new TypeReference<List<NutritionInfo>>() {});
            }
            else if (jsonNode.isObject()) {
                NutritionInfo singleItem = objectMapper.convertValue(jsonNode, NutritionInfo.class);
                return List.of(singleItem);
            } else {
                throw new FoodAnalysisException("Invalid JSON format - expected array or object with 'products' field");
            }
        } catch (Exception e) {
            throw new FoodAnalysisException("Failed to parse AI response: " + e.getMessage() + "\nJSON: " + responseContent, e);
        }
    }

    private FoodAnalysisResult calculateTotalNutrition(List<NutritionInfo> nutritionInfos) {
        double totalKilocalories = 0;
        double totalProteins = 0;
        double totalFats = 0;
        double totalCarbohydrates = 0;
        double totalFiber = 0;

        for (NutritionInfo info : nutritionInfos) {
            double ratio = info.getWeight() / 100.0;
            totalKilocalories += ratio * info.getKilocalories_per100g();
            totalProteins += ratio * info.getProteins_per100g();
            totalFats += ratio * info.getFats_per100g();
            totalCarbohydrates += ratio * info.getCarbohydrates_per100g();
            totalFiber += ratio * info.getFiber_per100g();
        }

        return new FoodAnalysisResult(
                nutritionInfos,
                Math.round(totalKilocalories),
                Math.round(totalProteins),
                Math.round(totalFats),
                Math.round(totalCarbohydrates),
                Math.round(totalFiber)
        );
    }
}
