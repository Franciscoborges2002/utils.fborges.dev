/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function JSONPrettifyTool() {
    const [left, setLeft] = useState<string>(
        `{"hello":"world","items":[1,2,3]}`
    );
    const [right, setRight] = useState<string>("{}");
    const [errLeft, setErrLeft] = useState<string>("");
    const [errRight, setErrRight] = useState<string>("");

    // initialize pretty on mount
    useEffect(() => {
        try {
            const parsed = JSON.parse(left);
            setRight(JSON.stringify(parsed, null, 2));
            setErrLeft("");
        } catch (e: any) {
            setErrLeft(e.message);
        }
    }, []);

    const onLeftChange = (val: string) => {
        setLeft(val);
        try {
            const parsed = JSON.parse(val);
            setRight(JSON.stringify(parsed, null, 2));
            setErrLeft("");
        } catch (e: any) {
            setErrLeft(e.message);
        }
    };

    const onRightChange = (val: string) => {
        setRight(val);
        try {
            const parsed = JSON.parse(val);
            // reflect edits from pretty → left (minified so you can see the difference)
            setLeft(JSON.stringify(parsed));
            setErrRight("");
        } catch (e: any) {
            setErrRight(e.message);
        }
    };

    const prettifyBoth = () => {
        try {
            const parsed = JSON.parse(left);
            const pretty = JSON.stringify(parsed, null, 2);
            setLeft(pretty);
            setRight(pretty);
            setErrLeft("");
            setErrRight("");
        } catch (e: any) {
            setErrLeft(e.message);
        }
    };

    const minifyBoth = () => {
        try {
            const parsed = JSON.parse(right);
            const mini = JSON.stringify(parsed);
            setLeft(mini);
            setRight(mini);
            setErrLeft("");
            setErrRight("");
        } catch (e: any) {
            setErrRight(e.message);
        }
    };

    const copyLeft = async () => navigator.clipboard.writeText(left);
    const copyRight = async () => navigator.clipboard.writeText(right);

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>JSON Prettify</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
                {/* Left: raw/minified */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="json-input">Input (raw / minified)</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={copyLeft}>
                                Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={prettifyBoth}>
                                Prettify
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        id="json-input"
                        value={left}
                        onChange={(e) => onLeftChange(e.target.value)}
                        spellCheck={false}
                        className="min-h-[360px] font-mono text-sm"
                    />
                    {errLeft && <p className="text-xs text-red-500">{errLeft}</p>}
                </div>

                {/* Right: pretty */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="json-pretty">Pretty</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={copyRight}>
                                Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={minifyBoth}>
                                Minify
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        id="json-pretty"
                        value={right}
                        onChange={(e) => onRightChange(e.target.value)}
                        spellCheck={false}
                        className="min-h-[360px] font-mono text-sm"
                    />
                    {errRight && <p className="text-xs text-red-500">{errRight}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
