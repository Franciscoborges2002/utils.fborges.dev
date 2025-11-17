/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import type { ToolKey, ToolMeta } from "../types/types";
import { Input } from "./ui/input";
import { useMemo, useState } from "react";

export default function SidebarNav({
  tool,
  setTool,
  collapsed,
  tools,
  groupOrder,
}: {
  tool: ToolKey;
  setTool: (t: ToolKey) => void;
  collapsed?: boolean;
  tools: ToolMeta[];
  groupOrder: string[];
}) {
  const [q, setQ] = useState("");
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return tools.filter((t) => {
      if (!query) return true;
      const group = (t.group ?? "").toLowerCase();
      return (
        t.title.toLowerCase().includes(query) ||
        group.includes(query)
      );
    });
  }, [q, tools]);

  // Ungrouped tools (e.g. Overview)
  const pinned = useMemo(
    () => filtered.filter((t) => !t.group),
    [filtered]
  );

  // Grouped tools
  const groups = useMemo(() => {
    const byGroup = new Map<string, ToolMeta[]>();

    for (const t of filtered) {
      if (!t.group) continue;
      if (!byGroup.has(t.group)) byGroup.set(t.group, []);
      byGroup.get(t.group)!.push(t);
    }

    const orderedKeys = [
      ...groupOrder.filter((g) => byGroup.has(g)),
      ...Array.from(byGroup.keys())
        .filter((g) => !groupOrder.includes(g))
        .sort(),
    ];

    return orderedKeys.map((key) => ({ key, items: byGroup.get(key)! }));
  }, [filtered, groupOrder]);

  const flatWhenCollapsed = useMemo(
    () => [...pinned, ...groups.flatMap((g) => g.items)],
    [pinned, groups]
  );

  const toggleGroup = (key: string) =>
    setClosed((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-3">
      {/* Search only when expanded */}
      {!collapsed && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          <Input
            placeholder="Search tools…"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      )}

      <nav className="space-y-3">
        {/* Collapsed: flat list of all tools, icons only */}
        {collapsed ? (
          <div className="space-y-1">
            {flatWhenCollapsed.length === 0 && (
              <p className="px-1 text-xs text-muted-foreground">No tools found.</p>
            )}
            {flatWhenCollapsed.map((t) => (
              <SidebarItem
                key={t.key}
                title={t.title}
                icon={t.icon}
                active={tool === t.key}
                onClick={() => setTool(t.key)}
                collapsed
              />
            ))}
          </div>
        ) : (
          <>
            {/* Pinned / ungrouped tools first */}
            {pinned.length > 0 && (
              <div className="space-y-1">
                {pinned.map((t) => (
                  <SidebarItem
                    key={t.key}
                    title={t.title}
                    icon={t.icon}
                    active={tool === t.key}
                    onClick={() => setTool(t.key)}
                  />
                ))}
              </div>
            )}

            {/* Grouped tools with collapsible headers */}
            {groups.length === 0 && filtered.length === 0 && (
              <p className="px-1 text-xs text-muted-foreground">No tools found.</p>
            )}

            {groups.map(({ key, items }) => {
              const isClosed = !!closed[key];
              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(key)}
                    className="flex w-full items-center justify-between px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:opacity-80"
                    aria-expanded={!isClosed}
                    aria-controls={`group-${key}`}
                  >
                    <span className="flex items-center gap-1">
                      {isClosed ? (
                        <ChevronRight className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                      {key}
                    </span>
                    <span className="opacity-60">{items.length}</span>
                  </button>

                  {!isClosed && (
                    <div id={`group-${key}`} className="space-y-1">
                      {items.map((t) => (
                        <SidebarItem
                          key={t.key}
                          title={t.title}
                          icon={t.icon}
                          active={tool === t.key}
                          onClick={() => setTool(t.key)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </nav>
    </div>
  );
}



export function SidebarItem({
  active,
  title,
  icon: Icon,
  onClick,
  collapsed,
}: {
  active?: boolean;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  collapsed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition",
        collapsed ? "justify-center" : "",
        active
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "hover:bg-muted",
      ].join(" ")}
      title={collapsed ? title : undefined}
    >
      <Icon className="h-4 w-4" />
      {!collapsed && <span className="font-medium">{title}</span>}
    </button>
  );
}
