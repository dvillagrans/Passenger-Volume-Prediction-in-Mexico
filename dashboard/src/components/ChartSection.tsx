"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useModelContext } from "@/lib/ModelContext";
import PredictionChart from "./PredictionChart";

const MODEL_COLORS: Record<string, string> = {
  "GLB-01": "#4499ff",
  "AM-438": "#ffaa00",
  "VB-2712": "#00ff88",
};

const MODEL_NAMES: Record<string, string> = {
  "GLB-01": "MODELO GLOBAL",
  "AM-438": "AEROMÉXICO",
  "VB-2712": "VIVA AEROBUS",
};

export default function ChartSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const { selectedModelId, highlightChart } = useModelContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".prediction-chart-wrapper", {
        opacity: 0,
        scale: 0.99,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cross-filtering highlight
  useEffect(() => {
    if (!highlightChart || !chartCardRef.current) return;
    const hex = MODEL_COLORS[selectedModelId] ?? "#00ff88";
    // Pulse del borde + glow efímero
    gsap.fromTo(
      chartCardRef.current,
      { borderColor: hex, boxShadow: `0 0 24px ${hex}30` },
      {
        borderColor: "var(--border-dim)",
        boxShadow: "none",
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      },
    );
    // Indicador badge
    gsap.fromTo(
      ".crossfilter-badge",
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.1 },
    );
    gsap.to(".crossfilter-badge", {
      opacity: 0,
      y: -4,
      duration: 0.4,
      ease: "power2.in",
      delay: 1.0,
    });
  }, [highlightChart, selectedModelId]);

  return (
    <section
      ref={sectionRef}
      id="predicciones"
      className="px-4 py-12 md:px-12 md:py-20"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
    >
      {/* Header bar — instrument panel style */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.25em",
                color: "var(--color-primary-dim)",
              }}
            >
              DISPLAY · CHT-01
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "var(--border-dim)",
                minWidth: "80px",
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "32px",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            PROYECCIÓN GLOBAL 2023–2028
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
              marginTop: "6px",
              letterSpacing: "0.05em",
            }}
          >
            Pasajeros mensuales · IC 95% · Modelos SARIMA
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "16px",
                height: "2px",
                background: "var(--color-primary)",
              }}
            />
            ESPERADO
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "16px",
                height: "6px",
                background: "var(--color-primary)",
                opacity: 0.3,
              }}
            />
            IC 95%
          </span>
        </div>
      </div>

      {/* Chart card */}
      <div
        ref={chartCardRef}
        style={{
          position: "relative",
          border: "1px solid var(--border-dim)",
          background: "var(--bg-surface)",
          padding: "20px",
          overflow: "hidden",
        }}
      >
        {/* top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--color-primary-dim), transparent)",
          }}
        />

        {/* Crossfilter badge */}
        <div
          className="crossfilter-badge"
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            zIndex: 10,
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.12em",
            color: MODEL_COLORS[selectedModelId] ?? "var(--color-primary)",
            background: "rgba(4,6,8,0.9)",
            border: `1px solid ${MODEL_COLORS[selectedModelId] ?? "var(--color-primary)"}40`,
            padding: "3px 8px",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          ← SINTONIZADO: {MODEL_NAMES[selectedModelId]}
        </div>

        <div className="prediction-chart-wrapper h-[300px] md:h-[420px]" style={{ width: "100%", position: "relative" }}>
          <PredictionChart />
        </div>
      </div>
    </section>
  );
}
