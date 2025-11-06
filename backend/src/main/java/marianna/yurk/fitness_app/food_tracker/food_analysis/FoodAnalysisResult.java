package marianna.yurk.fitness_app.food_tracker.food_analysis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@AllArgsConstructor
@ToString
public class FoodAnalysisResult {
    private List<NutritionInfo> products;
    private double totalKilocalories;
    private double totalProteins;
    private double totalFats;
    private double totalCarbohydrates;
    private double totalFiber;
}
