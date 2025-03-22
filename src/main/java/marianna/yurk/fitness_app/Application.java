package marianna.yurk.fitness_app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

	private static final Logger log = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
		log.info("Something changed!");
	}

//	@Bean
//	CommandLineRunner runner(UserRestClient client) {
//		return args -> {
//			List<User> users = client.findAll();
//			System.out.println(users);
//
//		};
//	}
}
