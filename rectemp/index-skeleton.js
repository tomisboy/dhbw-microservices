var session = require("express-session");
const express = require("express");
const app = express();
app.use(session({secret:"abcdefghijkl", resave:false,saveUninitialized:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/", require("./mqtt_stuff"));

app.use("/api/login", require("./Routes/api/login.js"));
const mqtt_stuff = require('./mqtt_stuff')
app.listen(5000, () => console.log('Server started'));