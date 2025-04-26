package marianna.yurk.fitness_app.water_tracker;

import jakarta.persistence.Id;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record WaterTracker(
        @Id int id,
        Long userId,
        LocalDate date,
        @Positive double totalIntakeMl,
        @Positive double goalMl,
        List<WaterEntry> entries,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }