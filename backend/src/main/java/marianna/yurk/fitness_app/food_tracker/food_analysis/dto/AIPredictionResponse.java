package marianna.yurk.fitness_app.food_tracker.food_analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class AIPredictionResponse {
    private String dish;
    private double confidence;
    private double weight_g;
    private NutritionPer100g nutrition_per_100g;
    private NutritionForWeight nutrition_for_weight;
}