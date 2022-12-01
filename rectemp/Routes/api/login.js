const { application } = require("express");
const express = require("express");
const router = express.Router();

const mqtt_stuff = require("../../mqtt_stuff.js")
var { T_unten } = require("../../mqtt_stuff.js")



function isFloat(n) {
    return n === +n && n !== (n | 0);
}

function isInteger(n) {
    return n === +n && n === (n | 0);
}

router.get("/", async (req, res) => {
    console.log("find all docs in mongodb");
});
router.post('/change-parameter', async (req, res) => {
    var userid = req.body.userid;
    var password = req.body.password;
    var err = 0

    console.log(userid, password)

    const found = (userid === "admin" && password === "admin");

    if (found) {

        if (isFinite((req.body.T_unten))) {
            global.T_unten = (req.body.T_unten);
            console.log(global.T_unten);
            //return res.status(200).send('userid and password' + global.T_unten);

        }
        if (isFinite(req.body.T_oben)) {
            global.T_oben = req.body.T_oben;
            console.log(global.T_oben);
        }
        //return res.status(200).send('userid and password' + global.T_oben);

        if (isFinite(req.body.X_oben)) {
            global.X_oben = req.body.X_oben;
            console.log(global.X_oben);
        }

        if (isFinite(req.body.P_unten)) {
            global.P_unten = req.body.P_unten;
            console.log(global.global.P_unten);
        }

        if (isFinite(req.body.P_oben)) {
            global.P_oben = req.body.P_oben;
            console.log(global.P_oben);
        }

        if (isFinite(req.body.H_unten)) {
            global.H_unten = req.body.H_unten;
            console.log(global.H_unten);
        }

        if (isFinite(req.body.H_oben)) {
            global.H_oben = req.body.H_oben;
            console.log(global.H_oben);
        }

        if (isFinite(req.body.p_oben)) {
            global.p_oben = req.body.p_oben;
            console.log(global.p_oben);
        }

    }
    else {
        console.log('no such userid/password');
        return res.status(404).send();
    }
    //req.session.user = users;
    if (!err) return res.status(200).send('Daten geaendert');
})

module.exports = router;