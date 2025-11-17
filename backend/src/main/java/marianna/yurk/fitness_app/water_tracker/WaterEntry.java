package marianna.yurk.fitness_app.water_tracker;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record WaterEntry(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id,
        Integer trackerId,
        LocalDateTime time,
        @Positive
        double amountMl
) {
}
