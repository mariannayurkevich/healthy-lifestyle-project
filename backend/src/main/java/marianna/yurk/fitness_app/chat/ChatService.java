package marianna.yurk.fitness_app.chat;


import io.netty.resolver.DefaultAddressResolverGroup;
import marianna.yurk.fitness_app.stats.DailyReportService;
import marianna.yurk.fitness_app.stats.DailySummaryDTO;
import marianna.yurk.fitness_app.user.Goal;
import marianna.yurk.fitness_app.user.User;
import marianna.yurk.fitness_app.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final WebClient webClient;
    private final UserService userService;
    private final DailyReportService dailyReportService;
    private final ChatHistoryRepository chatHistoryRepository;

    @Value("${together.api.timeout:30}")
    private int timeoutSeconds;

    @Value("${together.api.key}")
    private String apiKey;

    public ChatService(WebClient.Builder webClientBuilder,
                          UserService userService,
                          DailyReportService dailyReportService,
                          ChatHistoryRepository chatHistoryRepository) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.together.xyz/v1")
                .clientConnector(new ReactorClientHttpConnector(
                        HttpClient.create()
                                .responseTimeout(Duration.ofSeconds(timeoutSeconds))
                                .resolver(DefaultAddressResolverGroup.INSTANCE)
                ))
                .build();
        this.userService = userService;
        this.dailyReportService = dailyReportService;
        this.chatHistoryRepository = chatHistoryRepository;
    }

    public Mono<Map<String, Object>> handleChat(String userEmail, String userMessage) {
        User user = userService.getUserByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        DailySummaryDTO report = dailyReportService.generateReport(user.getId(), LocalDate.now());
        List<ChatHistory> history = getChatHistory(user);

        saveMessage(user, "user", userMessage);

        return generateAIResponse(user, report, history, userMessage)
                .flatMap(assistantReply -> {
                    saveMessage(user, "assistant", assistantReply);
                    return Mono.just(Map.of("reply", assistantReply));
                });
    }

    private List<ChatHistory> getChatHistory(User user) {
        List<ChatHistory> history = chatHistoryRepository
                .findTop20ByUserOrderByTimestampDesc(user);
        Collections.reverse(history);
        return history;
    }

    private void saveMessage(User user, String role, String content) {
        chatHistoryRepository.save(new ChatHistory(
                null,
                user,
                role,
                content,
                LocalDateTime.now()
        ));
    }

    private Mono<String> generateAIResponse(User user,
                                            DailySummaryDTO report,
                                            List<ChatHistory> history,
                                            String userMessage) {
        String systemPrompt = buildSystemPrompt(user, report, history);
        List<Map<String, String>> messages = prepareMessageHistory(systemPrompt, history, userMessage);

        return webClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "model", "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                        "messages", messages,
                        "temperature", 0.3,
                        "max_tokens", 500
                ))
                .retrieve()
                .onStatus(status -> status.isError(), this::handleAPIError)
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(this::extractAssistantReply);
    }

    private String buildSystemPrompt(User user, DailySummaryDTO report, List<ChatHistory> history) {
        return String.format("""
                        Ты русскоязычный персональный помощник по здоровью. Твоя задача - анализировать данные пользователя и давать персонализированные рекомендации на РУССКОМ ЯЗЫКЕ.
                                                                                          \s
                                                                                           КРИТИЧЕСКИ ВАЖНО:
                                                                                           1. Отвечай ТОЛЬКО на русском языке. Никаких английских, китайских или других языков.
                                                                                           2. Не используй английские слова и термины без крайней необходимости.
                                                                                           3. Если вопрос неясен - уточни, но не пытайся отвечать на вопросы не по теме здоровья.
                                                                                           4. Держись темы здоровья, питания и фитнеса.
                                                                                          \s
                                                                                           ### Профиль пользователя:
                                                                                           %s
                                                                                          \s
                                                                                           ### Сегодняшняя статистика:
                                                                                           %s
                                                                                          \s
                                                                                           ### История диалога (последние сообщения):
                                                                                           %s
                                                                                          \s
                                                                                           ### Стиль ответа:
                                                                                           1. Только на русском, без иностранных слов
                                                                                           2. Дружелюбный, поддерживающий тон
                                                                                           3. Используй эмодзи умеренно (1-2 в ответе)
                                                                                                                   4. Учитывай цели и ограничения пользователя
                                                                                                                   5. Если данных мало - попроси дополнить информацию
                                                                                                                   6. Будь конкретным и практичным
                                                                                                                   7. Длина ответа: 3-5 предложений
                                                                                                                  \s
                                                                                                                   ### Если вопрос не по теме здоровья:
                                                                                                                   "Я специализируюсь на вопросах здоровья и питания. Могу помочь с анализом ваших данных, рекомендациями по питанию или тренировкам."
            """,
                buildUserProfile(user),
                buildTrackersInfo(report),
                formatChatHistory(history)
        );
    }

    private String buildUserProfile(User user) {
        return String.format("""
            👤 Основные данные:
            - Пол: %s
            - Возраст: %s
            - Вес: %s
            - Рост: %s
            
            🎯 Цели:
            - Уровень активности: %s
            - Главная цель: %s
            - Дневная норма калорий: %s
            
            ⚕️ Медицинская информация:
            - Аллергии: %s
            - Непереносимости: %s
           
            """,
                formatValue(user.getGender(), "Не указан", g -> g.equalsIgnoreCase("male") ? "Мужской" : "Женский"),
                formatValue(user.getBirthDate(), "Не указан",
                        bd -> String.valueOf(Period.between(bd, LocalDate.now()).getYears()) + " лет"),
                formatValue(user.getWeight(), "Не указан", w -> w + " кг"),
                formatValue(user.getHeight(), "Не указан", h -> h + " см"),
                formatValue(user.getActivityLevel(), "Не указан", this::translateActivityLevel),
                formatValue(user.getGoal(), "Не установлена", this::translateGoal),
                formatValue(user.getDailyCalorieNorm(), "Не установлена", n -> String.format("%.0f ккал", n)),
                formatValue(user.getAllergies(), "Нет", String::toString),
                formatValue(user.getIntolerances(), "Нет", String::toString)
        );
    }

    private String buildTrackersInfo(DailySummaryDTO report) {
        return String.format("""
            🏃 Активность:
            - Продолжительность: %d мин
            
            🍎 Питание:
            - Калории: %.0f
            - Белки: %.1fг
            - Жиры: %.1fг
            - Углеводы: %.1fг
            
            💤 Сон:
            - Продолжительность: %.1f ч
            
            💧 Гидратация:
            - Выпито: %.0f/%.0f мл (%.0f%%)
            """,
                report.getActivityDurationMinutes(),
                report.getTotalCalories(),
                report.getTotalProteins(),
                report.getTotalFats(),
                report.getTotalCarbs(),
                report.getSleepDuration(),
                report.getTotalIntakeMl(),
                report.getGoalMl(),
                (report.getTotalIntakeMl() / report.getGoalMl()) * 100
        );
    }

    private List<Map<String, String>> prepareMessageHistory(String systemPrompt,
                                                            List<ChatHistory> history,
                                                            String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        history.forEach(entry -> messages.add(Map.of(
                "role", entry.getRole(),
                "content", entry.getContent()
        )));

        messages.add(Map.of("role", "user", "content", userMessage));
        return messages;
    }

    private String formatChatHistory(List<ChatHistory> history) {
        return history.isEmpty() ? "Нет истории" :
                history.stream()
                        .map(entry -> String.format("[%s] %s: %s",
                                entry.getTimestamp().format(DateTimeFormatter.ofPattern("dd.MM HH:mm")),
                                entry.getRole().equals("user") ? "Пользователь" : "Ассистент",
                                entry.getContent()))
                        .collect(Collectors.joining("\n"));
    }

    private <T> String formatValue(T value, String defaultValue, java.util.function.Function<T, String> formatter) {
        return value != null ? formatter.apply(value) : defaultValue;
    }

    private String translateActivityLevel(String level) {
        return switch (level.toLowerCase()) {
            case "sedentary" -> "Сидячий";
            case "light" -> "Легкая активность";
            case "moderate" -> "Умеренная";
            case "active" -> "Активный";
            case "very_active" -> "Очень активный";
            default -> level;
        };
    }

    private String translateGoal(Goal goal) {
        return switch (goal) {
            case LOSE -> "Похудение 🏃♀️";
            case GAIN -> "Набор массы 💪";
            case MAINTAIN -> "Поддержание веса ⚖️";
        };
    }

    private Mono<Throwable> handleAPIError(ClientResponse response) {
        return response.bodyToMono(String.class)
                .flatMap(body -> {
                    String errorMsg = "Ошибка API: " + response.statusCode() + " - " + body;
                    System.err.println(errorMsg);
                    return Mono.error(new RuntimeException(errorMsg));
                });
    }

    private String extractAssistantReply(Map<String, Object> response) {
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices != null && !choices.isEmpty()) {
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            if (message != null) {
                String rawContent = message.get("content").toString();

                if (rawContent.startsWith("{role=assistant, content=")) {
                    rawContent = rawContent.replaceFirst("\\{role=assistant, content=", "")
                            .replaceAll("}$", "");
                }

                String cleanedContent = rawContent
                        .replaceAll("\\*", "")     // убираем звездочки
                        .replaceAll("\\n+", " ")   // заменяем переносы строк на пробел
                        .replaceAll(" +", " ")     // убираем лишние пробелы
                        .trim();                   // удаляем пробелы по краям

                return cleanedContent;
            } else {
                return "Ошибка: пустой ответ от модели.";
            }
        }
        return "Ошибка: пустой список choices.";
    }


}
