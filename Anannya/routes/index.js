var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

var User = require('../models/user');

//Get homepage
router.get('/', verifyToken, function(req, res) {
    res.render('index');
});  

//Get user profile
router.get('/users/user',verifyToken, function(req,res){  
     res.render('user');  
     console.log("This is " + req.user.username);
});

//Get admin profile
router.get('/users/admin',verifyToken, function(req,res){
    res.render('admin');
});
//Get attendance
router.get('/users/attendance',verifyToken, function(req,res){
    res.render('attd');
});

//Get apply
router.get('/users/apply',verifyToken, function(req,res){
    res.render('apply');
});

function verifyToken(req, res, next) {

    jwt.verify(req.session.token, 'secretkey', (err, authUser) => {
        if (err) {
            res.redirect('/users/login');
        } else {
            next();
        }
    });

}

module.exports = router;