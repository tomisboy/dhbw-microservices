var session = require("express-session");
const express = require("express");
const app = express();
app.use(session({secret:"abcdefghijkl", resave:false,saveUninitialized:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/", require("./Routes/api/api.js"));
const mqtt = require('./mqtt')

const configs = require('./configs.js')
app.listen(5000, () => console.log('Server started'));



require('dotenv').config();

var dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATEBASE,
    Port: process.env.PORT
}
