//This is the routing for PLC related communication. This is simply routing page requests to the modbus-comms methods. 
//These methods simply connect or disconnect from the PLC or read or write data to the PLC.

import express from 'express';

const router = express.Router();

import {establishConnection, disconnectPLC, readTag, setTag} from "./modbus-comms.js"; //takes these methods from modbus-comms



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
        console.log("Disconnect route hit", req.params.id)
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
        console.log('Reading tag ',  req.params.tag, ' result ', result);
        res.status(200).json({tag: req.params.tag, value: result});
        //console.log("Attempted to read tag ", req.params.tag, " for PLC ", req.params.id);
    }
    catch(err)
    {
        res.status(501).json({error: err.message});
    }

});


//WRITE A VALUE TO AN ADDRESS
router.post("/:id/write", async(req, res) => {

    const id = req.params.id;
    const {tag, value} = req.body;

    console.log("Tag type:", typeof tag, "Tag value:", tag);

    console.log(`Received write: id=${id}, tag=${tag}, value=${value}`);

    if (typeof tag !== "number" || isNaN(tag)) {
    return res.status(400).json({ error: `Invalid tag: ${tag}` });
  }

  if (typeof value !== "boolean") {
    return res.status(400).json({ error: `Value must be a boolean, got: ${value}` });
  }

    
  if (tag < 0) {
    return res.status(400).json({ error: `Parsed address out of range: ${tag}` });
  }


    try
    {
        await setTag(tag, value, id);
        res.sendStatus(200);
        //console.log("Attempted to write value ", value, "at location ", tag, " for PLC ", req.params.id);
    }
    catch(err)
    {
        res.status(502).json({error: err.message});
    }

});

//DEBUG MESSAGING - so messages can be logged to server from components that have nothing to do with the server.
// Not really needed just an idea I had
router.post("/debug", async(req, res) => {

    try {
        console.log("Debug msg: ", req.params.body)
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;