/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

const db = require('./dbConfig.js');

const actors = {
    insertActor: (firstname,lastname, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                const sql = 'INSERT INTO actor (first_name, last_name) VALUES (?,?);';
                conn.query(sql,[firstname,lastname],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res.insertId);
                    }
                });
            }
        });
    }
}

module.exports = actors;