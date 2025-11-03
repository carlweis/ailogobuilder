import { useState, type ReactNode } from "react";
import { Download, FileType } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { exportAsPDF, exportAsPNG, exportAsSVG } from "@/lib/export";
import { useToast } from "./ui/use-toast";

interface ExportDialogProps {
  trigger: ReactNode;
  finalSvg: string | null;
  dimensions: { width: number; height: number } | null;
}

export function ExportDialog({ trigger, finalSvg, dimensions }: ExportDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState("ai-logo");
  const [scale, setScale] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const { toast } = useToast();

  const disabled = !finalSvg || !dimensions;

  const handleExport = async (format: "svg" | "png" | "pdf") => {
    if (!finalSvg || !dimensions) return;
    try {
      if (format === "svg") {
        exportAsSVG(finalSvg, filename);
      } else if (format === "png") {
        await exportAsPNG(finalSvg, { ...dimensions, scale, backgroundColor }, filename);
      } else if (format === "pdf") {
        await exportAsPDF(finalSvg, { ...dimensions, backgroundColor }, filename);
      }
      toast({
        title: "Export complete",
        description: `Saved as ${filename}.${format}`,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Logo</DialogTitle>
          <DialogDescription>Download the symbol as SVG, PNG, or PDF with custom sizing.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input id="filename" value={filename} onChange={(event) => setFilename(event.target.value)} />
          </div>
          <Tabs defaultValue="svg" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="svg">SVG</TabsTrigger>
              <TabsTrigger value="png">PNG</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
            <TabsContent value="svg" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Scalable vector graphics, perfect for editing and crisp at any size.
              </p>
              <Button onClick={() => handleExport("svg")} disabled={disabled}>
                <FileType className="mr-2 h-4 w-4" /> Save SVG
              </Button>
            </TabsContent>
            <TabsContent value="png" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <Label htmlFor="scale">Scale</Label>
                  <Input
                    id="scale"
                    type="number"
                    min={1}
                    max={8}
                    value={scale}
                    onChange={(event) => setScale(Number(event.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="png-background">Background</Label>
                  <input
                    id="png-background"
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => setBackgroundColor(event.target.value)}
                    className="h-10 w-full cursor-pointer rounded border"
                  />
                </div>
              </div>
              <Button onClick={() => handleExport("png")} disabled={disabled}>
                <Download className="mr-2 h-4 w-4" /> Save PNG
              </Button>
            </TabsContent>
            <TabsContent value="pdf" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Export a vector-friendly PDF for sharing and printing.
              </p>
              <Button onClick={() => handleExport("pdf")} disabled={disabled}>
                <Download className="mr-2 h-4 w-4" /> Save PDF
              </Button>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <span className="text-xs text-muted-foreground">
            Tip: Use higher scale for PNG exports if you need large display assets.
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
