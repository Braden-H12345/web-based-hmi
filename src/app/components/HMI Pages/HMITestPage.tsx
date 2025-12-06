"use client";
import {useEffect, useState} from "react";
import { PLCProvider } from "../Context/PLCContext";
import MomentaryButton from "../HMI-Components/MomentaryButton";
import ToggleButton from "../HMI-Components/ToggleButton";
import Indicator from "../HMI-Components/Indicator";
import PageChanger from "../HMI-Components/PageChanger";

export default function HMIPage() {
  const pagePLCId = 1;
  const ip = "192.168.100.69";
  const port = 502;

  // Optional: track if PLC is connected
  const [connected, setConnected] = useState(false);



    useEffect(() => {
    const connectPLC = async () => {

try {
          console.log(`Calling: /api/plc/${pagePLCId}/connect with ip=${ip}, port=${port}`);
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
    <PLCProvider plcId={pagePLCId} plcIpAddress={ip} plcPort={port}>
      <h1>HMI for {pagePLCId}</h1>
      <div> 
          <MomentaryButton modbusTag={101} label="Override"/>
          <br></br>
          <ToggleButton  modbusTag={210} label="ADA Door"/>
          <br></br>
          <Indicator modbusTag={100003} label="Input 1" shape="circle" pollTimeout={2000}/>
          <br></br>
          <Indicator modbusTag={100006} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100007} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100008} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100009} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100010} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100011} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100012} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100013} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100014} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100015} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100016} label="Input 1" shape="rectangle"/>
          <br></br>
          <Indicator modbusTag={100017} label="Input 1" shape="rectangle"/>
          <br></br>
          <PageChanger path={""} pageName={""}></PageChanger>
          </div>
          </PLCProvider>
            );
          }