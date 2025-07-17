"use client";
import {useEffect, useState} from "react";
import { PLCProvider } from "../Context/PLCContext";
import MomentaryButton from "../HMI Components/MomentaryButton";
import ToggleButton from "../HMI Components/ToggleButton";

export default function HMIPage() {
  const pagePLCId = 1;
  const ip = "192.168.100.69";
  const port = 502;

  // Optional: track if PLC is connected
  const [connected, setConnected] = useState(false);

 useEffect(() => {
    const connectPLC = async () => {

    console.log(`Calling: /api/plc/${pagePLCId}/connect with ip=${ip}, port=${port}`);

try {
          const response = await fetch(`/api/plc/${pagePLCId}/connect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip, port })
          });

          if (response.ok) {
            console.log(`Connected to PLC ${pagePLCId}`);
            setConnected(true);
          } else {
            console.error(`Failed to connect to PLC ${pagePLCId}`);
          }
        } catch (err) {
          console.error(`Connection error (PLC ${pagePLCId}):`, err);
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
          <MomentaryButton modbusTag={101} label="Override"/>
          <br></br>
          <ToggleButton  modbusTag={210} label="ADA Door"/>
      </div>
    </PLCProvider>
  );
}