import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ControlsBar } from "@/components/ControlsBar";
import { ExportDialog } from "@/components/ExportDialog";
import { HistoryPanel } from "@/components/HistoryPanel";
import { LogoCanvas } from "@/components/LogoCanvas";
import { MockupsPreview } from "@/components/MockupsPreview";
import { PromptPanel } from "@/components/PromptPanel";
import { TextControls } from "@/components/TextControls";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastSystemProvider, useToast } from "@/components/ui/toaster";
import { generateSymbol, iterateSymbol } from "@/lib/openai";
import { wrapWithCanvas } from "@/lib/svg";
import { selectCurrentVersion, useLogoStore } from "@/store/useLogoStore";
import { ThemeProvider } from "@/theme/ThemeProvider";

function HomeContent(): JSX.Element {
  const [prompt, setPrompt] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const { toast } = useToast();

  const { symbolVersions, selectedVersionId, logoText, sloganText, canvas, actions } = useLogoStore((state) => ({
    symbolVersions: state.symbolVersions,
    selectedVersionId: state.selectedVersionId,
    logoText: state.logoText,
    sloganText: state.sloganText,
    canvas: state.canvas,
    actions: state.actions,
  }));

  const currentVersion = useLogoStore(selectCurrentVersion);

  const final = useMemo(() => {
    if (!currentVersion) return { svg: null, width: 0, height: 0 };
    try {
      return wrapWithCanvas(currentVersion.svg, logoText, sloganText, canvas);
    } catch (error) {
      console.error("Failed to compose SVG", error);
      return { svg: currentVersion.svg, width: 1024, height: 1200 };
    }
  }, [currentVersion, logoText, sloganText, canvas]);

  const handleGenerate = async () => {
    if (isBusy) return;
    if (!prompt.trim()) {
      toast({ title: "Enter a prompt", description: "Describe the symbol you want to generate." });
      return;
    }
    setIsBusy(true);
    try {
      const response = await generateSymbol(prompt.trim());
      if (!response.svg) throw new Error("No SVG returned");
      actions.addVersion({ svg: response.svg, prompt });
      toast({ title: "Symbol ready", description: "A new logo symbol has been added to your history." });
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleIterate = async () => {
    if (isBusy) return;
    if (!prompt.trim() || !currentVersion) {
      toast({ title: "Add prompt", description: "Enter a new prompt to iterate on the current symbol." });
      return;
    }
    setIsBusy(true);
    try {
      const response = await iterateSymbol(prompt.trim(), currentVersion.svg);
      if (!response.svg) throw new Error("No SVG returned");
      actions.addVersion({ svg: response.svg, prompt });
      toast({ title: "Iteration ready", description: "The symbol has been iterated with your prompt." });
    } catch (error) {
      console.error(error);
      toast({
        title: "Iteration failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const sidebar = (
    <Tabs defaultValue="prompt" className="flex h-full flex-1 flex-col">
      <TabsList className="mx-6 mt-6 grid grid-cols-3">
        <TabsTrigger value="prompt">Prompt</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-y-auto">
        <TabsContent value="prompt" className="mt-0">
          <PromptPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            onIterate={handleIterate}
            isBusy={isBusy}
            canIterate={Boolean(currentVersion)}
          />
        </TabsContent>
        <TabsContent value="text" className="mt-0">
          <TextControls
            logoText={logoText}
            sloganText={sloganText}
            onLogoChange={actions.updateLogoText}
            onSloganChange={actions.updateSloganText}
          />
        </TabsContent>
        <TabsContent value="history" className="mt-0">
          <HistoryPanel
            versions={symbolVersions}
            selectedId={selectedVersionId}
            onSelect={actions.selectVersion}
            onDelete={actions.removeVersion}
          />
        </TabsContent>
      </div>
    </Tabs>
  );

  const exportTrigger = (
    <ExportDialog
      trigger={
        <Button variant="secondary" className="font-medium" disabled={!final.svg}>
          Export
        </Button>
      }
      finalSvg={final.svg}
      dimensions={final.svg ? { width: final.width, height: final.height } : null}
    />
  );

  return (
    <AppShell
      sidebar={sidebar}
      header={<TopBar onPrint={() => window.print()} exportTrigger={exportTrigger} />}
      toolbar={
        <ControlsBar
          canvas={canvas}
          onChange={actions.updateCanvas}
          onReset={() => {
            actions.resetAll();
            setPrompt("");
          }}
        />
      }
    >
      <div className="flex h-full w-full flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <LogoCanvas
            svg={final.svg}
            zoom={canvas.zoom}
            showGrid={canvas.showGrid}
            transparent={canvas.transparentBackground}
            backgroundColor={canvas.backgroundColor}
          />
        </div>
        <div className="hidden xl:flex print:hidden">
          <MockupsPreview finalSvg={final.svg} />
        </div>
      </div>
    </AppShell>
  );
}

export default function Home(): JSX.Element {
  return (
    <ThemeProvider>
      <ToastSystemProvider>
        <HomeContent />
      </ToastSystemProvider>
    </ThemeProvider>
  );
}
