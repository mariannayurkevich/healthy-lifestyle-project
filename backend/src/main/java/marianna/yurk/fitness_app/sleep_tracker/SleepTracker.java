package marianna.yurk.fitness_app.sleep_tracker;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalTime;

public record SleepTracker(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        int id,
        LocalDate date,
        LocalTime bedtime,
        LocalTime wakeupTime,
        double sleepDuration,
        int sleepQuality,  // Качество сна (1-5)
        String notes,
        Long userId
) { }
