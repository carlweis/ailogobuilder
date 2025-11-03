import { useMemo } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const fonts = [
  "Inter",
  "Roboto",
  "Montserrat",
  "Playfair Display",
  "Poppins",
  "Raleway",
  "Space Grotesk",
  "Work Sans",
  "Fira Sans",
  "Source Serif Pro",
];

interface FontSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FontSelect({ label, value, onChange, className }: FontSelectProps): JSX.Element {
  const options = useMemo(() => {
    if (fonts.includes(value)) {
      return fonts;
    }
    return [value, ...fonts];
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a font" />
        </SelectTrigger>
        <SelectContent>
          {options.map((font) => (
            <SelectItem key={font} value={font} className="font-medium">
              <span style={{ fontFamily: font }}>{font}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
