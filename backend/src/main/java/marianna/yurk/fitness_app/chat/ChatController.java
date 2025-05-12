package marianna.yurk.fitness_app.chat;

import marianna.yurk.fitness_app.stats.DailyReportService;
import marianna.yurk.fitness_app.stats.DailySummaryDTO;
import marianna.yurk.fitness_app.user.Goal;
import marianna.yurk.fitness_app.user.User;
import marianna.yurk.fitness_app.user.UserService;
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
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public Mono<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        String userMessage = payload.get("message");

        return chatService.handleChat(userEmail, userMessage);
    }
}