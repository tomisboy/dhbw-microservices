// Skeleton eines simulationsprogramm um Messdaten zu erzeugen
//   das simulationsprogramm soll erweitert werden, um alle Daten die in der Aufgabenstellung
//   beschrieben sind zu erzeugen und zu senden
// change history
// add mqtt support
var mqtt    = require('mqtt');

//Setzte mqtturl (auf LB von Kubernetes)

var mqttHOSTurl = "192.168.49.2:32244" 
//var client  = mqtt.connect('mqtt://mqtt:1883',{clientId:"sim-R4Nd0mSTRING" + locid});
var client  = mqtt.connect('mqtt://'+mqttHOSTurl,{clientId:"sim-R4Nd0mSTRING" + locid+ sensortype});
//console.log(client);

const express = require('express');
const app = express();

const cors = require('cors'); 
app.use(cors());

// required to handle the request body
app.use(express.json());

function randomValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// parameter für die Übermittlung der Testdaten
var timeinterval = 10000;
var locid = '1234';
var simanzahl = 5;
var sensortype = 'T';
var min = 20;
var max = 30;
var value = randomValue(min,max);
const args = process.argv.slice(2);


if (args[0] == '?') {


  console.log('arg1 = timeinterval in dem die Daten gesendet werden in sec');
  console.log('arg1 = unique id of the sensor station - 4 stellig');
  console.log('arg2 = Anzahl der Daten in Zyklen - 2stellig');
  console.log('arg3 = identifier type of messaurement - T=temperature, X=co2, P=people in a room, H=luftfeuchtigkeit, p=Feinstaub');
  console.log('arg4 = start value');
  console.log('arg5 = end value');
  console.log('bsp =npm start 10 1234 5 T 20 25');
  console.log('bsp will send every 10 sec a temperature value between 20 and 25 ');
  process.exit();

}

if ((args.length) == 6) {
  timeinterval = args[0];
  locid = args[1];
  simanzahl = args[2];
  sensortype = args[3];
  min = parseInt(args[4]);

  
  max = parseInt(args[5]);
  MessdatensensorID = args[6];
} else {
    console.log("Wrong no of arguemts ");
    process.exit();    
}


//var client  = mqtt.connect('mqtt://test.mosquitto.org',{clientId:"sim-R4Nd0mSTRING" + locid});
const axios = require('axios');

myinterval = setInterval(intervalFunc, timeinterval*1000);

var mqttmsg = {};
var i=0;
var myinterval;
console.log('min', min);

function intervalFunc() {
  
  if (i == simanzahl-1) {
    clearInterval(this);
  }
  // sende Beginn Fahrt Daten

   
    mqttmsg['timestamp'] = new Date().toISOString();
    mqttmsg['locid'] = locid;
    mqttmsg['gpslatitude'] = '48.60000';
    mqttmsg['gpslongitude'] = '8.90000';
    mqttmsg['sensortype'] = sensortype

//////////////////////////////////////////////////
//
//  fragen obs ok ist die Werte per zufall in range
//
/////////////////////////////////////////////////
    value = randomValue(min,max)
 
    //if (value >= max)
    //  value = max; 
    //else
    //  value = min + i;
    mqttmsg['value'] = value;

    console.log('mqttmsg = ', mqttmsg);
    if (args[3] == 'T') {
        mqttopic='4934001/T/'+locid;
    }
    if (args[3] == 'X') {
      mqttopic='4934001/X/'+locid;
    }
    if (args[3] == 'H') {
      mqttopic='4934001/H/'+locid;
    }
    if (args[3] == 'P') {
      mqttopic='4934001/P/'+locid;
    }  
    if (args[3] == 'p') {
      mqttopic='4934001/p/'+locid;
    }

    console.log('mqttopic =', mqttopic);
    console.log('mqtt msg',JSON.stringify(mqttmsg));
    client.publish(mqttopic,  JSON.stringify(mqttmsg));
    i++;


}
//app.listen(4000, () =>{
//  myinterval = setInterval(intervalFunc, 15000);

//  console.log('Listening on port 4000')
//});