"use client";

import { usePLC } from "../Context/PLCContext";

interface MomentaryButtonProps {
  modbusTag: number;
  label?: string;
  timeActive?: number; // ms
}

function MomentaryButton({
  modbusTag = 210,
  label = "Default Label",
  timeActive = 1000,
}: MomentaryButtonProps) {
  const { connected, plcId } = usePLC();

  const handleClick = async () => {
    if (!connected) {
      console.warn("Ignoring write: PLC not connected");
      return;
    }
    try {
      // TRUE
      await fetch(`/api/plc/${plcId}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: modbusTag, value: true }),
      });

      await new Promise((res) => setTimeout(res, timeActive));

      // FALSE
      await fetch(`/api/plc/${plcId}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: modbusTag, value: false }),
      });
    } catch (err) {
      console.error(`Failed to momentary write (PLC ${plcId}, tag ${modbusTag}):`, err);
    }
  };

  return (
    <button
      style={{ padding: "10px 20px", backgroundColor: "grey", color: "greenyellow" }}
      onClick={handleClick}
      disabled={!connected}
      title={!connected ? "PLC not connected" : undefined}
    >
      {label}
    </button>
  );
}

export default MomentaryButton;