"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import PredictionChart from "./PredictionChart";

export default function ChartSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
        <div className="prediction-chart-wrapper h-[300px] md:h-[420px]" style={{ width: "100%", position: "relative" }}>
          <PredictionChart />
        </div>
      </div>
    </section>
  );
}
