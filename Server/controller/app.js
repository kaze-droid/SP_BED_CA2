/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

// Require
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var verify = require('../auth/verifyToken.js');
var cors = require('cors');

// Jquery
app.options('*',cors());
app.use(cors());
var urlencodedParser=bodyParser.urlencoded({extended:false});


const actors = require('../model/actors.js');
const films = require('../model/film.js');
const customer = require('../model/customer.js');
const staff = require('../model/staff.js');
const store = require('../model/store.js');
const reviews = require('../model/review.js');

app.use(urlencodedParser);
app.use(bodyParser.json());

// Verify token
app.get('/verifyToken', verify.verifyToken, (req,res) => {
    res.status(200);
    res.type('application/json');
    res.send({success: true, isStaff: req.isStaff});
});

// Login Admin (Staff)
app.post('/staff/login', (req,res) => {
    const {email,password} = req.body;
    if (email==null||password==null||email==""||password=="") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg":"Bad Request"}`);
        return; 
    }

    staff.loginStaff(email,password, (err, token, result) => {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send({success: true, UserData: JSON.stringify(result[0]), token:token, status: 'You are successfully logged in!'});
        } else {
            // Invalid password or email
            if (err.statusCode==403) {
                res.status(403);
                res.type('application/json');
                res.send(`{"error_msg":"Invalid Password or Email"}`);
            } else {
                res.status(500);
                res.type('application/json');
                res.send(`{"error_msg":"Internal Server Error"}`);
            }
        }
    });
});

// Login Customer
app.post('/customer/login', (req,res) => {
    const {email,password} = req.body;
    if (email==null||password==null||email==""||password=="") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg":"Bad Request"}`);
        return;
    }

    customer.loginCustomer(email,password, (err, token, result) => {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send({success: true, UserData: JSON.stringify(result[0]), token:token, status: 'You are successfully logged in!'});
        } else {
            // Invalid password or email
            if (err.statusCode==403) {
                res.status(403);
                res.type('application/json');
                res.send(`{"error_msg":"Invalid Password or Email"}`);
            } else {
                res.status(500);
                res.type('application/json');
                res.send(`{"error_msg":"Internal Server Error"}`);
            }
        }
    });
});


// Get all film category (for select dropdown)
app.get('/film/AllCategory', (req,res) => {
    films.getAllCategory((err,result) => {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send({success: true, UserData: result});
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal Server Error"}`);
        }
    });
});

// Get search based on 
// Category, Title Substring, Rental Rate
app.get('/film/searchFilm', (req,res) =>  {
    // Data is stored in req.query for GET not req.body
    const {category, titleSubstring, maxRental} = req.query;

    // Missing key
    if (category == null || titleSubstring == null || maxRental == null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg":"Bad Request"}`);
        return;
    }

    films.searchFilm(category, titleSubstring, maxRental, (err, result) => {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send({success: true, UserData: result});
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal Server Error"}`);
        }
    })
});

// Get film by film id
app.get('/film/:filmid', (req,res) => {
    const filmid = req.params.filmid;

    films.getFilm(filmid, (err, result) => {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send({success: true, UserData: result});
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal Server Error"}`);
        }
    });
});

// Get store address
app.get('/stores/address', (req,res) => {
    store.getStoreAddress((err, result) => {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send({success: true, UserData: result});
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal Server Error"}`)
        }
    });
});

// Insert Customer
app.post('/customers', verify.verifyToken, (req,res) => {
    // If the JWT token is from a customer (403)
    if (!req.isStaff) {
        res.status(403);
        res.type('application/json');
        res.send(`{"error_msg":"Forbidden"}`);
        return;
    }

    const {store_id, first_name, last_name, email, address, district, city_id, postal_code, phone} = req.body;
    // If either key is missing (400)
    // store_id == "null" is special case
    if (store_id==null || first_name==null || last_name==null || email==null || address==null || district==null || city_id == null || postal_code == null || phone == null || store_id=="" || store_id=="null" || first_name=="" || last_name=="" || email=="" || address=="" || district== "" || city_id == "" || postal_code == "" || phone == "") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    } else {
        customer.insertCustomer(store_id, first_name, last_name, email, address, district, city_id, postal_code, phone, (err,result)=> {
            if (err) {
                // User tries to create a record with duplicate email address (409)
                if (err.code=='ER_DUP_ENTRY') {
                    res.status(409);
                    res.type('application/json');
                    res.send(`{"error_msg":"email already exist"}`);
                // Server Error (500)
                } else {
                    res.status(500);
                    res.type('application/json');
                    res.send(`{"error_msg":"Internal server error"}`);
                }
            // Successful Case (201)
            } else {
                res.status(201);
                res.type('application/json');
                res.send({success: true, UserData: result});
            }
        });
    }
});

// Insert Actor
app.post('/actors', verify.verifyToken, (req,res) => {
    // If the JWT token is from a customer (403)
    if (!req.isStaff) {
        res.status(403);
        res.type('application/json');
        res.send(`{"error_msg":"Forbidden"}`);
        return;
    }

    const {first_name, last_name} = req.body;
    // If either key is missing (400)
    if (first_name==null || last_name==null || first_name=="" || last_name=="") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
    } else {
        actors.insertActor(first_name, last_name, (err,result)=> {
            if (err) {
                // Server Error (500)
                res.status(500);
                res.type('application/json');
                res.send(`{"error_msg":"Internal server error"}`);
            // Successful Case (201)
            } else {
                res.status(201);
                res.type('application/json');
                res.send({success: true, UserData: result});
            }
        });
    }
});

// Get review by filmid
app.get('/reviews/:filmid', (req,res) => {
    const filmid = req.params.filmid;
    reviews.getReviewsByFilmId(filmid, (err, result) => {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send({success: true, UserData: result});
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal Server Error"}`);
        }
    });
});

// Submit Review
app.post('/reviews/:filmid', verify.verifyToken, (req,res) => {
    console.log(req);
    console.log(req.body);
    const filmid = req.params.filmid;
    console.log(filmid);
    const {rating, review, customer_id} = req.body;
    // If the JWT token is from a staff (403)
    if (req.isStaff) {
        res.status(403);
        res.type('application/json');
        res.send(`{"error_msg":"Forbidden"}`);
        return;
    }

    if (review==null || rating==null || review=="" || rating=="") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return
    }
    reviews.submitReview(filmid, customer_id, review, rating, (err,result)=> {
        if (err) {
            // Server Error (500)
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        // Successful Case (201)
        } else {
            res.status(201);
            res.type('application/json');
            res.send({success: true, UserData: result});
        }
    });
});





module.exports = app;