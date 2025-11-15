package marianna.yurk.fitness_app.activity_tracker;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ActivityTrackerServiceImpl implements ActivityTrackerService {
    private final ActivityTrackerRepository activityTrackerRepository;

    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String ACTIVITY_BY_ID_KEY = "activity:";
    private static final String ACTIVITIES_BY_USER_KEY = "activities_user:";
    private static final String ACTIVITIES_BY_USER_DATE_KEY = "activities_user_date:";
    private static final String ALL_ACTIVITIES_KEY = "all_activities";
    private static final String ACTIVITIES_BY_TYPE_KEY = "activities_type:";

    @Override
    public List<ActivityTracker> findAll() {
        List<ActivityTracker> cachedActivities = (List<ActivityTracker>) redisTemplate.opsForValue().get(ALL_ACTIVITIES_KEY);
        if (cachedActivities != null) {
            return cachedActivities;
        }
        List<ActivityTracker> activities = activityTrackerRepository.findAll();
        redisTemplate.opsForValue().set(ALL_ACTIVITIES_KEY, activities, Duration.ofMinutes(30));
        return activities;
    }

    @Override
    public Optional<ActivityTracker> findById(int id) {
        String cacheKey = ACTIVITY_BY_ID_KEY + id;
        ActivityTracker cachedActivity = (ActivityTracker) redisTemplate.opsForValue().get(cacheKey);
        if (cachedActivity != null) {
            return Optional.of(cachedActivity);
        }
        Optional<ActivityTracker> activity = activityTrackerRepository.findById(id);
        activity.ifPresent(activityTracker -> {
            redisTemplate.opsForValue().set(cacheKey, activityTracker, Duration.ofMinutes(30));
        });
        return activity;
    }

    @Override
    public List<ActivityTracker> findByUserId(Long userId) {
        String cacheKey = ACTIVITIES_BY_USER_KEY + userId;
        List<ActivityTracker> cachedActivities = (List<ActivityTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedActivities != null) {
            return cachedActivities;
        }
        List<ActivityTracker> activities = activityTrackerRepository.findByUserId(userId);
        redisTemplate.opsForValue().set(cacheKey, activities, Duration.ofMinutes(30));
        return activities;
    }

    @Override
    public List<ActivityTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        String cacheKey = ACTIVITIES_BY_USER_DATE_KEY + userId + ":" + date;
        List<ActivityTracker> cachedActivities = (List<ActivityTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedActivities != null) {
            return cachedActivities;
        }
        List<ActivityTracker> activities = activityTrackerRepository.findByUserIdAndDate(userId, date);
        redisTemplate.opsForValue().set(cacheKey, activities, Duration.ofMinutes(30));

        return activities;
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

        ActivityTracker createdActivity = activityTrackerRepository.create(activityTracker);

        invalidateActivityCaches(createdActivity);
        return createdActivity;
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

        ActivityTracker updatedActivity = activityTrackerRepository.update(activityTracker, id);
        invalidateActivityCaches(updatedActivity);
        invalidateActivityCaches(existingTracker);
        return activityTracker;
    }

    private void invalidateActivityCaches(ActivityTracker activity) {
        redisTemplate.delete(ACTIVITY_BY_ID_KEY + activity.id());

        invalidateUserActivityCaches(activity);

        redisTemplate.delete(ALL_ACTIVITIES_KEY);
        redisTemplate.delete("activities_count");

        redisTemplate.delete(ACTIVITIES_BY_TYPE_KEY + activity.activityType());
    }

    private void invalidateUserActivityCaches(ActivityTracker activity) {
        Long userId = activity.userId();
        LocalDate activityDate = activity.activityTimestamp().toLocalDate();

        redisTemplate.delete(ACTIVITIES_BY_USER_KEY + userId);

        redisTemplate.delete(ACTIVITIES_BY_USER_DATE_KEY + userId + ":" + activityDate);
    }

    @Override
    public void delete(Integer id) {
        ActivityTracker existingActivity = activityTrackerRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));

        activityTrackerRepository.delete(id);
        invalidateActivityCaches(existingActivity);
    }

    @Override
    public int count() {
        return activityTrackerRepository.count();
    }

    @Override
    public void saveAll(List<ActivityTracker> activityTrackers) {
        activityTrackerRepository.saveAll(activityTrackers);

        redisTemplate.delete(ALL_ACTIVITIES_KEY);

        activityTrackers.forEach(this::invalidateUserActivityCaches);
    }

    @Override
    public List<ActivityTracker> findByActivityType(String activityType) {
        String cacheKey = ACTIVITIES_BY_TYPE_KEY + activityType;

        List<ActivityTracker> cachedActivities = (List<ActivityTracker>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedActivities != null) {
            return cachedActivities;
        }

        List<ActivityTracker> activities = activityTrackerRepository.findByActivityType(activityType);
        redisTemplate.opsForValue().set(cacheKey, activities, Duration.ofMinutes(30));
        return activities;
    }
}
