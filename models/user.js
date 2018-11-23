var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/login',{useNewUrlParser: true});
const Schema = mongoose.Schema;
const UserDetail = new Schema({
	    username: String,
        email: String,
        checkAdmin: Boolean,
        password: String
    },
    {versionKey: false}
);

var User = module.exports = mongoose.model('User', UserDetail,'user');

// module.exports.createUser = function(newUser,cb){
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash(newUser.password, salt, function(err, hash) {
//             // Store hash in your password DB.
//             newUser.password = hash;
//             newUser.save(cb);
//         });
//     });
// }


module.exports.comparePassword = function(candidatePassword,hash,cb){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw (err);
        cb(null, isMatch);
    });
}


module.exports.getUserById = function(id,cb){
    User.findById(id,cb);
}

// module.exports.checkAuth = function(req,res,next){
//     try{
//           const dec = jwt.verify(req.body.token,secretkey);
//           req.userData = dec;
//           next();
//       }catch(error){
//           console.log("Auth failed");
//       }
// }


 