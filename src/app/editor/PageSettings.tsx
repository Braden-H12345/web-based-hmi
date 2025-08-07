"use client";
import { ChangeEvent } from "react";

interface PageSettingsProps {
  pageName: string;
  plcIp: string;
  plcId: number;
  port: number;
  onChange: (key: "pageName" | "plcIp" | "plcId" | "port", value: string | number) => void;
}

export default function PageSettings({
  pageName,
  plcIp,
  plcId,
  port,
  onChange,
}: PageSettingsProps) {
  return (
    <div className="w-64 p-4 border-l">
      <h3 className="text-lg font-bold mb-4">Page Settings</h3>

      <label className="block mb-2">
        Page Name:
        <input
          type="text"
          value={pageName}
          className="block w-full mt-1 p-1 border"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("pageName", e.target.value)
          }
        />
      </label>

      <label className="block mb-2">
        PLC IP:
        <input
          type="text"
          value={plcIp}
          className="block w-full mt-1 p-1 border"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("plcIp", e.target.value)
          }
        />
      </label>

      <label className="block mb-2">
        PLC ID:
        <input
          type="number"
          value={plcId}
          className="block w-full mt-1 p-1 border"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("plcId", Number(e.target.value))
          }
        />
      </label>

      <label className="block mb-2">
        Port:
        <input
          type="number"
          value={port}
          className="block w-full mt-1 p-1 border"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("port", Number(e.target.value))
          }
        />
      </label>
    </div>
  );
}