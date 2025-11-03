import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AppShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  toolbar?: ReactNode;
}

export function AppShell({ sidebar, header, children, toolbar }: AppShellProps): JSX.Element {
  return (
    <div className="flex h-screen w-full flex-col bg-muted/40 text-foreground lg:flex-row print:block print:h-auto">
      <aside className="border-b border-border/60 bg-background/95 shadow-lg lg:w-[360px] lg:border-b-0 lg:border-r print:hidden">
        <div className="flex h-full w-full flex-col overflow-hidden lg:overflow-hidden">
          <div className="flex-1 overflow-y-auto">{sidebar}</div>
        </div>
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="print:hidden">{header}</div>
        {toolbar ? <div className="border-b border-border/60 bg-background px-6 py-3 print:hidden">{toolbar}</div> : null}
        <div className={cn("flex flex-1 overflow-hidden")}>{children}</div>
      </main>
    </div>
  );
}
