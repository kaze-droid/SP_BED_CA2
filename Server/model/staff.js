/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

const db = require('./dbConfig.js');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');

const staff = {
    // Login Staff for login.html (CA2)
    loginStaff: (email, password, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null, null);
            } else {
                const sql = `SELECT * FROM staff WHERE email = ? AND password = ?;`;
                conn.query(sql,[email,password],(err,res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null, null);
                    } else {
                        if (res.length == 1) {
                            token = jwt.sign({id:res[0].user_id,first_name:res[0].first_name, last_name: res[0].last_name, email: res[0].email, isStaff: true},config.secretKey,{
                                expiresIn:86400 //expires in 24 hrs
                            });
                            //clear the password in json data, do not send back to client
                            delete res[0]['password'];
                            return callback(null, token, res);
                        } else {
                            const err2 = new Error("Email/Password does not match.");
							err2.statusCode = 403;
							return callback(err2, null, null);
                        }
                    }
                });
            }
        });
    }
}

module.exports = staff;