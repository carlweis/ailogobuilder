import { useState } from "react";
import { Lightbulb, RefreshCcw } from "lucide-react";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";

interface PromptPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  onIterate: () => void;
  isBusy: boolean;
  canIterate: boolean;
}

const starterPrompts = [
  "Minimalist geometric fox for a fintech app",
  "Fluid wave emblem for a wellness platform",
  "Futuristic circuit blossom for AI startup",
];

export function PromptPanel({
  prompt,
  onPromptChange,
  onGenerate,
  onIterate,
  isBusy,
  canIterate,
}: PromptPanelProps): JSX.Element {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  const handleUsePrompt = (value: string) => {
    onPromptChange(value);
    setActivePrompt(value);
  };

  return (
    <section className="space-y-4 border-b border-border/60 bg-background/95 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Symbol Generator</h2>
          <p className="text-sm text-muted-foreground">Describe the logo symbol you want and iterate effortlessly.</p>
        </div>
      </div>
      <Textarea
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        placeholder="e.g. Minimalist gradient phoenix for a productivity tool"
        className="h-32 resize-none"
      />
      <div className="flex flex-wrap gap-3">
        <Button onClick={onGenerate} disabled={isBusy}>
          <Lightbulb className="mr-2 h-4 w-4" /> Generate Symbol
        </Button>
        <Button variant="outline" onClick={onIterate} disabled={!canIterate || isBusy}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Iterate on Current
        </Button>
      </div>
      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ideas">Prompt Ideas</TabsTrigger>
          <TabsTrigger value="tips">Crafting Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="ideas" className="mt-4 space-y-3 text-sm">
          {starterPrompts.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleUsePrompt(item)}
              className={cn(
                "w-full rounded-lg border border-dashed border-muted-foreground/40 bg-muted/60 px-4 py-2 text-left transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring",
                activePrompt === item && "border-primary/70 bg-primary/10 text-primary",
              )}
            >
              {item}
            </button>
          ))}
        </TabsContent>
        <TabsContent value="tips" className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>• Start with the subject and style: "geometric owl icon".</p>
          <p>• Add mood or values: "representing wisdom and agility".</p>
          <p>• Reference shape language: "circular badge, negative space".</p>
          <p>• Mention constraints: "clean lines, symmetric, balanced".</p>
        </TabsContent>
      </Tabs>
    </section>
  );
}
