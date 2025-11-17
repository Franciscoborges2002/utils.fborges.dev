import { Braces, CalendarClock, FileBracesCorner, Home, PaintBucket, ShieldUser, Wand2 } from "lucide-react";

export type ToolKey = "overview" | "uuidGenerator" | "manifestGenerator" | "jsonPrettify" | "colorConverter" | "jwtDecoder" | "timestampConverter";

export type ToolMeta = {
  key: ToolKey;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string; // e.g., Generators, Converters, Config
  description: string;
};

export const TOOLS: ToolMeta[] = [
  { key: "overview", title: "Overview", icon: Home, description: "" },
  /* GENERATORS */
  { key: "jsonPrettify", title: "JSON Prettify", icon: FileBracesCorner, group: "Generators", description: "Pretty-print or minify JSON; edit both sides with instant validation.", },
  { key: "uuidGenerator", title: "UUID v4 Generator", icon: Wand2, group: "Generators", description: "Generate RFC4122-compliant random identifiers with one click.", },
  { key: "manifestGenerator", title: "Extension Manifest", icon: Braces, group: "Generators",description: "Bootstrap a Manifest V3 quickly with the fields you need.", },
  /* CONVERTERS */
  { key: "timestampConverter", title: "Timestamp Converter", icon: CalendarClock, group: "Converters", description: "Unix ↔ human time, in local or UTC.", },
  { key: "colorConverter", title: "Color Converter", icon: PaintBucket, group: "Converters", description: "HEX ⇄ RGB ⇄ HSL with a live swatch and copy buttons.", },
  /* DECODER */
  { key: "jwtDecoder", title: "JWT Decoder", icon: ShieldUser, group: "Decoder", description: "Decode JWT header & payload locally (no network).", },
];

export const GROUP_ORDER = ["Converters", "Generators", "Config", "Design", "Decoder"];

export const VERSION = "v1.0.1";