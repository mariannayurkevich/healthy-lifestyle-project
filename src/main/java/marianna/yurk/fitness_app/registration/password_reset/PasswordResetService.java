package marianna.yurk.fitness_app.registration.password_reset;

import lombok.RequiredArgsConstructor;
import marianna.yurk.fitness_app.registration.token.*;
import marianna.yurk.fitness_app.user.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final ConfirmationTokenService tokenService;

    public String sendResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        ConfirmationToken resetToken = new ConfirmationToken(token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(15), user);
        tokenService.save(resetToken);
        // TODO: отправить email пользователю
        return token;
    }

    public String resetPassword(NewPasswordRequest request) {
        Optional<ConfirmationToken> tokenOpt = tokenService.getToken(request.getToken());
        if (tokenOpt.isEmpty()) {
            throw new IllegalStateException("Invalid token");
        }
        ConfirmationToken token = tokenOpt.get();
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expired");
        }
        User user = token.getUser();
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password successfully reset";
    }
}