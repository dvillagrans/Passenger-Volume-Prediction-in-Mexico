"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ModelId = "GLB-01" | "AM-438" | "VB-2712";

interface ModelContextValue {
  selectedModelId: ModelId;
  setSelectedModelId: (id: ModelId) => void;
  highlightTick: number;
  triggerChartHighlight: () => void;
}

const ModelContext = createContext<ModelContextValue | null>(null);

export function useModelContext(): ModelContextValue {
  const ctx = useContext(ModelContext);
  if (!ctx) {
    // Fallback defensivo para SSR / fuera de provider
    return {
      selectedModelId: "AM-438",
      setSelectedModelId: () => {},
      highlightTick: 0,
      triggerChartHighlight: () => {},
    };
  }
  return ctx;
}

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModelId, setSelectedModelId] = useState<ModelId>("AM-438");
  const [highlightTick, setHighlightTick] = useState(0);

  const triggerChartHighlight = useCallback(() => {
    setHighlightTick((t) => t + 1);
  }, []);

  return (
    <ModelContext.Provider
      value={{ selectedModelId, setSelectedModelId, highlightTick, triggerChartHighlight }}
    >
      {children}
    </ModelContext.Provider>
  );
}
