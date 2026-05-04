package marianna.yurk.fitness_app.food_tracker.open_food_facts;

import com.alpermulayim.openfoodfacts_spring_boot_starter.requests.ProductSearchRequest;
import com.alpermulayim.openfoodfacts_spring_boot_starter.responses.OpenFoodFactsPageResponse;
import com.alpermulayim.openfoodfacts_spring_boot_starter.responses.OpenFoodFactsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.InvocationTargetException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class OpenFoodFactsController {
    @Autowired
    private OpenFoodFactsService service;

    @GetMapping("/v1/products/{barcode}")
    public ResponseEntity<OpenFoodFactsResponse> getProductByBarcode(@PathVariable String barcode) {
        OpenFoodFactsResponse response = service.findByBarcode(barcode);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/v2/search")
    public ResponseEntity<OpenFoodFactsPageResponse> searchProducts(@RequestParam String query) {
        try {
            OpenFoodFactsPageResponse response = service.findByProductName(query);
            return ResponseEntity.ok(response);
        } catch (InvocationTargetException | IllegalAccessException e) {

            return ResponseEntity.internalServerError().build();
        }
    }
}
