var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

// var token = req.cookies.auth;

//var checkAuth = require('../models/user');

//Get homepage
router.get('/',ensureAuthentication,verifyToken,function(req,res){
    res.render('index');
});

// router.get('/admin/token=',verifyToken,function(req,res){
//     res.render('admin');
//     console.log(JSON.stringify(req.headers));
// });

// router.get('/user/token=',verifyToken,function(req,res){
//     res.render('user');
//     console.log(JSON.stringify(req.headers));
// });


function ensureAuthentication(req,res,next){
    if (req.isAuthenticated()){
    //     user = {
    //         username: req.user.username
    //         }
    //     jwt.sign({user: user},'shh', {expiresIn: '40s'},(err,token)=>{      //asynchron
    //         if (req.user.checkAdmin){
    //             res.render('admin');
    //           // res.redirect('/admin/token=');
    //         }else
    //          {
    //             res.redirect('/user/token=');
    //          }
    //     });
       return next();
    }else{
      res.redirect('/users/login');
    }
}

// function verifyToken(req,res,next){
//     console.log("In Verify")
//     // jwt.verify(req.body.token, 'secretkey',(err,authUser)=> {
//     //   if (err){
//     //     console.log('error in verifyToken');
//     //     console.log(err);
//     //    //res.sendStatus(403);
//     //   }else{
//     //     console.log(authUser + "trying access");
//     //     next();
//     //   }
//     // });
// }
function verifyToken(req,res,next){

    jwt.verify(req.session.token, 'secretkey',(err,authUser)=> {
      if (err){
        console.log("hello " + req.session.token);
        res.sendStatus(403);
      }else{
        console.log(authUser + "trying access");
    next();
      }
    });

    // next()
}

module.exports = router;