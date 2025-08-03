// components/Editor/EditorToggleButton.tsx
"use client";

import { useDrag } from "react-dnd";


interface EditorToggleButtonProps {
  label?: string;
  id: number;
}
export default function EditorToggleButton({label, id }: EditorToggleButtonProps) {
  const [{ isDragging }, dragSource] = useDrag(() => ({
    type: "component",
    item: { type: "ToggleButton", id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={node => { 
            dragSource(node); 
           }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: "1px dashed gray",
        padding: "8px",
        background: "white",
        cursor: "move",
      }}
    >
      {label || "Toggle Button"}
    </div>
  );
}