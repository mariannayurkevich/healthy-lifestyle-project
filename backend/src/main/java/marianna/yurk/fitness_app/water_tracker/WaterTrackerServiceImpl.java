package marianna.yurk.fitness_app.water_tracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WaterTrackerServiceImpl implements WaterTrackerService {
    private final WaterTrackerRepository waterTrackerRepository;

    private static final String WATER_TRACKER_BY_ID_KEY = "water_tracker:";
    private static final String WATER_TRACKERS_BY_USER_KEY = "water_trackers_user:";
    private static final String WATER_TRACKERS_BY_USER_DATE_KEY = "water_trackers_user_date:";
    private static final String ALL_WATER_TRACKERS_KEY = "all_water_trackers";
    private static final String WATER_TRACKERS_BY_DATE_KEY = "water_trackers_date:";

    @Autowired
    public final RedisTemplate<String, Object> redisTemplate;

    public WaterTrackerServiceImpl(WaterTrackerRepository waterTrackerRepository, RedisTemplate<String, Object> redisTemplate) {
        this.waterTrackerRepository = waterTrackerRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public List<WaterTracker> findAll() {
        List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(ALL_WATER_TRACKERS_KEY);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<WaterTracker> trackers = waterTrackerRepository.findAll();
        redisTemplate.opsForValue().set(ALL_WATER_TRACKERS_KEY, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public Optional<WaterTracker> findById(int id) {
        String cacheKey = WATER_TRACKER_BY_ID_KEY + id;

        WaterTracker cachedTracker = (WaterTracker) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTracker != null) {
            return Optional.of(cachedTracker);
        }

        Optional<WaterTracker> tracker = waterTrackerRepository.findById(id);
        tracker.ifPresent(t ->
                redisTemplate.opsForValue().set(cacheKey, t, Duration.ofMinutes(30))
        );

        return tracker;
    }

    @Override
    public List<WaterTracker> findByUserId(Long userId) {
        String cacheKey = WATER_TRACKERS_BY_USER_KEY + userId;

        List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<WaterTracker> trackers = waterTrackerRepository.findByUserId(userId);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public List<WaterTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        String cacheKey = WATER_TRACKERS_BY_USER_DATE_KEY + userId + ":" + date;

        List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<WaterTracker> trackers = waterTrackerRepository.findByUserIdAndDate(userId, date);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public WaterTracker create(WaterTrackerRequest request) {

        LocalDateTime now = LocalDateTime.now();
        WaterTracker waterTracker = new WaterTracker(
                0,
                request.userId(),
                request.date(),
                0.0,
                request.goalMl(),
                request.entries() != null ? request.entries() : List.of(),
                now,
                now
        );

        WaterTracker createdTracker = waterTrackerRepository.create(waterTracker);

        invalidateWaterTrackerCaches(createdTracker);

        return createdTracker;
    }

    @Override
    public WaterTracker update(int id, WaterTrackerRequest request) {
        WaterTracker existingTracker = waterTrackerRepository.findById(id)
                .orElseThrow(() -> new WaterNotFoundException(id));

        LocalDateTime now = LocalDateTime.now();
        WaterTracker waterTracker = new WaterTracker(
                id,
                request.userId(),
                request.date(),
                0.0,
                request.goalMl(),
                request.entries() != null ? request.entries() : List.of(),
                existingTracker.createdAt(),
                now
        );

        WaterTracker updatedTracker = waterTrackerRepository.update(waterTracker, id);

        invalidateWaterTrackerCaches(updatedTracker);
        invalidateWaterTrackerCaches(existingTracker);

        return updatedTracker;
    }

    @Override
    public void delete(Integer id) {
        WaterTracker existingTracker = waterTrackerRepository.findById(id)
                .orElseThrow(() -> new WaterNotFoundException(id));

        waterTrackerRepository.delete(id);

        invalidateWaterTrackerCaches(existingTracker);
    }

    @Override
    public int count() {
        return waterTrackerRepository.count();
    }

    @Override
    public void saveAll(List<WaterTracker> waterTrackers) {
        waterTrackerRepository.saveAll(waterTrackers);

        redisTemplate.delete(ALL_WATER_TRACKERS_KEY);

        waterTrackers.forEach(this::invalidateUserWaterTrackerCaches);
    }

    private void invalidateWaterTrackerCaches(WaterTracker tracker) {
        redisTemplate.delete(WATER_TRACKER_BY_ID_KEY + tracker.id());

        invalidateUserWaterTrackerCaches(tracker);

        redisTemplate.delete(ALL_WATER_TRACKERS_KEY);
        redisTemplate.delete(WATER_TRACKERS_BY_DATE_KEY + tracker.date());
    }

    private void invalidateUserWaterTrackerCaches(WaterTracker tracker) {
        Long userId = tracker.userId();
        LocalDate trackerDate = tracker.date();

        redisTemplate.delete(WATER_TRACKERS_BY_USER_KEY + userId);
        redisTemplate.delete(WATER_TRACKERS_BY_USER_DATE_KEY + userId + ":" + trackerDate);
    }

    @Override
    public List<WaterTracker> findByDate(LocalDate date) {
        String cacheKey = WATER_TRACKERS_BY_DATE_KEY + date;

        List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<WaterTracker> trackers = waterTrackerRepository.findByDate(date);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
    }
}
