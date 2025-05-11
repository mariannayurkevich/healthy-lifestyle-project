CREATE TABLE IF NOT EXISTS activity_tracker (
                                                id SERIAL PRIMARY KEY,
                                                activity_type VARCHAR(255) NOT NULL,
                                                duration INT NOT NULL,
                                                calories_burned INT NOT NULL,
                                                activity_timestamp TIMESTAMP NOT NULL,
                                                user_id BIGINT
);
CREATE TABLE IF NOT EXISTS sleep_tracker (
                               id SERIAL PRIMARY KEY,
                               date DATE NOT NULL,
                               bedtime TIME NOT NULL,
                               wakeup_time TIME NOT NULL,
                               sleep_duration DOUBLE PRECISION CHECK (sleep_duration > 0),
                               sleep_quality INT CHECK (sleep_quality BETWEEN 1 AND 5),
                               notes TEXT,
                               user_id BIGINT NOT NULL,
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS food_tracker (
                                id SERIAL PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                date DATE NOT NULL,
                                total_calories DOUBLE PRECISION CHECK (total_calories >= 0),
                                total_proteins DOUBLE PRECISION CHECK (total_proteins >= 0),
                                total_fats DOUBLE PRECISION CHECK (total_fats >= 0),
                                total_carbs DOUBLE PRECISION CHECK (total_carbs >= 0),
                                total_fiber DOUBLE PRECISION CHECK (total_fiber >= 0),
                                total_sugar DOUBLE PRECISION CHECK (total_sugar >= 0),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS food_entries (
                                id SERIAL PRIMARY KEY,
                                tracker_id INT NOT NULL,
                                time TIMESTAMP NOT NULL,
                                food_name VARCHAR(255) NOT NULL,
                                calories DOUBLE PRECISION CHECK (calories >= 0),
                                proteins DOUBLE PRECISION CHECK (proteins >= 0),
                                fats DOUBLE PRECISION CHECK (fats >= 0),
                                carbs DOUBLE PRECISION CHECK (carbs >= 0),
                                fiber DOUBLE PRECISION CHECK (fiber >= 0),
                                sugar DOUBLE PRECISION CHECK (sugar >= 0),
                                FOREIGN KEY (tracker_id) REFERENCES food_tracker(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS water_tracker (
                                id SERIAL PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                date DATE NOT NULL,
                                total_intake_ml DOUBLE PRECISION CHECK (total_intake_ml >= 0),
                                goal_ml DOUBLE PRECISION CHECK (goal_ml >= 0),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS water_entries (
                                id SERIAL PRIMARY KEY,
                                tracker_id INT NOT NULL,
                                time TIMESTAMP NOT NULL,
                                amount_ml DOUBLE PRECISION CHECK (amount_ml > 0),
                                FOREIGN KEY (tracker_id) REFERENCES water_tracker(id) ON DELETE CASCADE
);

-- CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

-- CREATE SEQUENCE student_sequence START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS users (
                       id BIGINT PRIMARY KEY DEFAULT nextval('student_sequence'),
                       first_name VARCHAR(255),
                       last_name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       gender VARCHAR(255),
                       birth_date DATE,
                       height DOUBLE PRECISION,
                       weight DOUBLE PRECISION,
                       allergies VARCHAR(255),
                       intolerances VARCHAR(255),
                       daily_calorie_norm DOUBLE PRECISION,
                       activity_level VARCHAR(255),
                       user_role user_role,
                       locked BOOLEAN,
                       enabled BOOLEAN
);

CREATE TABLE IF NOT EXISTS chat_history (
                              id BIGINT PRIMARY KEY,
                              user_id BIGINT,
                              role VARCHAR(20),
                              content TEXT,
                              timestamp TIME,
                              FOREIGN KEY (user_id) REFERENCES users(id)
);


