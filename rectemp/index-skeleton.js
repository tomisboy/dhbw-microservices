var mqtt = require('mqtt');
var Topic = '4934001/#'; //subscribe to all topics from postapp

//var client  = mqtt.connect('mqtt://mqtt:1883',{clientId:"rectemp-hsMQu1111hewiuhewuTT"});

var client = mqtt.connect('mqtt://mqtt:1883', { clientId: "rectemp-hsMQu1111hewiuhewuTT" });


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
    console.log('Topic=' + topic + '  Message=' + message);
    var obj = JSON.parse(message);
    sensortyp = obj.sensortype
    value = obj.value;

    // Check den Schwellenwert ab.

    switch (sensortyp) {
        case 'T': {
            //Überprüfe Schwellwert für T=temperature
            //Diesr Schwellwert ist auf 19 Grad festgelegt 
            //(Innerräume dürfen nur bis 19 Grad beheizt werden)
            if (value > 19) {
                console.log("Schwellwert für Temperatur erreicht --> "+ value + "<--" );
                mqttopic = "4934001-errorCase/Schwellwert-temperatur"
                console.log("Publishe an " + mqttopic);
                console.log("\n");
                client.publish(mqttopic, JSON.stringify(obj));
            }
            break;
        }
        case 'X': {
            //Überprüfe Schwellwert für X=co2
            //Diesr Schwellwert ist auf 2000 (ppm) festgelegt 
            //Innerräume dürfen nicht mehr als 2000 ppm Co2 beinhalten 
            if (value > 2000) {
                console.log("Schwellwert für Co2 erreicht --> "+ value + "<--" );
                mqttopic = "4934001-errorCase/Schwellwert-co2"
                console.log("Publishe an " + mqttopic);
                console.log("\n");
                client.publish(mqttopic, JSON.stringify(obj));
            }
            break;
        }
        case 'P': {
            //Überprüfe Schwellwert für P=people in a room
            //Diesr Schwellwert ist auf 20 Personen festgelegt 
            //in Innerräume dürfen nicht mehr 20 Personen gleichzeitig sein 
            if (value > 20) {
                console.log("Schwellwert für Personen erreicht --> "+ value + "<--" );
                mqttopic = "4934001-errorCase/Schwellwert-Personen"
                console.log("Publishe an " + mqttopic);
                console.log("\n");
                client.publish(mqttopic, JSON.stringify(obj));
            }
            break;
        }
        case 'H': {
            //Überprüfe Schwellwert für H=luftfeuchtigkeit
            //in Innerräume dürfen nicht mehr als  60% relativer Luftfeuchtigkeit haben
            if (value > 60) {
                console.log("Schwellwert für relativer Luftfeuchtigkeit erreicht --> "+ value + "<--" );
                mqttopic = "4934001-errorCase/Schwellwert-Luftfeuchtigkeit"
                console.log("Publishe an " + mqttopic);
                console.log("\n");
                client.publish(mqttopic, JSON.stringify(obj));
            }
            break;
        }

        case 'p': {
            //Überprüfe Schwellwert für p=Feinstaub (Feinstaub = PM2,5)
            //Die Weltgesundheitsorganisation WHO hat einen Richtwert für PM2,5 von 5 µg/m³
            //Im Raum darf nicht mehr als 5 µg/m³ Feinstaub vorhanden sein 
            if (value > 5) {
                console.log("Schwellwert für Feinstaub erreicht --> "+ value + "<--" );
                mqttopic = "4934001-errorCase/Schwellwert-Feinstaub"
                console.log("Publishe an " + mqttopic);
                console.log("\n");
                client.publish(mqttopic, JSON.stringify(obj));
            }
            break;
        }

    }


    //client.subscribe(Topic, mqtt_subscribe);
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