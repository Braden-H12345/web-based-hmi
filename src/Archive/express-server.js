import express from "express";
import next from "next";
import path from "path";


//routing - this points to the files that do the actual legwork of specific tasks
import plcRoute from "./express/plc-routing.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {

const expressServer = express();

expressServer.use(express.json());
expressServer.use("/api/plc", plcRoute);
expressServer.use(express.static(path.join(process.cwd(), "public")));

expressServer.use((req, res) => {
    return handle(req,res);
});


expressServer.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Unified express + next server ready on http://localhost:3000");
});

});

//TODO: Need to change routing so it is to a specific url and also unhook express and next servers so that they can be hosted seperately. Modbus is too unsecure to host on web