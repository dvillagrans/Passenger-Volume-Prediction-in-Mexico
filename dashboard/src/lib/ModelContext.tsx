"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ModelId = "GLB-01" | "AM-438" | "VB-2712";

interface ModelContextValue {
  selectedModelId: ModelId;
  setSelectedModelId: (id: ModelId) => void;
  highlightChart: boolean;
  triggerChartHighlight: () => void;
}

const ModelContext = createContext<ModelContextValue | null>(null);

export function useModelContext() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModelContext must be used inside ModelProvider");
  return ctx;
}

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModelId, setSelectedModelId] = useState<ModelId>("AM-438");
  const [highlightChart, setHighlightChart] = useState(false);

  const triggerChartHighlight = useCallback(() => {
    setHighlightChart(true);
    setTimeout(() => setHighlightChart(false), 1500);
  }, []);

  return (
    <ModelContext.Provider
      value={{ selectedModelId, setSelectedModelId, highlightChart, triggerChartHighlight }}
    >
      {children}
    </ModelContext.Provider>
  );
}
