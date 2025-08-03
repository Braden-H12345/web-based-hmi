"use client";
import { useDrop } from "react-dnd";
import { useRef } from "react";
import { CanvasItem, DragItem, COMPONENT_SIZES } from "@/app/editor/types";

interface CanvasProps {
  items: CanvasItem[];
  setItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onDrop: (item: any, x: number, y: number) => void;
}



export default function Canvas({ items, setItems, selectedId, onSelect, onDrop }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [, dropRef] = useDrop<DragItem, void, unknown>(() => ({
    accept: "component",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvas = canvasRef.current;
      if (!offset || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const centerX = offset.x - rect.left;
      const centerY = offset.y - rect.top;
      const size = COMPONENT_SIZES[item.type];
      // center
      const x = centerX - size.w / 2;
      const y = centerY - size.h / 2;
      onDrop(item, x, y);
    },
  }));

  dropRef(canvasRef);

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 m-4 border-2 border-dashed border-gray-300"
      style={{ height: "80vh" }}
      onClick={() => 
        onSelect(null)}
    >
      {items.map((item) => (
        <div
            key={item.id}
            onClick={(e) => {
                e.stopPropagation(); // Avoid deselecting due to canvas background click
                onSelect(item.id);
            }}
            style={{
                position: "absolute",
                top: item.y,
                left: item.x,
                width: COMPONENT_SIZES[item.type]?.w,
                height: COMPONENT_SIZES[item.type]?.h,
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
                border: item.id === selectedId ? "2px solid blue" : "1px solid #888",
                boxShadow: item.id === selectedId ? "0 0 4px blue" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
            }}
            >
            {item.label}
        </div>
      ))}
    </div>
  );
}
