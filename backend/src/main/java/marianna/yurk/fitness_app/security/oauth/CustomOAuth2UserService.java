package marianna.yurk.fitness_app.security.oauth;

import marianna.yurk.fitness_app.user.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        logger.info("All attributes from Google: {}", attributes);
        String email = (String) attributes.get("email");
        logger.info("Email from attributes: {}", email);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName((String) attributes.get("name"));
            newUser.setImageUrl((String) attributes.get("picture"));
            newUser.setProvider(AuthProvider.GOOGLE);
            return userRepository.save(newUser);
        });

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "email"
        );
    }
}

