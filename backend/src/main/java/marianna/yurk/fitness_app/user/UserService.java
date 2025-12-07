package marianna.yurk.fitness_app.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import marianna.yurk.fitness_app.registration.token.ConfirmationToken;
import marianna.yurk.fitness_app.registration.token.ConfirmationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
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

    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String USER_CACHE_KEY = "user:";
    private static final String USER_EMAIL_CACHE_KEY = "user_email:";
    private static final String ALL_USERS_CACHE_KEY = "all_users";

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

    @SuppressWarnings("unchecked")
    public List<User> getAllUsers() {
        Object cachedObject = redisTemplate.opsForValue().get(ALL_USERS_CACHE_KEY);
        if (cachedObject != null) {
            try {
                return (List<User>) cachedObject;
            } catch (ClassCastException e) {
                redisTemplate.delete(ALL_USERS_CACHE_KEY);
            }
        }

        List<User> users = userRepository.findAll();
        redisTemplate.opsForValue().set(ALL_USERS_CACHE_KEY, users, Duration.ofMinutes(30));
        return users;
    }

    public Optional<User> getUserByEmail(String email) {
        String cacheKey = USER_EMAIL_CACHE_KEY + email;

        Object cachedObject = redisTemplate.opsForValue().get(cacheKey);
        if (cachedObject != null) {
            try {
                User cachedUser = (User) cachedObject;
                return Optional.of(cachedUser);
            } catch (ClassCastException e) {
                // Если в кэше неверный тип, удаляем его
                redisTemplate.delete(cacheKey);
            }
        }

        Optional<User> user = userRepository.findByEmail(email);
        user.ifPresent(u -> {
            redisTemplate.opsForValue().set(cacheKey, u, Duration.ofMinutes(30));
            redisTemplate.opsForValue().set(USER_CACHE_KEY + u.getId(), u, Duration.ofMinutes(30));
        });

        return user;
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            boolean isUpdated = false;

            if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
                if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                    throw new IllegalStateException("Email already taken");
                }
                user.setEmail(updatedUser.getEmail());
                isUpdated = true;
            }

            if (updatedUser.getFirstName() != null && !updatedUser.getFirstName().equals(user.getFirstName())) {
                user.setFirstName(updatedUser.getFirstName());
                isUpdated = true;
            }

            if (updatedUser.getLastName() != null && !updatedUser.getLastName().equals(user.getLastName())) {
                user.setLastName(updatedUser.getLastName());
                isUpdated = true;
            }

            if (updatedUser.getGender() != null && !updatedUser.getGender().equals(user.getGender())) {
                user.setGender(updatedUser.getGender());
                isUpdated = true;
            }

            if (updatedUser.getBirthDate() != null && !updatedUser.getBirthDate().equals(user.getBirthDate())) {
                user.setBirthDate(updatedUser.getBirthDate());
                isUpdated = true;
            }

            if (updatedUser.getHeight() != null && !updatedUser.getHeight().equals(user.getHeight())) {
                user.setHeight(updatedUser.getHeight());
                isUpdated = true;
            }

            if (updatedUser.getWeight() != null && !updatedUser.getWeight().equals(user.getWeight())) {
                user.setWeight(updatedUser.getWeight());
                isUpdated = true;
            }

            if (updatedUser.getAllergies() != null && !updatedUser.getAllergies().equals(user.getAllergies())) {
                user.setAllergies(updatedUser.getAllergies());
                isUpdated = true;
            }

            if (updatedUser.getIntolerances() != null && !updatedUser.getIntolerances().equals(user.getIntolerances())) {
                user.setIntolerances(updatedUser.getIntolerances());
                isUpdated = true;
            }

            if (updatedUser.getActivityLevel() != null && !updatedUser.getActivityLevel().equals(user.getActivityLevel())) {
                user.setActivityLevel(updatedUser.getActivityLevel());
                isUpdated = true;
            }

            if (updatedUser.getGoal() != null && !updatedUser.getGoal().equals(user.getGoal())) {
                user.setGoal(updatedUser.getGoal());
                isUpdated = true;
            }

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(bCryptPasswordEncoder.encode(updatedUser.getPassword()));
                isUpdated = true;
            }

            if (updatedUser.getUserRole() != null && !updatedUser.getUserRole().equals(user.getUserRole())) {
                user.setUserRole(updatedUser.getUserRole());
                isUpdated = true;
            }

            if (updatedUser.getLocked() != null && !updatedUser.getLocked().equals(user.getLocked())) {
                user.setLocked(updatedUser.getLocked());
                isUpdated = true;
            }

            if (updatedUser.getBirthDate() != null
                    && updatedUser.getHeight() != null
                    && updatedUser.getWeight() != null
                    && updatedUser.getGender() != null
                    && updatedUser.getActivityLevel() != null) {
                user.setDailyCalorieNorm(calculateCalorieNorm(updatedUser));
                isUpdated = true;
            }

            if (updatedUser.getImageUrl() != null && !updatedUser.getImageUrl().equals(user.getImageUrl())) {
                user.setImageUrl(updatedUser.getImageUrl());
                isUpdated = true;
            }

            if (updatedUser.getProfileCompleted() != null) {
                user.setProfileCompleted(updatedUser.getProfileCompleted());
                isUpdated = true;
            }

            if (isUpdated) {
                User savedUser = userRepository.save(user);
                updateUserCache(savedUser);
                return savedUser;
            } else {
                return user;
            }
        }).orElseThrow(() -> new RuntimeException("The user was not found with the id " + id));
    }

    private void updateUserCache(User user) {
        String userCacheKey = USER_CACHE_KEY + user.getId();
        String emailCacheKey = USER_EMAIL_CACHE_KEY + user.getEmail();

        redisTemplate.opsForValue().set(userCacheKey, user, Duration.ofMinutes(30));
        redisTemplate.opsForValue().set(emailCacheKey, user, Duration.ofMinutes(30));

        redisTemplate.delete(ALL_USERS_CACHE_KEY);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);

        String userCacheKey = USER_CACHE_KEY + id;
        redisTemplate.delete(userCacheKey);

        redisTemplate.delete(ALL_USERS_CACHE_KEY);

        Optional<User> user = userRepository.findById(id);
        user.ifPresent(u -> {
            String emailCacheKey = USER_EMAIL_CACHE_KEY + u.getEmail();
            redisTemplate.delete(emailCacheKey);
        });
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
        User savedUser = userRepository.save(user);

        updateUserCache(savedUser);

        return createAndSaveConfirmationToken(user);
    }

    public int enableUser(String email) {
        int result = userRepository.enableUser(email);
        return userRepository.enableUser(email);
    }

    public Optional<User> getUserById(Long id) {
        String cacheKey = USER_CACHE_KEY + id;

        Object cachedObject = redisTemplate.opsForValue().get(cacheKey);
        if (cachedObject != null) {
            try {
                User cachedUser = (User) cachedObject;
                return Optional.of(cachedUser);
            } catch (ClassCastException e) {
                redisTemplate.delete(cacheKey);
            }
        }

        Optional<User> user = userRepository.findById(id);
        user.ifPresent(u -> {
            redisTemplate.opsForValue().set(cacheKey, u, Duration.ofMinutes(30));
        });
        return user;
    }

}