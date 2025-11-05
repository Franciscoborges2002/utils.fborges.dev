import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Wand2, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function UUIDTool() {
  const [value, setValue] = useState<string>("");
  const make = () => setValue(crypto.randomUUID());
  useEffect(() => { make(); }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5"/>UUID v4 Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input value={value} readOnly className="font-mono"/>
          <Button variant="secondary" onClick={copy} title="Copy to clipboard"><Copy className="h-4 w-4"/></Button>
          <Button onClick={make}>Generate</Button>
        </div>
        <p className="text-sm text-muted-foreground">Uses <code>crypto.randomUUID()</code> in your browser.</p>
      </CardContent>
    </Card>
  );
}