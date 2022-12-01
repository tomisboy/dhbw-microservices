var mqtt = require('mqtt');
var Topic = '4934001/#'; //subscribe to all topics from postapp
var client = mqtt.connect('mqtt://test.mosquitto.org', { clientId: "rectemp1-hsMQu1111hewiuhewuTT" });
//var client = mqtt.connect('mqtt://mqtt:1883', { clientId: "rectemp-hsMQu1111hewiuhewuTT" });
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) { console.log(err); }
}

function mqtt_messsageReceived(topic, message, packet) {
    
    //console.log(global.T_unten, global.T_oben, global.X_oben, global.P_unten, global.P_oben, global.H_unten, global.H_oben, global.p_oben);

    if (!(check_valide_sensor(message))) {
        return // Abbruch wenn Sensor nicht genemigt wird ( nicht in der erlaubten list ist )
    }
    else {

        check_sensor_liveiness(topic);


        if (valide_messung = validation_test(topic, message)) {
            // Nur Messungen im Gültigkeitsbereich werden weiter untersucht
            insert_mongodb(message); //schreibe in DB 
            switch (valide_messung.sensortyp) {
                // Check den Schwellenwert der GÜLTIGEN Sensorenprüfung ab.
                case 'T': {
                    //Überprüfe Schwellwert für T=temperature
                    if (valide_messung.value < global.T_unten || valide_messung.value > global.T_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)

                    break;
                }
                case 'X': {
                    //Überprüfe Schwellwert für X=co2
                    if (valide_messung.value > global.X_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)

                    break;
                }
                case 'P': {
                    //Überprüfe Schwellwert für P=people in a room  
                    if (valide_messung.value < global.P_unten || valide_messung.value > global.P_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                    break;
                }
                case 'H': {
                    //Überprüfe Schwellwert für H=luftfeuchtigkeit

                    if (valide_messung.value < global.H_unten || valide_messung.value > global.H_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                    break;
                }

                case 'p': {
                    //Überprüfe Schwellwert für p=Feinstaub (Feinstaub = PM2,5)


                    if (valide_messung.value > global.p_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                    break;
                }

            }
        }
    }
}


function check_sensor_liveiness(topic) {
    /*if (!(akuelle_sensoren.includes(topic))) {
        akuelle_sensoren.push(topic);
        timeout = setTimeout(() => {
        console.log('timeout beyond time');
    }, 10500);
    }
    var timeout = topic
    console.log(timeout + "vor")
    


    clearTimeout(timeout);
*/
}


function check_timeout(topic, restart) {

}

function check_valide_sensor(message) {
    var messung = JSON.parse(message);
    //console.log(locid)
    if (loc_configs[0].includes(parseInt(messung.locid)))
        // Sensor ist in liste der erlaubten sensore und nachricht wird genemigt console.log("Sensor genemigt");
        return true
    else {
        console.log(">>ACHTUNG<< Sensor" + messung.locid + "ist nicht erlaubt. Message wird verworfen\n")
        return false
    }
}

function validation_test(topic, message) {
    // Überprüfe ob Sensoren "normale/gültige" Werte liefern.
    // Nur Werte im Gültigkeitsbereich werden akzeptiert und weiter verarbeitet

    var messung = JSON.parse(message);
    sensortyp = messung.sensortype
    value = messung.value;
    gueltig = 0;
    switch (sensortyp) {
        case 'T': {
            //temeratur Werte nur gültig wenn sie zwiswchen -10 und 50 Grad sind
            if (value >= -10 && value < 50)
                gueltig = 1;
            break;
        }
        case 'X': {
            //Co2 Werte nur gültig wenn sie zwiswchen 1000 und 2500 ppm sind
            if (value >= 1000 && value < 2500)
                gueltig = 1;
            break;
        }
        case 'P': {
            //Personenanzahl nur gültig wenn zwischen 0 und 25
            if (value >= 0 && value < 25)
                gueltig = 1;
            break;
        }
        case 'H': {
            //Luftfeuchtigkeit nur gültig wenn zwischen 0 und 100
            if (value >= 0 && value < 100)
                gueltig = 1;
            break;
        }

        case 'p': {
            //Feinstaub nur gültig wenn zwischen 0 und 25
            if (value >= 0 && value < 25)
                gueltig = 1;
            break;
        }

    }
    if (gueltig) {
        console.log('Topic=' + topic + '  Message=' + message);
        return { messung, sensortyp, value }
    }
    else {
        console.log("\n>>ACHTUNG<< Fehlerhafte Messung, außerhalb des Güligkeitsbereich, wird nicht übernommen: Topic=" + topic + "Message=" + message + "\n");
        return undefined
    }

}

function sende_schwellwert_mqtt_message(sensortype, value, messung) {
    mqttopic = "4934001-errorCase/Schwellwert-" + sensortype 
    console.log(">\tSchwellwert für " + sensortype + " erreicht --> " + value + " <-- \t  Publishe an " + mqttopic + "\n");
    client.publish(mqttopic, JSON.stringify(messung));
}


function mqtt_reconnect(err) {
    console.log("Reconnect MQTT");
    if (err) { console.log(err); }

}

function mqtt_error(err) {
    console.log("Error!");
    if (err) { console.log(err); }
}

function after_publish() {
    //do nothing
}

function mqtt_close(err) {
    console.log("Close MQTT");
    if (err) { console.log(err); }
}
const express = require("express");
const router = express.Router();


/////
// Mongo DB

require('dotenv').config();

var dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATEBASE,
    Port: process.env.PORT,
    connectionLimit: 10000
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

//mongoose.connect(mongooseurl);

function insert_mongodb(message) {
    //const User = require('../../model/User');
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
}

//module.exports = mqtt;
module.exports = router;