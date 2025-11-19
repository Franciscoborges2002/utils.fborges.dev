import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

type ResourceLink = {
    name: string;
    href: string;
    note?: string;
    badge?: string;
};

type ResourceGroup = {
    title: string;
    description: string;
    links: ResourceLink[];
};

const RESOURCE_GROUPS: ResourceGroup[] = [
    {
        title: "Design Systems & UI Kits",
        description: "Component libraries and design systems that pair nicely with React, Tailwind, and shadcn/ui.",
        links: [
            {
                name: "shadcn/ui",
                href: "https://ui.shadcn.com",
                note: "Copy-pasteable, unstyled components built on Radix.",
                badge: "Free",
            },
            {
                name: "Radix UI",
                href: "https://www.radix-ui.com",
                note: "Accessible primitives, themes, and colors for building UIs.",
                badge: "Free",
            },
            {
                name: "Material Design",
                href: "https://m3.material.io",
                note: "Official design system from Google with guidelines and components.",
                badge: "Free",
            },
        ],
    },
    {
        title: "Icons",
        description: "Consistent icon sets for interfaces, including React bindings.",
        links: [
            {
                name: "Lucide Icons",
                href: "https://lucide.dev",
                note: "Beautiful, consistent SVG icons with a great React package.",
                badge: "Free",
            },
            {
                name: "Heroicons",
                href: "https://heroicons.com",
                note: "MIT-licensed icons from the Tailwind CSS team.",
                badge: "Free",
            }
        ],
    },
    {
        title: "Colors & Typography",
        description: "Color systems and tools for building accessible palettes.",
        links: [
            {
                name: "Radix Colors",
                href: "https://www.radix-ui.com/colors",
                note: "Carefully designed, accessible color scales for UI.",
                badge: "Free",
            },
            {
                name: "Coolors",
                href: "https://coolors.co",
                note: "Quickly generate and tweak color palettes.",
                badge: "Free",
            },
            {
                name: "Google Fonts",
                href: "https://fonts.google.com",
                note: "Huge collection of web-safe fonts.",
                badge: "Free",
            }
        ],
    },
    {
        title: "Design Inspiration & Assets",
        description: "Places to explore UI patterns, inspiration, and illustrations.",
        links: [
            {
                name: "Dribbble",
                href: "https://dribbble.com",
                note: "Visual inspiration for UI, branding, and product design.",
                badge: "Free",
            },
            {
                name: "Behance",
                href: "https://www.behance.net",
                note: "Curated design portfolios and case studies.",
                badge: "Free",
            },
            {
                name: "unDraw",
                href: "https://undraw.co/illustrations",
                note: "Open-source illustrations you can customize.",
                badge: "Free",
            },
            {
                name: "LottieFiles",
                href: "https://lottiefiles.com",
                note: "Lightweight JSON animations for the web.",
                badge: "Free",
            },
        ],
    },
    {
        title: "Docs & References",
        description: "Go-to references for web fundamentals and framework docs.",
        links: [
            {
                name: "MDN Web Docs",
                href: "https://developer.mozilla.org/",
                note: "The best reference for HTML, CSS, and JavaScript.",
                badge: "Docs",
            },
            {
                name: "React Docs",
                href: "https://react.dev",
                note: "Official documentation for React.",
                badge: "Docs",
            },
            {
                name: "TypeScript Handbook",
                href: "https://www.typescriptlang.org/docs/",
                note: "Official TS docs and reference.",
                badge: "Docs",
            },
            {
                name: "Tailwind CSS Docs",
                href: "https://tailwindcss.com/docs",
                note: "Utility class reference and examples.",
                badge: "Docs",
            },
        ],
    },
    {
        title: "Performance & Frontend Tools",
        description: "Tools to debug, profile, and ship fast web apps.",
        links: [
            {
                name: "Lighthouse (Web)",
                href: "https://developer.chrome.com/docs/lighthouse/overview/",
                note: "Performance and a11y audits for your site.",
                badge: "Free",
            },
            {
                name: "Bundlephobia",
                href: "https://bundlephobia.com",
                note: "Check the size impact of npm packages.",
                badge: "Free",
            },
            {
                name: "Can I Use",
                href: "https://caniuse.com",
                note: "Browser support tables for modern features.",
                badge: "Free",
            },
        ],
    },
    {
        title: "Learning & Patterns",
        description: "Deep dives into UI, UX, and frontend architecture.",
        links: [
            {
                name: "Roadmap.sh Frontend",
                href: "https://roadmap.sh/frontend",
                note: "Learn with frontend with from 0 to hero with a wide set of tools.",
            }
        ],
    },
];

export default function ResourcesPage() {
    return (
        <div className="flex flex-col gap-5">
            <section className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Quicklinks & Resources
                </h1>
                <p className="text-sm md:text-base max-w-2xl text-muted-foreground">
                    A curated list of design, UI, and frontend resources I use often.
                    Everything here is just a click away when you’re building something
                    new.
                </p>
            </section>

            {/* Groups */}
            <section className="space-y-8">
                {RESOURCE_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h2 className="text-xs font-semibold uppercase tracking-[0.2em]">
                                    {group.title}
                                </h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {group.description}
                                </p>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                                {group.links.length} link
                                {group.links.length > 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {group.links.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className=""/* group rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left shadow-sm transition hover:border-sky-500/60 hover:bg-slate-900 */
                                >
                                    <Card className="flex flex-col p-1">
                                        <CardHeader className="flex flex-row items-center gap-2 p-1 pt-4 pl-6">
                                            <span className="text-sm font-medium">
                                                {link.name}
                                            </span>
                                            {link.badge && (
                                                <Badge className="rounded-full text-xs font-medium" variant={"outline"}>
                                                    {link.badge}
                                                </Badge>
                                            )}
                                        </CardHeader>
                                        <CardContent className="flex flex-row justify-between">
                                            {link.note && (
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {link.note}
                                                </p>
                                            )}
                                            <span className="mt-0.5 text-[11px] text-muted-foreground group-hover:text-sky-400">
                                                <ExternalLink className="w-3 h-3"  />
                                            </span>
                                        </CardContent>
                                    </Card>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
