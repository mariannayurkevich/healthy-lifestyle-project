package marianna.yurk.fitness_app.water_tracker;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDate;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WaterNotFoundException extends RuntimeException{
    public WaterNotFoundException(){

        super("Water not found");
    }

    public WaterNotFoundException(String message){
        super(message);
    }

    public WaterNotFoundException(int id){
        super("Water tracker not found with id: " + id);
    }

    public WaterNotFoundException(Long userId, LocalDate date){
        super("Water tracker not found for user: " + userId + " on date: " + date);
    }
}
