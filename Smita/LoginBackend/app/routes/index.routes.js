module.exports = (app) => {

  var path = require("path");
    app.get('/',function(req,res){
        res.sendFile(path.join( __dirname+'/../views/index.html'));
        //__dirname : It will resolve to your project folder.
    });
}
