package marianna.yurk.fitness_app.food_tracker.food_analysis;

public class FoodAnalysisException extends RuntimeException {
  public FoodAnalysisException(String message) {
    super(message);
  }

  public FoodAnalysisException(String message, Throwable cause) {
    super(message, cause);
  }
}
