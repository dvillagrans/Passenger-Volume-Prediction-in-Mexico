"use client";

import {
  Database,
  GitBranch,
  Cpu,
  BarChart2,
} from "lucide-react";

const phases = [
  {
    phase: "A1",
    icon: Database,
    accent: "var(--color-primary)",
    title: "Recopilación de datos",
    desc: "Registros mensuales de la DGAC sobre pasajeros nacionales e internacionales 1992–2022. Fuente oficial de aeronáutica civil.",
  },
  {
    phase: "A2",
    icon: GitBranch,
    accent: "var(--color-blue)",
    title: "Limpieza y normalización",
    desc: "Detección de outliers, imputación del periodo COVID-2020, segmentación por aerolínea y conversión a formato mensual.",
  },
  {
    phase: "A3",
    icon: Cpu,
    accent: "var(--color-amber)",
    title: "Identificación SARIMA",
    desc: "Análisis ACF/PACF, pruebas de estacionariedad (ADF, KPSS), selección óptima de parámetros (p,d,q)(P,D,Q)[12] por AIC/BIC.",
  },
  {
    phase: "A4",
    icon: BarChart2,
    accent: "var(--color-primary)",
    title: "Validación y proyección",
    desc: "Walk-forward cross-validation temporal. 60 puntos mensuales proyectados (2023–2028) con intervalos de confianza al 95%.",
  },
];

export default function MethodologySection() {
  return (
    <section
      id="metodologia"
      style={{ padding: "80px 48px", maxWidth: "1400px", margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "1px",
              background: "var(--color-primary-dim)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-primary)",
              letterSpacing: "0.2em",
            }}
          >
            PROCEDIMIENTO
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "48px",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          FASES DE VUELO DEL ANÁLISIS
        </h2>
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
        {phases.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.phase}
              style={{
                display: "flex",
                gap: "20px",
                background: "var(--bg-surface)",
                padding: "16px 20px",
                alignItems: "flex-start",
                transition: "background 0.15s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-primary-muted)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--bg-surface)")
              }
            >
              {/* Phase badge */}
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  width: "40px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${s.accent}40`,
                    background: `${s.accent}10`,
                    color: s.accent,
                  }}
                >
                  <Icon style={{ width: "14px", height: "14px" }} />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    color: `${s.accent}80`,
                  }}
                >
                  {s.phase}
                </span>
              </div>

              <div style={{ paddingTop: "2px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 300,
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    maxWidth: "640px",
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
