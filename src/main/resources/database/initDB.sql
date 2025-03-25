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
