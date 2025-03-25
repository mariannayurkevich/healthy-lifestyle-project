package marianna.yurk.fitness_app.sleep_tracker;

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
public class SleepTrackerJsonDataLoader implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(marianna.yurk.fitness_app.sleep_tracker.SleepTrackerJsonDataLoader.class);
    private final SleepTrackerRepository sleepTrackerRepository;
    private final ObjectMapper objectMapper;

    public SleepTrackerJsonDataLoader(SleepTrackerRepository sleepTrackerRepository) {
        this.sleepTrackerRepository = sleepTrackerRepository;
        this.objectMapper = new ObjectMapper();
        // Регистрируем модуль для поддержки LocalDateTime и других типов из java.time
        this.objectMapper.registerModule(new JavaTimeModule());
        // Отключаем запись дат в виде числовых таймстампов, чтобы использовать строковое представление ISO-8601
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void run(String... args) throws Exception {
        if(sleepTrackerRepository.count() == 0) {
            try(InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data/sleep.json")){
                if (inputStream == null) {
                    throw new RuntimeException("sleep.json not found in /data folder in classpath");
                }
                Sleep allSleep = objectMapper.readValue(inputStream, Sleep.class);
                log.info("Reading {} sleep from JSON data and saving it to a database.", allSleep.sleep().size());
                sleepTrackerRepository.saveAll(allSleep.sleep());
            } catch (IOException e){
                throw new RuntimeException("Failed to read JSON data", e);
            }
        } else {
            log.info("Not loading Sleep from JSON data because the collection contains data.");
        }
    }
}
