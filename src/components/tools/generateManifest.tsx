import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { FileJson, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function ManifestTool() {
  const [fields, setFields] = useState({
    name: "My Extension",
    version: "1.0.0",
    description: "A great browser extension",
    actionDefaultPopup: "index.html",
    hostPermissions: "https://*/*",
    permissions: "storage",
    backgroundServiceWorker: "background.js",
  });

  const manifest = useMemo(() => {
    const perms = fields.permissions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const hostPerms = fields.hostPermissions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base: any = {
      manifest_version: 3,
      name: fields.name,
      version: fields.version,
      description: fields.description,
      action: {
        default_popup: fields.actionDefaultPopup || undefined,
      },
      permissions: perms.length ? perms : undefined,
      host_permissions: hostPerms.length ? hostPerms : undefined,
    };

    if (fields.backgroundServiceWorker) {
      base.background = { service_worker: fields.backgroundServiceWorker };
    }

    return JSON.stringify(base, null, 2);
  }, [fields]);

  const copy = async () => {
    await navigator.clipboard.writeText(manifest);
  };

  const onChange = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileJson className="h-5 w-5"/>Extension Manifest Generator (MV3)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={fields.name} onChange={onChange("name")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="version">Version</Label>
            <Input id="version" value={fields.version} onChange={onChange("version")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={fields.description} onChange={onChange("description")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="popup">Action default_popup</Label>
            <Input id="popup" value={fields.actionDefaultPopup} onChange={onChange("actionDefaultPopup")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bg">Background service_worker</Label>
            <Input id="bg" value={fields.backgroundServiceWorker} onChange={onChange("backgroundServiceWorker")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="permissions">Permissions (comma-separated)</Label>
            <Input id="permissions" value={fields.permissions} onChange={onChange("permissions")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="host_permissions">Host permissions (comma-separated)</Label>
            <Input id="host_permissions" value={fields.hostPermissions} onChange={onChange("hostPermissions")} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>manifest.json</Label>
            <Button variant="secondary" size="sm" onClick={copy}>
              <Copy className="mr-2 h-4 w-4"/> Copy
            </Button>
          </div>
          <Textarea value={manifest} readOnly className="min-h-[420px] font-mono text-sm" />
        </div>
      </CardContent>
    </Card>
  );
}