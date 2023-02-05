/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

const db = require('./dbConfig.js');

const reviews = {
    // Get all reviews for a specific film
    getReviewsByFilmId: (film_id, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = 
                `SELECT r.review_id, r.customer_id, r.review, r.rating, c.first_name, c.last_name, f.title
                FROM review r, customer c, film f
                WHERE r.customer_id = c.customer_id AND r.film_id = f.film_id AND r.film_id = ?;`;
                conn.query(sql, [film_id], (err, res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, res);
                    }
                });
            }
        });
    },
    submitReview: (film_id, customer_id, review, rating, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(customer_id);
                const sql = `INSERT INTO review (film_id, customer_id, review, rating) VALUES (?, ?, ?, ?);`;
                conn.query(sql, [film_id, customer_id, review, rating], (err, res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, res);
                    }
                });
            }
        });
    }
}

module.exports = reviews;