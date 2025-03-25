package marianna.yurk.fitness_app.sleep_tracker;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SleepNotFoundException extends RuntimeException{
    public SleepNotFoundException(){
        super("Sleep not found");
    }
}
