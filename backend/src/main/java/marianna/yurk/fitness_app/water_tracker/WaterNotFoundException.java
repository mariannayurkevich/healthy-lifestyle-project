package marianna.yurk.fitness_app.water_tracker;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WaterNotFoundException extends RuntimeException{
    public WaterNotFoundException(){
        super("Water not found");
    }
}
