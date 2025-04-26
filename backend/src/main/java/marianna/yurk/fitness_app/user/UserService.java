package marianna.yurk.fitness_app.user;

import lombok.AllArgsConstructor;
import marianna.yurk.fitness_app.registration.token.ConfirmationToken;import marianna.yurk.fitness_app.registration.token.ConfirmationTokenService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final static String USER_NOT_FOUND_MSG =
            "User with email %s not found";
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ConfirmationTokenService confirmationTokenService;

    private double calculateCalorieNorm(User user) {
        int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
        double bmr;
        if (user.getGender().equalsIgnoreCase("male")) {
            bmr = 10 * user.getWeight() + 6.25 * user.getHeight() - 5 * age + 5;
        } else {
            bmr = 10 * user.getWeight() + 6.25 * user.getHeight() - 5 * age - 161;
        }
        double activityFactor = getActivityFactor(user.getActivityLevel());

        double maintenanceCalories = bmr * activityFactor;

        return switch (user.getGoal()) {
            case LOSE -> maintenanceCalories - 500;
            case GAIN -> maintenanceCalories + 500;
            default -> maintenanceCalories;
        };

    }

    private double getActivityFactor(String activityLevel) {
        if (activityLevel == null) {
            return 1.2;
        }

        return switch (activityLevel.toLowerCase()) {
            case "sedentary" -> 1.2;       // сидячий образ жизни
            case "light" -> 1.375;          // легкая активность (1-3 раза в неделю)
            case "moderate" -> 1.55;         // умеренная активность (3-5 раз в неделю)
            case "active" -> 1.725;          // высокая активность (6-7 раз в неделю)
            case "very_active" -> 1.9;      // очень высокая активность (физическая работа + тренировки)
            default -> 1.2;                 // по умолчанию
        };
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            if (!user.getEmail().equals(updatedUser.getEmail())) {
                if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                    throw new IllegalStateException("Email already taken");
                }
                user.setEmail(updatedUser.getEmail());
            }

            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setGender(updatedUser.getGender());
            user.setBirthDate(updatedUser.getBirthDate());
            user.setHeight(updatedUser.getHeight());
            user.setWeight(updatedUser.getWeight());
            user.setAllergies(updatedUser.getAllergies());
            user.setIntolerances(updatedUser.getIntolerances());
            user.setActivityLevel(updatedUser.getActivityLevel());
            user.setGoal(updatedUser.getGoal());


            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(bCryptPasswordEncoder.encode(updatedUser.getPassword()));
            }

            if (updatedUser.getUserRole() != null) {
                user.setUserRole(updatedUser.getUserRole());
            }
            if (updatedUser.getLocked() != null) {
                user.setLocked(updatedUser.getLocked());
            }
            if (updatedUser.getEnabled() != null) {
                user.setEnabled(updatedUser.getEnabled());
            }

            if (updatedUser.getBirthDate() != null
                    && updatedUser.getHeight() != null
                    && updatedUser.getWeight() != null
                    && updatedUser.getGender() != null
                    && updatedUser.getActivityLevel() != null) {
                user.setDailyCalorieNorm(calculateCalorieNorm(updatedUser));
            } else {
                user.setDailyCalorieNorm(null);
            }

            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("The user was not found with the id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(String.format(USER_NOT_FOUND_MSG, email)));
    }

    private String createAndSaveConfirmationToken(User user) {
        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                user
        );
        confirmationTokenService.save(confirmationToken);
        return token;
    }

    public String signUpUser(User user) {
        Optional<User> existingUserOpt = userRepository.findByEmail(user.getEmail());

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (!existingUser.getEnabled()) {
                return createAndSaveConfirmationToken(existingUser);
            }

            throw new IllegalStateException("User with this email already exists");
        }

        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        return createAndSaveConfirmationToken(user);
    }

    public int enableUser(String email) {
        return userRepository.enableUser(email);
    }
}
