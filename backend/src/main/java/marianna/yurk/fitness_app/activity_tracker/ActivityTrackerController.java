package marianna.yurk.fitness_app.activity_tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityTrackerController {
    private final ActivityTrackerService activityTrackerService;

    public ActivityTrackerController(ActivityTrackerService activityTrackerService) {
        this.activityTrackerService = activityTrackerService;
    }

    @GetMapping("")
    List<ActivityTracker> findAll(){
        return activityTrackerService.findAll();
    }

    @GetMapping("/user/{userId}")
    List<ActivityTracker> findByUserId(@PathVariable Long userId) {
        return activityTrackerService.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/date/{date}")
    List<ActivityTracker> findByUserIdAndDate(@PathVariable Long userId, @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return activityTrackerService.findByUserIdAndDate(userId, localDate);
    }

    @GetMapping("/{id}")
    ActivityTracker findByID(@PathVariable int id){
        return activityTrackerService.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));
    }

    @GetMapping("/type/{activityType}")
    List<ActivityTracker> findByActivityType(@PathVariable String activityType) {
        return activityTrackerService.findByActivityType(activityType);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    ActivityTracker create(@Valid @RequestBody ActivityTrackerRequest request) {
        return activityTrackerService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void update(@Valid @RequestBody ActivityTrackerRequest request, @PathVariable int id){
        activityTrackerService.update(id, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    void delete(@PathVariable int id){
        activityTrackerService.delete(id);
    }
}
