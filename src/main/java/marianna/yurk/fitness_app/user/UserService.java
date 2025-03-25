package marianna.yurk.fitness_app.user;

//import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    //private final PasswordEncoder passwordEncoder; // Предполагается, что в конфигурации настроен BCryptPasswordEncoder

    public UserService(UserRepository userRepository){//, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        //this.passwordEncoder = passwordEncoder;
    }

    private double calculateCalorieNorm(User user) {
        int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
        double bmr;
        if (user.getGender().equalsIgnoreCase("male")) {
            bmr = 10 * user.getWeight() + 6.25 * user.getHeight() - 5 * age + 5;
        } else {
            bmr = 10 * user.getWeight() + 6.25 * user.getHeight() - 5 * age - 161;
        }
        double activityFactor = getActivityFactor(user.getActivityLevel());
        return bmr * activityFactor;
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

    @Transactional
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        user.setDailyCalorieNorm(calculateCalorieNorm(user));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Обновление пользователя
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
//            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
//                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
//            }
            user.setGender(updatedUser.getGender());
            user.setBirthDate(updatedUser.getBirthDate());
            user.setHeight(updatedUser.getHeight());
            user.setWeight(updatedUser.getWeight());
            user.setAllergies(updatedUser.getAllergies());
            user.setIntolerances(updatedUser.getIntolerances());
            user.setDailyCalorieNorm(calculateCalorieNorm(updatedUser));
            user.setActivityLevel(updatedUser.getActivityLevel());

            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Пользователь не найден с id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
