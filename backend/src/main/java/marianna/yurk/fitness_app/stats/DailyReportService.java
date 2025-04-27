package marianna.yurk.fitness_app.stats;

import marianna.yurk.fitness_app.activity_tracker.*;
import marianna.yurk.fitness_app.food_tracker.*;
import marianna.yurk.fitness_app.sleep_tracker.*;
import marianna.yurk.fitness_app.water_tracker.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DailyReportService {
    @Autowired
    private ActivityTrackerRepository activityTrackerRepository;

    @Autowired
    private FoodTrackerRepository foodTrackerRepository;

    @Autowired
    private SleepTrackerRepository sleepTrackerRepository;

    @Autowired
    private WaterTrackerRepository waterTrackerRepository;

    public DailySummaryDTO generateReport(Long userId,LocalDate date) {

        List<ActivityTracker> activityTrackers = activityTrackerRepository.findByUserIdAndDate(userId, date);

        int activityDurationMinutes = activityTrackers.stream()
                .mapToInt(ActivityTracker::duration)
                .sum();

        List<FoodTracker> foodTrackers = foodTrackerRepository.findByUserIdAndDate(userId, date);

        double totalCalories = foodTrackers.stream()
                .mapToDouble(FoodTracker::totalCalories)
                .sum();

        double totalProteins = foodTrackers.stream()
                .mapToDouble(FoodTracker::totalProteins)
                .sum();

        double totalFats = foodTrackers.stream()
                .mapToDouble(FoodTracker::totalFats)
                .sum();

        double totalCarbs = foodTrackers.stream()
                .mapToDouble(FoodTracker::totalCarbs)
                .sum();

        List<SleepTracker> sleepTrackers = sleepTrackerRepository.findByUserIdAndDate(userId, date);
        double sleepDuration = sleepTrackers.stream()
                .mapToDouble(SleepTracker::sleepDuration)
                .sum();

        List<WaterTracker> waterTrackers = waterTrackerRepository.findByUserIdAndDate(userId, date);

        double totalIntakeMl = waterTrackers.stream()
                .mapToDouble(WaterTracker::totalIntakeMl)
                .sum();

        double goalMl = waterTrackers.stream()
                .mapToDouble(WaterTracker::goalMl)
                .findFirst()
                .orElse(0.0);

        StringBuilder analysis = new StringBuilder();

        if (totalCalories > 2500.0) {
            analysis.append("Потреблено слишком много калорий. ");
        } else if (totalCalories < 1500.0) {
            analysis.append("Недостаточное потребление калорий. ");
        } else {
            analysis.append("Калорийность в пределах нормы. ");
        }

        if (activityDurationMinutes < 30) {
            analysis.append("Мало активности. ");
        } else {
            analysis.append("Достаточная физическая активность. ");
        }

        if (sleepDuration < 8.0) {
            analysis.append("Недостаток сна. ");
        } else {
            analysis.append("Сон в норме. ");
        }

        if (goalMl > 0 && totalIntakeMl < goalMl) {
            analysis.append("Недостаточное потребление воды. ");
        } else if (goalMl > 0) {
            analysis.append("Цель по воде достигнута. ");
        }

        return new DailySummaryDTO(userId,date, totalCalories, totalProteins, totalFats, totalCarbs, activityDurationMinutes,
        sleepDuration, totalIntakeMl, goalMl, analysis.toString());
    }
}
