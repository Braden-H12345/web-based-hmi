"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import Sidebar from "@/app/OLD-EDITOR/Sidebar";
import Canvas from "@/app/OLD-EDITOR/Canvas";
import PropertiesPanel from "@/app/OLD-EDITOR/PropertiesPanel";
import { DragItem, CanvasItem } from "@/app/OLD-EDITOR/types";

export default function EditorPage() {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDrop = (item: DragItem, x: number, y: number) => {
    setItems((prev) => [...prev, { id: Date.now(), ...item, x, y }]);
  };

  const handleChange = (id: number, key: keyof CanvasItem, value: any) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };

  const selectedItem = items.find((it) => it.id === selectedId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <Sidebar />
        <Canvas
            items={items}
            setItems={setItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDrop={handleDrop}
          />
        {selectedItem && <PropertiesPanel item={selectedItem} onChange={handleChange} />}
      </div>
    </DndProvider>
  );
}