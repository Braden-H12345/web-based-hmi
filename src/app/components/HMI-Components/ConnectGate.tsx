

"use client";

import { useEffect, useRef } from "react";
import { usePLC } from "../Context/PLCContext";

type Props = {
  children: React.ReactNode;
  /** Auto-retry interval in ms (0 = disabled). Example: 3000 */
  autoRetryMs?: number;
};

export default function ConnectGate({ children, autoRetryMs = 0 }: Props) {
  const { connected, connecting, connect, lastError, disconnect, plcId } = usePLC();

  // Keep the latest connect function in a ref so we can call it from effects
  const connectRef = useRef(connect);
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);


  //same logic for disconnect ref
    const disconnectRef = useRef(disconnect);
  useEffect(() => {
    disconnectRef.current = disconnect;
  }, [disconnect]);

  // Timer for optional auto-retry
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Try once on mount
  useEffect(() => {
    connectRef.current().catch(() => {});
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  //schedule auto-retry only when we're idle and not connected
  useEffect(() => {
    if (autoRetryMs <= 0) return;
    if (connected || connecting) return;      // only when idle & disconnected
    if (retryTimerRef.current) return;        // don't queue multiple timers

    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      connectRef.current().catch(() => {});
    }, autoRetryMs);
  }, [connected, connecting, autoRetryMs]);

useEffect(() => {
  function handleDisconnect() {
    disconnectRef.current()
      .catch(async () => {
        await fetch("/api/plc/debug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "disconnect-catch", plcId }),
          // keepalive: true, //optional
        });
      });
  }

  window.addEventListener("pagehide", handleDisconnect);

  return () => {
    window.removeEventListener("pagehide", handleDisconnect);
    handleDisconnect();
  };
}, []);

  

  // UI
  if (connecting) {
    // Show a stable "connecting" screen while the attempt is in flight.
    return <p className="p-6">Connecting to PLC…</p>;
  }

  if (!connected) {
    // Idle & disconnected: show one steady error screen with retry
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-600">Unable to connect to PLC</h2>
        {lastError && (
          <pre className="mt-2 text-sm bg-red-50 p-3 rounded border border-red-200 whitespace-pre-wrap">
{lastError}
          </pre>
        )}
        <button
          onClick={() => connectRef.current().catch(() => {})}
          className="mt-3 bg-black text-white px-3 py-1 rounded"
        >
          Retry
        </button>
        {autoRetryMs > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Auto-retrying every {autoRetryMs} ms…
          </p>
        )}
      </div>
    );
  }

  // Connected
  return <>{children}</>;
}