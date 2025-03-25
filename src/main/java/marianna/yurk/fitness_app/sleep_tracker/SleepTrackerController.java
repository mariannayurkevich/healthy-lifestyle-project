package marianna.yurk.fitness_app.sleep_tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sleep")
public class SleepTrackerController {
    private final SleepTrackerRepository sleepTrackerRepository;

    public SleepTrackerController(SleepTrackerRepository sleepTrackerRepository) {
        this.sleepTrackerRepository = sleepTrackerRepository;
    }

    // get
    @GetMapping("")
    List<SleepTracker> findAll(){
        return sleepTrackerRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    List<SleepTracker> findByUserId(@PathVariable Long userId) {
        return sleepTrackerRepository.findByUserId(userId);
    }

    @GetMapping("/{id}")
    SleepTracker findByID(@PathVariable int id){
        Optional<SleepTracker> sleep = sleepTrackerRepository.findById(id);
        if (sleep.isEmpty()){
            throw new SleepNotFoundException();
        }
        return sleep.get();
    }

    // post
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    void create(@Valid @RequestBody SleepTracker sleep, @RequestParam Long userId) {
        sleep = new SleepTracker(
                sleep.id(),
                sleep.date(),
                sleep.bedtime(),
                sleep.wakeupTime(),
                sleep.sleepDuration(),
                sleep.sleepQuality(),
                sleep.notes(),
                userId
        );
        sleepTrackerRepository.create(sleep);
    }
    // put
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void update(@Valid @RequestBody SleepTracker sleep, @PathVariable int id){
        sleepTrackerRepository.update(sleep, id);
    }

    // delete
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    void delete(@PathVariable int id){
        sleepTrackerRepository.delete(id);
    }
}
