const express = require("express");
const router = express.Router();
var counter = 0
router.get("/", async(req, res) => {
    
  //if(counter < 3){
    //counter ++;
  return res.status(200).send("OK "+ counter);
  //}
  });


  
module.exports = router;