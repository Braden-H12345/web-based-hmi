import express from "express";
import cors from "cors";
import plcRoute from "./plc-routing.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));

app.use("/api/plc", plcRoute);

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`PLC backend listening on :${port}`);
});