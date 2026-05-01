"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const contextRows = [
  { label: "HIST. DATOS", value: "1992–2022" },
  { label: "PROYECCIÓN", value: "2023–2028" },
  { label: "LIBRERÍA", value: "Statsmodels" },
  { label: "MAPE", value: "< 5%" },
];

const stackItems = [
  { name: "Python 3.11", desc: "Análisis y modelado", pct: 100 },
  { name: "Statsmodels", desc: "SARIMA · ajuste y forecast", pct: 90 },
  { name: "Pandas / NumPy", desc: "Manipulación de datos", pct: 95 },
  { name: "Next.js + Recharts", desc: "Dashboard interactivo", pct: 85 },
  { name: "GSAP + Lenis", desc: "Animaciones y scroll", pct: 80 },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stack-bar-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="acerca"
      className="px-4 py-12 md:px-12 md:py-20"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
    >
      <div
        className="grid-cols-1 md:grid-cols-2"
        style={{
          display: "grid",
          gap: "0 80px",
          borderTop: "1px solid var(--border-dim)",
          paddingTop: "48px",
        }}
      >
        {/* COLUMNA IZQUIERDA: contexto */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "1px",
                background: "var(--color-amber-dim)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--color-amber)",
                letterSpacing: "0.2em",
              }}
            >
              CONTEXTO
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px, 3vw, 40px)",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              margin: "0 0 20px 0",
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
              lineHeight: 1.7,
              margin: "0 0 36px 0",
              maxWidth: "480px",
            }}
          >
            Análisis y proyección del tráfico aéreo de México mediante modelos
            SARIMA. Tres décadas de datos incluyendo la crisis financiera de 2008,
            la pandemia COVID-2020 y la posterior recuperación del sector aviación.
          </p>

          {/* Metadata como tabla */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {contextRows.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--text-secondary)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: stack técnico */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
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
              STACK TÉCNICO
            </span>
          </div>

          {stackItems.map(({ name, desc, pct }) => {
            const isAmber = pct >= 95;
            const barColor = isAmber ? "var(--color-amber)" : "var(--color-primary)";
            const pctColor = isAmber ? "var(--color-amber)" : "var(--color-primary-dim)";

            return (
              <div key={name} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "6px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "var(--text-primary)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--text-secondary)",
                        letterSpacing: "0.05em",
                        marginLeft: "10px",
                      }}
                    >
                      {desc}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: pctColor,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {pct}%
                  </span>
                </div>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.06)",
                    position: "relative",
                  }}
                >
                  <div
                    className="stack-bar-fill"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${pct}%`,
                      background: barColor,
                      boxShadow: `0 0 6px ${barColor}40`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* MAPE al pie */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-secondary)",
              letterSpacing: "0.08em",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>PRECISIÓN GENERAL</span>
            <span style={{ color: "var(--color-amber)" }}>MAPE &lt; 5%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
