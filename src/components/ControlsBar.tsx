import { type ChangeEvent } from "react";
import { Minus, Plus, RefreshCw, Square, SquareDashed } from "lucide-react";

import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import type { CanvasSettings } from "@/store/useLogoStore";

interface ControlsBarProps {
  canvas: CanvasSettings;
  onChange: (updates: Partial<CanvasSettings>) => void;
  onReset: () => void;
}

export function ControlsBar({ canvas, onChange, onReset }: ControlsBarProps): JSX.Element {
  const adjustZoom = (delta: number) => {
    const next = Math.min(Math.max(canvas.zoom + delta, 0.25), 4);
    onChange({ zoom: Number(next.toFixed(2)) });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={canvas.showGrid}
            onCheckedChange={(checked: boolean) => onChange({ showGrid: Boolean(checked) })}
          />
          <Label className="flex items-center gap-1 text-sm font-medium">
            <SquareDashed className="h-4 w-4" /> Grid
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={canvas.transparentBackground}
            onCheckedChange={(checked: boolean) => onChange({ transparentBackground: Boolean(checked) })}
          />
          <Label className="flex items-center gap-1 text-sm font-medium">
            <Square className="h-4 w-4" /> Transparent
          </Label>
          {!canvas.transparentBackground ? (
            <input
              type="color"
              value={canvas.backgroundColor}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({ backgroundColor: event.target.value })}
              className="h-8 w-10 cursor-pointer rounded border border-border"
              aria-label="Background color"
            />
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1">
          <Button variant="ghost" size="icon-sm" onClick={() => adjustZoom(-0.1)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">{Math.round(canvas.zoom * 100)}%</span>
          <Button variant="ghost" size="icon-sm" onClick={() => adjustZoom(0.1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" /> Reset Canvas
        </Button>
      </div>
    </div>
  );
}
