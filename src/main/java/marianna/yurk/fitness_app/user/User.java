package marianna.yurk.fitness_app.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

        @NotEmpty(message = "Имя пользователя обязательно")
        private String lastName;

        @NotEmpty(message = "Электронная почта обязательна")
        @Email(message = "Некорректный формат эл. почты")
        @Column(unique = true)
        private String email;

        @NotEmpty(message = "Пароль обязателен")
        private String password;

        // @NotEmpty(message = "Пол обязателен")
        private String gender;

        // @NotNull(message = "Дата рождения обязательна")
        private LocalDate birthDate;

        // @NotNull(message = "Рост обязателен")
        // @Positive(message = "Рост должен быть положительным числом")
        private Double height; // в сантиметрах

        // @NotNull(message = "Вес обязателен")
        // @Positive(message = "Вес должен быть положительным числом")
        private Double weight; // в килограммах

        private String allergies;
        private String intolerances;

        private Double dailyCalorieNorm;

        private String activityLevel;

        @Enumerated(EnumType.STRING)
        private UserRole userRole;
        private Boolean locked = false;
        private Boolean enabled = false;

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
        public Collection<? extends GrantedAuthority> getAuthorities() {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(userRole.name());
                return Collections.singletonList(authority);
        }

        @Override
        public String getPassword() {
                return password;
        }

        @Override
        public String getUsername() {
                return email;
        }

        @Override
        public boolean isAccountNonExpired() {
                return true;
        }

        @Override
        public boolean isAccountNonLocked() {
                return !locked;
        }

        @Override
        public boolean isCredentialsNonExpired() {
                return true;
        }

        @Override
        public boolean isEnabled() {
                return enabled;
        }
}