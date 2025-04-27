package marianna.yurk.fitness_app.registration.password_reset;

import lombok.*;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class PasswordResetRequest {
    private String email;
}
