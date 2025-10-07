// A single source of truth for component names & shape
export const COMPONENT_NAMES = [
  "Indicator",
  "MomentaryButton",
  "ToggleButton",
  "PageChanger",
] as const;

export type ComponentKey = typeof COMPONENT_NAMES[number];

export type HMIComponentDef = {
  type: ComponentKey;
  layout?: { x: number; y: number; w: number; h: number };
  props?: Record<string, any>;
};