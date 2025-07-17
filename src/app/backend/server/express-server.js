const express = require("express");
const next = require("next");
const path = require("path");


//routing - this points to the files that do the actual legwork of specific tasks
const plcRoute = require("./routing/plc-routing");

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