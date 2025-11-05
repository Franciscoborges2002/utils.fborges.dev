import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import Navbar from "../components/navbar";
import { GROUP_ORDER, TOOLS, VERSION, type ToolKey } from "../types/types";
import SidebarNav from "../components/sidebar";
import UUIDTool from "../components/tools/generateUUID";
import ManifestTool from "../components/tools/generateManifest";
import useTheme from "../components/useTheme";
import Footer from "../components/footer";
import JSONPrettifyTool from "../components/tools/jsonPrettify";
import ColorConverterTool from "../components/tools/colorConverter";

// ---- Theme management (light / dark / system) ----
// Minimal theme controller that toggles the `class` on <html>
// Persists preference in localStorage: theme = "light" | "dark" | "system"


// ---- Tools ----


// Minimal MV3 manifest generator

export default function UtilsApp() {
    const { theme, setTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile floating panel
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
    const [tool, setTool] = useState<ToolKey>("uuidGenerator");

    const ToolView = useMemo(() => {
        switch (tool) {
            case "manifestGenerator":
                return <ManifestTool />;
            case "uuidGenerator":
                return <UUIDTool />;
            case "jsonPrettify":
                return <JSONPrettifyTool />;
            case "colorConverter":
                return <ColorConverterTool />;
            default:
                return <UUIDTool />;
        }
    }, [tool]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar
                theme={theme}
                setTheme={setTheme}
                version={VERSION}
            />

            <div className="mx-auto max-w-6xl px-4 py-6">
                {/* Responsive shell: column on mobile, row on desktop */}
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Sidebar (desktop) */}
                    <aside className="relative hidden md:block" style={{ width: sidebarCollapsed ? 72 : 240 }}>
                        <div className="sticky top-[4.25rem]">
                            <Card className="shadow-sm">
                                <CardHeader className="flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-base">{sidebarCollapsed ? "" : "Tools"}</CardTitle>
                                    <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed((v) => !v)} aria-label="Collapse sidebar">
                                        {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <SidebarNav tool={tool} setTool={setTool} collapsed={sidebarCollapsed} tools={TOOLS} groupOrder={GROUP_ORDER} />
                                </CardContent>
                            </Card>
                        </div>
                    </aside>

                    {/* Mobile: toggle button in navbar area and floating panel under it */}
                    <div className="md:hidden">
                        <Button variant="outline" size="sm" onClick={() => setSidebarOpen((s) => !s)}>
                            <Menu className="mr-2 h-4 w-4" /> Tools
                        </Button>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="fixed left-4 right-4 top-[4.25rem] z-40"
                                >
                                    <div className="rounded-xl border bg-background p-2 shadow-xl">
                                        <SidebarNav
                                            tool={tool}
                                            setTool={(t) => { setTool(t); setSidebarOpen(false); }}
                                            tools={TOOLS} 
                                            groupOrder={GROUP_ORDER}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Main content */}
                    <main className="min-w-0 flex-1 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tool}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="space-y-6"
                            >
                                {ToolView}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
            {/* Sticky-to-bottom minimal footer */}
            <Footer version={VERSION} />
        </div>
    );
}
