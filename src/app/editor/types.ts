export const COMPONENT_SIZES = {
  ToggleButton: { w: 120, h: 40 },
  MomentaryButton: { w: 120, h: 40 },
  Indicator: { w: 120, h: 40 },
} as const;

export type ComponentType = keyof typeof COMPONENT_SIZES;

export interface DragItem {
  type: ComponentType;
  label: string;
}

export interface CanvasItem {
  id: number;
  type: ComponentType;
  label: string;
  modbusTag?: number;
  x: number;
  y: number;
}
