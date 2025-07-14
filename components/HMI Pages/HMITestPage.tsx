"use client";
import {useEffect, useState} from "react";
import { PLCProvider } from "../Context/PLCContext";
import MomentaryButton from "../HMI Components/MomentaryButton";

export default function HMIPage() {
  const pagePLCId = "thisisastring";
  const ip = "192.168.100.69";
  const port = 502;

  // Optional: track if PLC is connected
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectPLC = async () => {

    console.log(`Calling: /api/plc/${pagePLCId}/connect with ip=${ip}, port=${port}`);

  if (!pagePLCId || typeof pagePLCId !== "string" || pagePLCId.trim() === "") {
    console.error(`Invalid PLC ID: ${pagePLCId}`);
    return;
  }

      try {
        const res = await fetch(`/api/plc/${pagePLCId}/connect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip, port })
        });

        if (res.ok) {
          console.log(`Connected to PLC ${pagePLCId}`);
          setConnected(true);
        } else {
          console.error("PLC connection failed");
        }
      } catch (err) {
        console.error("Connection error:", err);
      }
    };

    connectPLC();
  }, [pagePLCId, ip, port]);

  // ✅ Optionally show loading state while PLC connects
  if (!connected) return <p>Connecting to PLC...</p>;

  return (
    <PLCProvider plcId={pagePLCId}>
      <h1>HMI for {pagePLCId}</h1>
      <div> 
            <MomentaryButton modbusTag="000210" label="ADA Door"/>
          <br></br>
          <MomentaryButton modbusTag="000101" label="Knock override"/>
      </div>
    </PLCProvider>
  );
}