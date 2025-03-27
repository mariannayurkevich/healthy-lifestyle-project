package marianna.yurk.fitness_app.sleep_tracker;

import jakarta.persistence.Id;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record SleepTracker(
        @Id
        int id,
        LocalDate date,
        LocalTime bedtime,
        LocalTime wakeupTime,
        @Positive
        double sleepDuration,
        @Positive
        int sleepQuality,  // Качество сна (1-5)
        String notes,
        Long userId
) { }
