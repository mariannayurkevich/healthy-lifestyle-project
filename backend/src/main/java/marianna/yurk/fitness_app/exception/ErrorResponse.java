package marianna.yurk.fitness_app.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ErrorResponse {
    private final int status;
    private final String message;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private final LocalDateTime timestamp;
    private final String path;

    public ErrorResponse(int status, String message, LocalDateTime timestamp, String path) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
        this.path = path;
    }
}
