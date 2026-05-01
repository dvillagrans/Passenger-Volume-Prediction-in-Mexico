"use client";

import { type ReactNode } from "react";
import { ModelProvider } from "@/lib/ModelContext";

export default function Providers({ children }: { children: ReactNode }) {
  return <ModelProvider>{children}</ModelProvider>;
}
