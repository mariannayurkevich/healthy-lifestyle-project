package marianna.yurk.fitness_app.food_tracker;

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
public class FoodTrackerJsonDataLoader implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(FoodTrackerJsonDataLoader.class);
    private final FoodTrackerRepository foodTrackerRepository;
    private final ObjectMapper objectMapper;

    public FoodTrackerJsonDataLoader(FoodTrackerRepository foodTrackerRepository) {
        this.foodTrackerRepository = foodTrackerRepository;
        this.objectMapper = new ObjectMapper();
        // Enable support for Java 8 date/time types
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void run(String... args) throws Exception {
        if (foodTrackerRepository.count() == 0) {
            try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data/food.json")) {
                if (inputStream == null) {
                    throw new RuntimeException("food.json not found in /data folder in classpath");
                }
                Food allFood = objectMapper.readValue(inputStream, Food.class);
                log.info("Reading {} food from JSON data and saving it to a database.", allFood.food().size());
                foodTrackerRepository.saveAll(allFood.food());
            } catch (IOException e) {
                throw new RuntimeException("Failed to read JSON data", e);
            }
        } else {
            log.info("Not loading Food entries from JSON data because the collection already contains data.");
        }
    }
}
