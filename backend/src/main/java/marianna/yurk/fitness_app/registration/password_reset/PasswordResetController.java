package marianna.yurk.fitness_app.registration.password_reset;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

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
}