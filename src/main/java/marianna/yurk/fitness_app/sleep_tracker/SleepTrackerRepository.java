package marianna.yurk.fitness_app.sleep_tracker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public class SleepTrackerRepository {

    private static final Logger log = LoggerFactory.getLogger(marianna.yurk.fitness_app.sleep_tracker.SleepTrackerRepository.class);
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
        return jdbcClient.sql("SELECT id,date,bedtime,wakeup_time,sleep_duration,sleep_quality,notes FROM SleepTracker WHERE id = :id" )
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

    public void create(SleepTracker sleepTracker) {
        var updated = jdbcClient.sql("INSERT INTO Sleep_tracker(id,date,bedtime,wakeup_time,sleep_duration,sleep_quality,notes, user_id) values(?, ?, ?, ?, ?, ?, ?, ?)")
                .params(List.of(sleepTracker.id(), sleepTracker.date(), sleepTracker.bedtime(), sleepTracker.wakeupTime(), sleepTracker.sleepDuration(), sleepTracker.sleepQuality(),sleepTracker.notes(),sleepTracker.userId()))
                .update();

        Assert.state(updated == 1, "Failed to create sleep " + sleepTracker.date());
    }

    public void update(SleepTracker sleepTracker, Integer id) {
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

        Assert.state(updated == 1, "Failed to update sleep " + sleepTracker.date());
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
