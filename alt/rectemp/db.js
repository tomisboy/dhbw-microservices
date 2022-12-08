const configs = require('./configs.js')
var mongoose = require('mongoose');

// Wenn Datenbank-Config vorhanden,  verwende Config um mit MongoDB zu Connecten
if (env) {
    var mongooseurl = "mongodb://" + global.env.DB_HOST + ":" + global.env.DB_PORT + "/" + global.env.DB_DATEBASE;
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
    
        // Füge locdescription in die Messung
        index = global.loc_configs[0].indexOf(parseInt(messung.locid));
        //console.log(index + ">index")
        locdescription = global.loc_configs[1][index]
    
    
        const insert_sensor_messung = {
            unique_sensor_id: messung.unique_sensor_id,
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