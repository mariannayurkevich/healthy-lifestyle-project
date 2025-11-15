package marianna.yurk.fitness_app.food_tracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FoodTrackerServiceImpl implements FoodTrackerService {
    private final FoodTrackerRepository foodTrackerRepository;

    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String FOOD_TRACKER_BY_ID_KEY = "food_tracker:";
    private static final String FOOD_TRACKERS_BY_USER_KEY = "food_trackers_user:";
    private static final String FOOD_TRACKERS_BY_USER_DATE_KEY = "food_trackers_user_date:";
    private static final String ALL_FOOD_TRACKERS_KEY = "all_food_trackers";
    private static final String FOOD_TRACKERS_BY_DATE_KEY = "food_trackers_date:";
    private static final String FOOD_TRACKERS_COUNT_KEY = "food_trackers_count";

    public FoodTrackerServiceImpl(FoodTrackerRepository foodTrackerRepository, RedisTemplate<String, Object> redisTemplate) {
        this.foodTrackerRepository = foodTrackerRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public List<FoodTracker> findAll() {
        List<FoodTracker> cachedTrackers = (List<FoodTracker>) redisTemplate.opsForValue().get(ALL_FOOD_TRACKERS_KEY);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<FoodTracker> trackers = foodTrackerRepository.findAll();
        redisTemplate.opsForValue().set(ALL_FOOD_TRACKERS_KEY, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public Optional<FoodTracker> findById(int id) {
        String cacheKey = FOOD_TRACKER_BY_ID_KEY + id;

        FoodTracker cachedTracker = (FoodTracker) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTracker != null) {
            return Optional.of(cachedTracker);
        }

        Optional<FoodTracker> tracker = foodTrackerRepository.findById(id);
        tracker.ifPresent(t ->
                redisTemplate.opsForValue().set(cacheKey, t, Duration.ofMinutes(30))
        );

        return tracker;
    }

    @Override
    public List<FoodTracker> findByUserId(Long userId) {
        String cacheKey = FOOD_TRACKERS_BY_USER_KEY + userId;

        List<FoodTracker> cachedTrackers = (List<FoodTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<FoodTracker> trackers = foodTrackerRepository.findByUserId(userId);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public List<FoodTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        String cacheKey = FOOD_TRACKERS_BY_USER_DATE_KEY + userId + ":" + date;

        List<FoodTracker> cachedTrackers = (List<FoodTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<FoodTracker> trackers = foodTrackerRepository.findByUserIdAndDate(userId, date);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
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

        FoodTracker createdTracker = foodTrackerRepository.create(foodTracker);

        invalidateFoodTrackerCaches(createdTracker);

        return createdTracker;
    }

    private void invalidateFoodTrackerCaches(FoodTracker tracker) {
        redisTemplate.delete(FOOD_TRACKER_BY_ID_KEY + tracker.id());

        invalidateUserFoodTrackerCaches(tracker);

        redisTemplate.delete(ALL_FOOD_TRACKERS_KEY);
        redisTemplate.delete(FOOD_TRACKERS_COUNT_KEY);

        redisTemplate.delete(FOOD_TRACKERS_BY_DATE_KEY + tracker.date());
    }

    private void invalidateUserFoodTrackerCaches(FoodTracker tracker) {
        Long userId = tracker.userId();
        LocalDate trackerDate = tracker.date();

        redisTemplate.delete(FOOD_TRACKERS_BY_USER_KEY + userId);

        redisTemplate.delete(FOOD_TRACKERS_BY_USER_DATE_KEY + userId + ":" + trackerDate);
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

        FoodTracker updatedTracker = foodTrackerRepository.update(foodTracker, id);
        invalidateFoodTrackerCaches(updatedTracker);
        invalidateFoodTrackerCaches(existingTracker);
        return updatedTracker;
    }

    @Override
    public void delete(Integer id) {
        FoodTracker existingTracker = foodTrackerRepository.findById(id)
                .orElseThrow(() -> new FoodNotFoundException(id));

        foodTrackerRepository.delete(id);

        invalidateFoodTrackerCaches(existingTracker);
    }

    @Override
    public long count() {
        Long cachedCount = (Long) redisTemplate.opsForValue().get(FOOD_TRACKERS_COUNT_KEY);
        if (cachedCount != null) {
            return cachedCount;
        }

        long count = foodTrackerRepository.count();
        redisTemplate.opsForValue().set(FOOD_TRACKERS_COUNT_KEY, count, Duration.ofMinutes(30));
        return count;
    }

    @Override
    public void saveAll(List<FoodTracker> foodTrackers) {
        foodTrackerRepository.saveAll(foodTrackers);

        redisTemplate.delete(ALL_FOOD_TRACKERS_KEY);
        redisTemplate.delete(FOOD_TRACKERS_COUNT_KEY);

        foodTrackers.forEach(this::invalidateUserFoodTrackerCaches);
    }

    @Override
    public List<FoodTracker> findByDate(LocalDate date) {
        String cacheKey = FOOD_TRACKERS_BY_DATE_KEY + date;

        List<FoodTracker> cachedTrackers = (List<FoodTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<FoodTracker> trackers = foodTrackerRepository.findByDate(date);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public List<FoodTracker> findByUserIdAndToday(Long userId) {
        return foodTrackerRepository.findByUserIdAndDate(userId, LocalDate.now());
    }
}
