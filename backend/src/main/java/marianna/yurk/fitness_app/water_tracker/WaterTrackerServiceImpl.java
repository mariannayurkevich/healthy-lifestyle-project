package marianna.yurk.fitness_app.water_tracker;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WaterTrackerServiceImpl implements WaterTrackerService {
    private final WaterTrackerRepository waterTrackerRepository;

    public WaterTrackerServiceImpl(WaterTrackerRepository waterTrackerRepository) {
        this.waterTrackerRepository = waterTrackerRepository;
    }

    @Override
    public List<WaterTracker> findAll() {
        return waterTrackerRepository.findAll();
    }

    @Override
    public Optional<WaterTracker> findById(int id) {
        return waterTrackerRepository.findById(id);
    }

    @Override
    public List<WaterTracker> findByUserId(Long userId) {
        return waterTrackerRepository.findByUserId(userId);
    }

    @Override
    public List<WaterTracker> findByUserIdAndDate(Long userId, LocalDate date) {
        return waterTrackerRepository.findByUserIdAndDate(userId, date);
    }

    @Override
    public WaterTracker create(WaterTrackerRequest request) {

        LocalDateTime now = LocalDateTime.now();
        WaterTracker waterTracker = new WaterTracker(
                0,
                request.userId(),
                request.date(),
                0.0,
                request.goalMl(),
                request.entries() != null ? request.entries() : List.of(),
                now,
                now
        );

        waterTrackerRepository.create(waterTracker);
        return waterTracker;
    }

    @Override
    public WaterTracker update(int id, WaterTrackerRequest request) {
        WaterTracker existingTracker = waterTrackerRepository.findById(id)
                .orElseThrow(() -> new WaterNotFoundException(id));

        LocalDateTime now = LocalDateTime.now();
        WaterTracker waterTracker = new WaterTracker(
                id,
                request.userId(),
                request.date(),
                0.0,
                request.goalMl(),
                request.entries() != null ? request.entries() : List.of(),
                existingTracker.createdAt(),
                now
        );

        waterTrackerRepository.update(waterTracker, id);
        return waterTracker;
    }

    @Override
    public void delete(Integer id) {
        if (!waterTrackerRepository.findById(id).isPresent()) {
            throw new WaterNotFoundException(id);
        }
        waterTrackerRepository.delete(id);
    }

    @Override
    public int count() {
        return waterTrackerRepository.count();
    }

    @Override
    public void saveAll(List<WaterTracker> waterTrackers) {
        waterTrackerRepository.saveAll(waterTrackers);
    }

    @Override
    public List<WaterTracker> findByDate(LocalDate date) {
        return waterTrackerRepository.findByDate(date);
    }
}
