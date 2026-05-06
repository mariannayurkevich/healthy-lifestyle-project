package marianna.yurk.fitness_app.food_tracker.open_food_facts;

import com.alpermulayim.openfoodfacts_spring_boot_starter.OpenFoodFactsApi;
import com.alpermulayim.openfoodfacts_spring_boot_starter.requests.ProductField;
import com.alpermulayim.openfoodfacts_spring_boot_starter.requests.ProductSearchRequest;
import com.alpermulayim.openfoodfacts_spring_boot_starter.responses.OpenFoodFactsPageResponse;
import com.alpermulayim.openfoodfacts_spring_boot_starter.responses.OpenFoodFactsResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class OpenFoodFactsService {
    @Autowired
    private OpenFoodFactsApi openFoodFactsApi;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final long BARCODE_CACHE_TTL_HOURS = 1;
    private static final long NAME_CACHE_TTL_MINUTES = 30;

    public OpenFoodFactsResponse findByBarcode(String barcode) {
        String cacheKey = "off:product:" + barcode;
        try {
            String cachedJson = redisTemplate.opsForValue().get(cacheKey);
            if (cachedJson != null) {
                return objectMapper.readValue(cachedJson, OpenFoodFactsResponse.class);
            }
        } catch (Exception e) {
            System.err.println("Redis cache read error for barcode " + barcode + ": " + e.getMessage());
        }

        OpenFoodFactsResponse response = openFoodFactsApi.getProduct(barcode);
        if (response != null && response.status() == 1) {
            try {
                String json = objectMapper.writeValueAsString(response);
                redisTemplate.opsForValue().set(cacheKey, json, BARCODE_CACHE_TTL_HOURS, TimeUnit.HOURS);
            } catch (Exception e) {
                System.err.println("Redis cache write error for barcode " + barcode + ": " + e.getMessage());
            }
        }
        return response;
    }

    public OpenFoodFactsPageResponse findByProductName(String query)
            throws InvocationTargetException, IllegalAccessException {
        String cacheKey = "off:search:" + query.toLowerCase().trim();
        try {
            String cachedJson = redisTemplate.opsForValue().get(cacheKey);
            if (cachedJson != null) {
                return objectMapper.readValue(cachedJson, OpenFoodFactsPageResponse.class);
            }
        } catch (Exception e) {
            System.err.println("Redis cache read error for query " + query + ": " + e.getMessage());
        }

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

        OpenFoodFactsPageResponse response = openFoodFactsApi.searchProduct(request);

        if (response != null && response.products() != null && !response.products().isEmpty()) {
            try {
                String json = objectMapper.writeValueAsString(response);
                redisTemplate.opsForValue().set(cacheKey, json, NAME_CACHE_TTL_MINUTES, TimeUnit.MINUTES);
            } catch (Exception e) {
                System.err.println("Redis cache write error for query " + query + ": " + e.getMessage());
            }
        }
        return response;
    }
}
