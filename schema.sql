DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(255),
    overview VARCHAR(255)
);