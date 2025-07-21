"use client";

import { usePLC } from "../Context/PLCContext"
import {useEffect, useState} from "react";

interface IndicatorProps
{
    modbusTag: number;
    label?: string;
    pollTimeout?: number;
    colorOn?: string;
    colorOff?: string;
    shape: "circle" | "rectangle";

}

function Indicator({modbusTag=10000, label = "Default Label", colorOn = "green", colorOff = "grey", pollTimeout=1000, shape="circle"}: IndicatorProps)
{
      const { plcId } = usePLC();
  const [state, setState] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        const res = await fetch(`/api/plc/${plcId}/read/${modbusTag}`);
        const data = await res.json();
        if (isMounted && typeof data.value === "boolean") {
          setState(data.value);
        }
      } catch (err) {
        console.error(`Failed to read tag ${modbusTag} from PLC ${plcId}:`, err);
      }
    };

    poll();
    const interval = setInterval(poll, pollTimeout);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [plcId, modbusTag, pollTimeout]);

  const indicatorStyle: React.CSSProperties = {
    width: shape === "circle" ? "30px" : "60px",
    height: "30px",
    backgroundColor: state ? colorOn : colorOff,
    borderRadius: shape === "circle" ? "50%" : "6px",
    marginRight: "10px",
    transition: "background-color 0.3s"
  };

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
      <div style={indicatorStyle}></div>
      {label && <span>{label}</span>}
    </div>
  );
}

export default Indicator;