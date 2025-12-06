"use client";

import { usePLC } from "../Context/PLCContext";
import { useEffect, useMemo, useRef, useState } from "react";

interface IndicatorProps {
  modbusTag: number;
  label?: string;
  pollTimeout?: number;           // overrides context.pollMs if provided
  colorOn?: string;               // ON color
  colorOff?: string;              // OFF color
  shape?: "circle" | "rectangle";
}

function Indicator({
  modbusTag = 10000,
  label = "Default Label",
  pollTimeout,
  colorOn = "green",
  colorOff = "grey",
  shape = "circle",
}: IndicatorProps) {
  const { connected, plcId, pollMs } = usePLC();
  const [isOn, setIsOn] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!connected) return; // don't poll until connected

    mountedRef.current = true;
    const intervalMs = typeof pollTimeout === "number" ? pollTimeout : (pollMs ?? 1000);

    const poll = async () => {
      try {
        const res = await fetch(`/api/plc/${plcId}/read/${modbusTag}`);
        if (!res.ok) return; // read errors: keep last state
        const data = await res.json(); // { tag, value }
        const raw = (data?.value ?? data) as boolean | number;
        const on = typeof raw === "number" ? raw !== 0 : !!raw;
        if (mountedRef.current) setIsOn(on);
      } catch (err) {
        if (mountedRef.current) {
          console.error(`Indicator read error (PLC ${plcId}, tag ${modbusTag}):`, err);
        }
      }
    };

    poll();
    const id = setInterval(poll, intervalMs);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [connected, plcId, modbusTag, pollMs, pollTimeout]);

  const bg = useMemo(() => (isOn ? colorOn : colorOff), [isOn, colorOn, colorOff]);

  const indicatorStyle: React.CSSProperties = {
    width: shape === "circle" ? "30px" : "60px",
    height: "30px",
    backgroundColor: bg,
    borderRadius: shape === "circle" ? "50%" : "6px",
    marginRight: "10px",
    transition: "background-color 0.2s ease",
    border: "1px solid rgba(0,0,0,.2)",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
      <div style={indicatorStyle} />
      {label && <span>{label}</span>}
    </div>
  );
}

export default Indicator;