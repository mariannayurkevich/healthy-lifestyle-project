package marianna.yurk.fitness_app.water_tracker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(WaterTrackerServiceImpl.class);

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
        try {
            List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(ALL_WATER_TRACKERS_KEY);
            if (cachedTrackers != null) {
                return cachedTrackers;
            }

            List<WaterTracker> trackers = waterTrackerRepository.findAll();
            redisTemplate.opsForValue().set(ALL_WATER_TRACKERS_KEY, trackers, Duration.ofMinutes(30));
            return trackers;
        } catch (Exception e) {
            logger.error("Error in findAll", e);
            throw e;
        }
    }

    @Override
    public Optional<WaterTracker> findById(int id) {
        try {
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
        } catch (Exception e) {
            logger.error("Error in findById: {}", id, e);
            throw e;
        }
    }

    @Override
    public List<WaterTracker> findByUserId(Long userId) {
        try {
            String cacheKey = WATER_TRACKERS_BY_USER_KEY + userId;

            List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(cacheKey);
            if (cachedTrackers != null) {
                return cachedTrackers;
            }

            List<WaterTracker> trackers = waterTrackerRepository.findByUserId(userId);
            redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
            return trackers;
        } catch (Exception e) {
            logger.error("Error in findByUserId: {}", userId, e);
            throw e;
        }
    }

    @Override
    public List<WaterTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        try {
            String cacheKey = WATER_TRACKERS_BY_USER_DATE_KEY + userId + ":" + date;

            List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(cacheKey);
            if (cachedTrackers != null) {
                return cachedTrackers;
            }

            List<WaterTracker> trackers = waterTrackerRepository.findByUserIdAndDate(userId, date);
            redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
            return trackers;
        } catch (Exception e) {
            logger.error("Error in findByUserIdAndDate: {}, {}", userId, date, e);
            throw e;
        }
    }

    @Override
    public WaterTracker create(Long userId, WaterTrackerRequest request) {
        try {
            LocalDateTime now = LocalDateTime.now();
            WaterTracker waterTracker = new WaterTracker(
                    0,
                    userId,
                    request.date() != null ? request.date() : LocalDate.now(),
                    0.0,
                    request.goalMl(),
                    request.entries() != null ? request.entries() : List.of(),
                    now,
                    now
            );

            WaterTracker createdTracker = waterTrackerRepository.create(waterTracker);
            invalidateWaterTrackerCaches(createdTracker);
            return createdTracker;
        } catch (Exception e) {
            logger.error("Error in create", e);
            throw e;
        }
    }

    @Override
    public WaterTracker update(int id, WaterTrackerRequest request) {
        try {
            WaterTracker existingTracker = waterTrackerRepository.findById(id)
                    .orElseThrow(() -> new WaterNotFoundException(id));

            LocalDateTime now = LocalDateTime.now();
            WaterTracker waterTracker = new WaterTracker(
                    id,
                    existingTracker.userId(),
                    request.date() != null ? request.date() : existingTracker.date(),
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
        } catch (Exception e) {
            logger.error("Error in update: {}", id, e);
            throw e;
        }
    }

    @Override
    public void delete(Integer id) {
        try {
            WaterTracker existingTracker = waterTrackerRepository.findById(id)
                    .orElseThrow(() -> new WaterNotFoundException(id));

            waterTrackerRepository.delete(id);

            invalidateWaterTrackerCaches(existingTracker);
        } catch (Exception e) {
            logger.error("Error in delete: {}", id, e);
            throw e;
        }
    }

    @Override
    public int count() {
        try {
            return waterTrackerRepository.count();
        } catch (Exception e) {
            logger.error("Error in count", e);
            throw e;
        }
    }

    @Override
    public void saveAll(List<WaterTracker> waterTrackers) {
        try {
            waterTrackerRepository.saveAll(waterTrackers);

            redisTemplate.delete(ALL_WATER_TRACKERS_KEY);

            waterTrackers.forEach(this::invalidateUserWaterTrackerCaches);
        } catch (Exception e) {
            logger.error("Error in saveAll", e);
            throw e;
        }
    }

    private void invalidateWaterTrackerCaches(WaterTracker tracker) {
        try {
            redisTemplate.delete(WATER_TRACKER_BY_ID_KEY + tracker.id());

            invalidateUserWaterTrackerCaches(tracker);

            redisTemplate.delete(ALL_WATER_TRACKERS_KEY);
            redisTemplate.delete(WATER_TRACKERS_BY_DATE_KEY + tracker.date());
        } catch (Exception e) {
            logger.error("Error invalidating water tracker caches", e);
        }
    }

    private void invalidateUserWaterTrackerCaches(WaterTracker tracker) {
        try {
            Long userId = tracker.userId();
            LocalDate trackerDate = tracker.date();

            redisTemplate.delete(WATER_TRACKERS_BY_USER_KEY + userId);
            redisTemplate.delete(WATER_TRACKERS_BY_USER_DATE_KEY + userId + ":" + trackerDate);
        } catch (Exception e) {
            logger.error("Error invalidating user water tracker caches", e);
        }
    }

    @Override
    public List<WaterTracker> findByDate(LocalDate date) {
        try {
            String cacheKey = WATER_TRACKERS_BY_DATE_KEY + date;

            List<WaterTracker> cachedTrackers = (List<WaterTracker>) redisTemplate.opsForValue().get(cacheKey);
            if (cachedTrackers != null) {
                return cachedTrackers;
            }

            List<WaterTracker> trackers = waterTrackerRepository.findByDate(date);
            redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
            return trackers;
        } catch (Exception e) {
            logger.error("Error in findByDate: {}", date, e);
            throw e;
        }
    }
}