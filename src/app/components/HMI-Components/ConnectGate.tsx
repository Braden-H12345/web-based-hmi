"use client";
import { useEffect } from "react";
import { usePLC } from "../Context/PLCContext";

export default function ConnectGate({ children }: { children: React.ReactNode }) {
  const { connected, connecting, connect, lastError } = usePLC();

  useEffect(() => {
    // should log once per page load
    console.log("[HMI] ConnectGate → connect()");
    connect().catch(() => {});
  }, [connect]);

  if (connecting) return <p className="p-6">Connecting to PLC…</p>;
  if (!connected) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-600">Unable to connect to PLC</h2>
        {lastError && (
          <pre className="mt-2 text-sm bg-red-50 p-3 rounded border border-red-200">
            {lastError}
          </pre>
        )}
        <button
          onClick={() => connect().catch(() => {})}
          className="mt-3 bg-black text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }
  return <>{children}</>;
}