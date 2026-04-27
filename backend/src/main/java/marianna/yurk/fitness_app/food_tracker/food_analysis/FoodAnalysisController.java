package marianna.yurk.fitness_app.food_tracker.food_analysis;

import lombok.AllArgsConstructor;
import marianna.yurk.fitness_app.food_tracker.food_analysis.dto.FoodAnalysisResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
public class FoodAnalysisController {
    private final FoodAnalyzer analyzer;

    @PostMapping("/analyze-food")
    public Mono<FoodAnalysisResult> analyzeFood(@RequestParam("image") MultipartFile image,
                                                @RequestParam("weight") double weightGrams) {
        if (image.isEmpty()) {
            return Mono.error(new FoodAnalysisException("Файл не может быть пустым"));
        }
        if (weightGrams <= 0) {
            return Mono.error(new FoodAnalysisException("Вес должен быть положительным числом"));
        }

        return analyzer.analyzeFood(image,weightGrams);
    }
}
