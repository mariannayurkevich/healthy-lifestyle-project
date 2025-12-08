package marianna.yurk.fitness_app.water_tracker;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record WaterTrackerRequest(
        Long userId,
        LocalDate date,
        double goalMl,
        List<WaterEntry> entries
) {
    public static WaterTrackerRequest withUserId(Long userId, WaterTrackerRequest original) {
        return new WaterTrackerRequest(
                userId,
                original.date(),
                original.goalMl(),
                original.entries()
        );
    }
}