package marianna.yurk.fitness_app.food_tracker;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDate;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FoodNotFoundException extends RuntimeException{

  public FoodNotFoundException(){
    super("Food tracker not found");
  }

  public FoodNotFoundException(String message){
    super(message);
  }

  public FoodNotFoundException(int id){
    super("Food tracker not found with id: " + id);
  }

  public FoodNotFoundException(Long userId, LocalDate date){
    super("Food tracker not found for user: " + userId + " on date: " + date);
  }
}