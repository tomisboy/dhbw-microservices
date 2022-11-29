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


    if (valide_messung = validation_test(topic, message)) {
        // Nur Messungen im Gültigkeitsbereich werden weiter untersucht

        switch (valide_messung.sensortyp) {
            // Check den Schwellenwert der GÜLTIGEN Sensorenprüfung ab.
            case 'T': {
                //Überprüfe Schwellwert für T=temperature
                //(Innerräume dürfen nur zwischen 16 und 19 Grad beheizt werden)
                if (valide_messung.value < 16 || valide_messung.value > 19)
                    sende_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)

                break;
            }
            case 'X': {
                //Überprüfe Schwellwert für X=co2
                //Diesr Schwellwert ist auf 2000 (ppm) festgelegt 
                //Innerräume dürfen nicht mehr als 2000 ppm Co2 beinhalten 
                if (valide_messung.value > 2000)
                    sende_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)

                break;
            }
            case 'P': {
                //Überprüfe Schwellwert für P=people in a room
                //Diesr Schwellwert ist auf 20 Personen festgelegt 
                //in Innerräume dürfen nicht mehr 20 Personen gleichzeitig sein
                // Zusätzlich soll, eine Warnung ausgegeben werden wenn der raum leer ist  
                if (valide_messung.value < 1 || valide_messung.value > 20)
                    sende_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                break;
            }
            case 'H': {
                //Überprüfe Schwellwert für H=luftfeuchtigkeit
                //in Innerräume dürfen nicht mehr als  60% relativer Luftfeuchtigkeit haben
                // Sollten aber mindestens 30 % haben
                if (valide_messung.value < 30 || valide_messung.value > 60)
                    sende_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                break;
            }

            case 'p': {
                //Überprüfe Schwellwert für p=Feinstaub (Feinstaub = PM2,5)
                //Die Weltgesundheitsorganisation WHO hat einen Richtwert für PM2,5 von 5 µg/m³
                //Im Raum darf nicht mehr als 5 µg/m³ Feinstaub vorhanden sein 
                if (valide_messung.value > 5)
                    sende_mqtt_message(valide_messung.sensortyp, valide_messung.value, valide_messung.messung)
                break;
            }

        }

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
        console.log("\n#################\nFehlerhafte Messung, wird nicht übernommen:\n " + "'Topic=" + topic + "Message=" + message + "\n#################\n");
        return undefined
    }

}


function sende_mqtt_message(sensortype, value, messung) {
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