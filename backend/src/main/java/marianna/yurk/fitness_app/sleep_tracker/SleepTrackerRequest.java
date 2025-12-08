package marianna.yurk.fitness_app.sleep_tracker;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.time.LocalTime;

public record SleepTrackerRequest (
    @NotNull(message = "Date must not be null")
    @PastOrPresent(message = "Date cannot be in the future")
    LocalDate date,

    @NotNull(message = "Bedtime must not be null")
    LocalTime bedtime,

    @NotNull(message = "Wakeup time must not be null")
    LocalTime wakeupTime,

    @NotNull(message = "Sleep duration must not be null")
    @Min(value = 0, message = "Sleep duration cannot be negative")
    Double sleepDuration,

    @NotNull(message = "Sleep quality must not be null")
    @Min(value = 1, message = "Sleep quality must be between 1 and 5")
    @Max(value = 5, message = "Sleep quality must be between 1 and 5")
    Integer sleepQuality,

    String notes,

    Long userId
){}
