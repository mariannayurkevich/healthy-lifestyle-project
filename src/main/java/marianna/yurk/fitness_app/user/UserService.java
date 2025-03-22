package marianna.yurk.fitness_app.user;

//import org.springframework.security.crypto.password.PasswordEncoder;
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

    // Метод для расчета нормы калорий по формуле Миффлина-Сан Жеора
    private double calculateCalorieNorm(User user) {
        int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
        double bmr;
        if (user.getGender().equalsIgnoreCase("male")) {
            bmr = 10 * user.getWeight() + 6.25 * user.getHeight() - 5 * age + 5;
        } else {
            bmr = 10 * user.getWeight() + 6.25 * user.getHeight() - 5 * age - 161;
        }
        // Можно добавить коэффициент активности, если требуется:
        // double activityFactor = 1.2; // пример для малоподвижного образа жизни
        // return bmr * activityFactor;
        return bmr;
    }

    // Регистрация пользователя
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Пользователь с такой почтой уже существует!");
        }
        // Шифрование пароля
        //user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Расчет нормы калорий
        user.setDailyCalorieNorm(calculateCalorieNorm(user));
        return userRepository.save(user);
    }

    // Получение всех пользователей
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Получение пользователя по email
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
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Пользователь не найден с id " + id));
    }

    // Удаление пользователя
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
