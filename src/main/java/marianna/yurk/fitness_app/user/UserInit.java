package marianna.yurk.fitness_app.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class UserInit implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(UserInit.class);
    private final UserRepository userRepository;
    private final UserService userService;

    public UserInit(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User defaultUser = new User(
                    "Default User",
                    "user@example.com",
                    "password",
                    "female",
                    LocalDate.of(2000, 1, 1),
                    170.0,
                    65.0,
                    "none",
                    "none",
                    0.0,  // норма калорий будет рассчитана в сервисе
                    ""
            );
            userService.registerUser(defaultUser);
            log.info("Default user created: {}", defaultUser.getEmail());
        } else {
            log.info("User data already exists.");
        }
    }
}
