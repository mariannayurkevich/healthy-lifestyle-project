package marianna.yurk.fitness_app.food_tracker.food_analysis.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Setter
public class NutritionInfo {
    private String title;
    private double weight;
    private double kilocalories_per100g;
    private double proteins_per100g;
    private double fats_per100g;
    private double carbohydrates_per100g;
    private double fiber_per100g;
}
