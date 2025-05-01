package marianna.yurk.fitness_app.email;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmailRequest {
    @Email(message = "Incorrect email format")
    private String email;
}
