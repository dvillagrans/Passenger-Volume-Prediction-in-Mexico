"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const MIN_YEAR = 1992;
const MAX_YEAR = 2028;
const RANGE = MAX_YEAR - MIN_YEAR; // 36

const models = [
  {
    id: "GLB-01",
    name: "MODELO GLOBAL",
    sub: "Mercado nacional total",
    trainStart: 1992,
    trainEnd: 2022,
    forecastEnd: 2028,
    color: "var(--color-blue)",
    hex: "#4499ff",
    order: "(1,1,1)(1,1,1)[12]",
    aic: "2847.3",
    period: "1992–2022",
    s: "12",
    fit: 82,
  },
  {
    id: "AM-438",
    name: "AEROMÉXICO",
    sub: "Líder del mercado · AM",
    trainStart: 1992,
    trainEnd: 2022,
    forecastEnd: 2028,
    color: "var(--color-amber)",
    hex: "#ffaa00",
    order: "(1,1,1)(1,1,1)[12]",
    aic: "1934.8",
    period: "1992–2022",
    s: "12",
    fit: 89,
  },
  {
    id: "VB-2712",
    name: "VIVA AEROBUS",
    sub: "Low-cost carrier · VB",
    trainStart: 2006,
    trainEnd: 2022,
    forecastEnd: 2028,
    color: "var(--color-primary)",
    hex: "#00ff88",
    order: "(1,1,1)(1,1,1)[12]",
    aic: "1756.2",
    period: "2006–2022",
    s: "12",
    fit: 91,
  },
];

const events = [
  { type: "line" as const, year: 2008.75, label: "CRISIS 2008", color: "var(--color-amber)", offsetY: 0 },
  { type: "range" as const, start: 2019.9, end: 2021.5, label: "COVID", color: "rgba(255, 50, 50, 0.08)", offsetY: 0 },
  { type: "line" as const, year: 2022.9, label: "RECUPERACIÓN", color: "var(--color-primary)", offsetY: 0 },
];

function scaleX(year: number, width: number) {
  return ((year - MIN_YEAR) / RANGE) * width;
}

export default function SARIMATimeline() {
  const [selected, setSelected] = useState(1); // AM-438 por defecto
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgWidth, setSvgWidth] = useState(800);

  const active = models[selected];

  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        setSvgWidth(svgRef.current.clientWidth);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".timeline-row", {
        opacity: 0,
        x: -16,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".train-bar", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.from(".forecast-bar", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animación del panel de detalles al cambiar selección
  useEffect(() => {
    gsap.fromTo(
      ".detail-panel",
      { opacity: 0, x: 8 },
      { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [selected]);

  const yearTicks = [];
  for (let y = MIN_YEAR; y <= MAX_YEAR; y += 2) {
    yearTicks.push(y);
  }

  const trackHeight = 140;
  const barHeight = 8;
  const barGap = 36;
  const startY = 24;

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="px-4 py-12 md:px-12 md:py-20"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
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
            CRONOLOGÍA
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(28px, 5vw, 48px)",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          LÍNEA DE TIEMPO SARIMA
        </h2>
      </div>

      {/* Layout: 3 columnas desktop, stack mobile */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px]"
        style={{ gap: "24px" }}
      >
        {/* COLUMNA IZQUIERDA: Selector */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {models.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setSelected(i)}
              className="timeline-row"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                textAlign: "left",
                padding: "12px 14px",
                background:
                  selected === i
                    ? "var(--color-primary-muted)"
                    : "transparent",
                borderLeft:
                  selected === i
                    ? `2px solid ${m.hex}`
                    : "2px solid transparent",
                color:
                  selected === i ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flex: "1",
                minWidth: "140px",
              }}
              onMouseEnter={(e) => {
                if (selected !== i) {
                  e.currentTarget.style.background = "var(--bg-elevated)";
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== i) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span
                style={{
                  display: "block",
                  color: m.color,
                  fontSize: "11px",
                  letterSpacing: "0.05em",
                  marginBottom: "2px",
                }}
              >
                {m.id}
              </span>
              <span style={{ letterSpacing: "0.02em" }}>{m.name}</span>
            </button>
          ))}
        </div>

        {/* COLUMNA CENTRAL: Gantt SVG */}
        <div
          style={{
            border: "1px solid var(--border-dim)",
            background: "var(--bg-surface)",
            padding: "16px",
            overflow: "hidden",
            position: "relative",
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

          <svg
            ref={svgRef}
            width="100%"
            height={trackHeight}
            viewBox={`0 0 ${svgWidth} ${trackHeight}`}
            preserveAspectRatio="none"
          >
            {/* Grid vertical cada 2 años */}
            {yearTicks.map((y) => {
              const x = scaleX(y, svgWidth);
              return (
                <g key={y}>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={trackHeight}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                  <text
                    x={x}
                    y={trackHeight - 4}
                    fill="var(--text-tertiary)"
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {y}
                  </text>
                </g>
              );
            })}

            {/* Eventos históricos */}
            {events.map((ev, i) => {
              if (ev.type === "line") {
                const x = scaleX(ev.year, svgWidth);
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={4}
                      x2={x}
                      y2={trackHeight - 18}
                      stroke={ev.color}
                      strokeWidth="1"
                      opacity={0.6}
                    />
                    <text
                      x={x}
                      y={14}
                      fill={ev.color}
                      fontFamily="var(--font-mono)"
                      fontSize="8"
                      textAnchor="middle"
                      opacity={0.8}
                    >
                      {ev.label}
                    </text>
                  </g>
                );
              }
              // range (COVID)
              const x1 = scaleX(ev.start, svgWidth);
              const x2 = scaleX(ev.end, svgWidth);
              return (
                <g key={i}>
                  <rect
                    x={x1}
                    y={4}
                    width={x2 - x1}
                    height={trackHeight - 22}
                    fill={ev.color}
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={14}
                    fill="rgba(255,255,255,0.4)"
                    fontFamily="var(--font-mono)"
                    fontSize="8"
                    textAnchor="middle"
                  >
                    {ev.label}
                  </text>
                </g>
              );
            })}

            {/* Barras de modelos */}
            {models.map((m, i) => {
              const y = startY + i * barGap;
              const trainX = scaleX(m.trainStart, svgWidth);
              const trainW = scaleX(m.trainEnd, svgWidth) - trainX;
              const forecastX = scaleX(m.trainEnd, svgWidth);
              const forecastW = scaleX(m.forecastEnd, svgWidth) - forecastX;

              return (
                <g key={m.id}>
                  {/* Label a la izquierda de la barra */}
                  <text
                    x={4}
                    y={y + barHeight / 2 + 3}
                    fill={m.color}
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    opacity={0.7}
                  >
                    {m.id}
                  </text>

                  {/* Barra de entrenamiento */}
                  <rect
                    className="train-bar"
                    x={trainX}
                    y={y}
                    width={trainW}
                    height={barHeight}
                    fill={m.hex}
                    opacity={0.35}
                  />

                  {/* Barra de forecast (dashed stroke) */}
                  <rect
                    className="forecast-bar"
                    x={forecastX}
                    y={y}
                    width={forecastW}
                    height={barHeight}
                    fill="none"
                    stroke={m.hex}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity={0.6}
                  />
                </g>
              );
            })}
          </svg>

          {/* Leyenda debajo del SVG */}
          <div
            className="flex-wrap"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.08em",
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "4px",
                  background: "var(--text-secondary)",
                  opacity: 0.4,
                }}
              />
              ENTRENAMIENTO
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.08em",
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "4px",
                  border: "1px dashed var(--text-secondary)",
                  opacity: 0.4,
                }}
              />
              FORECAST
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--color-amber)",
                letterSpacing: "0.08em",
              }}
            >
              <span
                style={{
                  width: "1px",
                  height: "8px",
                  background: "var(--color-amber)",
                }}
              />
              EVENTO CRÍTICO
            </span>
          </div>
        </div>

        {/* COLUMNA DERECHA: Panel de detalles */}
        <div
          className="detail-panel"
          style={{
            border: "1px solid var(--border-dim)",
            background: "var(--bg-surface)",
            padding: "20px",
            position: "relative",
          }}
        >
          {/* top accent line en color del modelo */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: active.hex,
              opacity: 0.5,
            }}
          />

          {/* Header del modelo */}
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: active.color,
                letterSpacing: "0.15em",
              }}
            >
              {active.id}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "22px",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
                margin: "4px 0 0",
              }}
            >
              {active.name}
            </h3>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.05em",
                display: "block",
                marginTop: "4px",
              }}
            >
              {active.sub}
            </span>
          </div>

          {/* Parámetros */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              background: "rgba(255,255,255,0.04)",
              marginBottom: "20px",
            }}
          >
            {[
              ["ORDEN", active.order],
              ["AIC", active.aic],
              ["PERÍODO", active.period],
              ["SEASONAL", `s=${active.s}`],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  background: "var(--bg-surface)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Gauge de ajuste */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.15em",
                }}
              >
                AJUSTE
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  color: active.color,
                  letterSpacing: "0.02em",
                }}
              >
                {active.fit}%
              </span>
            </div>
            <div
              style={{
                height: "2px",
                background: "rgba(255,255,255,0.06)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${active.fit}%`,
                  background: active.hex,
                  boxShadow: `0 0 8px ${active.hex}40`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
