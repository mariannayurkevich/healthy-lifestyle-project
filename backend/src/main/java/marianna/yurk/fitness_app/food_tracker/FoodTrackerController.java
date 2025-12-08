package marianna.yurk.fitness_app.food_tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodTrackerController {
    private final FoodTrackerService foodTrackerService;

    public FoodTrackerController(FoodTrackerService foodTrackerService) {
        this.foodTrackerService = foodTrackerService;
    }

    @GetMapping("")
    public List<FoodTracker> findAll() {
        return foodTrackerService.findAll();
    }

    @GetMapping("/{id}")
    public FoodTracker findById(@PathVariable int id) {
        return foodTrackerService.findById(id)
                .orElseThrow(() -> new FoodNotFoundException(id));
    }

    @GetMapping("/user/{userId}")
    public List<FoodTracker> findByUserId(@PathVariable Long userId) {
        return foodTrackerService.findByUserId(userId);
    }

    @GetMapping("/date/{date}")
    public List<FoodTracker> findByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return foodTrackerService.findByDate(localDate);
    }

    @GetMapping("/user/{userId}/date/{date}")
    public List<FoodTracker> findByUserIdAndDate(@PathVariable Long userId, @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return foodTrackerService.findByUserIdAndDate(userId, localDate);
    }

    @GetMapping("/user/{userId}/today")
    public List<FoodTracker> findByUserIdAndToday(@PathVariable Long userId) {
        return foodTrackerService.findByUserIdAndToday(userId);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public FoodTracker create(@RequestParam Long userId, @Valid @RequestBody FoodTrackerRequest request) {
        try {
            FoodTrackerRequest fullRequest = new FoodTrackerRequest(
                    userId,
                    request.date(),
                    request.entries()
            );

            FoodTracker created = foodTrackerService.create(fullRequest);
            return created;
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error creating food tracker", e);
        }
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public FoodTracker update(@PathVariable int id, @Valid @RequestBody FoodTrackerRequest request) {
        return foodTrackerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int id) {
        foodTrackerService.delete(id);
    }
}