/*-- require Express and create our Express app by calling express(). --*/
const express = require('express');
const app = express();
/*-- a middleware to parse the incoming request bodies  --*/
const bodyParser = require('body-parser');
/*-- a module to save cookies --*/
const cookieParser = require('cookie-parser');

var path = require("path");

/*-- Returns middleware that only parses urlencoded bodies and only json respectively
and only looks at requests where the Content-Type header matches the type option. --*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/* MONGOOSE SETUP */
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.Promise =  require('bluebird');

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database! ");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now.');
    process.exit();
});

// Require users routes
require('./app/routes/index.routes.js')(app);
app.get('/home', function(req, res) {
  res.sendFile(path.join( __dirname+'/app/views/login.html'));
});

/*-- we use process.env.PORT to set the port to the environment port variable if it exists. 
Otherwise, we’ll default to 3000, which is the port we’ll be using locally. 
This gives you enough flexibility to switch from development, directly to a production environment 
where the port might be set by a service provider like, for instance, Heroku */
const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));