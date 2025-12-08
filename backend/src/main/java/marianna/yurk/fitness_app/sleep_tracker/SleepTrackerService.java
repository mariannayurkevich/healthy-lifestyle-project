package marianna.yurk.fitness_app.sleep_tracker;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SleepTrackerService {
    List<SleepTracker> findAll();

    Optional<SleepTracker> findById(int id);

    List<SleepTracker> findByUserId(Long userId);

    List<SleepTracker> findByUserIdAndDate(Long userId, LocalDate date);

    SleepTracker create(Long userId, SleepTrackerRequest request);

    SleepTracker update(int id, SleepTrackerRequest request);

    void delete(Integer id);

    int count();

    void saveAll(List<SleepTracker> sleepTrackers);

    List<SleepTracker> findByDate(LocalDate date);

    List<SleepTracker> getTodaySleep(Long userId);
}
