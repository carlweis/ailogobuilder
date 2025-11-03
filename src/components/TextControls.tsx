import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { AlignCenter, AlignLeft, AlignRight, CaseLower, CaseSensitive, CaseUpper } from "lucide-react";

import { ColorPicker } from "./ColorPicker";
import { FontSelect } from "./FontSelect";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import type { TextLayer } from "@/store/useLogoStore";

interface TextControlsProps {
  logoText: TextLayer;
  sloganText: TextLayer;
  onLogoChange: (changes: Partial<TextLayer>) => void;
  onSloganChange: (changes: Partial<TextLayer>) => void;
}

const caseOptions: Array<{ label: string; value: TextLayer["case"]; icon: ReactNode }> = [
  { label: "Normal", value: "normal", icon: <CaseSensitive className="h-4 w-4" /> },
  { label: "Upper", value: "uppercase", icon: <CaseUpper className="h-4 w-4" /> },
  { label: "Lower", value: "lowercase", icon: <CaseLower className="h-4 w-4" /> },
];

const alignOptions: Array<{ label: string; value: TextLayer["align"]; icon: ReactNode }> = [
  { label: "Left", value: "left", icon: <AlignLeft className="h-4 w-4" /> },
  { label: "Center", value: "center", icon: <AlignCenter className="h-4 w-4" /> },
  { label: "Right", value: "right", icon: <AlignRight className="h-4 w-4" /> },
];

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-3 rounded-xl border border-border/60 bg-background/80 p-4">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
    {children}
  </div>
);

function TextLayerControls({
  label,
  layer,
  onChange,
}: {
  label: string;
  layer: TextLayer;
  onChange: (changes: Partial<TextLayer>) => void;
}): JSX.Element {
  const [outlineEnabled, setOutlineEnabled] = useState(Boolean(layer.outline));
  const [shadowEnabled, setShadowEnabled] = useState(Boolean(layer.shadow));

  useEffect(() => {
    setOutlineEnabled(Boolean(layer.outline));
  }, [layer.outline]);

  useEffect(() => {
    setShadowEnabled(Boolean(layer.shadow));
  }, [layer.shadow]);

  return (
    <Section title={label}>
      <div className="space-y-4">
        <Input
          value={layer.text}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({ text: event.target.value })}
          placeholder="Enter text"
          className="h-10"
        />
        <FontSelect label="Font" value={layer.font} onChange={(value) => onChange({ font: value })} />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <Label>Size</Label>
            <Slider
              value={[layer.size]}
              min={12}
              max={160}
              step={1}
              onValueChange={(value: number[]) => onChange({ size: value[0]! })}
            />
          </div>
          <div className="space-y-2">
            <Label>Weight</Label>
            <Input
              type="number"
              value={layer.weight}
              min={100}
              max={900}
              step={50}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({ weight: Number(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Letter Spacing</Label>
            <Slider
              value={[layer.letterSpacing]}
              min={-10}
              max={20}
              step={0.5}
              onValueChange={(value: number[]) => onChange({ letterSpacing: Number(value[0]) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Line Height</Label>
            <Slider
              value={[layer.lineHeight]}
              min={0.8}
              max={2}
              step={0.05}
              onValueChange={(value: number[]) => onChange({ lineHeight: Number(value[0]) })}
            />
          </div>
        </div>
        <ColorPicker label="Color" value={layer.color} onChange={(color) => onChange({ color })} />
        <div className="flex flex-wrap gap-2">
          {caseOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={layer.case === option.value ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onChange({ case: option.value })}
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {alignOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={layer.align === option.value ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onChange({ align: option.value })}
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="outline">
            <AccordionTrigger className="text-sm font-medium">
              Outline
              <Switch
                checked={outlineEnabled}
                onCheckedChange={(checked: boolean) => {
                  setOutlineEnabled(Boolean(checked));
                  onChange({ outline: checked ? layer.outline ?? { width: 4, color: layer.color } : undefined });
                }}
                className="ml-auto"
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-sm">
                  <Label>Width</Label>
                  <Input
                    type="number"
                    value={layer.outline?.width ?? 4}
                    min={1}
                    max={20}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      onChange({
                        outline: {
                          width: Number(event.target.value),
                          color: layer.outline?.color ?? layer.color,
                        },
                      })
                    }
                  />
                </div>
                <ColorPicker
                  label="Outline"
                  value={layer.outline?.color ?? layer.color}
                  onChange={(color) =>
                    onChange({
                      outline: {
                        width: layer.outline?.width ?? 4,
                        color,
                      },
                    })
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shadow">
            <AccordionTrigger className="text-sm font-medium">
              Shadow
              <Switch
                checked={shadowEnabled}
                onCheckedChange={(checked: boolean) => {
                  setShadowEnabled(Boolean(checked));
                  onChange({
                    shadow: checked
                      ? layer.shadow ?? { x: 4, y: 4, blur: 8, color: "#0f172a" }
                      : undefined,
                  });
                }}
                className="ml-auto"
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label>Offset X</Label>
                  <Input
                    type="number"
                    value={layer.shadow?.x ?? 4}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      onChange({
                        shadow: {
                          x: Number(event.target.value),
                          y: layer.shadow?.y ?? 4,
                          blur: layer.shadow?.blur ?? 8,
                          color: layer.shadow?.color ?? "#0f172a",
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Offset Y</Label>
                  <Input
                    type="number"
                    value={layer.shadow?.y ?? 4}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      onChange({
                        shadow: {
                          x: layer.shadow?.x ?? 4,
                          y: Number(event.target.value),
                          blur: layer.shadow?.blur ?? 8,
                          color: layer.shadow?.color ?? "#0f172a",
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Blur</Label>
                  <Input
                    type="number"
                    value={layer.shadow?.blur ?? 8}
                    min={0}
                    max={50}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      onChange({
                        shadow: {
                          x: layer.shadow?.x ?? 4,
                          y: layer.shadow?.y ?? 4,
                          blur: Number(event.target.value),
                          color: layer.shadow?.color ?? "#0f172a",
                        },
                      })
                    }
                  />
                </div>
                <ColorPicker
                  label="Shadow"
                  value={layer.shadow?.color ?? "#0f172a"}
                  onChange={(color) =>
                    onChange({
                      shadow: {
                        x: layer.shadow?.x ?? 4,
                        y: layer.shadow?.y ?? 4,
                        blur: layer.shadow?.blur ?? 8,
                        color,
                      },
                    })
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  );
}

export function TextControls({ logoText, sloganText, onLogoChange, onSloganChange }: TextControlsProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
      <TextLayerControls label="Logo Text" layer={logoText} onChange={onLogoChange} />
      <TextLayerControls label="Slogan" layer={sloganText} onChange={onSloganChange} />
    </div>
  );
}
