package marianna.yurk.fitness_app.food_tracker;

import jakarta.persistence.Id;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record FoodEntry(
        @Id Integer id,
        Integer trackerId,
        LocalDateTime time,
        String foodName,
        double calories,
        double proteins,
        double fats,
        double carbs,
        double fiber,
        double sugar
) {
}
