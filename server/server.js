"use strict";

const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const server = require('http').Server(app);
const io = require('socket.io')(server, {serveClient: true});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const { Strategy } = require('passport-jwt');

const { jwt } = require('./config');

passport.use(new Strategy(jwt, function(jwt_payload, done){
    if (jwt_payload != void(0)) return done(false, jwt_payload);
    done();
}));

mongoose.connect('mongodb://admin:zaq12wsx@ds157964.mlab.com:57964/notes', {useNewUrlParser: true});
mongoose.Promise = require('bluebird');

nunjucks.configure('./client/views', {
   autoescape: true,
   express: app
});

app.use(bodyParser.urlencoded({extend: false}));

app.use(bodyParser.json());

app.use(cookieParser());

require('./router')(app);

require('./sockets')(io);

server.listen(7777, () => {
    console.log("Server started on port 7777");
});