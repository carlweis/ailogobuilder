import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface LogoCanvasProps {
  svg: string | null;
  zoom: number;
  showGrid: boolean;
  transparent: boolean;
  backgroundColor: string;
}

export function LogoCanvas({ svg, zoom, showGrid, transparent, backgroundColor }: LogoCanvasProps): JSX.Element {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [zoom]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
    setIsPanning(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning || !pointerRef.current) return;
    setPan({ x: event.clientX - pointerRef.current.x, y: event.clientY - pointerRef.current.y });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    pointerRef.current = null;
    setIsPanning(false);
  };

  return (
    <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden bg-muted/40 print:h-screen print:bg-white">
      <div
        className={cn(
          "relative flex h-[80%] w-[80%] cursor-grab items-center justify-center rounded-2xl border border-border/60 bg-background shadow-2xl transition print:h-full print:w-full print:border-0 print:shadow-none",
          isPanning && "cursor-grabbing",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          background: transparent
            ? "transparent"
            : showGrid
            ? `${backgroundColor}`
            : backgroundColor,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-2xl print:rounded-none"
          style={{
            backgroundImage: showGrid
              ? "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)"
              : transparent
              ? "repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%, transparent 0% 50%)"
              : undefined,
            backgroundSize: showGrid ? "40px 40px" : transparent ? "20px 20px" : undefined,
            backgroundColor: transparent ? "transparent" : backgroundColor,
          }}
        >
          <div
            className="pointer-events-none flex h-full w-full items-center justify-center"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            {svg ? (
              <div
                className="flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
                role="img"
                aria-label="Logo preview"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Generate a symbol to see the preview canvas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
