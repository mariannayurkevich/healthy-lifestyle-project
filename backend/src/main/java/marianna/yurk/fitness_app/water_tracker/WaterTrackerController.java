package marianna.yurk.fitness_app.water_tracker;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/water")
@CrossOrigin(origins = "http://localhost:3000")
public class WaterTrackerController {
    private final WaterTrackerService waterTrackerService;
    private static final Logger logger = LoggerFactory.getLogger(WaterTrackerController.class);

    public WaterTrackerController(WaterTrackerService waterTrackerService) {
        this.waterTrackerService = waterTrackerService;
    }

    @GetMapping("")
    public ResponseEntity<List<WaterTracker>> findAll() {
        try {
            return ResponseEntity.ok(waterTrackerService.findAll());
        } catch (Exception e) {
            logger.error("Error finding all water trackers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable int id) {
        try {
            return waterTrackerService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error finding water tracker by id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WaterTracker>> findByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(waterTrackerService.findByUserId(userId));
        } catch (Exception e) {
            logger.error("Error finding water trackers by user id: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<List<WaterTracker>> findByUserIdAndDate(@PathVariable Long userId, @PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            return ResponseEntity.ok(waterTrackerService.findByUserIdAndDate(userId, localDate));
        } catch (Exception e) {
            logger.error("Error finding water trackers by user id and date: {}, {}", userId, date, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<WaterTracker>> findByDate(@PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            return ResponseEntity.ok(waterTrackerService.findByDate(localDate));
        } catch (Exception e) {
            logger.error("Error finding water trackers by date: {}", date, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> create(@RequestParam Long userId, @Valid @RequestBody WaterTrackerRequest request) {
        try {
            WaterTracker created = waterTrackerService.create(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            logger.error("Error creating water tracker", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error creating water tracker", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @Valid @RequestBody WaterTrackerRequest request) {
        try {
            WaterTracker updated = waterTrackerService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            logger.error("Error updating water tracker: {}", id, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error updating water tracker: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            waterTrackerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting water tracker: {}", id, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error deleting water tracker: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Обработчик ошибок валидации
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("timestamp", System.currentTimeMillis());
        errors.put("status", HttpStatus.BAD_REQUEST.value());

        List<String> errorMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        errors.put("errors", errorMessages);

        return ResponseEntity.badRequest().body(errors);
    }
}