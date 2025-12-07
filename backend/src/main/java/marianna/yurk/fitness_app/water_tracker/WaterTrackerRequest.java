package marianna.yurk.fitness_app.water_tracker;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record WaterTrackerRequest(
        @NotNull(message = "User ID обязателен")
        Long userId,
        LocalDate date,
        double goalMl,
        List<WaterEntry> entries
) { }