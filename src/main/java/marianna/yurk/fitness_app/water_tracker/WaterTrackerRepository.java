package marianna.yurk.fitness_app.water_tracker;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class WaterTrackerRepository {

    private static final Logger log = LoggerFactory.getLogger(WaterTrackerRepository.class);
    private final JdbcClient jdbcClient;

    public WaterTrackerRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<WaterTracker> findAll() {
        List<WaterTracker> trackers = jdbcClient.sql("""
        SELECT id, user_id, date, total_intake_ml, goal_ml, created_at, updated_at
        FROM water_tracker
    """)
                .query((rs, rowNum) -> new WaterTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_intake_ml"),
                        rs.getDouble("goal_ml"),
                        findEntriesByTrackerId(rs.getInt("id")), // Подгрузка списка entries
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();

        return trackers;
    }

    private List<WaterEntry> findEntriesByTrackerId(int trackerId) {
        return jdbcClient.sql("""
        SELECT id, tracker_id, time, amount_ml
        FROM water_entries
        WHERE tracker_id = :trackerId
    """)
                .param("trackerId", trackerId)
                .query((rs, rowNum) -> new WaterEntry(
                        rs.getInt("id"),
                        rs.getInt("tracker_id"),
                        rs.getTimestamp("time").toLocalDateTime(),
                        rs.getDouble("amount_ml")
                ))
                .list();
    }

    public Optional<WaterTracker> findById(int id) {
        return jdbcClient.sql("""
        SELECT id, user_id, date, total_intake_ml, goal_ml, created_at, updated_at
        FROM water_tracker WHERE id = :id
    """)
                .param("id", id)
                .query((rs, rowNum) -> new WaterTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_intake_ml"),
                        rs.getDouble("goal_ml"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .optional();
    }

    public List<WaterTracker> findByUserId(Long userId) {
        return jdbcClient.sql("""
        SELECT id, user_id, date, total_intake_ml, goal_ml, created_at, updated_at
        FROM water_tracker WHERE user_id = :userId
    """)
                .param("userId", userId)
                .query((rs, rowNum) -> new WaterTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_intake_ml"),
                        rs.getDouble("goal_ml"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();
    }

    public List<WaterTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        return jdbcClient.sql("""
        SELECT id, user_id, date, total_intake_ml, goal_ml, created_at, updated_at
        FROM water_tracker 
        WHERE user_id = :userId AND date = :date
    """)
                .param("userId", userId)
                .param("date", date)
                .query((rs, rowNum) -> new WaterTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_intake_ml"),
                        rs.getDouble("goal_ml"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();
    }

    public void create(WaterTracker waterTracker) {
        int trackerId = jdbcClient.sql("""
        INSERT INTO water_tracker (user_id, date, total_intake_ml, goal_ml, created_at, updated_at)
        VALUES (:userId, :date, :totalIntakeMl, :goalMl, :createdAt, :updatedAt)
        RETURNING id
    """)
                .param("userId", waterTracker.userId())
                .param("date", waterTracker.date())
                .param("totalIntakeMl", calculateTotalIntake(waterTracker.entries()))
                .param("goalMl", waterTracker.goalMl())
                .param("createdAt", waterTracker.createdAt())
                .param("updatedAt", waterTracker.updatedAt())
                .query(Integer.class)
                .single();

        // Сохраняем записи entries (без id)
        saveEntries(trackerId, waterTracker.entries());
    }

    public void update(WaterTracker waterTracker, int id) {
        int updated = jdbcClient.sql("""
        UPDATE water_tracker SET 
            user_id = :userId,
            date = :date,
            total_intake_ml = :totalIntakeMl,
            goal_ml = :goalMl,
            updated_at = :updatedAt
        WHERE id = :id
    """)
                .param("userId", waterTracker.userId())
                .param("date", waterTracker.date())
                .param("totalIntakeMl", calculateTotalIntake(waterTracker.entries()))
                .param("goalMl", waterTracker.goalMl())
                .param("updatedAt", waterTracker.updatedAt())
                .param("id", id)
                .update();

        Assert.state(updated == 1, "Failed to update water tracker record with ID " + id);

        // Удаляем старые entries и вставляем новые без id
        deleteEntries(id);
        saveEntries(id, waterTracker.entries());
    }



    public void delete(Integer id) {
        deleteEntries(id);
        var updated = jdbcClient.sql("DELETE FROM water_tracker WHERE id = :id")
                .param("id", id)
                .update();

        Assert.state(updated == 1, "Failed to delete water entry " + id);
    }

    public int count() {
        return jdbcClient.sql("select * from water_tracker").query().listOfRows().size();
    }

    public void saveAll(List<WaterTracker> waterEntries) {
        waterEntries.forEach(this::create);
    }

    public List<WaterTracker> findByDate(LocalDate date) {
        return jdbcClient.sql("""
        SELECT id, user_id, date, total_intake_ml, goal_ml, created_at, updated_at
        FROM water_tracker WHERE date = :date
    """)
                .param("date", date)
                .query((rs, rowNum) -> new WaterTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_intake_ml"),
                        rs.getDouble("goal_ml"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();
    }


    private void saveEntries(int trackerId, List<WaterEntry> entries) {
        if (entries == null || entries.isEmpty()) {
            return; // Если нет записей, выходим
        }

        for (WaterEntry entry : entries) {
            jdbcClient.sql("""
            INSERT INTO water_entries (tracker_id, time, amount_ml)
            VALUES (:trackerId, :time, :amountMl)
        """)
                    .param("trackerId", trackerId)
                    .param("time", entry.time())
                    .param("amountMl", entry.amountMl())
                    .update();
        }
    }


    private void deleteEntries(int trackerId) {
        jdbcClient.sql("DELETE FROM water_entries WHERE tracker_id = :trackerId")
                .param("trackerId", trackerId)
                .update();
    }

    private double calculateTotalIntake(List<WaterEntry> entries) {
        return entries.stream()
                .mapToDouble(WaterEntry::amountMl)
                .sum();
    }
}