package marianna.yurk.fitness_app.sleep_tracker;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SleepTrackerServiceImpl implements SleepTrackerService {
    private final SleepTrackerRepository sleepTrackerRepository;

    public SleepTrackerServiceImpl(SleepTrackerRepository sleepTrackerRepository) {
        this.sleepTrackerRepository = sleepTrackerRepository;
    }

    @Override
    public List<SleepTracker> findAll() {
        return sleepTrackerRepository.findAll();
    }

    @Override
    public Optional<SleepTracker> findById(int id) {
        return sleepTrackerRepository.findById(id);
    }

    @Override
    public List<SleepTracker> findByUserId(Long userId) {
        return sleepTrackerRepository.findByUserId(userId);
    }

    @Override
    public List<SleepTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        return sleepTrackerRepository.findByUserIdAndDate(userId, date);
    }

    @Override
    public SleepTracker create(SleepTrackerRequest request) {
        SleepTracker sleepTracker = new SleepTracker(
                0,
                request.date(),
                request.bedtime(),
                request.wakeupTime(),
                request.sleepDuration(),
                request.sleepQuality(),
                request.notes(),
                request.userId()
        );

        sleepTrackerRepository.create(sleepTracker);
        return sleepTracker;
    }

    @Override
    public SleepTracker update(int id, SleepTrackerRequest request) {
        SleepTracker existingTracker = sleepTrackerRepository.findById(id)
                .orElseThrow(() -> new SleepNotFoundException(id));

        SleepTracker sleepTracker = new SleepTracker(
                id,
                request.date(),
                request.bedtime(),
                request.wakeupTime(),
                request.sleepDuration(),
                request.sleepQuality(),
                request.notes(),
                request.userId()
        );

        sleepTrackerRepository.update(sleepTracker, id);
        return sleepTracker;
    }

    @Override
    public void delete(Integer id) {
        if (!sleepTrackerRepository.findById(id).isPresent()) {
            throw new SleepNotFoundException(id);
        }

        sleepTrackerRepository.delete(id);
    }

    @Override
    public int count() {
        return sleepTrackerRepository.count();
    }

    @Override
    public void saveAll(List<SleepTracker> sleepTrackers) {
        sleepTrackerRepository.saveAll(sleepTrackers);
    }

    @Override
    public List<SleepTracker> findByDate(LocalDate date) {
        return sleepTrackerRepository.findByDate(date);
    }

    @Override
    public List<SleepTracker> getTodaySleep(Long userId) {
        LocalDate today = LocalDate.now();
        return sleepTrackerRepository.findByUserIdAndDate(userId, today);
    }
}
