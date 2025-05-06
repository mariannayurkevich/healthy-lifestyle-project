package marianna.yurk.fitness_app.chat;

import marianna.yurk.fitness_app.activity_tracker.ActivityTracker;
import marianna.yurk.fitness_app.activity_tracker.ActivityTrackerRepository;
import marianna.yurk.fitness_app.food_tracker.FoodTracker;
import marianna.yurk.fitness_app.food_tracker.FoodTrackerRepository;
import marianna.yurk.fitness_app.sleep_tracker.SleepTracker;
import marianna.yurk.fitness_app.sleep_tracker.SleepTrackerRepository;
import marianna.yurk.fitness_app.stats.DailyReportService;
import marianna.yurk.fitness_app.stats.DailySummaryDTO;
import marianna.yurk.fitness_app.user.Goal;
import marianna.yurk.fitness_app.user.User;
import marianna.yurk.fitness_app.user.UserService;
import marianna.yurk.fitness_app.water_tracker.WaterTracker;
import marianna.yurk.fitness_app.water_tracker.WaterTrackerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final WebClient webClient;
    private final UserService userService;
    private final DailyReportService dailyReportService;

    @Value("${together.api.key}")
    private String apiKey;

    public ChatController(WebClient.Builder webClientBuilder,
                          UserService userService,
                          DailyReportService dailyReportService) {
        this.webClient = webClientBuilder.baseUrl("https://api.together.xyz/v1").build();
        this.userService = userService;
        this.dailyReportService = dailyReportService;
    }

    @PostMapping
    public Mono<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DailySummaryDTO report = dailyReportService.generateReport(user.getId(), LocalDate.now());

        StringBuilder trackersInfo = new StringBuilder("\n\nДанные трекеров:");

        // Активность
        if (report.getActivityDurationMinutes() > 0) {
            trackersInfo.append("\n- Активность за сегодня:")
                    .append(String.format("\n  • Общая продолжительность: %d мин",
                            report.getActivityDurationMinutes()));
        }

        // Питание
        if (report.getTotalCalories() > 0) {
            trackersInfo.append("\n- Питание за сегодня:")
                    .append(String.format("\n  • Калории: %.1f (Б:%.1f, Ж:%.1f, У:%.1f)",
                            report.getTotalCalories(),
                            report.getTotalProteins(),
                            report.getTotalFats(),
                            report.getTotalCarbs()));
        }

        // Сон
        if (report.getSleepDuration() > 0) {
            trackersInfo.append("\n- Сон за сегодня:")
                    .append(String.format("\n  • Продолжительность: %.1f ч",
                            report.getSleepDuration()));
        }

        // Вода
        if (report.getGoalMl() > 0) {
            double percentage = (report.getTotalIntakeMl() / report.getGoalMl()) * 100;
            trackersInfo.append("\n- Потребление воды за сегодня:")
                    .append(String.format("\n  • %.0f/%.0f мл (%.0f%%)",
                            report.getTotalIntakeMl(),
                            report.getGoalMl(),
                            percentage));
        }

        // Добавляем анализ из отчета
        if (report.getAnalysis() != null && !report.getAnalysis().isEmpty()) {
            trackersInfo.append("\n\nАнализ: ").append(report.getAnalysis());
        }

        StringBuilder userProfileBuilder = new StringBuilder();

        // Пол
        if (user.getGender() != null) {
            userProfileBuilder.append(user.getGender().equalsIgnoreCase("male") ? "Мужчина" : "Женщина");
        } else {
            userProfileBuilder.append("Пользователь");
        }

        // Возраст
        if (user.getBirthDate() != null) {
            int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
            userProfileBuilder.append(", ").append(age).append(" лет");
        }

        // Вес и рост
        if (user.getWeight() != null) {
            userProfileBuilder.append(", ").append(user.getWeight()).append(" кг");
        }
        if (user.getHeight() != null) {
            userProfileBuilder.append(", ").append(user.getHeight()).append(" см");
        }

        // Добавляем дополнительную информацию
        String additionalInfo = getAdditionalUserInfo(user);
        if (!additionalInfo.isEmpty()) {
            userProfileBuilder.append(". ").append(additionalInfo);
        }

        String userMessage = payload.get("message");

        String prompt = "Ты — помощник по здоровью. Пользователь: " + userProfileBuilder.toString() + trackersInfo.toString() +
                "\n\nВопрос пользователя: " + userMessage +
                "\n\nОтветь дружелюбно, кратко и с эмодзи.";

        return webClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "model", "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
                        "messages", new Object[]{
                                Map.of("role", "user", "content", prompt)
                        }
                ))
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class).flatMap(body -> {
                            System.err.println("Ошибка от Together.ai: " + body);
                            return Mono.error(new RuntimeException("Ошибка от Together.ai: " + body));
                        })
                )
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }
    private String getAdditionalUserInfo(User user) {
        if (user == null) {
            return "";
        }

        StringBuilder sb = new StringBuilder();

        if (user.getAllergies() != null && !user.getAllergies().isEmpty()) {
            sb.append("Аллергии: ").append(user.getAllergies()).append(". ");
        }

        if (user.getIntolerances() != null && !user.getIntolerances().isEmpty()) {
            sb.append("Непереносимости: ").append(user.getIntolerances()).append(". ");
        }

        if (user.getDailyCalorieNorm() != null) {
            sb.append("Дневная норма калорий: ").append(user.getDailyCalorieNorm().intValue()).append(". ");
        }

        if (user.getActivityLevel() != null) {
            sb.append("Уровень активности: ").append(translateActivityLevel(user.getActivityLevel())).append(". ");
        }

        if (user.getGoal() != null) {
            sb.append("Цель: ").append(translateGoal(user.getGoal())).append(". ");
        }

        return sb.toString();
    }

    private String translateActivityLevel(String activityLevel) {
        switch (activityLevel.toLowerCase()) {
            case "sedentary": return "сидячий образ жизни";
            case "light": return "легкая активность";
            case "moderate": return "умеренная активность";
            case "active": return "высокая активность";
            case "very_active": return "очень высокая активность";
            default: return activityLevel;
        }
    }

    private String translateGoal(Goal goal) {
        switch (goal) {
            case LOSE: return "похудение";
            case GAIN: return "набор массы";
            case MAINTAIN: return "поддержание веса";
            default: return goal.toString();
        }
    }
}
