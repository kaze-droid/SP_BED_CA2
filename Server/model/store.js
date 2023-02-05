/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/
// Contains additional endpoint 1
const db = require('./dbConfig.js');

const store = {
    getStoreAddress: (callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `SELECT s.store_id, a.address FROM address a, store s WHERE s.address_id = a.address_id;`;
                conn.query(sql,[],(err,res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null,res)
                    }
                });
            }
        });
    }
}

module.exports = store;