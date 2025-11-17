package marianna.yurk.fitness_app.activity_tracker;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDate;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ActivityNotFoundException extends RuntimeException{
    public ActivityNotFoundException(){
        super("Activity not found");
    }

    public ActivityNotFoundException(String message){
        super(message);
    }

    public ActivityNotFoundException(int id){
        super("Activity tracker not found with id: " + id);
    }

    public ActivityNotFoundException(Long userId, LocalDate date){
        super("Activity tracker not found for user: " + userId + " on date: " + date);
    }
}
