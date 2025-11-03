import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MOCKUP_CONFIG } from "@/lib/mockups";

interface MockupsPreviewProps {
  finalSvg: string | null;
}

export function MockupsPreview({ finalSvg }: MockupsPreviewProps): JSX.Element {
  const dataUrl = useMemo(() => (finalSvg ? `data:image/svg+xml,${encodeURIComponent(finalSvg)}` : null), [finalSvg]);

  return (
    <aside className="flex w-[320px] flex-col gap-4 border-l border-border/60 bg-background/80 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Icon Sizes</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {MOCKUP_CONFIG.iconSizes.map((icon) => (
            <div key={icon.id} className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <div
                className="flex items-center justify-center overflow-hidden border border-border/60 bg-muted"
                style={{
                  width: icon.size / 6,
                  height: icon.size / 6,
                  borderRadius: icon.radius ? `${icon.radius / 6}px` : undefined,
                }}
              >
                {dataUrl ? <img src={dataUrl} alt={icon.label} className="h-full w-full object-contain" /> : null}
              </div>
              <span>{icon.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">App Bar Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/60 px-4 py-3">
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-background">
              {dataUrl ? <img src={dataUrl} alt="App icon" className="h-full w-full object-contain" /> : null}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">AI Logo Builder</span>
              <span className="text-xs text-muted-foreground">Prototype App Bar</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
