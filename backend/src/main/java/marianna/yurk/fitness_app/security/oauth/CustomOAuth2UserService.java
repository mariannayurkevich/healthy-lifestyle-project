package marianna.yurk.fitness_app.security.oauth;

import jakarta.transaction.Transactional;
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
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        logger.info("Loading user from OAuth2 request");
        OAuth2User oAuth2User = super.loadUser(request);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        logger.info("All attributes: {}", attributes);

        String email = (String) attributes.get("email");
        if (email == null) {
            logger.error("Email not found in OAuth2 attributes");
            throw new OAuth2AuthenticationException("Email not found");
        }

        logger.info("Looking for user with email: {}", email);
        Optional<User> userOptional = userRepository.findByEmail(email);

        User user = userOptional.orElseGet(() -> {
            logger.info("Creating new user for email: {}", email);
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName((String) attributes.get("given_name"));
            newUser.setLastName((String) attributes.get("family_name"));
            newUser.setImageUrl((String) attributes.get("picture"));

            newUser.setProvider(AuthProvider.GOOGLE);
            newUser.setEnabled(true);
            newUser.setUserRole(UserRole.USER);
            return userRepository.save(newUser);
        });

        logger.info("User found/created: {}", user);
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "email"
        );
    }
}

