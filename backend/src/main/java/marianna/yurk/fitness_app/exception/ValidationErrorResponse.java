package marianna.yurk.fitness_app.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
public class ValidationErrorResponse {
    private final int status;
    private final String message;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private final LocalDateTime timestamp;
    private final Map<String, String> errors;

    public ValidationErrorResponse(int status, String message, LocalDateTime timestamp, Map<String, String> errors) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
        this.errors = errors;
    }

}
