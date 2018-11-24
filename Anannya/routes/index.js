var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

//Get homepage
router.get('/', verifyToken, function(req, res) {
    res.render('index');
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