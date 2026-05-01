"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const phases = [
  {
    id: "01",
    title: "Recopilación de datos",
    desc: "Registros mensuales de la DGAC sobre pasajeros nacionales e internacionales 1992–2022. Fuente oficial de aeronáutica civil.",
    tag: "DGAC · 1992–2022",
  },
  {
    id: "02",
    title: "Limpieza y normalización",
    desc: "Detección de outliers, imputación del período COVID-2020, segmentación por aerolínea y conversión a formato mensual.",
    tag: "PREPROCESSING",
  },
  {
    id: "03",
    title: "Identificación SARIMA",
    desc: "Análisis ACF/PACF, pruebas de estacionariedad (ADF, KPSS), selección óptima de parámetros (p,d,q)(P,D,Q)[12] por AIC/BIC.",
    tag: "MODEL SELECTION",
  },
  {
    id: "04",
    title: "Validación y proyección",
    desc: "Walk-forward cross-validation temporal. 60 puntos mensuales proyectados (2023–2028) con intervalos de confianza al 95%.",
    tag: "FORECAST · IC 95%",
  },
];

export default function MethodologySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".methodology-phase", {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
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
      id="metodologia"
      className="px-4 py-12 md:px-12 md:py-20"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
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
            fontSize: "clamp(36px, 5vw, 56px)",
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

      {/* Fases — paneles horizontales */}
      <div style={{ borderTop: "1px solid var(--border-dim)" }}>
        {phases.map((phase) => (
          <div
            key={phase.id}
            className="methodology-phase"
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr auto",
              alignItems: "start",
              gap: "0 32px",
              padding: "28px 0",
              borderBottom: "1px solid var(--border-dim)",
              position: "relative",
            }}
          >
            {/* Número de fase — fondo tipográfico */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "56px",
                lineHeight: 1,
                color: "var(--color-primary-glow)",
                letterSpacing: "-0.02em",
                userSelect: "none",
                paddingTop: "2px",
              }}
            >
              {phase.id}
            </div>

            {/* Contenido */}
            <div style={{ maxWidth: "640px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  letterSpacing: "0.02em",
                  margin: "0 0 10px 0",
                }}
              >
                {phase.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 300,
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {phase.desc}
              </p>
            </div>

            {/* Tag técnico */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--color-primary-dim)",
                letterSpacing: "0.12em",
                whiteSpace: "nowrap",
                paddingTop: "4px",
              }}
            >
              {phase.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
