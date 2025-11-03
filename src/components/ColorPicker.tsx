import { useEffect, useState, type ChangeEvent } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Palette } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const presetSwatches = [
  "#111827",
  "#1f2937",
  "#3b82f6",
  "#0ea5e9",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#facc15",
  "#9333ea",
  "#ec4899",
];

export function ColorPicker({ label, value, onChange, className }: ColorPickerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const commit = (color: string) => {
    onChange(color);
    setTempValue(color);
    setOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setTempValue(next);
    onChange(next);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-lg">
              <span className="sr-only">Pick color</span>
              <span className="inline-flex size-7 rounded-md border shadow-inner" style={{ backgroundColor: value }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 space-y-4 rounded-lg border bg-popover p-4 shadow-lg" align="start">
            <div className="flex flex-wrap gap-2">
              {presetSwatches.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  className={cn(
                    "size-8 rounded-md border shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    swatch === value && "ring-2 ring-ring",
                  )}
                  style={{ backgroundColor: swatch }}
                  onClick={() => commit(swatch)}
                >
                  <span className="sr-only">{swatch}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <Label htmlFor={`${label}-hex`} className="col-span-1 flex items-center gap-1">
                <Palette className="size-3" /> HEX
              </Label>
              <Input
                id={`${label}-hex`}
                value={tempValue}
                onChange={handleInputChange}
                className="col-span-2 h-8"
                placeholder="#111827"
              />
              <Label htmlFor={`${label}-picker`} className="col-span-1 self-center">
                Picker
              </Label>
              <Input
                id={`${label}-picker`}
                type="color"
                value={tempValue}
                onChange={(event) => commit(event.target.value)}
                className="col-span-2 h-8 p-1"
              />
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex-1">
          <Input value={value} onChange={handleInputChange} className="h-10" />
        </div>
      </div>
    </div>
  );
}
