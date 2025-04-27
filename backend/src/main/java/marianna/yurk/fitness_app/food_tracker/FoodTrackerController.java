package marianna.yurk.fitness_app.food_tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/food")
public class FoodTrackerController {
    private final FoodTrackerRepository foodTrackerRepository;

    public FoodTrackerController(FoodTrackerRepository foodTrackerRepository) {
        this.foodTrackerRepository = foodTrackerRepository;
    }

    // Получение всех записей
    @GetMapping("")
    public List<FoodTracker> findAll() {
        return foodTrackerRepository.findAll();
    }

    // Получение записи по ID
    @GetMapping("/{id}")
    public FoodTracker findById(@PathVariable int id) {
        return foodTrackerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id " + id));
    }

    // Получение записей по userId
    @GetMapping("/user/{userId}")
    public List<FoodTracker> findByUserId(@PathVariable Long userId) {
        return foodTrackerRepository.findByUserId(userId);
    }

    // Получение записей по дате
    @GetMapping("/date/{date}")
    public List<FoodTracker> findByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return foodTrackerRepository.findByDate(localDate);
    }

    // Создание новой записи
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid @RequestBody FoodTracker foodTracker, @RequestParam Long userId) {
        foodTracker = new FoodTracker(
                foodTracker.id(),
                userId,
                foodTracker.date(),
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                foodTracker.entries(),
                foodTracker.createdAt(),
                foodTracker.updatedAt()
        );

        foodTrackerRepository.create(foodTracker);
    }

    // Обновление записи по ID
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable int id, @Valid @RequestBody FoodTracker foodTracker) {
        foodTrackerRepository.update(foodTracker, id);

    }

    // Удаление записи по ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int id) {
        foodTrackerRepository.delete(id);
    }
}
