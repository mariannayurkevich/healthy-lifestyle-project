package marianna.yurk.fitness_app.water_tracker;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WaterTrackerService {
    List<WaterTracker> findAll();

    Optional<WaterTracker> findById(int id);

    List<WaterTracker> findByUserId(Long userId);

    List<WaterTracker> findByUserIdAndDate(Long userId, LocalDate date);

    WaterTracker create(Long userId, WaterTrackerRequest request);

    WaterTracker update(int id, WaterTrackerRequest request);

    void delete(Integer id);

    int count();

    void saveAll(List<WaterTracker> waterTrackers);

    List<WaterTracker> findByDate(LocalDate date);
}
