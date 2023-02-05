/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

const db = require('./dbConfig.js');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');

const customer = {
    insertCustomer: (store_id, first_name, last_name, email, address, district, city_id, postal_code, phone, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                const sql1 = 
                `INSERT into address(address,district,city_id,postal_code,phone)
                VALUES (?,?,?,?,?);`;
                conn.query(sql1,[address,district,city_id,postal_code,phone], (err1,res1)=> {
                    if (err1) {
                        console.log(err1);
                        return callback(err1,null);
                    } else {
                        const address_id = res1.insertId;
                        const sql2 = `INSERT INTO customer(store_id,first_name,last_name,email,address_id)
                        VALUES (?,?,?,?,?);`;
                        conn.query(sql2,[store_id,first_name,last_name,email,address_id],(err2,res2) => {
                            if (err2) {
                                console.log(err2);
                                // Delete address if customer insert fails
                                const sql3 = `DELETE FROM address WHERE address_id = ?;`;
                                conn.query(sql3,[address_id],(err3,res3) => {
                                    conn.end();
                                    if (err3) {
                                        console.log(err3);
                                        return callback(err3,null);
                                    } else {
                                        return callback(err2,null);
                                    }
                                });
                            } else {
                                conn.end();
                                console.log(res2.insertId);
                                return callback(null,res2.insertId);
                            }
                        });
                    }
                });
            }
        });
    }, 
    loginCustomer: (email, password, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null, null);
            } else {
                const sql = `SELECT * FROM customer WHERE email = ? AND password = ?;`;
                conn.query(sql,[email,password],(err,res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null, null);
                    } else {
                        if (res.length == 1) {
                            token = jwt.sign({id:res[0].user_id,first_name:res[0].first_name, last_name: res[0].last_name, email: res[0].email, isStaff: false},config.secretKey,{
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

module.exports = customer;