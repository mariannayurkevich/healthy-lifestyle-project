package marianna.yurk.fitness_app.food_tracker.food_analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class NutritionPer100g {
    private double calories_per_100g;
    private double protein_per_100g;
    private double carbs_per_100g;
    private double fat_per_100g;
    private double fiber_per_100g;
}
