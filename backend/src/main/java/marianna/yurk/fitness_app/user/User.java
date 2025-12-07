package marianna.yurk.fitness_app.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class User implements UserDetails {

        @SequenceGenerator(
                name = "student_sequence",
                sequenceName = "student_sequence",
                allocationSize = 1
        )
        @Id
        @GeneratedValue(
                strategy = GenerationType.SEQUENCE,
                generator = "student_sequence"
        )
        private Long id;

        private String firstName;

        private String lastName;

        @NotEmpty(message = "Электронная почта обязательна")
        @Email(message = "Некорректный формат эл. почты")
        @Column(unique = true)
        private String email;

        @JsonIgnore // Игнорируем при сериализации
        private String password;

        private String gender;
        private LocalDate birthDate;
        private Double height;
        private Double weight;
        private String allergies;
        private String intolerances;
        private Double dailyCalorieNorm;
        private String activityLevel;

        @Enumerated(EnumType.STRING)
        private UserRole userRole;

        @Enumerated(EnumType.STRING)
        private Goal goal;

        private Boolean locked = false;
        private Boolean enabled = false;

        @Enumerated(EnumType.STRING)
        private AuthProvider provider;

        private String imageUrl;

        private Boolean profileCompleted = false;

        public User(String firstName,
                    String lastName,
                    String email,
                    String password,
                    UserRole userRole
        ) {
                this.firstName = firstName;
                this.lastName = lastName;
                this.email = email;
                this.password = password;
                this.userRole = userRole;
        }

        @Override
        @JsonIgnore
        public Collection<? extends GrantedAuthority> getAuthorities() {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(userRole.name());
                return Collections.singletonList(authority);
        }

        @Override
        @JsonIgnore
        public String getPassword() {
                return password;
        }

        @Override
        @JsonIgnore
        public String getUsername() {
                return email;
        }

        @Override
        @JsonIgnore
        public boolean isAccountNonExpired() {
                return true;
        }

        @Override
        @JsonIgnore
        public boolean isAccountNonLocked() {
                return !locked;
        }

        @Override
        @JsonIgnore
        public boolean isCredentialsNonExpired() {
                return true;
        }

        @Override
        @JsonIgnore
        public boolean isEnabled() {
                return enabled;
        }
}