"use client";

import { useState } from "react";
import { PLCProvider } from "@/app/components/Context/PLCContext";
import DragWrapper from "@/app/editor/DragWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Indicator, MomentaryButton, ToggleButton } from "@/app/components/HMI-Components/import-index";

export default function TestPage() {
  const [editMode, setEditMode] = useState(false);

  // Initial items (generated)
  const [items, setItems] = useState([
    { "id": 17577443902460, "type": "Indicator", "x": 60, "y": 80, "tag": 21321, "label": "Test", "shape": "circle" },
    { "id": 17577443902461, "type": "MomentaryButton", "x": 60, "y": 160, "tag": 222, "label": "Test :)" },
    { "id": 17577443902462, "type": "ToggleButton", "x": 60, "y": 240, "tag": 33, "label": "Yeaaaa" }
  ]);

  const toggleEditMode = () => setEditMode(prev => !prev);

  // (optional) you can later persist 'items' layout via API when saving

  const pagePLCId = 55;
  const ip = "33.33.333.3";
  const port = 502;

  return (
    <DndProvider backend={HTML5Backend}>
      <PLCProvider plcId={pagePLCId}>
        <div className="hmi-page relative min-h-screen p-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
            <span className="text-sm text-gray-600">
              PLC ID: {pagePLCId} • IP: {ip} • Port: {port}
            </span>
          </div>

          <div
            id="hmi-page-container"
            className="relative w-full h-[80vh] border border-gray-300 rounded bg-gray-50 overflow-hidden"
          >

          {items.map((item) => {
            const commonProps = {
              modbusTag: item.tag,
              ...(item.label ? { label: item.label } : {}),
              ...(item.shape ? { shape: item.shape } : {}),
            };

            // EDIT MODE: draggable via DragWrapper
            if (editMode) {
              return (
                <DragWrapper
                  key={item.id}
                  id={item.id}
                  x={item.x}
                  y={item.y}
                  editMode={editMode}
                  onMove={(id, newX, newY) => {
                    setItems(prev => prev.map(i => i.id === id ? { ...i, x: newX, y: newY } : i));
                  }}
                >
                  {item.type === "ToggleButton" && <ToggleButton {...commonProps} />}
                  {item.type === "MomentaryButton" && <MomentaryButton {...commonProps} />}
                  {item.type === "Indicator" && <Indicator {...commonProps} />}
                </DragWrapper>
              );
            }

            // VIEW MODE: static absolute positioning (no DragWrapper so buttons still work)
            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: item.y,
                  left: item.x,
                }}
              >
                {item.type === "ToggleButton" && <ToggleButton {...commonProps} />}
                {item.type === "MomentaryButton" && <MomentaryButton {...commonProps} />}
                {item.type === "Indicator" && <Indicator {...commonProps} />}
              </div>
            );
          })}
  
          </div>
        </div>
      </PLCProvider>
    </DndProvider>
  );
}