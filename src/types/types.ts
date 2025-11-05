import { Braces, FileBracesCorner, PaintBucket, Wand2 } from "lucide-react";

export type ToolKey = "uuidGenerator" | "manifestGenerator" | "jsonPrettify" | "colorConverter";

export type ToolMeta = {
  key: ToolKey;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string; // e.g., Generators, Converters, Config
};

export const TOOLS: ToolMeta[] = [
  { key: "uuidGenerator", title: "UUID v4 Generator", icon: Wand2, group: "Generators" },
  { key: "manifestGenerator", title: "Extension Manifest", icon: Braces, group: "Config" },
  { key: "jsonPrettify", title: "JSON Prettify", icon: FileBracesCorner, group: "Generators" },
  { key: "colorConverter", title: "Color Converter", icon: PaintBucket, group: "Colors" },
];

export const GROUP_ORDER = ["Converters", "Generators", "Config", "Colors"];

export const VERSION = "v1.0.0";