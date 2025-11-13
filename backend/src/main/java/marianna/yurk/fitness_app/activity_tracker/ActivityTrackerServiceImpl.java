package marianna.yurk.fitness_app.activity_tracker;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityTrackerServiceImpl implements ActivityTrackerService {
    private final ActivityTrackerRepository activityTrackerRepository;

    public ActivityTrackerServiceImpl(ActivityTrackerRepository activityTrackerRepository) {
        this.activityTrackerRepository = activityTrackerRepository;
    }

    @Override
    public List<ActivityTracker> findAll() {
        return activityTrackerRepository.findAll();
    }

    @Override
    public Optional<ActivityTracker> findById(int id) {
        return activityTrackerRepository.findById(id);
    }

    @Override
    public List<ActivityTracker> findByUserId(Long userId) {
        return activityTrackerRepository.findByUserId(userId);
    }

    @Override
    public List<ActivityTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        return activityTrackerRepository.findByUserIdAndDate(userId, date);
    }

    @Override
    public ActivityTracker create(ActivityTrackerRequest request) {
        ActivityTracker activityTracker = new ActivityTracker(
                0,
                request.activityType(),
                request.duration(),
                request.caloriesBurned(),
                request.activityTimestamp(),
                request.userId()
        );

        activityTrackerRepository.create(activityTracker);
        return activityTracker;
    }

    @Override
    public ActivityTracker update(int id, ActivityTrackerRequest request) {
        ActivityTracker existingTracker = activityTrackerRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));

        ActivityTracker activityTracker = new ActivityTracker(
                id,
                request.activityType(),
                request.duration(),
                request.caloriesBurned(),
                request.activityTimestamp(),
                request.userId()
        );

        activityTrackerRepository.update(activityTracker, id);
        return activityTracker;
    }

    @Override
    public void delete(Integer id) {
        if (!activityTrackerRepository.findById(id).isPresent()) {
            throw new ActivityNotFoundException(id);
        }

        activityTrackerRepository.delete(id);
    }

    @Override
    public int count() {
        return activityTrackerRepository.count();
    }

    @Override
    public void saveAll(List<ActivityTracker> activityTrackers) {
        activityTrackerRepository.saveAll(activityTrackers);
    }

    @Override
    public List<ActivityTracker> findByActivityType(String activityType) {
        return activityTrackerRepository.findByActivityType(activityType);
    }
}
