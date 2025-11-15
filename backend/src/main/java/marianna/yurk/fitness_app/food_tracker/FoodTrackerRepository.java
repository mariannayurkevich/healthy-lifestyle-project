package marianna.yurk.fitness_app.food_tracker;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class FoodTrackerRepository {
    private final JdbcClient jdbcClient;

    public FoodTrackerRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<FoodTracker> findAll() {
        return jdbcClient.sql("""
            SELECT id, user_id, date, total_calories, total_proteins, total_fats, total_carbs, total_fiber, total_sugar, created_at, updated_at
            FROM food_tracker
        """)
                .query((rs, rowNum) -> new FoodTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_calories"),
                        rs.getDouble("total_proteins"),
                        rs.getDouble("total_fats"),
                        rs.getDouble("total_carbs"),
                        rs.getDouble("total_fiber"),
                        rs.getDouble("total_sugar"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();
    }

    public Optional<FoodTracker> findById(int id) {
        return jdbcClient.sql("""
            SELECT id, user_id, date, total_calories, total_proteins, total_fats, total_carbs, total_fiber, total_sugar, created_at, updated_at
            FROM food_tracker WHERE id = :id
        """)
                .param("id", id)
                .query((rs, rowNum) -> new FoodTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_calories"),
                        rs.getDouble("total_proteins"),
                        rs.getDouble("total_fats"),
                        rs.getDouble("total_carbs"),
                        rs.getDouble("total_fiber"),
                        rs.getDouble("total_sugar"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .optional();
    }

    public List<FoodEntry> findEntriesByTrackerId(int trackerId) {
        return jdbcClient.sql("""
            SELECT id, tracker_id, time, food_name, calories, proteins, fats, carbs, fiber, sugar
            FROM food_entries
            WHERE tracker_id = :trackerId
        """)
                .param("trackerId", trackerId)
                .query((rs, rowNum) -> new FoodEntry(
                        rs.getInt("id"),
                        rs.getInt("tracker_id"),
                        rs.getTimestamp("time").toLocalDateTime(),
                        rs.getString("food_name"),
                        rs.getDouble("calories"),
                        rs.getDouble("proteins"),
                        rs.getDouble("fats"),
                        rs.getDouble("carbs"),
                        rs.getDouble("fiber"),
                        rs.getDouble("sugar")
                ))
                .list();
    }

    public List<FoodTracker> findByUserId(Long userId) {
        return jdbcClient.sql("""
        SELECT id, user_id, date, total_calories, total_proteins, total_fats, total_carbs, total_fiber, total_sugar, created_at, updated_at
        FROM food_tracker WHERE user_id = :userId
    """)
                .param("userId", userId)
                .query((rs, rowNum) -> new FoodTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_calories"),
                        rs.getDouble("total_proteins"),
                        rs.getDouble("total_fats"),
                        rs.getDouble("total_carbs"),
                        rs.getDouble("total_fiber"),
                        rs.getDouble("total_sugar"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();
    }

    public List<FoodTracker> findByDate(LocalDate date) {
        return jdbcClient.sql("""
        SELECT id, user_id, date, total_calories, total_proteins, total_fats, total_carbs, total_fiber, total_sugar, created_at, updated_at
        FROM food_tracker WHERE date = :date
    """)
                .param("date", date)
                .query((rs, rowNum) -> new FoodTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_calories"),
                        rs.getDouble("total_proteins"),
                        rs.getDouble("total_fats"),
                        rs.getDouble("total_carbs"),
                        rs.getDouble("total_fiber"),
                        rs.getDouble("total_sugar"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();
    }

    public List<FoodTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        return jdbcClient.sql("""
        SELECT id, user_id, date, total_calories, total_proteins, total_fats, total_carbs, total_fiber, total_sugar, created_at, updated_at
        FROM food_tracker 
        WHERE user_id = :userId AND date = :date
    """)
                .param("userId", userId)
                .param("date", date)
                .query((rs, rowNum) -> new FoodTracker(
                        rs.getInt("id"),
                        rs.getLong("user_id"),
                        rs.getDate("date").toLocalDate(),
                        rs.getDouble("total_calories"),
                        rs.getDouble("total_proteins"),
                        rs.getDouble("total_fats"),
                        rs.getDouble("total_carbs"),
                        rs.getDouble("total_fiber"),
                        rs.getDouble("total_sugar"),
                        findEntriesByTrackerId(rs.getInt("id")),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()
                ))
                .list();
    }


    public FoodTracker create(FoodTracker foodTracker) {
        Integer generatedId = jdbcClient.sql("""
            INSERT INTO food_tracker (user_id, date, total_calories, total_proteins, total_fats, total_carbs, total_fiber, total_sugar, created_at, updated_at)
            VALUES (:userId, :date, :totalCalories, :totalProteins, :totalFats, :totalCarbs, :totalFiber, :totalSugar, :createdAt, :updatedAt)
            RETURNING id
        """)
                .param("userId", foodTracker.userId())
                .param("date", foodTracker.date())
                .param("totalCalories", calculateTotalCalories(foodTracker.entries()))
                .param("totalProteins", calculateTotalProteins(foodTracker.entries()))
                .param("totalFats", calculateTotalFats(foodTracker.entries()))
                .param("totalCarbs", calculateTotalCarbs(foodTracker.entries()))
                .param("totalFiber", calculateTotalFiber(foodTracker.entries()))
                .param("totalSugar", calculateTotalSugar(foodTracker.entries()))
                .param("createdAt", foodTracker.createdAt())
                .param("updatedAt", foodTracker.updatedAt())
                .query(Integer.class)
                .single();

        saveEntries(generatedId, foodTracker.entries());

        return new FoodTracker(
                generatedId,
                foodTracker.userId(),
                foodTracker.date(),
                calculateTotalCalories(foodTracker.entries()),
                calculateTotalProteins(foodTracker.entries()),
                calculateTotalFats(foodTracker.entries()),
                calculateTotalCarbs(foodTracker.entries()),
                calculateTotalFiber(foodTracker.entries()),
                calculateTotalSugar(foodTracker.entries()),
                foodTracker.entries(),
                foodTracker.createdAt(),
                foodTracker.updatedAt()
        );
    }

    public FoodTracker update(FoodTracker foodTracker, int id) {
        int updated = jdbcClient.sql("""
            UPDATE food_tracker SET 
                user_id = :userId,
                date = :date,
                total_calories = :totalCalories,
                total_proteins = :totalProteins,
                total_fats = :totalFats,
                total_carbs = :totalCarbs,
                total_fiber = :totalFiber,
                total_sugar = :totalSugar,
                updated_at = :updatedAt
            WHERE id = :id
        """)
                .param("userId", foodTracker.userId())
                .param("date", foodTracker.date())
                .param("totalCalories", calculateTotalCalories(foodTracker.entries()))
                .param("totalProteins", calculateTotalProteins(foodTracker.entries()))
                .param("totalFats", calculateTotalFats(foodTracker.entries()))
                .param("totalCarbs", calculateTotalCarbs(foodTracker.entries()))
                .param("totalFiber", calculateTotalFiber(foodTracker.entries()))
                .param("totalSugar", calculateTotalSugar(foodTracker.entries()))
                .param("updatedAt", foodTracker.updatedAt())
                .param("id", id)
                .update();

        deleteEntries(id);
        saveEntries(id, foodTracker.entries());

        return foodTracker;
    }

    private void saveEntries(int trackerId, List<FoodEntry> entries) {
        if (entries == null || entries.isEmpty()) {
            return;
        }

        for (FoodEntry entry : entries) {
            jdbcClient.sql("""
                INSERT INTO food_entries (tracker_id, time, food_name, calories, proteins, fats, carbs, fiber, sugar)
                VALUES ( :trackerId, :time, :foodName, :calories, :proteins, :fats, :carbs, :fiber, :sugar)
            """)
                    .param("trackerId", trackerId)
                    .param("time", entry.time())
                    .param("foodName", entry.foodName())
                    .param("calories", entry.calories())
                    .param("proteins", entry.proteins())
                    .param("fats", entry.fats())
                    .param("carbs", entry.carbs())
                    .param("fiber", entry.fiber())
                    .param("sugar", entry.sugar())
                    .update();
        }
    }

    private void deleteEntries(int trackerId) {
        jdbcClient.sql("DELETE FROM food_entries WHERE tracker_id = :trackerId")
                .param("trackerId", trackerId)
                .update();
    }

    public void delete(Integer id) {
        var updated = jdbcClient.sql("delete from food_tracker where id = :id")
                .param("id", id)
                .update();

        Assert.state(updated == 1, "Failed to delete food " + id);
    }

    private double calculateTotalCalories(List<FoodEntry> entries) {
        return entries.stream().mapToDouble(FoodEntry::calories).sum();
    }

    private double calculateTotalProteins(List<FoodEntry> entries) {
        return entries.stream().mapToDouble(FoodEntry::proteins).sum();
    }

    private double calculateTotalFats(List<FoodEntry> entries) {
        return entries.stream().mapToDouble(FoodEntry::fats).sum();
    }

    private double calculateTotalCarbs(List<FoodEntry> entries) {
        return entries.stream().mapToDouble(FoodEntry::carbs).sum();
    }

    private double calculateTotalFiber(List<FoodEntry> entries) {
        return entries.stream().mapToDouble(FoodEntry::fiber).sum();
    }

    private double calculateTotalSugar(List<FoodEntry> entries) {
        return entries.stream().mapToDouble(FoodEntry::sugar).sum();
    }

    public long count() {
        return jdbcClient.sql("SELECT COUNT(*) FROM food_tracker")
                .query(Long.class)
                .single();
    }

    public void saveAll(List<FoodTracker> foodEntries) {
        foodEntries.forEach(this::create);
    }

}
