package marianna.yurk.fitness_app.stats;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DailySummaryDTO {
    private LocalDate date;
    private double totalCalories;
    private double totalProteins;
    private double totalFats;
    private double totalCarbs;
    private int activityDurationMinutes;
    private double sleepDurationMinutes;
    private double totalIntakeMl;
    private double goalMl;
    private String analysis;

    public DailySummaryDTO(LocalDate date, double totalCalories, double totalProteins, double totalFats, double totalCarbs,
    int activityDurationMinutes, double sleepDurationMinutes, double totalIntakeMl, double goalMl, String analysis) {
        this.date = date;
        this.totalCalories = totalCalories;
        this.totalProteins = totalProteins;
        this.totalFats = totalFats;
        this.totalCarbs = totalCarbs;
        this.activityDurationMinutes = activityDurationMinutes;
        this.sleepDurationMinutes = sleepDurationMinutes;
        this.totalIntakeMl = totalIntakeMl;
        this.goalMl = goalMl;
        this.analysis = analysis;
    }
}
