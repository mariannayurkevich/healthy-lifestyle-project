package marianna.yurk.fitness_app.sleep_tracker;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDate;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SleepNotFoundException extends RuntimeException{
    public SleepNotFoundException(){
        super("Sleep not found");
    }
    public SleepNotFoundException(String message){
        super(message);
    }

    public SleepNotFoundException(int id){
        super("Sleep tracker not found with id: " + id);
    }

    public SleepNotFoundException(Long userId, LocalDate date){
        super("Sleep tracker not found for user: " + userId + " on date: " + date);
    }
}
