package marianna.yurk.fitness_app.food_tracker;

import jakarta.persistence.Id;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record FoodEntry(
        @Id Integer id,
        Integer trackerId,
        LocalDateTime time,
        String foodName,
        @Positive double calories,
        @Positive double proteins,
        @Positive double fats,
        @Positive double carbs,
        @Positive double fiber,
        @Positive double sugar
) {
}
