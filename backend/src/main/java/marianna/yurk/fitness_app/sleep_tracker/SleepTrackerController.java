package marianna.yurk.fitness_app.sleep_tracker;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sleep")
@CrossOrigin(origins = "http://localhost:3000")
public class SleepTrackerController {
    private final SleepTrackerService sleepTrackerService;

    public SleepTrackerController(SleepTrackerService sleepTrackerService) {
        this.sleepTrackerService = sleepTrackerService;
    }

    @GetMapping("")
    public List<SleepTracker> findAll(){
        return sleepTrackerService.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<SleepTracker> findByUserId(@PathVariable Long userId) {
        return sleepTrackerService.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public SleepTracker findByID(@PathVariable int id){
        return sleepTrackerService.findById(id)
                .orElseThrow(() -> new SleepNotFoundException(id));
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public SleepTracker create(@RequestParam Long userId, @Valid @RequestBody SleepTrackerRequest request) {
        try {
            return sleepTrackerService.create(userId, request);
        }
        catch (Exception e) {
            throw new RuntimeException("Unexpected error creating sleep tracker", e);
        }
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public SleepTracker update(@Valid @RequestBody SleepTrackerRequest request, @PathVariable int id){
        return sleepTrackerService.update(id, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id){
        sleepTrackerService.delete(id);
    }

    @GetMapping("/today")
    public List<SleepTracker> getTodaySleep(@RequestParam Long userId) {
        return sleepTrackerService.getTodaySleep(userId);
    }
}


