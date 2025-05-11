package marianna.yurk.fitness_app.water_tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/water")
@CrossOrigin(origins = "http://localhost:3000")
public class WaterTrackerController {
    private final WaterTrackerRepository waterTrackerRepository;

    public WaterTrackerController(WaterTrackerRepository waterTrackerRepository) {
        this.waterTrackerRepository = waterTrackerRepository;
    }

    // получение всех записей
    @GetMapping("")
    List<WaterTracker> findAll() {
        return waterTrackerRepository.findAll();
    }

    // получение записи по ID
    @GetMapping("/{id}")
    WaterTracker findById(@PathVariable int id) {
        return waterTrackerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Water tracker not found with id " + id));
    }

    // получение записей по userId
    @GetMapping("/user/{userId}")
    List<WaterTracker> findByUserId(@PathVariable Long userId) {
        return waterTrackerRepository.findByUserId(userId);
    }

    // получение записей по дате
    @GetMapping("/date/{date}")
    List<WaterTracker> findByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return waterTrackerRepository.findByDate(localDate);
    }

    // создание новой записи с entries
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    void create(@Valid @RequestBody WaterTracker waterTracker, @RequestParam Long userId) {
        waterTracker = new WaterTracker(
                0,
                userId,
                waterTracker.date(),
                0.0,
                waterTracker.goalMl(),
                waterTracker.entries(),
                waterTracker.createdAt(),
                waterTracker.updatedAt()
        );

        waterTrackerRepository.create(waterTracker);
    }

    // обновление записи по ID
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void update(@PathVariable int id, @Valid @RequestBody WaterTracker waterTracker) {
        waterTrackerRepository.update(waterTracker, id);
    }

    // удаление записи по ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable int id) {
        waterTrackerRepository.delete(id);
    }
}
