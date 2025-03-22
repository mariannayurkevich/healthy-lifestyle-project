package marianna.yurk.fitness_app.activity_tracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class ActivityTrackerJsonDataLoader implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(ActivityTrackerJsonDataLoader.class);
    private final ActivityTrackerRepository activityTrackerRepository;
    private final ObjectMapper objectMapper;

    public ActivityTrackerJsonDataLoader(ActivityTrackerRepository activityTrackerRepository) {
        this.activityTrackerRepository = activityTrackerRepository;
        this.objectMapper = new ObjectMapper();
        // Регистрируем модуль для поддержки LocalDateTime и других типов из java.time
        this.objectMapper.registerModule(new JavaTimeModule());
        // Отключаем запись дат в виде числовых таймстампов, чтобы использовать строковое представление ISO-8601
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void run(String... args) throws Exception {
        if(activityTrackerRepository.count() == 0) {
            try(InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data/activity.json")){
                if (inputStream == null) {
                    throw new RuntimeException("activity.json not found in /data folder in classpath");
                }
                Activity allActivity = objectMapper.readValue(inputStream, Activity.class);
                log.info("Reading {} activity from JSON data and saving it to a database.", allActivity.activity().size());
                activityTrackerRepository.saveAll(allActivity.activity());
            } catch (IOException e){
                throw new RuntimeException("Failed to read JSON data", e);
            }
        } else {
            log.info("Not loading Activity from JSON data because the collection contains data.");
        }
    }
}
