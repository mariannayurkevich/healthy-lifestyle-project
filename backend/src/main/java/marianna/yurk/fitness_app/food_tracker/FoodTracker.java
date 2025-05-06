package marianna.yurk.fitness_app.food_tracker;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record FoodTracker(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        int id,
        Long userId,
        LocalDate date,
        @Positive double totalCalories,
        @Positive double totalProteins,
        @Positive double totalFats,
        @Positive double totalCarbs,
        @Positive double totalFiber,
        @Positive double totalSugar,
        List<FoodEntry> entries,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }