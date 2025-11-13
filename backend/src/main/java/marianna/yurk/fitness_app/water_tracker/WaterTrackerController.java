package marianna.yurk.fitness_app.water_tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/water")
@CrossOrigin(origins = "http://localhost:3000")
public class WaterTrackerController {
    private final WaterTrackerService waterTrackerService;

    public WaterTrackerController(WaterTrackerService waterTrackerService) {
        this.waterTrackerService = waterTrackerService;
    }

    @GetMapping("")
    List<WaterTracker> findAll() {

        return waterTrackerService.findAll();
    }

    @GetMapping("/{id}")
    WaterTracker findById(@PathVariable int id) {
        return waterTrackerService.findById(id)
                .orElseThrow(() -> new RuntimeException("Water tracker not found with id " + id));
    }

    @GetMapping("/user/{userId}")
    List<WaterTracker> findByUserId(@PathVariable Long userId) {

        return waterTrackerService.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/date/{date}")
    List<WaterTracker> findByUserIdAndDate(@PathVariable Long userId, @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return waterTrackerService.findByUserIdAndDate(userId, localDate);
    }

    @GetMapping("/date/{date}")
    List<WaterTracker> findByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return waterTrackerService.findByDate(localDate);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    WaterTracker create(@Valid @RequestBody WaterTrackerRequest request) {
        return waterTrackerService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    WaterTracker update(@PathVariable int id, @Valid @RequestBody WaterTrackerRequest request) {
        return waterTrackerService.update(id,request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable int id) {

        waterTrackerService.delete(id);
    }
}
