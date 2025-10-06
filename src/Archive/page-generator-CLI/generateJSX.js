function generateJSX({ pageName, pageIp, plcId, components }) {
  // Build imports for just the components used
  const imports = new Set(components.map(c => c.type));
  const importLine = `import { ${[...imports].join(", ")} } from "@/app/components/HMI-Components/import-index";`;

  // Initial layout: simple stack top-left (tweak spacing as desired)
  const itemsLiteral = components
    .map((comp, idx) => {
      const x = 60;             // start left
      const y = 80 + idx * 80;  // stack vertically
      const shapeProp = comp.shape != null ? `, "shape": "${comp.shape}"` : "";
      const labelProp = comp.label ? `, "label": ${JSON.stringify(comp.label)}` : "";
      return `    { "id": ${Date.now()}${idx}, "type": "${comp.type}", "x": ${x}, "y": ${y}, "tag": ${comp.tag}${labelProp}${shapeProp} }`;
    })
    .join(",\n");

  // Helper to render a single component instance from item data
  const componentSwitch = `
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
                  {item.type === "Indicator" &&    <Indicator
                    modbusTag={item.tag}
                    label={item.label}
                    shape={(item.shape === "rectangle" ? "rectangle" : "circle") as Shape}
                  />}
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
                  {item.type === "Indicator" &&    <Indicator
                    modbusTag={item.tag}
                    label={item.label}
                    shape={(item.shape === "rectangle" ? "rectangle" : "circle") as Shape}
                  />}
              </div>
            );
          })}
  `;

  return `
"use client";

import { useState } from "react";
import { PLCProvider } from "@/app/components/Context/PLCContext";
import DragWrapper from "@/app/editor/DragWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
${importLine}

type Shape = "circle" | "rectangle";
type ItemType = "ToggleButton" | "MomentaryButton" | "Indicator";

interface Item {
  id: number;
  type: ItemType;
  x: number;
  y: number;
  tag: number;
  label?: string;
  shape?: Shape;
}

export default function ${pageName.replaceAll(" ", "")}() {
  const [editMode, setEditMode] = useState(false);

  // Initial items (generated)
  const [items, setItems] = useState<Item[]>([
${itemsLiteral}
  ]);

  const toggleEditMode = () => setEditMode(prev => !prev);

  // (optional) you can later persist 'items' layout via API when saving

  const pagePLCId = ${plcId};
  const ip = ${JSON.stringify(pageIp)};
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
${componentSwitch}
          </div>
        </div>
      </PLCProvider>
    </DndProvider>
  );
}
  `.trim();
}

export default generateJSX;