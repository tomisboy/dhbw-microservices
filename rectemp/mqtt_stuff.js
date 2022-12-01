var mqtt = require('mqtt');
var Topic = '4934001/#'; //subscribe to all topics from postapp
var client = mqtt.connect('mqtt://test.mosquitto.org', { clientId: "rectemp1-hsMQu1111hewiuhewuTT" });
//var client = mqtt.connect('mqtt://mqtt:1883', { clientId: "rectemp-hsMQu1111hewiuhewuTT" });
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);



//##################################################
//           Config  
// Nur definierte Sensoren werden akzeptiert 
// hier werden die locid der Sensoren definiert, von denen Nachrichten empfangen und gespeichert werden sollen 
erlaubte_sensoren = [1234, 3456, 4567, 5678];

//Schwellwerte:
//(Temperatur: Innerräume dürfen nur zwischen 16 und 19 Grad beheizt werden)
//var T_unten = 16;
var T_unten = 16;
//module.export = {T_unten}
var T_oben = 19;
function set_T_unten(T_oben) { T_oben = T_oben }
//CO2:  Innerräume dürfen nicht mehr als 2000 ppm Co2 beinhalten 
var X_oben = 2000;

//Personen: in Innerräume dürfen nicht mehr 20 Personen gleichzeitig sein
// Zusätzlich soll, eine Warnung ausgegeben werden wenn der raum leer ist
var P_unten = 1;
var P_oben = 20;


//Luftfeuchtigkeit: in Innerräume dürfen nicht mehr als  60% relativer Luftfeuchtigkeit haben
// Sollten aber mindestens 30 % haben
var H_unten = 30;
var H_oben = 60;

//Feinstaub:    Im Raum darf nicht mehr als 5 µg/m³ Feinstaub vorhanden sein 
//Die Weltgesundheitsorganisation WHO hat einen Richtwert für PM2,5 von 5 µg/m³
var p_oben = 5;



var akuelle_sensoren = []



function mqtt_connect() {
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) { console.log(err); }
}

function mqtt_messsageReceived(topic, message, packet) {
    console.log(T_unten, T_oben, X_oben, P_unten, P_oben, H_unten, H_oben, p_oben);

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
                    if (valide_messung.value < T_unten || valide_messung.value > T_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)

                    break;
                }
                case 'X': {
                    //Überprüfe Schwellwert für X=co2
                    if (valide_messung.value > X_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)

                    break;
                }
                case 'P': {
                    //Überprüfe Schwellwert für P=people in a room  
                    if (valide_messung.value < P_unten || valide_messung.value > P_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                    break;
                }
                case 'H': {
                    //Überprüfe Schwellwert für H=luftfeuchtigkeit

                    if (valide_messung.value < H_unten || valide_messung.value > H_oben)
                        sende_schwellwert_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                    break;
                }

                case 'p': {
                    //Überprüfe Schwellwert für p=Feinstaub (Feinstaub = PM2,5)


                    if (valide_messung.value > p_oben)
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
    if (erlaubte_sensoren.includes(parseInt(messung.locid)))
        // Sensor ist in liste der erlaubten sensore und nachricht wird genemigt console.log("Sensor genemigt");
        return true
    else {
        console.log("\n>>ACHTUNG Sensor" + messung.locid + " ist nicht erlaubt. Message wird verworfen\n")
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
        console.log("\n#################\nFehlerhafte Messung, außerhalb des Güligkeitsbereich, wird nicht übernommen:\n " + "'Topic=" + topic + "Message=" + message + "\n#################\n");
        return undefined
    }

}

function sende_schwellwert_mqtt_message(sensortype, value, messung) {
    console.log(">\tSchwellwert für " + sensortype + " erreicht --> " + value + " <--");
    mqttopic = "4934001-errorCase/Schwellwert-" + sensortype
    console.log("Publishe an " + mqttopic + "\n\n");
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
var mongooseurl = "mongodb://" + dbconfig.host + ":" + dbconfig.Port + "/" + dbconfig.database
console.log(mongooseurl);
mongoose.connect(mongooseurl, { useUnifiedTopology: true, useNewUrlParser: true });

//mongoose.connect(mongooseurl);
var sensor_werte = require('./model/sensor_werte.js');

function insert_mongodb(message) {
    //const User = require('../../model/User');
    const User = require('./model/sensor_werte.js');
    console.log("connect")


    var messung = JSON.parse(message);
    console.log(messung)

    const insert_sensor_messung = {
        timestamp: messung.timestamp,
        locid: messung.locid,
        gpslatitude: messung.gpslatitude,
        gpslongitude: messung.gpslongitude,
        sensortype: messung.sensortype,
        value: messung.value
    };

    //const duplicate = await User.findOne({userid: newUser.userid}).exec();
    User.insertMany(insert_sensor_messung);
    console.log("save data successful");
}



////

router.post('/change-parameter', (req, res) => {
    //ändere die Schwellwerte wenn richtiger User mit Passwort im Body mitgesendet wird
    var userid = req.body.userid;
    var password = req.body.password;


    console.log(userid, password)
    const found = (userid === "admin" && password === "admin");
    if (found) {

        if (req.body.T_unten)
            T_unten = req.body.T_unten;

        if (req.body.T_oben)
            T_oben = req.body.T_oben;

        if (req.body.X_oben)
            X_oben = req.body.X_oben;

        if (req.body.P_unten)
            P_unten = req.body.P_unten;

        if (req.body.P_oben)
            P_oben = req.body.P_oben;

        if (req.body.H_unten)
            H_unten = req.body.H_unten;

        if (req.body.H_oben)
            H_oben = req.body.H_oben;

        if (req.body.p_oben)
            p_oben = req.body.p_oben;
    }
    else {
        console.log('no such userid/password');
        return res.status(404).send();
    }
    //req.session.user = users;
    return res.status(200).send('userid and password defined' + T_unten);
});


module.exports = mqtt;
module.exports = router;