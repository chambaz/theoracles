"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-8 h-[1.15rem]" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-1.5">
      <Sun className={`h-3.5 w-3.5 transition-opacity ${isDark ? "opacity-40" : "opacity-100"}`} />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      />
      <Moon className={`h-3.5 w-3.5 transition-opacity ${isDark ? "opacity-100" : "opacity-40"}`} />
    </div>
  );
}
