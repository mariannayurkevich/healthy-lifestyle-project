package marianna.yurk.fitness_app.stats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/report")
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
}
