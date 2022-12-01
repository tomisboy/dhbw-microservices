const { application } = require("express");
const express = require("express");
const sensor_werte = require("../../model/sensor_werte.js");
const router = express.Router();
require('dotenv').config();



router.get("/", async(req, res) => {
    console.log("find all docs in mongodb");
    alldocs = await sensor_werte.find({}).exec();
    return res.status(200).send(alldocs);
  });

  router.get ('/getLocid/:locid/', async(req, res) => {
    //console.log("reg =", req);
    locid=(req.params.locid);
    console.log("userid = ", locid);
  
    sensor_werte.find({locid: locid}, function(err,docs) {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      else {
        //console.log("user document = ", docs);
      }
      return res.status(200).send(docs);
    });
  });




  router.get ('/getSensor/:sensortype/', async(req, res) => {
    //console.log("reg =", req);
    sensortype=(req.params.sensortype);
    console.log("userid = ", sensortype);
  
    sensor_werte.find({sensortype: sensortype}, function(err,docs) {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      else {
        //console.log("user document = ", docs);
      }
      return res.status(200).send(docs);
    });
  });
router.post('/change-parameter', async (req, res) => {
    var userid = req.body.userid;
    var password = req.body.password;
    var rueckgabe = ""
    var authentifcation = {
        userid: process.env.userid,
        password: process.env.password
    }
    
    const login = (userid === authentifcation.userid && password === authentifcation.password);

    if (login) {

        if (isFinite((req.body.T_unten))) {
            global.T_unten = (req.body.T_unten);
            console.log(global.T_unten);
            rueckgabe += "\n T_unten wurde geändert auf: " + global.T_unten;
        }

        if (isFinite(req.body.T_oben)) {
            global.T_oben = req.body.T_oben;
            console.log(global.T_oben);
            rueckgabe += "\n T_oben wurde geändert auf: " + global.T_oben;
        }
        //return res.status(200).send('userid and password' + global.T_oben);

        if (isFinite(req.body.X_oben)) {
            global.X_oben = req.body.X_oben;
            console.log(global.X_oben);
            rueckgabe += "\n X_oben wurde geändert auf: " + global.X_oben;
        }

        if (isFinite(req.body.P_unten)) {
            global.P_unten = req.body.P_unten;
            console.log(global.global.P_unten);
            rueckgabe += "\n P_unten wurde geändert auf: " + global.P_unten;

        }

        if (isFinite(req.body.P_oben)) {
            global.P_oben = req.body.P_oben;
            console.log(global.P_oben);
            rueckgabe += "\n P_oben wurde geändert auf: " + global.P_oben;
        }

        if (isFinite(req.body.H_unten)) {
            global.H_unten = req.body.H_unten;
            console.log(global.H_unten);
            rueckgabe += "\n H_unten wurde geändert auf: " + global.H_unten;
        }

        if (isFinite(req.body.H_oben)) {
            global.H_oben = req.body.H_oben;
            console.log(global.H_oben);
            rueckgabe += "\n H_oben wurde geändert auf: " + global.H_oben;
        }

        if (isFinite(req.body.p_oben)) {
            global.p_oben = req.body.p_oben;
            console.log(global.p_oben);
            rueckgabe += "\n p_oben wurde geändert auf: " + global.p_oben;
        }

    }
    else {
        console.log('no such userid/password');
        return res.status(404).send("no such userid/password");
    }
    //req.session.user = users;
    if (rueckgabe) return res.status(200).send(rueckgabe)
    else { return res.status(404).send("Fehler!  Keine Daten geändert") };
})

router.post('/loc_configs', async (req, res) => {
    var userid = req.body.userid;
    var password = req.body.password;
    var authentifcation = {
        userid: process.env.userid,
        password: process.env.password
    }
    const login = (userid === authentifcation.userid && password === authentifcation.password);
    if (login && req.body.locid && req.body.locdescription) { 
        //Wenn authentifiziert und locid und locdescription vorhanden ist 

        if (global.loc_configs[0].includes(parseInt(req.body.locid))) {
            index = global.loc_configs[0].indexOf(parseInt(req.body.locid));
            global.loc_configs[1][index] = req.body.locdescription;
            console.log(global.loc_configs)
            return res.status(200).send("Beschreibung von Location:" +req.body.locid + " auf -> " + global.loc_configs[1][index]+ " <- gewechselt ");
        }
        else return res.status(404).send("error " + global.loc_configs[1][index])



    }
    else return res.status(404).send("error: einloggen und locid und locdescription angeben")


})



module.exports = router;