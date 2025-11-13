package marianna.yurk.fitness_app.food_tracker;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FoodTrackerServiceImpl implements FoodTrackerService {
    private final FoodTrackerRepository foodTrackerRepository;

    public FoodTrackerServiceImpl(FoodTrackerRepository foodTrackerRepository) {
        this.foodTrackerRepository = foodTrackerRepository;
    }

    @Override
    public List<FoodTracker> findAll() {
        return foodTrackerRepository.findAll();
    }

    @Override
    public Optional<FoodTracker> findById(int id) {
        return foodTrackerRepository.findById(id);
    }

    @Override
    public List<FoodTracker> findByUserId(Long userId) {
        return foodTrackerRepository.findByUserId(userId);
    }

    @Override
    public List<FoodTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        return foodTrackerRepository.findByUserIdAndDate(userId, date);
    }

    @Override
    public FoodTracker create(FoodTrackerRequest request) {
        LocalDateTime now = LocalDateTime.now();
        FoodTracker foodTracker = new FoodTracker(
                0,
                request.userId(),
                request.date(),
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                request.entries() != null ? request.entries() : List.of(),
                now,
                now
        );

        foodTrackerRepository.create(foodTracker);
        return foodTracker;
    }

    @Override
    public FoodTracker update(int id, FoodTrackerRequest request) {
        FoodTracker existingTracker = foodTrackerRepository.findById(id)
                .orElseThrow(() -> new FoodNotFoundException(id));

        LocalDateTime now = LocalDateTime.now();
        FoodTracker foodTracker = new FoodTracker(
                id,
                request.userId(),
                request.date(),
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                request.entries() != null ? request.entries() : List.of(),
                existingTracker.createdAt(),
                now
        );

        foodTrackerRepository.update(foodTracker, id);
        return foodTracker;
    }

    @Override
    public void delete(Integer id) {
        if (!foodTrackerRepository.findById(id).isPresent()) {
            throw new FoodNotFoundException(id);
        }

        foodTrackerRepository.delete(id);
    }

    @Override
    public long count() {
        return foodTrackerRepository.count();
    }

    @Override
    public void saveAll(List<FoodTracker> foodTrackers) {
        foodTrackerRepository.saveAll(foodTrackers);
    }

    @Override
    public List<FoodTracker> findByDate(LocalDate date) {
        return foodTrackerRepository.findByDate(date);
    }

    @Override
    public List<FoodTracker> findByUserIdAndToday(Long userId) {
        return foodTrackerRepository.findByUserIdAndDate(userId, LocalDate.now());
    }
}
