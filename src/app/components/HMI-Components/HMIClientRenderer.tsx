"use client";

import React from "react";
import { PLCProvider } from "../Context/PLCContext";
import { COMPONENTS } from "./registry";
import type { HMIComponentDef } from "../../types/hmi";

export default function HMIClientRenderer({ components }: { components: HMIComponentDef[] }) {
  return (
    <PLCProvider plcId={1}>
      <main className="p-6 grid gap-4" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
        {components.map((c, i) => {
          const Cmp = COMPONENTS[c.type];
          if (!Cmp) {
            return (
              <div key={i} className="border p-2 rounded bg-red-100 text-red-800">
                Unknown component: {c.type}
              </div>
            );
          }
          const style = c.layout
            ? {
                gridColumn: `${c.layout.x} / span ${c.layout.w}`,
                gridRow: `${c.layout.y} / span ${c.layout.h}`,
              }
            : {};
          return (
            <div key={i} style={style}>
              <Cmp {...(c.props as any)} />
            </div>
          );
        })}
      </main>
    </PLCProvider>
  );
}