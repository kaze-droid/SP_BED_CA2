/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

const db = require('./dbConfig.js');

const films = {
    // Get All Film Categories
    getAllCategory: (callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `SELECT name,category_id FROM category ORDER BY name ASC;`;
                conn.query(sql, [], (err,res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                });
            }
        });
    },
    // Search film by category id, title substring, and max rental rate based on what is provided
    searchFilm: (category, titleSubstring, maxRental, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                let [sql,params] = [`SELECT f.film_id, f.title, f.rating, f.release_year, f.rental_rate, f.rental_duration `, []];
                // If nothing is submitted (3C0 Case 1)
                if (category == "" && titleSubstring == "" && maxRental == "") {
                    // Sql no need where statement
                     sql += `FROM film f;`;
                    // No need change params
                // If only category is submitted (3C1 Case 1)
                } else if (category != "" && titleSubstring == "" && maxRental == "") {
                    sql += `FROM film f, category c, film_category fc WHERE fc.category_id = c.category_id AND fc.film_id = f.film_id AND c.category_id = ?;`;
                    params.push(category);
                // If only titleSubstring is submitted (3C1 Case 2)
                } else if (category == "" && titleSubstring != "" && maxRental == "") {
                    sql += `FROM film f WHERE f.title LIKE ?;`;
                    params.push('%' + titleSubstring + '%');
                // If only maxRental is submitted (3C1 Case 3)
                } else if (category == "" && titleSubstring == "" && maxRental != "") {
                    sql += `FROM film f WHERE rental_rate BETWEEN 0 AND ?;`;
                    params.push(maxRental);
                // If only category and titleSubstring is submitted (3C2 Case 1)
                } else if (category != "" && titleSubstring != "" && maxRental == "") {
                    sql += `FROM film f, category c, film_category fc WHERE fc.category_id = c.category_id AND fc.film_id = f.film_id AND c.category_id = ? AND f.title LIKE ?;`;
                    params.push(category, '%' + titleSubstring + '%');
                // If only category and maxRental is submitted (3C2 Case 2)
                } else if (category != "" && titleSubstring == "" && maxRental != "") {
                    sql += `FROM film f, category c, film_category fc WHERE fc.category_id = c.category_id AND fc.film_id = f.film_id AND c.category_id = ? AND rental_rate BETWEEN 0 AND ?;`;
                    params.push(category, maxRental);
                // If only titleSubstring and maxRental is submitted (3C2 Case 3)
                } else if (category == "" && titleSubstring != "" && maxRental != "") {
                    sql += `FROM film f WHERE f.title LIKE ? AND rental_rate BETWEEN 0 AND ?;`;
                    params.push('%' + titleSubstring + '%', maxRental);
                // If everything is submitted (3C3 Case 1)
                } else {
                    sql += `FROM film f, category c, film_category fc WHERE fc.category_id = c.category_id AND fc.film_id = f.film_id AND c.category_id = ? AND f.title LIKE ? AND rental_rate BETWEEN 0 AND ?;`;
                    params.push(category, '%' + titleSubstring + '%', maxRental);
                 }
                conn.query(sql, params, (err,res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                });
            }
        })
    },
    // Get specific film by film id
    getFilm: (filmId, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                sql = 
                `SELECT f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, c.name AS category, a.first_name, a.last_name, l.name AS language
                FROM film f, category c, film_category fc, actor a, film_actor fa, language l
                WHERE l.language_id = f.language_id AND f.film_id = fc.film_id AND fc.category_id = c.category_id AND f.film_id = fa.film_id AND fa.actor_id = a.actor_id AND f.film_id = ?;`
                conn.query(sql, [filmId], (err,res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        // Get rid of things that are not needed
                        delete res[0]['last_update'];
                        delete res[0]['language_id'];
                        delete res[0]['original_language_id'];
                        return callback(null,res);
                    }
                });
            }
        });
    }
}

module.exports = films;