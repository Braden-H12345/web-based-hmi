"use client";

import { usePLC } from "../Context/PLCContext";
import { useEffect, useRef, useState } from "react";

interface ToggleButtonProps {
  modbusTag: number;
  label?: string;
  pollTimeout?: number;     // ms; defaults to context.pollMs or 1000
  colorOn?: string;         // default "red"
  colorOff?: string;        // default "grey"
}

function ToggleButton({
  modbusTag = 1,
  label = "Default Label",
  pollTimeout,
  colorOn = "red",
  colorOff = "grey",
}: ToggleButtonProps) {
  const { connected, plcId, pollMs } = usePLC();
  const [toggled, setToggled] = useState(false);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  const lastWriteRef = useRef<number>(0);

  // Poll the PLC for the current state so all clients stay consistent
  useEffect(() => {
    if (!connected) return;

    mounted.current = true;
    const intervalMs = typeof pollTimeout === "number" ? pollTimeout : (pollMs ?? 1000);

    const poll = async () => {
      try {
        const res = await fetch(`/api/plc/${plcId}/read/${modbusTag}`);
        if (!res.ok) return;
        const data = await res.json(); // { tag, value }
        const raw = (data?.value ?? data) as boolean | number;
        const on = typeof raw === "number" ? raw !== 0 : !!raw;

        // If we very recently clicked, allow the click to “win” momentarily
        // to avoid flicker from network latency; otherwise accept server truth.
        const now = Date.now();
        const clickedAgo = now - lastWriteRef.current;
        const preferServer = clickedAgo > 300; // 300ms grace window

        if (mounted.current && (preferServer || !busy)) {
          setToggled(on);
        }
      } catch (err) {
        // keep last known UI state; just log
        // console.error(`Toggle read error (PLC ${plcId}, tag ${modbusTag}):`, err);
      }
    };

    // initial + interval
    poll();
    const id = setInterval(poll, intervalMs);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [connected, plcId, modbusTag, pollMs, pollTimeout, busy]);

  const handleClick = async () => {
    if (!connected || busy) return;

    const next = !toggled;
    setBusy(true);
    lastWriteRef.current = Date.now();
    try {
      const res = await fetch(`/api/plc/${plcId}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: modbusTag, value: next }),
      });
      if (!res.ok) throw new Error(`Write failed ${res.status}`);

      // Optimistically set, then confirm with one immediate read
      setToggled(next);

      // confirm
      try {
        const r = await fetch(`/api/plc/${plcId}/read/${modbusTag}`);
        if (r.ok) {
          const d = await r.json();
          const raw = (d?.value ?? d) as boolean | number;
          const truth = typeof raw === "number" ? raw !== 0 : !!raw;
          if (mounted.current) setToggled(truth);
        }
      } catch {}
    } catch (err) {
      // console.error(`Failed to write coil (PLC ${plcId}, tag ${modbusTag}):`, err);
      // optional: force a re-read to resync
      try {
        const r = await fetch(`/api/plc/${plcId}/read/${modbusTag}`);
        if (r.ok) {
          const d = await r.json();
          const raw = (d?.value ?? d) as boolean | number;
          const truth = typeof raw === "number" ? raw !== 0 : !!raw;
          if (mounted.current) setToggled(truth);
        }
      } catch {}
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const bgColor = toggled ? colorOn : colorOff;

  return (
    <button
      style={{ padding: "10px 20px", backgroundColor: bgColor, color: "greenyellow", opacity: busy ? 0.7 : 1 }}
      onClick={handleClick}
      disabled={!connected || busy}
      title={!connected ? "PLC not connected" : undefined}
    >
      {label}
    </button>
  );
}

export default ToggleButton;