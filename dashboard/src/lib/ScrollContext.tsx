"use client";

import { createContext, useContext, type ReactNode } from "react";
import type Lenis from "lenis";

interface ScrollContextValue {
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextValue>({ lenis: null });

export function useScrollContext() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ lenis, children }: { lenis: Lenis | null; children: ReactNode }) {
  return <ScrollContext.Provider value={{ lenis }}>{children}</ScrollContext.Provider>;
}
