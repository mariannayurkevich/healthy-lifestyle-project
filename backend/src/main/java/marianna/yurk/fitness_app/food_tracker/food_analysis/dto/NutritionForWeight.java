package marianna.yurk.fitness_app.food_tracker.food_analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class NutritionForWeight {
    private double calories;
    private double protein;
    private double carbs;
    private double fat;
    private double fiber;
}
