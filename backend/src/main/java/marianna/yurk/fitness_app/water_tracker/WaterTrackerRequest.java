package marianna.yurk.fitness_app.water_tracker;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;

public record WaterTrackerRequest (
    @NotNull Long userId,
    @NotNull
    LocalDate date,
    @Positive
    double goalMl,
    List<WaterEntry> entries
) {}
