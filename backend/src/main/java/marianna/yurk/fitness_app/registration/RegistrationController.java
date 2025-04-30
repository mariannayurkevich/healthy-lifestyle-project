package marianna.yurk.fitness_app.registration;

import lombok.AllArgsConstructor;
import marianna.yurk.fitness_app.email.EmailRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/registration")
@AllArgsConstructor
public class RegistrationController {
    private RegistrationService registrationService;
    @PostMapping
    public String register(@RequestBody RegistrationRequest request){
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


//    @GetMapping("/google")
//    public ResponseEntity<?> currentUser(@AuthenticationPrincipal OAuth2AuthenticationToken token) {
//        if (token == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated via OAuth2");
//        }
//        return ResponseEntity.ok(token.getPrincipal().getAttributes());
//    }

}
