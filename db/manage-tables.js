const db = require("./connection.js");

const createTables = () => {
  return db
    .query(
      `
    CREATE TABLE categories (
        slug VARCHAR(50) PRIMARY KEY,
        description VARCHAR(250)
    );
  `
    )
    .then(() => {
      return db.query(`
        CREATE TABLE users (
            username VARCHAR(150) PRIMARY KEY,
            avatar_url VARCHAR(300),
            name VARCHAR(250) NOT NULL
        );
        `);
    })
    .then(() => {
      return db.query(
        `
        CREATE TABLE reviews (
            review_id SERIAL PRIMARY KEY,
            title VARCHAR(250) NOT NULL,
            review_body VARCHAR(3000) NOT NULL,
            designer VARCHAR(150),
            review_img_url VARCHAR(3000) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
            votes INT DEFAULT 0,
            category VARCHAR(50) REFERENCES categories(slug) NOT NULL,
            owner VARCHAR(150) REFERENCES users(username) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        `
      );
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments(
            comment_id SERIAL PRIMARY KEY,
            author VARCHAR(150) REFERENCES users(username) NOT NULL,
            review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
            votes INT DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            body VARCHAR(300) NOT NULL
        )
        
        `);
    });
};

const dropTables = () => {
  return db.query(`DROP TABLE IF EXISTS comments, reviews, users, categories;`);
};

module.exports = { createTables, dropTables };
