package marianna.yurk.fitness_app.food_tracker;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.util.List;

public record FoodTrackerRequest (
        Long userId,

        @NotNull(message = "Date must not be null")
        @PastOrPresent(message = "Date cannot be in the future")
        LocalDate date,

        List<FoodEntry> entries
){}
