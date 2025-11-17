package marianna.yurk.fitness_app.activity_tracker;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ActivityTrackerService {
    List<ActivityTracker> findAll();

    Optional<ActivityTracker> findById(int id);

    List<ActivityTracker> findByUserId(Long userId);

    List<ActivityTracker> findByUserIdAndDate(Long userId, LocalDate date);

    ActivityTracker create(ActivityTrackerRequest request);

    ActivityTracker update(int id, ActivityTrackerRequest request);

    void delete(Integer id);

    int count();

    void saveAll(List<ActivityTracker> activityTrackers);

    List<ActivityTracker> findByActivityType(String activityType);
}
