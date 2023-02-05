const express=require('express');
const serveStatic=require('serve-static');

var hostname="localhost";
var port=3001;

var app=express();

app.use(function(req,res,next){
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);

    if(req.method!="GET"){
        res.type('.html');
        var msg="<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    }else{
        next();
    }
});

app.get('/',(req,res) => {
    res.sendFile("/public/index.html",{root:__dirname});
});

app.get('/index',(req,res) => {
    res.sendFile("/public/index.html",{root:__dirname});
});

// Login
app.get('/login',(req,res) => {
    res.sendFile("/public/login.html",{root:__dirname});
});

// Film
app.get('/film?:filmid',(req,res) => {
    res.sendFile("/public/film.html",{root:__dirname});
});

// Review
app.get('/review?:filmid',(req,res) => {
    res.sendFile("/public/review.html",{root:__dirname});
});

// Search
app.get('/search',(req,res) => {
    res.sendFile("/public/search.html",{root:__dirname});
});

// Add Customer
app.get('/addCustomer',(req,res) => {
    res.sendFile("/public/addCustomer.html",{root:__dirname});
});

// Add Actor
app.get('/addActor',(req,res) => {
    res.sendFile("/public/addActor.html",{root:__dirname});
});

// admin
app.get('/admin',(req,res) => {
    res.sendFile("/public/admin.html",{root:__dirname});
});

// customer
app.get('/customer',(req,res) => {
    res.sendFile("/public/customer.html",{root:__dirname});
});

// Redirect all '.html' to without '.html'
app.get('/*.html',(req,res) => {
    res.sendFile("/public/" + req.path,{root:__dirname});
});


app.use(serveStatic(__dirname+"/public"));

app.listen(port,hostname,function(){

    console.log(`Server hosted at http://${hostname}:${port}`);
});