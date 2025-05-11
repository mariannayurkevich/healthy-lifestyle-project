package marianna.yurk.fitness_app.activity_tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityTrackerController {
    private final ActivityTrackerRepository activityTrackerRepository;

    public ActivityTrackerController(ActivityTrackerRepository activityTrackerRepository) {
        this.activityTrackerRepository = activityTrackerRepository;
    }

    // get
    @GetMapping("")
    List<ActivityTracker> findAll(){
        return activityTrackerRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    List<ActivityTracker> findByUserId(@PathVariable Long userId) {
        return activityTrackerRepository.findByUserId(userId);
    }

    @GetMapping("/{id}")
    ActivityTracker findByID(@PathVariable int id){
        Optional<ActivityTracker> activity = activityTrackerRepository.findById(id);
        if (activity.isEmpty()){
            throw new ActivityNotFoundException();
        }
        return activity.get();
    }

    // post
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    void create(@Valid @RequestBody ActivityTracker activity, @RequestParam Long userId) {
        activity = new ActivityTracker(
                0,
                activity.activityType(),
                activity.duration(),
                activity.caloriesBurned(),
                activity.activityTimestamp(),
                userId
        );
        activityTrackerRepository.create(activity);
    }
    // put
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void update(@Valid @RequestBody ActivityTracker activity, @PathVariable int id){
        activityTrackerRepository.update(activity, id);
    }

    // delete
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    void delete(@PathVariable int id){
        activityTrackerRepository.delete(id);
    }
}
