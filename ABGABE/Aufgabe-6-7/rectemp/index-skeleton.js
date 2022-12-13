var session = require("express-session");
const express = require("express");
const app = express();
app.use(session({secret:"abcdefghijkl", resave:false,saveUninitialized:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/", require("./Routes/api.js"));
app.use("/healthz/", require("./Routes/healthz.js"));


const mqtt = require('./mqtt')

const configs = require('./configs.js')
app.listen(5000, () => console.log('Server started'));


