package marianna.yurk.fitness_app.registration.password_reset;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class PasswordResetRequest {
    @Email(message = "Incorrect email format")
    private String email;
}
