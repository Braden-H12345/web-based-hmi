"use client";

import { useDrag } from "react-dnd";
import { ReactNode } from "react";

interface DragWrapperProps {
  children: ReactNode;
  id: number;
  x: number;
  y: number;
  editMode: boolean;
  onMove: (id: number, x: number, y: number) => void;
}

export default function DragWrapper({ children, id, x, y, editMode, onMove }: DragWrapperProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "component",
    item: { id, x, y },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const container = document.getElementById("hmi-page-container");
        if (container) {
          const rect = container.getBoundingClientRect();
          const newX = offset.x - rect.left - 50; // half width guess
          const newY = offset.y - rect.top - 20;  // half height guess
          onMove(id, newX, newY);
        }
      }
    },
  }), [x, y, id, onMove]);

  return (
    <div
      ref={node => {
        if (editMode && node) dragRef(node);
        }}
      style={{
        position: "absolute",
        top: y,
        left: x,
        opacity: isDragging ? 0.5 : 1,
        cursor: editMode ? "move" : "default",
      }}
    >
      {children}
    </div>
  );
}