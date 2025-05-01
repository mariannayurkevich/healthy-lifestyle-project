package marianna.yurk.fitness_app.registration;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import marianna.yurk.fitness_app.email.EmailRequest;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path = "api/v1/registration")
@AllArgsConstructor
public class RegistrationController {
    private RegistrationService registrationService;
    @PostMapping
    public String register(@RequestBody @Valid RegistrationRequest request){
        return registrationService.register(request);
    }

    @GetMapping(path = "confirm")
    public String confirm(@RequestParam("token") String token) {
        return registrationService.confirmToken(token);
    }

    @PostMapping("/resend-activation")
    public String resendActivationEmail(@RequestBody EmailRequest request) {
        return registrationService.resendActivationEmail(request.getEmail());
    }
}
