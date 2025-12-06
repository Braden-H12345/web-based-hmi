"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

export interface PLCContextType {
  // your existing names
  plcId: number;
  plcIpAddress: string;
  plcPort: number;

  // optional extras you may already pass
  unitId?: number;
  apiBase?: string; // default "/api/plc"
  pollMs?: number;

  // connection state
  connected: boolean;
  connecting: boolean;
  lastError: string | null;

  // actions (connection only)
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  // runtime config updates (if you need to swap PLCs)
  setConfig: (patch: Partial<Pick<PLCContextType,
    "plcId" | "plcIpAddress" | "plcPort" | "unitId" | "apiBase" | "pollMs">>) => void;
}

const PLCContext = createContext<PLCContextType | null>(null);

export const usePLC = () => {
  const context = useContext(PLCContext);
  if (!context) throw new Error("usePLC must be used inside a PLCProvider");
  return context;
};

export const PLCProvider = ({
  plcId,
  plcIpAddress,
  plcPort,
  apiBase = "/api/plc",
  pollMs,
  children,
}: {
  plcId: number;
  plcIpAddress: string;
  plcPort: number;
  apiBase?: string;
  pollMs?: number;
  children: React.ReactNode;
}) => {
  const [cfg, setCfg] = useState({
    plcId,
    plcIpAddress,
    plcPort,
    apiBase,
    pollMs,
  });

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const setConfig: PLCContextType["setConfig"] = (patch) =>
    setCfg((prev) => ({ ...prev, ...patch }));

  const base = cfg.apiBase ?? "/api/plc";

  const connect = useCallback(async () => {
    if (connecting || connected) return;
    setConnecting(true);
    setLastError(null);
    try {
        console.log("[HMI] PLC connect ->", cfg.plcId, cfg.plcIpAddress, cfg.plcPort);
      const res = await fetch(`${base}/${cfg.plcId}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip: cfg.plcIpAddress,
          port: cfg.plcPort,
        }),
      });
      console.log("[HMI] PLC connect status", res.status);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
      }
      setConnected(true);
    } catch (e: any) {
      setConnected(false);
      setLastError(e?.message || "Connect failed");
      throw e;
    } finally {
      setConnecting(false);
    }
  }, [base, cfg, connected, connecting]);

  const disconnect = useCallback(async () => {
    try {
      await fetch(`${base}/${cfg.plcId}/disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {}
    setConnected(false);
  }, [base, cfg.plcId]);

  const value = useMemo(
    () => ({
      plcId: cfg.plcId,
      plcIpAddress: cfg.plcIpAddress,
      plcPort: cfg.plcPort,
      apiBase: cfg.apiBase,
      pollMs: cfg.pollMs,
      connected,
      connecting,
      lastError,
      connect,
      disconnect,
      setConfig,
    }),
    [cfg, connected, connecting, lastError, connect, disconnect]
  );

  return <PLCContext.Provider value={value}>{children}</PLCContext.Provider>;
};