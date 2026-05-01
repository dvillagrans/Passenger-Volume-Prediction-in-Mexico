"use client";

import { Database, Calendar, Activity, Award } from "lucide-react";

const contextItems = [
  { icon: Database, label: "Hist. datos", val: "1992–2022", accent: "var(--color-primary)" },
  { icon: Calendar, label: "Proyección", val: "2023–2028", accent: "var(--color-blue)" },
  { icon: Activity, label: "Librería", val: "Statsmodels", accent: "var(--color-amber)" },
  { icon: Award, label: "MAPE", val: "< 5%", accent: "var(--color-primary)" },
];

const stackItems = [
  { tech: "Python 3.11", role: "Análisis y modelado", pct: 100, color: "var(--color-primary)" },
  { tech: "Statsmodels", role: "SARIMA · ajuste y forecast", pct: 90, color: "var(--color-blue)" },
  { tech: "Pandas / NumPy", role: "Manipulación de datos", pct: 95, color: "var(--color-amber)" },
  { tech: "Next.js + Recharts", role: "Dashboard interactivo", pct: 85, color: "var(--color-primary)" },
  { tech: "Framer Motion", role: "Animaciones de UI", pct: 80, color: "var(--color-blue)" },
];

export default function AboutSection() {
  return (
    <section
      id="acerca"
      style={{ padding: "80px 48px", maxWidth: "1400px", margin: "0 auto" }}
    >
      <div
        style={{
          position: "relative",
          border: "1px solid var(--border-dim)",
          background: "var(--bg-surface)",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          overflow: "hidden",
        }}
      >
        {/* decorative top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--color-amber-dim), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "320px",
            height: "320px",
            background: "var(--color-primary-muted)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        {/* Left */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "var(--color-amber-dim)",
            }}
          >
            CONTEXTO
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "32px",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              margin: "8px 0 16px",
            }}
          >
            ACERCA DEL PROYECTO
          </h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "24px",
              maxWidth: "420px",
            }}
          >
            Análisis y proyección del tráfico aéreo de México mediante modelos
            SARIMA. Tres décadas de datos incluyendo la crisis financiera de 2008,
            la pandemia COVID-2020 y la posterior recuperación del sector aviación.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              background: "var(--border-dim)",
            }}
          >
            {contextItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    background: "var(--bg-elevated)",
                  }}
                >
                  <span style={{ color: item.accent }}>
                    <Icon style={{ width: "14px", height: "14px" }} />
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                        marginTop: "2px",
                      }}
                    >
                      {item.val}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — stack */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "var(--color-primary-dim)",
            }}
          >
            STACK TÉCNICO
          </span>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {stackItems.map((t, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                      }}
                    >
                      {t.tech}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--text-tertiary)",
                        marginLeft: "8px",
                      }}
                    >
                      {t.role}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 400,
                      color: t.color,
                    }}
                  >
                    {t.pct}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "var(--text-tertiary)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${t.pct}%`,
                      background: t.color,
                      boxShadow: `0 0 6px ${t.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
