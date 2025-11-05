import { useEffect, useState } from "react";

export default function useTheme() {
  type Theme = "light" | "dark" | "system";
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "system");

  useEffect(() => {
    const root = window.document.documentElement;
    const apply = (t: Theme) => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = t === "dark" || (t === "system" && systemDark);
      root.classList.remove("dark");
      if (isDark) root.classList.add("dark");
      root.setAttribute("data-theme", isDark ? "dark" : "light");
    };
    apply(theme);
    localStorage.setItem("theme", theme);

    // Keep in sync with OS changes when on system
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => theme === "system" && apply("system");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  return { theme, setTheme } as const;
}