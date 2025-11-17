/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

function format(ts: number, tz: "local" | "utc") {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "Invalid date";
    if (tz === "utc") {
        return d.toISOString().replace("T", " ").replace("Z", " UTC");
    }
    return d.toLocaleString();
}

export default function TimestampTool() {
    const [mode, setMode] = useState<"s" | "ms">("ms");
    const [tz, setTz] = useState<"local" | "utc">("local");
    const [tsInput, setTsInput] = useState<string>(() => String(Date.now()));

    const parsedTs = useMemo(() => {
        const n = Number(tsInput.trim());
        if (!Number.isFinite(n)) return NaN;
        return mode === "ms" ? n : n * 1000;
    }, [tsInput, mode]);

    const [humanInput, setHumanInput] = useState<string>(() => format(Date.now(), "local"));

    const now = () => {
        const nowMs = Date.now();
        setTsInput(String(mode === "ms" ? nowMs : Math.floor(nowMs / 1000)));
        setHumanInput(format(nowMs, tz));
    };

    const copy = async (text: string) => {
        try { await navigator.clipboard.writeText(text); } catch { /* empty */ }
    };

    // Human → TS (try Date.parse)
    const humanToTs = () => {
        const dt = humanInput.trim();
        const t = Date.parse(dt); // accepts many formats incl. "2025-11-06 10:20:00"
        if (Number.isNaN(t)) return;
        setTsInput(String(mode === "ms" ? t : Math.floor(t / 1000)));
    };

    // TS → Human
    const tsToHuman = () => {
        if (Number.isNaN(parsedTs)) return;
        setHumanInput(format(parsedTs, tz));
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Timestamp Converter</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="ts">Unix Timestamp ({mode})</Label>
                        <div className="flex items-center gap-2">
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value as "s" | "ms")}
                                className="rounded-md border bg-background px-2 py-1 text-sm"
                            >
                                <option value="ms">milliseconds</option>
                                <option value="s">seconds</option>
                            </select>
                            <Button size="sm" variant="secondary" onClick={() => copy(tsInput)}>Copy</Button>
                        </div>
                    </div>
                    <Input
                        id="ts"
                        value={tsInput}
                        onChange={(e: any) => setTsInput(e.target.value)}
                        inputMode="numeric"
                        placeholder={mode === "ms" ? String(Date.now()) : String(Math.floor(Date.now() / 1000))}
                        className="font-mono"
                    />
                    <div className="flex gap-2">
                        <Button onClick={tsToHuman}>→ Human</Button>
                        <Button variant="outline" onClick={now}>Now</Button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="human">Human Date/Time</Label>
                        <div className="flex items-center gap-2">
                            <select
                                value={tz}
                                onChange={(e) => setTz(e.target.value as "local" | "utc")}
                                className="rounded-md border bg-background px-2 py-1 text-sm"
                            >
                                <option value="local">Local</option>
                                <option value="utc">UTC</option>
                            </select>
                            <Button size="sm" variant="secondary" onClick={() => copy(humanInput)}>Copy</Button>
                        </div>
                    </div>
                    <Input
                        id="human"
                        value={humanInput}
                        onChange={(e: any) => setHumanInput(e.target.value)}
                        className="font-mono"
                        placeholder="2025-11-06 10:20:00"
                    />
                    <div className="flex gap-2">
                        <Button onClick={humanToTs}>→ Timestamp</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
