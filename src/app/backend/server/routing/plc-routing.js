//This is the routing for PLC related communication. This is simply routing page requests to the modbus-comms methods. 
//These methods simply connect or disconnect from the PLC or read or write data to the PLC.

const express = require("express");

const router = express.Router();

const {establishConnection, disconnectPLC, readTag, setTag} = require("../../modbus/modbus-comms"); //takes these methods from modbus-comms



//routing


//CONNECT TO PLC
router.use("/:id", (req, res, next) => {
  const plcId = req.params.id;

  if (!plcId || typeof plcId !== "string" || plcId.trim() === "") {
    return res.status(400).json({ error: "Missing or invalid PLC ID" });
  }

  next(); // continue to actual route
});


router.post("/:id/connect", async (req, res) => {

    const { ip, port } = req.body;
    try {
        console.log("Connecting to:", ip, port, req.params.id);
        await establishConnection( ip, port, req.params.id );
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }


});


//DISCONNECT FROM PLC
router.post("/:id/disconnect", async(req, res) => {

    try {
        await disconnectPLC(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }


});


//READ A TAG
router.get("/:id/read/:tag", async(req, res) => {

    try
    {
        const result = await readTag(req.params.tag, req.params.id);
        res.status(200).json({tag: req.params.tag, value: result});
        console.log("Attempted to read tag ", req.params.tag, " for PLC ", req.params.id);
    }
    catch(err)
    {
        res.status(501).json({error: err.message});
    }

});


//WRITE A VALUE TO AN ADDRESS
router.post("/:id/write", async(req, res) => {

    const {tag, value} = req.body;

    try
    {
        await setTag(tag, value, req.params.id);
        res.sendStatus(200);
        console.log("Attempted to write value ", value, "at location ", tag, " for PLC ", req.params.id);
    }
    catch(err)
    {
        res.status(502).json({error: err.message});
    }

});

module.exports = router;