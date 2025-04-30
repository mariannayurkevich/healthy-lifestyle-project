package marianna.yurk.fitness_app.registration.password_reset;

import lombok.RequiredArgsConstructor;
import marianna.yurk.fitness_app.registration.token.ConfirmationToken;
import marianna.yurk.fitness_app.registration.token.ConfirmationTokenService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final ConfirmationTokenService confirmationTokenService;

    @PostMapping("/forgot")
    public String forgotPassword(@RequestBody PasswordResetRequest request) {
        return passwordResetService.sendResetToken(request.getEmail());
    }

    @PostMapping("/reset")
    public String resetPassword(@RequestBody NewPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        return passwordResetService.resetPassword(request);
    }

    @GetMapping("/reset")
    public String showResetForm(@RequestParam("token") String token) {
        Optional<ConfirmationToken> tokenOpt = confirmationTokenService.getToken(token);
        if (tokenOpt.isEmpty()) {
            throw new IllegalStateException("Invalid token");
        }
        return "Please enter your new password.";
    }
}