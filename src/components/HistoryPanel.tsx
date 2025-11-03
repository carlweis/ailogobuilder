import type { MouseEvent } from "react";
import { Clock, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import type { SymbolVersion } from "@/store/useLogoStore";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  versions: SymbolVersion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HistoryPanel({ versions, selectedId, onSelect, onDelete }: HistoryPanelProps): JSX.Element {
  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h2 className="text-lg font-semibold">History</h2>
          <p className="text-sm text-muted-foreground">Track every symbol variation and revert in one click.</p>
        </div>
      </div>
      <div className="mt-4 space-y-3 px-6 pb-8">
        {versions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-muted-foreground/50 bg-muted/60 p-6 text-center text-sm text-muted-foreground">
            Generated symbols will appear here with quick previews and prompts.
          </div>
        ) : (
          versions.map((version) => {
            const isActive = version.id === selectedId;
            const encoded = `data:image/svg+xml,${encodeURIComponent(version.svg)}`;
            return (
              <button
                key={version.id}
                type="button"
                onClick={() => onSelect(version.id)}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-xl border border-border/60 bg-background/70 p-3 text-left transition hover:border-primary/70 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-ring",
                  isActive && "border-primary bg-primary/10",
                )}
              >
                <div className="flex size-16 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                  {version.svg ? <img src={encoded} alt="Symbol preview" className="h-full w-full object-contain" /> : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-medium text-foreground">{version.prompt}</p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(version.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="opacity-0 transition group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(event: Event | MouseEvent) => {
                        event.preventDefault();
                        onDelete(version.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete version
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
