import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useStore } from "@/lib/store";

// Mirrors an iOS launch screen: show the brand lockup over a bare background,
// then fade to the real app once data is hydrated. MIN_VISIBLE_MS is a floor,
// not a fake delay — it keeps the splash from flickering on fast (local
// storage) hydration while still giving the brand moment room to register.
const MIN_VISIBLE_MS = 1600;
const FADE_MS = 400;

export function SplashScreen() {
  const hydrated = useStore((s) => s.hydrated);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  const ready = hydrated && minTimeElapsed;

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden={ready}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background duration-[400ms] ease-out ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionProperty: "opacity" }}
    >
      <div className="flex flex-col items-center gap-2">
        <Logo className="size-11 text-foreground" />
        <span className="font-display text-3xl font-bold tracking-tight">
          Setout
        </span>
      </div>
      <p className="max-w-md text-center font-display text-xl font-bold tracking-tight text-muted">
        Measure twice, order once.
      </p>
    </div>
  );
}
