import * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

function b64urlDecode(s: string) {
    try {
        s = s.replace(/-/g, "+").replace(/_/g, "/");
        const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
        s += "=".repeat(pad);
        const decoded = atob(s);
        // decode UTF-8
        return decodeURIComponent(
            decoded.split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
        );
    } catch {
        return null;
    }
}

export default function JwtDecoderTool() {
    const [jwt, setJwt] = useState<string>("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldiIsImlhdCI6MTUxNjIzOTAyMn0." +
        "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"); // demo

    const parts = useMemo(() => jwt.split("."), [jwt]);

    const headerJson = useMemo(() => {
        if (parts.length < 2) return "Invalid JWT";
        const hdr = b64urlDecode(parts[0]);
        try { return JSON.stringify(JSON.parse(hdr ?? ""), null, 2); } catch { return hdr ?? "Invalid header"; }
    }, [parts]);

    const payloadJson = useMemo(() => {
        if (parts.length < 2) return "Invalid JWT";
        const pl = b64urlDecode(parts[1]);
        try { return JSON.stringify(JSON.parse(pl ?? ""), null, 2); } catch { return pl ?? "Invalid payload"; }
    }, [parts]);

    const signature = parts[2] ?? "";

    const expInfo = useMemo(() => {
        try {
            const obj = JSON.parse(payloadJson);
            if (typeof obj.exp === "number") {
                const when = new Date(obj.exp * 1000);
                const expired = Date.now() >= when.getTime();
                return `exp: ${obj.exp} → ${when.toLocaleString()} (${expired ? "expired" : "valid"})`;
            }
        } catch { /* empty */ }
        return "";
    }, [payloadJson]);

    const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); } catch { /* empty */ } };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>JWT Decoder (no network)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="jwt">JWT</Label>
                    <Textarea id="jwt" value={jwt} onChange={(e) => setJwt(e.target.value)} className="min-h-[120px] font-mono text-sm" />
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => copy(jwt)}>Copy</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Decodes header & payload locally. <strong>No signature verification.</strong>
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Header</Label>
                        <Textarea readOnly value={headerJson} className="min-h-[120px] font-mono text-sm" />
                    </div>

                    <div className="grid gap-2">
                        <Label>Payload</Label>
                        <Textarea readOnly value={payloadJson} className="min-h-[180px] font-mono text-sm" />
                        {expInfo && <p className="text-xs text-muted-foreground">{expInfo}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Signature (base64url)</Label>
                        <Textarea readOnly value={signature} className="min-h-[60px] font-mono text-sm" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
