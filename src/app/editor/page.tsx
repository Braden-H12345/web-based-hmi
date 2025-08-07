"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import Sidebar from "@/app/editor/Sidebar";
import Canvas from "@/app/editor/Canvas";
import PropertiesPanel from "@/app/editor/PropertiesPanel";
import { DragItem, CanvasItem } from "@/app/editor/types";
import PageSettings from "./PageSettings";
import {useEffect } from "react";


export default function EditorPage() {

  const [pageName, setPageName] = useState("New-HMI-Page");
  const [plcIp, setPlcIp] = useState("192.168.0.100");
  const [plcId, setPlcId] = useState(1);
  const [port, setPort] = useState(502);


  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDelete = () => {
  if (selectedItem) {
    setItems((prevItems) => prevItems.filter(item => item.id !== selectedItem.id));
    setSelectedId(null);
  }
};

  const handleDrop = (item: DragItem, x: number, y: number) => {
    setItems((prev) => [...prev, { id: Date.now(), ...item, x, y }]);
  };

  const handleChange = (id: number, key: keyof CanvasItem, value: any) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };





  // Page settings change
  const handlePageChange = (
    key: "pageName" | "plcIp" | "plcId" | "port",
    value: string | number
  ) => {
    if (key === "pageName") return setPageName(value as string);
    if (key === "plcIp")   return setPlcIp(value as string);
    if (key === "plcId")   return setPlcId(value as number);
    if (key === "port")    return setPort(value as number);
  };

  const selectedItem = items.find((it) => it.id === selectedId);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedItem) {
      handleDelete();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedItem]);

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
        {selectedItem ? (
          <PropertiesPanel item={selectedItem} onChange={handleChange} onDelete={handleDelete} />
        ) : (
          <PageSettings
            pageName={pageName}
            plcIp={plcIp}
            plcId={plcId}
            port={port}
            onChange={handlePageChange}
          />
        )}
      </div>
    </DndProvider>
  );
}