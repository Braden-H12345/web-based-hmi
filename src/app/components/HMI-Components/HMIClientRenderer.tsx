"use client";

import React from "react";
import { PLCProvider } from "../Context/PLCContext";
import ConnectGate from "./ConnectGate";
import { COMPONENTS } from "./registry";
import type { HMIComponentDef } from "@/app/types/hmi";

type AnyRow = any;
function isVisual(row: AnyRow): row is HMIComponentDef {
  return !!row && typeof row.type === "string" && row.type in COMPONENTS;
}

export default function HMIClientRenderer({ components }: { components: AnyRow[] }) {
  // find config row
const cfgRow = (components as any[]).find(r => r?.type === "PLCConfig");

// tolerate stringified props
let cfg = cfgRow?.props ?? null;
if (typeof cfg === "string") {
  try { cfg = JSON.parse(cfg); } catch { cfg = null; }
}

// hard fail if missing/invalid
if (!cfg || cfg.plcId == null || !cfg.plcIpAddress || cfg.plcPort == null) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-red-600">PLC configuration missing</h2>
      <p className="text-sm mt-2">
        First row must provide <code>plcId</code>, <code>plcIpAddress</code>, and <code>plcPort</code>.
      </p>
    </div>
  );
}

  const visual = components.filter(isVisual);

  return (
    <PLCProvider
      plcId={cfg.plcId}
      plcIpAddress={cfg.plcIpAddress}
      plcPort={cfg.plcPort}
      apiBase={cfg.apiBase ?? "/api/plc"}
      pollMs={cfg.pollMs}
    >
      <ConnectGate>
        <main
          className="p-6 grid gap-4"
          style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
        >
          {visual.map((c, i) => {
            const Cmp = COMPONENTS[c.type as keyof typeof COMPONENTS];
            const style = c.layout
              ? {
                  gridColumn: `${c.layout.x} / span ${c.layout.w}`,
                  gridRow: `${c.layout.y} / span ${c.layout.h}`,
                }
              : {};
            return Cmp ? (
              <div key={i} style={style}>
                <Cmp {...(c.props as any)} />
              </div>
            ) : (
              <div key={i} className="border p-2 rounded bg-red-100 text-red-800">
                Unknown component: {String(c.type)}
              </div>
            );
          })}
        </main>
      </ConnectGate>
    </PLCProvider>
  );
}