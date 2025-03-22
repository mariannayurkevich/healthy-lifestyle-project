CREATE TABLE IF NOT EXISTS activity_tracker (
                                                id SERIAL PRIMARY KEY,
                                                activity_type VARCHAR(255) NOT NULL,
                                                duration INT NOT NULL,
                                                calories_burned INT NOT NULL,
                                                activity_timestamp TIMESTAMP NOT NULL,
                                                user_id BIGINT
);
