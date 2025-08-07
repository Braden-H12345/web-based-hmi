"use client";
import { ChangeEvent } from "react";
import { CanvasItem } from "@/app/editor/types";

interface PropsPanelProps {
  item: CanvasItem;
  onChange: (id: number, key: keyof CanvasItem, value: any) => void;
  onDelete?: () => void;
}
export default function PropertiesPanel({ item, onChange, onDelete }: PropsPanelProps) {
  return (
    <div className="w-64 p-4 border-l">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Properties</h2>
        <button
          className="text-red-500 hover:text-red-700 font-bold"
          onClick={() => onDelete?.()}
        >
          Delete
        </button>
</div>
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