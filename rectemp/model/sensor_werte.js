const mongoose = require("mongoose");
const Schema = mongoose.Schema;




let Sensor_Schema = new Schema(
    {
        timestamp: { type: String },
        locid: { type: Number },
        gpslatitude: { type: String },
        gpslongitude: { type: String },
        sensortype: { type: String },
        value: { type: String }
    }
);

module.exports = mongoose.model("sensor", Sensor_Schema);