package marianna.yurk.fitness_app.security.config;

import com.alpermulayim.openfoodfacts_spring_boot_starter.OpenFoodFactsApi;
import com.alpermulayim.openfoodfacts_spring_boot_starter.OpenFoodFactsWebClient;
import com.alpermulayim.openfoodfacts_spring_boot_starter.config.OpenFoodFactsWebClientProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(OpenFoodFactsWebClientProperties.class)
public class OpenFoodFactsConfig {
    OpenFoodFactsWebClientProperties properties;

    @Autowired
    public OpenFoodFactsConfig(OpenFoodFactsWebClientProperties properties) {
        this.properties = properties;
    }

    @Bean
    OpenFoodFactsApi openFoodFactsWebClient(){
        return new OpenFoodFactsWebClient(properties);
    }
}
