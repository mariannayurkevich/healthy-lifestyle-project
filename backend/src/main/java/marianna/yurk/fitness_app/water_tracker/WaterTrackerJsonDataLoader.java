package marianna.yurk.fitness_app.water_tracker;

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
public class WaterTrackerJsonDataLoader implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(WaterTrackerJsonDataLoader.class);
    private final WaterTrackerRepository waterTrackerRepository;
    private final ObjectMapper objectMapper;

    public WaterTrackerJsonDataLoader(WaterTrackerRepository waterTrackerRepository) {
        this.waterTrackerRepository = waterTrackerRepository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void run(String... args) throws Exception {
        if(waterTrackerRepository.count() == 0) {
            try(InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data/water.json")){
                if (inputStream == null) {
                    throw new RuntimeException("activity.json not found in /data folder in classpath");
                }
                Water allWater = objectMapper.readValue(inputStream, Water.class);
                log.info("Reading {} water from JSON data and saving it to a database.", allWater.water().size());
                waterTrackerRepository.saveAll(allWater.water());
            } catch (IOException e){
                throw new RuntimeException("Failed to read JSON data", e);
            }
        } else {
            log.info("Not loading Water from JSON data because the collection contains data.");
        }
    }
}
