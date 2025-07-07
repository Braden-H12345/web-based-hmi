const express = require("express");
const path = require("path");

//setup
const PORT = 4537;
const expressServer = express();

//routing - this points to the files that do the actual legwork of specific tasks
const plcRoute = require("./routing/plc-routing");

//mounting of the routes
expressServer.use(express.json());
expressServer.use("/api/plc", plcRoute);
expressServer.use(express.static(path.join(process.cwd(), "public")));

expressServer.listen(PORT, () => console.log(`Server is running. Found on port ${PORT}`));


