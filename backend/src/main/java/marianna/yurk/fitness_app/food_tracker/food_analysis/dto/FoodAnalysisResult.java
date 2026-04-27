package marianna.yurk.fitness_app.food_tracker.food_analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@AllArgsConstructor
@ToString
@Setter
public class FoodAnalysisResult {
    private List<NutritionInfo> products;
    private double totalKilocalories;
    private double totalProteins;
    private double totalFats;
    private double totalCarbohydrates;
    private double totalFiber;
}
