CREATE TABLE IF NOT EXISTS activity_tracker (
    id INT NOT NULL,
    activity_type VARCHAR(255) NOT NULL,
    duration INT CHECK (duration > 0) NOT NULL,
    calories_burned INT CHECK (calories_burned > 0) NOT NULL,
    activity_timestamp timestamp NOT NULL,
    PRIMARY KEY (id)
    );
