/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

/** ---------- Color helpers ---------- */

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

function clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
}

function isRGB(o: any): o is RGB {
    return (
        o &&
        Number.isFinite(o.r) &&
        Number.isFinite(o.g) &&
        Number.isFinite(o.b) &&
        o.r >= 0 &&
        o.g >= 0 &&
        o.b >= 0
    );
}

function rgbToHex({ r, g, b }: RGB) {
    const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToRgb(hex: string): RGB | null {
    const s = hex.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(s)) return null;
    const full = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return { r, g, b };
}

function rgbToHsl({ r, g, b }: RGB): HSL {
    const R = clamp(r, 0, 255) / 255;
    const G = clamp(g, 0, 255) / 255;
    const B = clamp(b, 0, 255) / 255;

    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
        switch (max) {
            case R:
                h = ((G - B) / d) % 6;
                break;
            case G:
                h = (B - R) / d + 2;
                break;
            case B:
                h = (R - G) / d + 4;
                break;
        }
        h *= 60;
        if (h < 0) h += 360;
    }

    const l = (max + min) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return { h, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: HSL): RGB {
    const H = ((h % 360) + 360) % 360;
    const S = clamp(s, 0, 100) / 100;
    const L = clamp(l, 0, 100) / 100;

    const C = (1 - Math.abs(2 * L - 1)) * S;
    const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
    const m = L - C / 2;

    let r1 = 0, g1 = 0, b1 = 0;
    if (0 <= H && H < 60) [r1, g1, b1] = [C, X, 0];
    else if (60 <= H && H < 120) [r1, g1, b1] = [X, C, 0];
    else if (120 <= H && H < 180) [r1, g1, b1] = [0, C, X];
    else if (180 <= H && H < 240) [r1, g1, b1] = [0, X, C];
    else if (240 <= H && H < 300) [r1, g1, b1] = [X, 0, C];
    else[r1, g1, b1] = [C, 0, X];

    return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255),
    };
}

// parsers for text inputs
function parseRgbString(s: string): RGB | null {
    // Accept "255, 0, 128", "rgb(255,0,128)"
    const m = s.replace(/\s+/g, "").match(/^rgb?\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$|^(\d{1,3}),(\d{1,3}),(\d{1,3})$/i);
    const nums = m
        ? [m[1], m[2], m[3]].every(Boolean) ? [m[1], m[2], m[3]] : [m[4], m[5], m[6]]
        : null;
    if (!nums) return null;
    const [r, g, b] = nums.map((n) => Number(n));
    if ([r, g, b].some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return null;
    return { r, g, b };
}

function parseHslString(s: string): HSL | null {
    // Accept "hsl(210, 50%, 40%)" or "210,50,40" (interpreted as %, except H)
    const clean = s.replace(/\s+/g, "");
    const m = clean.match(
        /^hsl\(([-+]?\d+(\.\d+)?),([-+]?\d+(\.\d+)?)%?,([-+]?\d+(\.\d+)?)%?\)$/i
    ) || clean.match(
        /^([-+]?\d+(\.\d+)?),([-+]?\d+(\.\d+)?),([-+]?\d+(\.\d+)?)$/
    );
    if (!m) return null;

    const h = Number(m[1]);
    const sVal = Number(m[3]);
    const lVal = Number(m[5]);
    if (![h, sVal, lVal].every((n) => Number.isFinite(n))) return null;

    // If user omitted % in the second form, treat as plain numbers (0–100).
    return { h, s: clamp(sVal, 0, 100), l: clamp(lVal, 0, 100) };
}

/** ---------- Component ---------- */

export default function ColorConverterTool() {
    // single source of truth is RGB; fields mirror it
    const [rgb, setRgb] = useState<RGB>({ r: 52, g: 120, b: 246 }); // a blue
    const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
    const hex = useMemo(() => rgbToHex(rgb), [rgb]);

    const [hexField, setHexField] = useState(hex);
    const [rgbField, setRgbField] = useState(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
    const [hslField, setHslField] = useState(`${Math.round(hsl.h)}, ${Math.round(hsl.s)}, ${Math.round(hsl.l)}`);

    const [errHex, setErrHex] = useState("");
    const [errRgb, setErrRgb] = useState("");
    const [errHsl, setErrHsl] = useState("");

    // Keep fields in sync when rgb changes (from any input)
    useEffect(() => {
        const h = rgbToHsl(rgb);
        setHexField(rgbToHex(rgb));
        setRgbField(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
        setHslField(`${Math.round(h.h)}, ${Math.round(h.s)}, ${Math.round(h.l)}`);
    }, [rgb]);

    // handlers
    const onHexChange = (v: string) => {
        setHexField(v);
        const parsed = hexToRgb(v);
        if (parsed) {
            setErrHex("");
            setRgb(parsed);
        } else {
            setErrHex("Invalid HEX (#RGB or #RRGGBB).");
        }
    };

    const onRgbChange = (v: string) => {
        setRgbField(v);
        const parsed = parseRgbString(v);
        if (parsed && isRGB(parsed)) {
            setErrRgb("");
            setRgb(parsed);
        } else {
            setErrRgb("Invalid RGB. Try “255, 0, 128” or “rgb(255,0,128)”.");
        }
    };

    const onHslChange = (v: string) => {
        setHslField(v);
        const parsed = parseHslString(v);
        if (parsed) {
            setErrHsl("");
            setRgb(hslToRgb(parsed));
        } else {
            setErrHsl("Invalid HSL. Try “hsl(210,50%,40%)” or “210,50,40”.");
        }
    };

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // ignore
        }
    };

    const swatchStyle = {
        backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    } as React.CSSProperties;

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🎨 Color Converter & Preview
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-[1fr_1fr]">
                {/* Inputs */}
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="hex">HEX</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hex"
                                value={hexField}
                                onChange={(e: any) => onHexChange(e.target.value)}
                                placeholder="#3478F6"
                                className="font-mono"
                            />
                            <Button variant="secondary" onClick={() => copy(hexField)}>
                                Copy
                            </Button>
                        </div>
                        {errHex && <p className="text-xs text-red-500">{errHex}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rgb">RGB</Label>
                        <div className="flex gap-2">
                            <Input
                                id="rgb"
                                value={rgbField}
                                onChange={(e: any) => onRgbChange(e.target.value)}
                                placeholder="255, 0, 128 or rgb(255,0,128)"
                                className="font-mono"
                            />
                            <Button variant="secondary" onClick={() => copy(rgbField)}>
                                Copy
                            </Button>
                        </div>
                        {errRgb && <p className="text-xs text-red-500">{errRgb}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hsl">HSL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hsl"
                                value={hslField}
                                onChange={(e: any) => onHslChange(e.target.value)}
                                placeholder="hsl(210, 50%, 40%) or 210,50,40"
                                className="font-mono"
                            />
                            <Button variant="secondary" onClick={() => copy(hslField)}>
                                Copy
                            </Button>
                        </div>
                        {errHsl && <p className="text-xs text-red-500">{errHsl}</p>}
                    </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    <div className="rounded-xl border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Preview</div>
                            <div className="text-xs text-muted-foreground">
                                rgb({rgb.r}, {rgb.g}, {rgb.b}) • {rgbToHex(rgb)}
                            </div>
                        </div>
                        <div
                            className="h-40 w-full rounded-lg border shadow-inner"
                            style={swatchStyle}
                        />
                    </div>

                    <Separator />

                    {/* Quick nudges */}
                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setRgb({
                                    r: clamp(rgb.r + 10, 0, 255),
                                    g: rgb.g,
                                    b: rgb.b,
                                })
                            }
                        >
                            R+10
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setRgb({
                                    r: rgb.r,
                                    g: clamp(rgb.g + 10, 0, 255),
                                    b: rgb.b,
                                })
                            }
                        >
                            G+10
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setRgb({
                                    r: rgb.r,
                                    g: rgb.g,
                                    b: clamp(rgb.b + 10, 0, 255),
                                })
                            }
                        >
                            B+10
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
