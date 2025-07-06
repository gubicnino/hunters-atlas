require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const animalsRouter = require('./routes/animals');
const reservesRouter = require('./routes/reserves');

var app = express();
var http = require('http'); 
var server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/animals', animalsRouter);
app.use('/reserves', reservesRouter);

if (require.main === module) {
    server.listen(3000, () => {
        console.log(`http://localhost:3000/`);
    });
}


module.exports = app;
