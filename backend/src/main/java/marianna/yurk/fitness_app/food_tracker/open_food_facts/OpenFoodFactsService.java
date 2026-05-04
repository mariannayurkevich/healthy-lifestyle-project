package marianna.yurk.fitness_app.food_tracker.open_food_facts;

import com.alpermulayim.openfoodfacts_spring_boot_starter.OpenFoodFactsApi;
import com.alpermulayim.openfoodfacts_spring_boot_starter.requests.ProductField;
import com.alpermulayim.openfoodfacts_spring_boot_starter.requests.ProductSearchRequest;
import com.alpermulayim.openfoodfacts_spring_boot_starter.responses.OpenFoodFactsPageResponse;
import com.alpermulayim.openfoodfacts_spring_boot_starter.responses.OpenFoodFactsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

@Service
public class OpenFoodFactsService {
    @Autowired
    private OpenFoodFactsApi openFoodFactsApi;

    public OpenFoodFactsResponse findByBarcode(String barcode) {
        return openFoodFactsApi.getProduct(barcode);
    }


    public OpenFoodFactsPageResponse findByProductName(String query)
            throws InvocationTargetException, IllegalAccessException {

        List<ProductField> fields = List.of(
                ProductField.PRODUCT_NAME,
                ProductField.CODE,
                ProductField.BRANDS,
                ProductField.IMAGE_URL,
                ProductField.INGREDIENTS_TEXT,
                ProductField.NUTRITION_GRADES
        );

        ProductSearchRequest request = ProductSearchRequest.builder()
                .brandsTags(query)
                .pageSize(3)
                .fields(fields)
                .build();

        return openFoodFactsApi.searchProduct(request);
    }
}
