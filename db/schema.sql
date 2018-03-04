DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS comments;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    image_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (image, username, title, description) VALUES ('JxwZ_JizLwkozxFw1t04NFmpqUF1U835.jpg', 'mattyfew', 'Skrillex', 'chillin');
