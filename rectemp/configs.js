
//##################################################
//           Config  
// Nur definierte Sensoren werden akzeptiert 
// hier werden die locid der Sensoren definiert, von denen Nachrichten empfangen und gespeichert werden sollen 
global.loc_configs = [[1234, 3456, 4567, 5678],
["Beschreibung 1234", "Beschreibung 3456", "Beschreibung 4567", "Beschreibung 5678"]];

//Schwellwerte:
//(Temperatur: Innerräume dürfen nur zwischen 16 und 19 Grad beheizt werden)
//var global.T_unten = 16;
global.T_unten = 16;
//module.export = {global.T_unten}
global.T_oben = 19;
//CO2:  Innerräume dürfen nicht mehr als 2000 ppm Co2 beinhalten 
global.X_oben = 2000;

//Personen: in Innerräume dürfen nicht mehr 20 Personen gleichzeitig sein
// Zusätzlich soll, eine Warnung ausgegeben werden wenn der raum leer ist
global.P_unten = 1;
global.P_oben = 20;


//Luftfeuchtigkeit: in Innerräume dürfen nicht mehr als  60% relativer Luftfeuchtigkeit haben
// Sollten aber mindestens 30 % haben
global.H_unten = 30;
global.H_oben = 60;

//Feinstaub:    Im Raum darf nicht mehr als 5 µg/m³ Feinstaub vorhanden sein 
//Die Weltgesundheitsorganisation WHO hat einen Richtwert für PM2,5 von 5 µg/m³
global.p_oben = 5;


// Config Parameter für MongoDB und MQTT und Zugangsdaten für Admins für die API Calls 
global.env = {
    MQTT_HOST: "192.168.165.3:1883",
    DB_HOST: "192.168.165.3",
    DB_DATEBASE: "Temperatur",
    DB_PORT: "27017",
    USERID: "admin",
    PASSWORD: "admin",
}


