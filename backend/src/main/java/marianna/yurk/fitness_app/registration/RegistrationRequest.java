package marianna.yurk.fitness_app.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class RegistrationRequest {
    @NotEmpty(message = "The name is required")
    private final String firstName;
    @NotEmpty(message = "Last name is required")
    private final String lastName;

    @NotEmpty(message = "A password is required")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "The password must contain at least 8 characters, at least one digit and one capital letter."
    )
    private final String password;
    @NotEmpty(message = "Password confirmation is required")
    private String confirmPassword;
    @NotEmpty(message = "Email is required")
    @Email(message = "Incorrect email format")
    private final String email;
}
