// src/components/Editor/Sidebar.tsx
"use client";
import { DragItem } from "@/app/editor/types";
import { useDrag } from "react-dnd";

interface PaletteItemProps extends DragItem {}
export default function Sidebar() {
  const COMPONENTS: DragItem[] = [
    { type: "ToggleButton", label: "Toggle Button" },
    { type: "MomentaryButton", label: "Momentary Button" },
    { type: "Indicator", label: "Indicator" },
  ];

  return (
    <div className="w-48 bg-gray-100 p-2 border-r">
      <h2 className="text-lg font-bold mb-2">Components</h2>
      {COMPONENTS.map((comp) => (
        <PaletteItem key={comp.type} {...comp} />
      ))}
    </div>
  );
}

function PaletteItem({ type, label }: PaletteItemProps) {
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(
    () => ({ type: "component", item: { type, label }, collect: (m) => ({ isDragging: m.isDragging() }) })
  );

  return (
    <div
      ref={node => { dragRef(node); }}
      className="p-2 mb-2 border bg-white text-center cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {label}
    </div>
  );
}