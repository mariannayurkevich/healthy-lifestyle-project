package marianna.yurk.fitness_app.stats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/report")
@CrossOrigin(origins = "http://localhost:3000")
public class DailyReportController {
    @Autowired
    private DailyReportService reportService;

    @GetMapping("/today")
    public DailySummaryDTO getTodayReport(@RequestParam("userId") Long userId) {
        return reportService.generateReport(userId, LocalDate.now());
    }

    @GetMapping("/date")
    public DailySummaryDTO getReportByDate(@RequestParam("userId") Long userId,
                                           @RequestParam("d") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reportService.generateReport(userId,date);
    }

    @GetMapping("/week")
    public List<DailySummaryDTO> getWeeklyReport(
            @RequestParam("userId") Long userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate
    ) {
        return reportService.generateWeeklyReport(userId, startDate);
    }
}
