import { Monitor, Moon, Sun } from "lucide-react";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Navbar({  setTheme, version }: {/* theme, */
  /* theme: string; */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTheme: (t: any) => void;
  version: string;
}) {
  return (
    <div className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: emoji + name + desktop collapse button */}
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span role="img" aria-label="sparkles">✨</span>
          <span>utils</span>
          <Badge variant="outline" className="text-xs">{version}</Badge>
        </div>

        {/* Right: version + theme */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Change theme" className="cursor-pointer">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-40">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-muted-foreground/10"> 
                <Sun className="mr-2 h-4 w-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-muted-foreground/10">
                <Moon className="mr-2 h-4 w-4" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-muted-foreground/10">
                <Monitor className="mr-2 h-4 w-4" /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}