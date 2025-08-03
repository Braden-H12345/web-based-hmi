"use client";
import { ChangeEvent } from "react";
import { CanvasItem } from "@/app/editor/types";

interface PropsPanelProps {
  item: CanvasItem;
  onChange: (id: number, key: keyof CanvasItem, value: any) => void;
}
export default function PropertiesPanel({ item, onChange }: PropsPanelProps) {
  return (
    <div className="w-64 p-4 border-l">
      <h3 className="text-lg font-bold mb-4">Properties</h3>
      <h4 className="itemType"> Type: {item.type}</h4>
      <label className="block mb-2">
        Label:
        <input
          type="text"
          value={item.label}
          className="block mt-1 p-1 border"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(item.id, 'label', e.target.value)}
        />
      </label>
      <label className="block mb-2">
        Modbus Tag:
        <input
          type="number"
          value={item.modbusTag ?? ''}
          className="block mt-1 p-1 border"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(item.id, 'modbusTag', Number(e.target.value))}
        />
      </label>
    </div>
  );
}