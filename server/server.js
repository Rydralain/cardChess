// Dependencies
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');

// Init App
const app = express();
const PORT = process.env.PORT || 4000

// Require models for syncing
const db = require('./models');

//Body Parser Middleware 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// passport setup (PLS don't move this)
require('./config/passport.js')(app, passport, db);

// Import routes from controller folder so server has access to them
require('./routes/auth.js')(app, passport);
require('./routes/api.js')(app, db);

//if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, '/../build/')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '/../build', 'index.html'));
    });
//}

// Init server and begin listening
db.sequelize.sync({}).then(function(){
    app.listen(PORT, function(){
        console.log(`Server now listening on port: ${PORT}`);
    });
})