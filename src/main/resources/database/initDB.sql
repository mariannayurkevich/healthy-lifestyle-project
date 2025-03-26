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

