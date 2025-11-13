package marianna.yurk.fitness_app.food_tracker;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FoodTrackerService {
    List<FoodTracker> findAll();

    Optional<FoodTracker> findById(int id);

    List<FoodTracker> findByUserId(Long userId);

    List<FoodTracker> findByUserIdAndDate(Long userId, LocalDate date);

    FoodTracker create(FoodTrackerRequest request);

    FoodTracker update(int id, FoodTrackerRequest request);

    void delete(Integer id);

    long count();

    void saveAll(List<FoodTracker> foodTrackers);

    List<FoodTracker> findByDate(LocalDate date);

    List<FoodTracker> findByUserIdAndToday(Long userId);
}
