var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

//Get homepage
router.get('/',ensureAuthentication,function(req,res){
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
//     jwt.verify(req.query.token, 'shh',(err,authUser)=> {
//       if (err){
//        //res.sendStatus(403);
//       }else{
//         console.log(authUser + "trying access");
//         next();
//       }
//     });
// }

module.exports = router;