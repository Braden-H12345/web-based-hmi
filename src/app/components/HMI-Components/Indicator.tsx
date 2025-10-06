"use client";

import { usePLC } from "../Context/PLCContext"
import { useEffect, useMemo, useRef, useState } from "react";

interface IndicatorProps
{
    modbusTag: number;
    secondTag?: number;
    label?: string;
    pollTimeout?: number;
    color1?: string;
    color2?: string;
    colorOff?: string;
    shape: "circle" | "rectangle";

}

function Indicator({modbusTag=10000, label = "Default Label", secondTag = 20000, color1 = "green", color2 = "orange", 
  colorOff = "grey", pollTimeout=1000, shape="circle"}: IndicatorProps)
{
      const { plcId } = usePLC();
  const [state1, setState1] = useState(false);
  const [state2, setState2] = useState(false);

 
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const poll = async () => {
      try {
        // Always read the primary tag
        const p1 = fetch(`/api/plc/${plcId}/read/${modbusTag}`).then((r) => r.json());

        // Conditionally read the second tag
        const p2 = secondTag != null
          ? fetch(`/api/plc/${plcId}/read/${secondTag}`).then((r) => r.json())
          : Promise.resolve<{ value?: boolean }>({ value: false });

        const [d1, d2] = await Promise.all([p1, p2]);

        if (!mountedRef.current) return;

        if (typeof d1.value === "boolean") setState1(d1.value);
        if (typeof d2.value === "boolean") setState2(d2.value);
      } catch (err) {
        // If a read fails, don't flip states—just log and try again next poll
        console.error(
          `Indicator read error (PLC ${plcId}):`,
          { modbusTag, secondTag, err }
        );
      }
    };

    // initial + interval
    poll();
    const int = setInterval(poll, pollTimeout);

    return () => {
      mountedRef.current = false;
      clearInterval(int);
    };
  }, [plcId, modbusTag, secondTag, pollTimeout]);

  // decide the color:
  const bg = useMemo(() => {
    // If both are true (shouldn't happen but just in case):
    if (state1 && state2) {
      // deterministic priority: primary wins
      return color1;
    }
    if (state1) return color1;
    if (state2) return color2;
    return colorOff;
  }, [state1, state2, color1, color2, colorOff]);

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
      <div style={indicatorStyle}></div>
      {label && <span>{label}</span>}
    </div>
  );
}

export default Indicator;