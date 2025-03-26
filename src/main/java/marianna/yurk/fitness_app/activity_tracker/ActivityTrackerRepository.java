package marianna.yurk.fitness_app.activity_tracker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;


@Repository
public class ActivityTrackerRepository {

    private static final Logger log = LoggerFactory.getLogger(ActivityTrackerRepository.class);
    private final JdbcClient jdbcClient;

    public ActivityTrackerRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<ActivityTracker> findAll() {
        return jdbcClient.sql("select * from activity_tracker")
                .query(ActivityTracker.class)
                .list();
    }

    public Optional<ActivityTracker> findById(Integer id) {
        return jdbcClient.sql("""
        SELECT id, activity_type, duration, calories_burned, activity_timestamp, user_id 
        FROM activity_tracker 
        WHERE id = :id
    """)
                .param("id", id)
                .query(ActivityTracker.class)
                .optional();
    }


    public List<ActivityTracker> findByUserId(Long userId) {
        return jdbcClient.sql("select * from activity_tracker where user_id = :userId")
                .param("userId", userId)
                .query(ActivityTracker.class)
                .list();
    }

    public void create(ActivityTracker activityTracker) {
        var updated = jdbcClient.sql("INSERT INTO Activity_tracker(id, activity_type, duration, calories_burned, activity_timestamp, user_id) values(?, ?, ?, ?, ?, ?)")
                .params(List.of(activityTracker.id(), activityTracker.activityType(), activityTracker.duration(), activityTracker.caloriesBurned(), activityTracker.activityTimestamp(), activityTracker.userId()))
                .update();

        Assert.state(updated == 1, "Failed to create activity " + activityTracker.activityType());
    }

    public void update(ActivityTracker activityTracker, Integer id) {
        var updated = jdbcClient.sql("""
    UPDATE ACTIVITY_TRACKER 
    SET activity_type = :activity_type, 
        duration = :duration, 
        calories_burned = :calories_burned, 
        activity_timestamp = :activity_timestamp,
        user_id = :user_id
    WHERE id = :id
    """)
                .param("id", id)
                .param("activity_type", activityTracker.activityType())
                .param("duration", activityTracker.duration())
                .param("calories_burned", activityTracker.caloriesBurned())
                .param("activity_timestamp", activityTracker.activityTimestamp())
                .param("user_id", activityTracker.userId())
                .update();

        Assert.state(updated == 1, "Failed to update activity " + activityTracker.activityType());
    }


    public void delete(Integer id) {
        var updated = jdbcClient.sql("delete from activity_tracker where id = :id")
                .param("id", id)
                .update();

        Assert.state(updated == 1, "Failed to delete activity " + id);
    }

    public int count() {
        return jdbcClient.sql("select * from activity_tracker").query().listOfRows().size();
    }

    public void saveAll(List<ActivityTracker> activity) {
        activity.stream().forEach(this::create);
    }

    public List<ActivityTracker> findByActivityType(String activityType) {
        return jdbcClient.sql("select * from activity_tracker where activity_type = :activityType")
                .param("activity_type", activityType)
                .query(ActivityTracker.class)
                .list();
    }

}
