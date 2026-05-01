"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import RadarWidget from "./RadarWidget";

function AnimatedCounter({
  end,
  suffix = "",
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const frames = 60;
    const step = end / frames;
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= end) {
        setValue(end);
        clearInterval(interval);
      } else setValue(parseFloat(current.toFixed(decimals)));
    }, duration / frames);
    return () => clearInterval(interval);
  }, [inView, end, decimals]);

  return (
    <span ref={ref}>
      {decimals ? value.toFixed(decimals) : value.toLocaleString("es-MX")}
      {suffix}
    </span>
  );
}

const statRows = [
  { code: "DATOS", value: 31, unit: "AÑOS HIST.", color: "var(--color-primary)" },
  { code: "FLOTAS", value: 2, unit: "AEROLÍNEAS", color: "var(--color-primary)" },
  { code: "FCAST", value: 60, unit: "MESES PROY.", color: "var(--color-amber)" },
  { code: "ACC", value: 95, unit: "% PRECISIÓN", color: "var(--color-amber)" },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="grid grid-cols-1 lg:grid-cols-[1fr_380px]"
      style={{
        gap: 0,
        minHeight: "100vh",
        padding: "80px 16px 48px",
        alignItems: "center",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* COLUMNA IZQUIERDA: contenido principal */}
      <div className="lg:pr-12" style={{ paddingRight: 0 }}>
        {/* Flight tag */}
        <div
          className="mb-6 lg:mb-8"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-primary)",
              padding: "3px 8px",
              border: "1px solid var(--border-normal)",
              letterSpacing: "0.12em",
              flexShrink: 0,
            }}
          >
            FLT-2023/28
          </span>
          <div
            className="hidden sm:block"
            style={{
              width: "40px",
              height: "1px",
              background: "var(--color-primary-dim)",
            }}
          />
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-secondary)",
              letterSpacing: "0.15em",
            }}
          >
            SERIES DE TIEMPO · ML · DGAC
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(44px, 12vw, 110px)",
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          VOLUMEN
          <br />
          DE
          <br />
          <span style={{ color: "var(--color-primary)" }}>PASAJEROS</span>
        </h1>

        {/* Subtítulo geográfico */}
        <div
          className="flex-wrap"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            color: "var(--text-secondary)",
            letterSpacing: "0.2em",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span>EN MÉXICO</span>
          <span style={{ color: "var(--text-tertiary)" }}>·</span>
          <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
            19.4363°N 99.0721°W
          </span>
        </div>

        {/* Descripción */}
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 300,
            fontSize: "15px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: "480px",
            marginBottom: "36px",
          }}
        >
          Modelos SARIMA entrenados con 31 años de registros DGAC. Proyecciones
          mensuales de Aeroméxico y Viva Aerobus hasta 2028 con intervalos de
          confianza al 95%.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row" style={{ gap: "12px" }}>
          <a
            href="#predicciones"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              padding: "10px 20px",
              background: "var(--color-primary)",
              color: "#040608",
              border: "none",
              cursor: "pointer",
              fontWeight: 400,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              borderRadius: 0,
              transition: "box-shadow 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 20px rgba(0,255,136,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
          >
            ▶ VER PROYECCIONES
          </a>
          <a
            href="#metodologia"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              padding: "10px 20px",
              background: "transparent",
              color: "var(--color-primary)",
              border: "1px solid var(--border-normal)",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              borderRadius: 0,
              transition: "border-color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-bright)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-normal)")
            }
          >
            ◈ METODOLOGÍA
          </a>
        </div>
      </div>

      {/* COLUMNA DERECHA: panel técnico */}
      <div
        className="mt-12 lg:mt-0"
        style={{
          borderLeft: "1px solid var(--border-dim)",
          paddingLeft: "24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {/* Radar */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <RadarWidget />
        </div>

        {/* Stats rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            background: "var(--border-dim)",
          }}
        >
          {statRows.map(({ code, value, unit, color }) => (
            <div
              key={code}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "var(--bg-surface)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.12em",
                  width: "48px",
                }}
              >
                {code}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "28px",
                  fontWeight: 400,
                  color,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                <AnimatedCounter end={value} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.1em",
                  textAlign: "right",
                }}
              >
                {unit}
              </span>
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          LAST UPDATE: 2022-12-31 · DGAC MÉXICO
        </div>
      </div>
    </section>
  );
}
