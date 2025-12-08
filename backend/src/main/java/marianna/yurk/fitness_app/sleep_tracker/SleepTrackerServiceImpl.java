package marianna.yurk.fitness_app.sleep_tracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SleepTrackerServiceImpl implements SleepTrackerService {
    private final SleepTrackerRepository sleepTrackerRepository;

    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String SLEEP_TRACKER_BY_ID_KEY = "sleep_tracker:";
    private static final String SLEEP_TRACKERS_BY_USER_KEY = "sleep_trackers_user:";
    private static final String SLEEP_TRACKERS_BY_USER_DATE_KEY = "sleep_trackers_user_date:";
    private static final String ALL_SLEEP_TRACKERS_KEY = "all_sleep_trackers";
    private static final String SLEEP_TRACKERS_BY_DATE_KEY = "sleep_trackers_date:";

    public SleepTrackerServiceImpl(SleepTrackerRepository sleepTrackerRepository, RedisTemplate<String, Object> redisTemplate) {
        this.sleepTrackerRepository = sleepTrackerRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public List<SleepTracker> findAll() {
        List<SleepTracker> cachedTrackers = (List<SleepTracker>) redisTemplate.opsForValue().get(ALL_SLEEP_TRACKERS_KEY);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<SleepTracker> trackers = sleepTrackerRepository.findAll();
        redisTemplate.opsForValue().set(ALL_SLEEP_TRACKERS_KEY, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public Optional<SleepTracker> findById(int id) {
        String cacheKey = SLEEP_TRACKER_BY_ID_KEY + id;

        SleepTracker cachedTracker = (SleepTracker) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTracker != null) {
            return Optional.of(cachedTracker);
        }

        Optional<SleepTracker> tracker = sleepTrackerRepository.findById(id);
        tracker.ifPresent(t ->
                redisTemplate.opsForValue().set(cacheKey, t, Duration.ofMinutes(30))
        );

        return tracker;
    }

    @Override
    public List<SleepTracker> findByUserId(Long userId) {
        String cacheKey = SLEEP_TRACKERS_BY_USER_KEY + userId;

        List<SleepTracker> cachedTrackers = (List<SleepTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<SleepTracker> trackers = sleepTrackerRepository.findByUserId(userId);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
    }


    @Override
    public List<SleepTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        String cacheKey = SLEEP_TRACKERS_BY_USER_DATE_KEY + userId + ":" + date;

        List<SleepTracker> cachedTrackers = (List<SleepTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedTrackers != null) {
            return cachedTrackers;
        }

        List<SleepTracker> trackers = sleepTrackerRepository.findByUserIdAndDate(userId, date);
        redisTemplate.opsForValue().set(cacheKey, trackers, Duration.ofMinutes(30));
        return trackers;
    }

    @Override
    public SleepTracker create(Long userId, SleepTrackerRequest request) {
        SleepTracker sleepTracker = new SleepTracker(
                0,
                request.date(),
                request.bedtime(),
                request.wakeupTime(),
                request.sleepDuration(),
                request.sleepQuality(),
                request.notes(),
                userId
        );

        SleepTracker createdTracker = sleepTrackerRepository.create(sleepTracker);
        invalidateSleepTrackerCaches(createdTracker);
        return createdTracker;
    }

    @Override
    public SleepTracker update(int id, SleepTrackerRequest request) {
        SleepTracker existingTracker = sleepTrackerRepository.findById(id)
                .orElseThrow(() -> new SleepNotFoundException(id));


        SleepTracker sleepTracker = new SleepTracker(
                id,
                request.date(),
                request.bedtime(),
                request.wakeupTime(),
                request.sleepDuration(),
                request.sleepQuality(),
                request.notes(),
                existingTracker.userId()
        );

        SleepTracker updatedTracker = sleepTrackerRepository.update(sleepTracker, id);
        invalidateSleepTrackerCaches(updatedTracker);
        invalidateSleepTrackerCaches(existingTracker);
        return updatedTracker;
    }

    @Override
    public void delete(Integer id) {
        SleepTracker existingTracker = sleepTrackerRepository.findById(id)
                .orElseThrow(() -> new SleepNotFoundException(id));

        sleepTrackerRepository.delete(id);

        invalidateSleepTrackerCaches(existingTracker);
    }

    private void invalidateSleepTrackerCaches(SleepTracker tracker) {
        redisTemplate.delete(SLEEP_TRACKER_BY_ID_KEY + tracker.id());

        invalidateUserSleepTrackerCaches(tracker);

        redisTemplate.delete(ALL_SLEEP_TRACKERS_KEY);

        redisTemplate.delete(SLEEP_TRACKERS_BY_DATE_KEY + tracker.date());
    }

    private void invalidateUserSleepTrackerCaches(SleepTracker tracker) {
        Long userId = tracker.userId();
        LocalDate trackerDate = tracker.date();

        redisTemplate.delete(SLEEP_TRACKERS_BY_USER_KEY + userId);

        redisTemplate.delete(SLEEP_TRACKERS_BY_USER_DATE_KEY + userId + ":" + trackerDate);
    }

    @Override
    public int count() {
        return sleepTrackerRepository.count();
    }

    @Override
    public void saveAll(List<SleepTracker> sleepTrackers) {
        sleepTrackerRepository.saveAll(sleepTrackers);
    }

    @Override
    public List<SleepTracker> findByDate(LocalDate date) {
        return sleepTrackerRepository.findByDate(date);
    }

    @Override
    public List<SleepTracker> getTodaySleep(Long userId) {
        return sleepTrackerRepository.findByUserIdAndDate(userId, LocalDate.now());
    }
}
