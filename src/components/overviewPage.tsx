import * as React from "react";
import { VERSION, type ToolKey, type ToolMeta } from "../types/types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

type Props = {
    tools: ToolMeta[];
    groupOrder: string[];
    onSelectTool: (key: ToolKey) => void;
};

export default function OverviewPage({ tools, groupOrder, onSelectTool }: Props) {
    // all tools that have a group (i.e., not the overview itself)
    const grouped = React.useMemo(() => {
        const byGroup = new Map<string, ToolMeta[]>();

        for (const t of tools) {
            if (!t.group) continue; // skip ungrouped (overview etc.)
            if (!byGroup.has(t.group)) byGroup.set(t.group, []);
            byGroup.get(t.group)!.push(t);
        }

        const orderedKeys = [
            ...groupOrder.filter((g) => byGroup.has(g)),
            ...Array.from(byGroup.keys()).filter((g) => !groupOrder.includes(g)).sort(),
        ];

        return orderedKeys.map((key) => ({
            key,
            items: byGroup.get(key)!,
        }));
    }, [tools, groupOrder]);

    return (
        <div className="space-y-8">
            {/* Hero */}
            <section className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    A tiny toolbox for web developers
                </h1>
                <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                    Handpicked utilities I use every day — fast, private, and entirely in your browser.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button size="lg" variant="outline" className="cursor-pointer">
                        <a href="https://github.com/Franciscoborges2002/utils.fborges.dev">
                            Github
                        </a>
                    </Button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                    Version {VERSION} · Simple and fast to use.
                </p>
            </section>

            <Separator />

            {/* Categories & tools */}
            <section className="space-y-6">
                {grouped.map(({ key, items }) => (
                    <div key={key} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                                {key}
                            </h2>
                            <span className="text-[11px] text-muted-foreground">
                                {items.length} tool{items.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            {items.map((t) => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => onSelectTool(t.key)}
                                    className="text-left"
                                >
                                    <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">
                                        <CardContent className="flex items-start gap-3 p-4">
                                            {t.icon && (
                                                <div className="mt-1 rounded-md border bg-muted p-2">
                                                    <t.icon className="h-4 w-4" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">{t.title}</div>
                                                {t.description && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {t.description}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
