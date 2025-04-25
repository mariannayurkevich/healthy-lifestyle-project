package marianna.yurk.fitness_app.registration.password_reset;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class NewPasswordRequest {
    private String token;
    private String newPassword;
    private String confirmPassword;
}
