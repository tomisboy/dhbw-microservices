const { application } = require("express");
const express = require("express");
const router = express.Router();

const mqtt_stuff = require("../../mqtt_stuff.js")
var { T_unten } = require("../../mqtt_stuff.js")

router.get("/", async (req, res) => {
    console.log("find all docs in mongodb");
});
router.post('/change-parameter', async (req, res) => {
    var userid = req.body.userid;
    var password = req.body.password;


    console.log(userid, password)

    const found = (userid === "admin" && password === "admin");

    if (found) {

        if (req.body.T_unten) {
            console.log(req.body.T_unten);
            //set_T_unten(req.body.T_unten)
            console.log(mqtt_stuff.T_unten)
            await (mqtt_stuff.T_unten = req.body.T_unten);
            console.log(mqtt_stuff.T_unten)
        }
        if (req.body.t_oben)
            t_oben = req.body.t_oben;

        if (req.body.x_oben)
            x_oben = req.body.x_oben;

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
    return res.status(200).send('userid and password' + T_unten);
});

module.exports = router;