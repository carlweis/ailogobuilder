import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";

type Alignment = "left" | "center" | "right";
type TextCase = "normal" | "uppercase" | "lowercase";

type TextEffect = {
  outline?: { width: number; color: string };
  shadow?: { x: number; y: number; blur: number; color: string };
};

export interface TextLayer extends TextEffect {
  text: string;
  font: string;
  size: number;
  weight: number;
  color: string;
  letterSpacing: number;
  lineHeight: number;
  align: Alignment;
  case: TextCase;
}

export interface CanvasSettings {
  zoom: number;
  showGrid: boolean;
  transparentBackground: boolean;
  backgroundColor: string;
}

export interface SymbolVersion {
  id: string;
  svg: string;
  prompt: string;
  createdAt: number;
}

export interface LogoState {
  symbolVersions: SymbolVersion[];
  selectedVersionId: string | null;
  logoText: TextLayer;
  sloganText: TextLayer;
  canvas: CanvasSettings;
  actions: {
    addVersion: (payload: { svg: string; prompt: string }) => void;
    selectVersion: (id: string) => void;
    removeVersion: (id: string) => void;
    updateLogoText: (updater: Partial<TextLayer>) => void;
    updateSloganText: (updater: Partial<TextLayer>) => void;
    updateCanvas: (updater: Partial<CanvasSettings>) => void;
    resetAll: () => void;
  };
}

const defaultTextLayer = (overrides?: Partial<TextLayer>): TextLayer => ({
  text: "",
  font: "Inter",
  size: 72,
  weight: 600,
  color: "#111827",
  letterSpacing: 0,
  lineHeight: 1.1,
  align: "center",
  case: "normal",
  ...overrides,
});

const createDefaultCanvas = (): CanvasSettings => ({
  zoom: 1,
  showGrid: true,
  transparentBackground: true,
  backgroundColor: "#ffffff",
});

export const useLogoStore = create<LogoState>()(
  immer<LogoState>((set) => ({
    symbolVersions: [],
    selectedVersionId: null,
    logoText: defaultTextLayer({ size: 96, weight: 700 }),
    sloganText: defaultTextLayer({ size: 36, weight: 400, color: "#4b5563" }),
    canvas: createDefaultCanvas(),
    actions: {
      addVersion: ({ svg, prompt }) =>
        set((state) => {
          const id = nanoid();
          state.symbolVersions.unshift({
            id,
            svg,
            prompt,
            createdAt: Date.now(),
          });
          state.selectedVersionId = id;
        }),
      selectVersion: (id) =>
        set((state) => {
          state.selectedVersionId = id;
        }),
      removeVersion: (id) =>
        set((state) => {
          state.symbolVersions = state.symbolVersions.filter(
            (version) => version.id !== id,
          );
          if (state.selectedVersionId === id) {
            state.selectedVersionId = state.symbolVersions[0]?.id ?? null;
          }
        }),
      updateLogoText: (updater) =>
        set((state) => {
          state.logoText = { ...state.logoText, ...updater };
        }),
      updateSloganText: (updater) =>
        set((state) => {
          state.sloganText = { ...state.sloganText, ...updater };
        }),
      updateCanvas: (updater) =>
        set((state) => {
          state.canvas = { ...state.canvas, ...updater };
        }),
      resetAll: () =>
        set((state) => {
          state.symbolVersions = [];
          state.selectedVersionId = null;
          state.logoText = defaultTextLayer({ size: 96, weight: 700 });
          state.sloganText = defaultTextLayer({ size: 36, weight: 400, color: "#4b5563" });
          state.canvas = createDefaultCanvas();
        }),
    },
  })),
);

export const selectCurrentVersion = (state: LogoState): SymbolVersion | null => {
  if (!state.selectedVersionId) return null;
  return state.symbolVersions.find((item) => item.id === state.selectedVersionId) ?? null;
};
