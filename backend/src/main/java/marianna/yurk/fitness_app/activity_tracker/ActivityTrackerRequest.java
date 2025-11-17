package marianna.yurk.fitness_app.activity_tracker;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record ActivityTrackerRequest (
        @NotBlank(message = "Activity type must not be blank")
        String activityType,

        @NotNull(message = "Duration must not be null")
        @Positive(message = "Duration must be positive")
        Integer duration,

        @NotNull(message = "Calories burned must not be null")
        @Positive(message = "Calories burned must be positive")
        Integer caloriesBurned,

        @NotNull(message = "Activity timestamp must not be null")
        LocalDateTime activityTimestamp,

        @NotNull(message = "User ID must not be null")
        Long userId
){}
