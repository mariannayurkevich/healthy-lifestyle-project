package marianna.yurk.fitness_app.sleep_tracker;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public class SleepTrackerRepository {

    private final JdbcClient jdbcClient;

    public SleepTrackerRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<SleepTracker> findAll() {
        return jdbcClient.sql("select * from sleep_tracker")
                .query(SleepTracker.class)
                .list();
    }

    public Optional<SleepTracker> findById(Integer id) {
        return jdbcClient.sql("SELECT id,date,bedtime,wakeup_time,sleep_duration,sleep_quality,notes,user_id FROM sleep_tracker WHERE id = :id" )
                .param("id", id)
                .query(SleepTracker.class)
                .optional();
    }

    public List<SleepTracker> findByUserId(Long userId) {
        return jdbcClient.sql("select * from sleep_tracker where user_id = :userId")
                .param("userId", userId)
                .query(SleepTracker.class)
                .list();
    }

    public List<SleepTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        return jdbcClient.sql("""
        SELECT * 
        FROM sleep_tracker 
        WHERE user_id = :userId 
        AND (
            (wakeup_time >= bedtime AND date = :date) 
            OR 
            (wakeup_time < bedtime AND date = :date - INTERVAL '1 day')
        )
        """)
                .param("userId", userId)
                .param("date", date)
                .query(SleepTracker.class)
                .list();
    }


    public SleepTracker create(SleepTracker sleepTracker) {
        Integer generatedId = jdbcClient.sql("""
            INSERT INTO sleep_tracker (date, bedtime, wakeup_time, sleep_duration, sleep_quality, notes, user_id)
            VALUES (:date, :bedtime, :wakeupTime, :sleepDuration, :sleepQuality, :notes, :userId)
            RETURNING id
        """)
                .param("date", sleepTracker.date())
                .param("bedtime", sleepTracker.bedtime())
                .param("wakeupTime", sleepTracker.wakeupTime())
                .param("sleepDuration", sleepTracker.sleepDuration())
                .param("sleepQuality", sleepTracker.sleepQuality())
                .param("notes", sleepTracker.notes())
                .param("userId", sleepTracker.userId())
                .query(Integer.class)
                .single();

        return new SleepTracker(
                generatedId,
                sleepTracker.date(),
                sleepTracker.bedtime(),
                sleepTracker.wakeupTime(),
                sleepTracker.sleepDuration(),
                sleepTracker.sleepQuality(),
                sleepTracker.notes(),
                sleepTracker.userId()
        );

    }

    public SleepTracker update(SleepTracker sleepTracker, Integer id) {
        var updated = jdbcClient.sql("""
        UPDATE SLEEP_TRACKER 
        SET date = :date,
            bedtime = :bedtime,
            wakeup_time = :wakeup_time,
            sleep_duration = :sleep_duration,
            sleep_quality = :sleep_quality,
            notes = :notes,
            user_id = :user_id
        WHERE id = :id
    """)
                .param("id", id)
                .param("date", sleepTracker.date())
                .param("bedtime", sleepTracker.bedtime())
                .param("wakeup_time", sleepTracker.wakeupTime())
                .param("sleep_duration", sleepTracker.sleepDuration())
                .param("sleep_quality", sleepTracker.sleepQuality())
                .param("notes", sleepTracker.notes())
                .param("user_id", sleepTracker.userId())
                .update();

        return sleepTracker;
    }


    public void delete(Integer id) {
        var updated = jdbcClient.sql("delete from sleep_tracker where id = :id")
                .param("id", id)
                .update();

        Assert.state(updated == 1, "Failed to delete sleep " + id);
    }

    public int count() {
        return jdbcClient.sql("select * from sleep_tracker").query().listOfRows().size();
    }

    public void saveAll(List<SleepTracker> sleep) {
        sleep.stream().forEach(this::create);
    }

    public List<SleepTracker> findByDate(LocalDate date) {
        return jdbcClient.sql("select * from sleep_tracker where date = :date")
                .param("date", date)
                .query(SleepTracker.class)
                .list();
    }

}
