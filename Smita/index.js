/*-- require Express and create our Express app by calling express(). --*/
const express = require('express');
const app = express();
/*-- a middleware to parse the incoming request bodies  --*/
const bodyParser = require('body-parser');
/*-- a module to save cookies --*/
const cookieParser = require('cookie-parser');

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

app.listen(3000, function(){
  console.log('Listening to port 3000');
});