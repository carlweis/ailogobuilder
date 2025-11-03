import type { ReactNode } from "react";
import { Github, MoonStar, Printer, SunMedium } from "lucide-react";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Separator } from "./ui/separator";
import { useTheme } from "@/theme/ThemeProvider";

interface TopBarProps {
  onPrint: () => void;
  exportTrigger: ReactNode;
}

export function TopBar({ onPrint, exportTrigger }: TopBarProps): JSX.Element {
  const { theme, toggle } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="text-lg font-bold">AI</span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight">AI Logo Builder</span>
          <span className="text-xs text-muted-foreground">Craft intelligent brand marks at lightning speed</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>{theme === "dark" ? "Switch to light" : "Switch to dark"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onPrint} aria-label="Print">
                <Printer className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Print canvas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator orientation="vertical" className="mx-2 h-6" />
        {exportTrigger}
        <a
          href="https://github.com/your-org/ai-logo-builder"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <Github className="h-4 w-4" /> Repo
        </a>
      </div>
    </header>
  );
}
