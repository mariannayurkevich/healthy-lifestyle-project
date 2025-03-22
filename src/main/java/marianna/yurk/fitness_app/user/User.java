package marianna.yurk.fitness_app.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotEmpty(message = "Имя пользователя обязательно")
        private String name;

        @NotEmpty(message = "Электронная почта обязательна")
        @Email(message = "Некорректный формат эл. почты")
        @Column(unique = true)
        private String email;

        @NotEmpty(message = "Пароль обязателен")
        private String password;

        @NotEmpty(message = "Пол обязателен")
        private String gender;

        @NotNull(message = "Дата рождения обязательна")
        private LocalDate birthDate;

        @NotNull(message = "Рост обязателен")
        @Positive(message = "Рост должен быть положительным числом")
        private Double height; // в сантиметрах

        @NotNull(message = "Вес обязателен")
        @Positive(message = "Вес должен быть положительным числом")
        private Double weight; // в килограммах


        private String allergies;
        private String intolerances;


        private Double dailyCalorieNorm;

        public User() {
        }

        public User(String name, String email, String password, String gender, LocalDate birthDate, Double height, Double weight, String allergies, String intolerances, Double dailyCalorieNorm) {
                this.name = name;
                this.email = email;
                this.password = password;
                this.gender = gender;
                this.birthDate = birthDate;
                this.height = height;
                this.weight = weight;
                this.allergies = allergies;
                this.intolerances = intolerances;
                this.dailyCalorieNorm = dailyCalorieNorm;
        }
}