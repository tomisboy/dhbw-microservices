require('dotenv').config();

var dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATEBASE,
    Port: process.env.PORT
}

var mongoose = require('mongoose');
// Wenn Datenbank-Config vorhanden,  verwende Config um mit MongoDB zu Connecten
if (dbconfig) {
    var mongooseurl = "mongodb://" + dbconfig.host + ":" + dbconfig.Port + "/" + dbconfig.database;
}
else {
    //Datenbank-Config nicht vorhanden nutzte Vorgaben aus dem Anfordungsdokument 
    var mongooseurl = "mongodb://localhost:27017/Temoeratur";
}
//console.log(mongooseurl);
mongoose.connect(mongooseurl, { useUnifiedTopology: true, useNewUrlParser: true });
console.log(mongooseurl)




module.exports = {

    insert_mongodb: function (message) {

        const sonsor_daten = require('./model/sensor_werte.js');
        var messung = JSON.parse(message);
        //console.log(messung)
    
        // Füge locdescription in die Messung
        index = global.loc_configs[0].indexOf(parseInt(messung.locid));
        //console.log(index + ">index")
        locdescription = global.loc_configs[1][index]
    
    
        const insert_sensor_messung = {
            timestamp: messung.timestamp,
            locid: messung.locid,
            locdescription: locdescription,
            gpslatitude: messung.gpslatitude,
            gpslongitude: messung.gpslongitude,
            sensortype: messung.sensortype,
            value: messung.value
        };
    
        //const duplicate = await User.findOne({userid: newUser.userid}).exec();
        sonsor_daten.insertMany(insert_sensor_messung);
        console.log("Schreibe in MongoDB ");



      },

}