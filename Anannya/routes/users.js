var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// var cookieParser = require('cookie-parser')
// app.use(cookieParser());

var User = require('../models/user');


//Get Register
router.get('/register',function(req,res){
    res.render('register');
});

//Get login
router.get('/login',function(req,res){
    res.render('login');
});

//Video register user
router.post('/register',function(req,res){
   
    var username = req.body.username;
    var email = req.body.email;
    var checkAdmin = req.body.checkAdmin;
    var password = req.body.password;
    var confirmpassword = req.body.confirmpassword;

    req.checkBody('username', 'Enter Username').notEmpty();
    req.checkBody('email','Enter E-mail').isEmail();
    req.checkBody('checkAdmin','Verify if you are Admin').notEmpty();
    req.checkBody('password','Enter password').notEmpty();
    req.checkBody('confirmpassword','Confirm password').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
         res.render('register',{
            errors: errors
        });
    }
    else{ User.findOne({username :  req.body.username})
    .exec()
    .then(user=>{
        if(user != undefined){
            req.flash('success_msg','Already registered');
        }
        else{
            bcrypt.hash(req.body.password,12,function(err,hash){
                if (err) throw err;
                else{
                    var newUser = new User({
                       username : username,
                       email : email,
                       checkAdmin : checkAdmin,
                       password : hash
                    });
                    newUser.save()
                    .then(result =>{
                        req.flash('success_msg','Successfully registered');
                        res.redirect('/users/login');
                    })
                    .catch(err=>{
                        console.log(err);
                    });
                }
            });
        }
    });
        // User.createUser(newUser, function(err,user){
        //     if (err) throw err;
        //     console.log(user);
        // });
     req.flash('success_msg','Successfully registered');
     res.redirect('/users/login');
    }
});
        



// //Register user
// router.post('/register',function(req,res){
//         req.checkBody('username','Enter Username').not().isEmpty();
//         req.checkBody('email','Enter E-mail').not().isEmpty();
//         req.checkBody('checkAdmin','Verify if you are Admin').not().isEmpty();
//         req.checkBody('password','Enter password').not().isEmpty();
//         req.checkBody('confirmpassword','Confirm password').not().isEmpty();

//         const err = req.validationErrors(req);
//         if(!err.isEmpty()) {
//             var arr = err.array();
//             UserDetails.find().then(function(users){
//                 console.log(arr);
//                 res.render('register',{
//                     title: 'Employees',
//                     users: users,
//                     err: arr
//                 });
//             });
//         }else{

//             var newUser = new User({
//                 username : req.body.username,
//                 email : req.body.email,
//                 checkAdmin : req.body.checkAdmin,
//                 password : req.body.password
//              });

//              UserDetails.createUser(newUser,function(errorr,user){
//                  if(errorr) throw errorr;
//                  console.log(user)
//              });
//             // newUser.save(function(errs,data){
//             //     if(errs){return console.log(errs)}
//             //     res.redirect('/users/login')
//             // })
//         }
//         req.flash('success_msg','Successfully registered');
//         res.redirect('/users/login');
// });


// //Alternative register user
// router.post('/register',function(req,res){
    
//     check('username', 'Enter username').notEmpty();
//     req.checkBody('email','Enter e-mail').not().isEmpty();
//     req.checkBody('checkAdmin','Enter Admin').not().isEmpty();
//     req.checkBody('password','Enter password').not().isEmpty();
//     req.checkBody('confirmpassword','Confirm Password').not().isEmpty();
    
//         const err = validationResult(req);
//         if (!err.isEmpty()) {
//             var arr = err.array();
//            // console.log( arr );
//             UserDetails.find().then(function(users){
//              console.log( arr );
//              res.render('register',{
//                 title: 'Employees',
//                 users: users,
//                 err: arr
//                 });
//                 //res.redirect('/');
//               });
 
//           }else{
//             var newUser = new User({
//                 username : req.body.username,
//                 email : req.body.email,
//                 checkAdmin : req.body.checkAdmin,
//                 password : req.body.password
//              });
 
//                 // console.log(newUser);
//                 newUser.save(function (errs, data) {
//                      if (errs) {
//                        return console.log(errs);
//                        }
//                        res.redirect('/');
//                      });
//               }
//     })


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if (err) throw err; 
            if (!user)
             { return done(null, false, {message:'Incorrect Username'}); }
            User.comparePassword(password,user.password,function(err,isMatch){
                if(err) throw err;
                if(isMatch){                 
                    return done(null,user,{message:'Access Granted'
                                            //,token: token
                    });
                }
                else{
                    return done(null,false,{message:'Invalid Password'});
                }
            });
        });
    })
);


passport.serializeUser(function(user, done){
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local',{failureRedirect: "/users/login",failureFlash: true}),
    function(req,res){
        const token = jwt.sign({
            username: req.username,
            password: req.password
        }, 'secretkey',{expiresIn : 120});
      console.log(token);
      console.log('creating token');
      req.session.token = token;
      console.log(req.session.token);
      res.redirect('/');
});


//Get logout
router.get('/logout', function(req,res){
    req.logout();
    req.session.destroy(function(err) {
        if(err) throw err;
        res.redirect('/');
        });
    
    console.log("in logout")
 //  req.flash('success_msg','You are logged out');  
});




module.exports = router;
