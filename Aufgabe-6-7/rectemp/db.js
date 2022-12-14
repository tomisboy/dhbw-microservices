const configs = require('./configs.js')
var mongoose = require('mongoose');

// Hier wird entschieden mit welchen Paramtern auf die MongoDB verbunden wird
// Für diesen MVP wurde Mongo DB OHNE zugriffsschutzt als anonyme Zugangsdaten konfiguriert 

if (global.env.DB_HOST && global.env.DB_PORT) { 
    // Überprüfe ob Zugriffsparameter vorhanden sind
    if (global.env.DB_IS_SECURED === 'True') {
        // Falls Mongo DB mit Username und Passwort authentfiziert werden muss verwende diesen connection String:
        var mongooseurl = "mongodb://" + global.env.DB_USERNAME + ":" + global.env.DB_PASSWORD + "@" + global.env.DB_HOST + ":" + global.env.DB_PORT + "/" + global.env.DB_DATEBASE+ "?authSource=admin";
    }
    else { 
        // mongo DB Paramter aus  Config aber keine Authentifizierung mittels Username oder Password
        var mongooseurl = "mongodb://" + global.env.DB_HOST + ":" + global.env.DB_PORT + "/" + global.env.DB_DATEBASE;
    }

}
else {
    //Datenbank-Config nicht vorhanden nutzte Vorgaben aus dem Anfordungsdokument 
    var mongooseurl = "mongodb://localhost:27017/Temperatur";
}
//console.log(mongooseurl);
mongoose.connect(mongooseurl, { useUnifiedTopology: true, useNewUrlParser: true });
console.log(mongooseurl)




module.exports = {

    insert_mongodb: function (message) {

        const sonsor_daten = require('./model/sensor_werte.js');
        var messung = JSON.parse(message);
        //console.log(messung)


        const insert_sensor_messung = {
            unique_sensor_id: messung.unique_sensor_id,
            timestamp: messung.timestamp,
            locid: messung.locid,
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