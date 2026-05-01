"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ScrollProvider } from "@/lib/ScrollContext";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Conecta Lenis con GSAP ScrollTrigger
    instance.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      instance.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return <ScrollProvider lenis={lenis}>{children}</ScrollProvider>;
}
