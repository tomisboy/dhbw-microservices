var mqtt = require('mqtt');
var Topic = '4934001-errorCase/#'; //subscribe to all topics from postapp

//var client  = mqtt.connect('mqtt://test.mosquitto.org',{clientId:"1tempalert-hsMQu1111hewiuhewuTT"});

var client  = mqtt.connect('mqtt://mqtt:1883',{clientId:"tempalert-hsMQu1111hewiuhewuTT"});


client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect()
{
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted)
{
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
}



function mqtt_messsageReceived(topic, message, packet)
{   
    var obj = JSON.parse(message);
    locid = obj.locid;
    sensortype = obj.sensortype
    value = obj.value


    //Hole Bereich des Schwellwerts aus dem Topic
    const myArray = topic.split("/");
    let schwellwert_bereich = myArray[1];
    console.log("Achtung " + schwellwert_bereich + " überschritten!");
    console.log("Wert: "+ value +" bei Sensor " + sensortype +" am Standort " + locid + ":");
    console.log('Topic=' +  topic + '  Message=' + message);
    console.log("\n")
}























function mqtt_reconnect(err)
{
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
	
}

function mqtt_error(err)
{
    console.log("Error!");
	if (err) {console.log(err);}
}


function mqtt_close(err)
{
	console.log("Close MQTT");
    if (err) {console.log(err);}
}