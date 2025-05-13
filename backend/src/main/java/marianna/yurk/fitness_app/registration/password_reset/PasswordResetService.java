package marianna.yurk.fitness_app.registration.password_reset;

import lombok.RequiredArgsConstructor;
import marianna.yurk.fitness_app.email.EmailSender;
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
    private final EmailSender emailSender;

    public String sendResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        ConfirmationToken resetToken = new ConfirmationToken(token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(15), user);
        tokenService.save(resetToken);

        String resetLink = "http://localhost:3000/resetpasswordmenu?token=" + token;

        String emailContent = buildResetEmail(user.getFirstName(), resetLink);

        emailSender.send(user.getEmail(), emailContent);

        return token;
    }

    private String buildResetEmail(String name, String link) {
        return "Привет, " + name + "!\n\n"
                + "Ты запросил(а) сброс пароля.\n"
                + "Нажми на ссылку ниже, чтобы установить новый пароль:\n"
                + link + "\n\n"
                + "Срок действия ссылки — 15 минут.\n"
                + "Если ты не запрашивал(а) сброс пароля, просто проигнорируй это письмо.\n\n"
                + "С уважением,\n"
                + "Команда поддержки";
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