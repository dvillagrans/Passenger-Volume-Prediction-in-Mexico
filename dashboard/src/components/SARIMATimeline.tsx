"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useModelContext, type ModelId } from "@/lib/ModelContext";
import { useScrollContext } from "@/lib/ScrollContext";
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, ChevronRight } from "lucide-react";

const MIN_YEAR = 1992;
const MAX_YEAR = 2028;
const RANGE = MAX_YEAR - MIN_YEAR;

const models = [
  {
    id: "GLB-01" as ModelId,
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
    csv: null,
  },
  {
    id: "AM-438" as ModelId,
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
    csv: null,
  },
  {
    id: "VB-2712" as ModelId,
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
    csv: null,
  },
];

interface TimelineEvent {
  type: "line" | "range";
  year?: number;
  start?: number;
  end?: number;
  label: string;
  color: string;
  impact: string;
  duration: string;
  icon: string;
}

const events: TimelineEvent[] = [
  {
    type: "line",
    year: 2008.75,
    label: "CRISIS 2008",
    color: "var(--color-amber)",
    impact: "Caída estimada: −12% en tráfico aéreo nacional. Recesión hipotecaria global, crédito restringido, aerolíneas reducen rutas no rentables.",
    duration: "2008–2009",
    icon: "⬇",
  },
  {
    type: "range",
    start: 2019.9,
    end: 2021.5,
    label: "COVID-19",
    color: "rgba(255, 50, 50, 0.08)",
    impact: "Colapso: −58% tráfico en 2020. Cierre de fronteras, restricciones sanitarias globales. Recuperación parcial en H2 2021 con reapertura gradual.",
    duration: "Mar 2020 – Jun 2021",
    icon: "⚠",
  },
  {
    type: "line",
    year: 2022.9,
    label: "RECUPERACIÓN",
    color: "var(--color-primary)",
    impact: "Recuperación total: +95% del tráfico pre-pandemia. Reapertura completa de fronteras, demanda acumulada impulsa crecimiento récord.",
    duration: "2022–2023",
    icon: "⬆",
  },
];

// ── Escala según viewRange ──────────────────────────────────────────────────
function scaleX(year: number, width: number, viewStart: number, viewEnd: number) {
  return ((year - viewStart) / (viewEnd - viewStart)) * width;
}

// ── Tooltip: HUD flotante ───────────────────────────────────────────────────
interface TooltipData {
  x: number;
  y: number;
  title: string;
  rows: [string, string][];
  hex: string;
}

// ── Componente principal ────────────────────────────────────────────────────
export default function SARIMATimeline() {
  const { selectedModelId, setSelectedModelId, triggerChartHighlight } = useModelContext();
  const { lenis } = useScrollContext();

  const selectedIndex = models.findIndex((m) => m.id === selectedModelId);
  const [internalSelected, setInternalSelected] = useState(selectedIndex >= 0 ? selectedIndex : 1);

  useEffect(() => {
    const idx = models.findIndex((m) => m.id === selectedModelId);
    if (idx >= 0) setInternalSelected(idx);
  }, [selectedModelId]);

  const setSelected = useCallback(
    (i: number) => {
      setInternalSelected(i);
      setSelectedModelId(models[i].id);
    },
    [setSelectedModelId],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const chartSectionRef = useRef<HTMLElement | null>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  // ── Estados ─────────────────────────────────────────────────────────────
  const [svgWidth, setSvgWidth] = useState(800);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [viewRange, setViewRange] = useState<[number, number]>([1992, 2028]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadYear, setPlayheadYear] = useState(1992);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [detailMode, setDetailMode] = useState<"model" | number>("model");
  const [glitchTick, setGlitchTick] = useState(0);

  const active = models[internalSelected];

  // ── Resize ──────────────────────────────────────────────────────────────
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

  // ── Referencia a ChartSection para scroll suave ─────────────────────────
  useEffect(() => {
    chartSectionRef.current = document.getElementById("predicciones");
  }, []);

  // ── Animaciones iniciales GSAP ──────────────────────────────────────────
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

  // ── Animación panel de detalles al cambiar selección ────────────────────
  useEffect(() => {
    if (detailPanelRef.current) {
      gsap.fromTo(
        detailPanelRef.current,
        { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [internalSelected, detailMode]);

  // ── Glitch effect ───────────────────────────────────────────────────────
  useEffect(() => {
    if (glitchTick > 0 && sectionRef.current) {
      const el = sectionRef.current.querySelector(".detail-panel-glitch") as HTMLElement;
      if (el) {
        gsap.fromTo(
          el,
          {
            clipPath: "inset(0 0 0 0)",
            x: 0,
          },
          {
            keyframes: [
              { clipPath: "inset(20% 0 70% 0)", x: -2, duration: 0.03 },
              { clipPath: "inset(60% 0 30% 0)", x: 2, duration: 0.03 },
              { clipPath: "inset(10% 0 80% 0)", x: -1, duration: 0.04 },
              { clipPath: "inset(0 0 0 0)", x: 0, duration: 0.05 },
            ],
            ease: "none",
          },
        );
      }
    }
  }, [glitchTick]);

  // ── Playback loop ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = Math.max(30, 200 / playSpeed);
    const interval = setInterval(() => {
      setPlayheadYear((prev) => {
        if (prev >= MAX_YEAR) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 0.15;
        // Actualizar barra de progreso del Navbar cada paso
        return next > MAX_YEAR ? MAX_YEAR : next;
      });
    }, stepMs);
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  // Reset playhead cuando para
  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (playheadYear >= MAX_YEAR - 0.1) setPlayheadYear(1992);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPlayheadYear(1992);
  };

  // ── Scrubber drag ───────────────────────────────────────────────────────
  const scrubTrackRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isScrubbing || !scrubTrackRef.current) return;
      const rect = scrubTrackRef.current.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      setPlayheadYear(MIN_YEAR + frac * RANGE);
    };
    const onUp = () => setIsScrubbing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isScrubbing]);

  const handleScrubDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    setIsPlaying(false);
    if (scrubTrackRef.current) {
      const rect = scrubTrackRef.current.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      setPlayheadYear(MIN_YEAR + frac * RANGE);
    }
  };

  // ── Zoom con rueda ──────────────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const [vs, ve] = viewRange;
      const span = ve - vs;
      const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
      const newSpan = Math.max(4, Math.min(RANGE, span * zoomFactor));
      // Centrar alrededor del cursor
      if (svgContainerRef.current) {
        const rect = svgContainerRef.current.getBoundingClientRect();
        const mouseFrac = (e.clientX - rect.left) / rect.width;
        const center = vs + span * mouseFrac;
        const newStart = Math.max(MIN_YEAR, center - newSpan * mouseFrac);
        const newEnd = Math.min(MAX_YEAR, newStart + newSpan);
        setViewRange([newStart, newEnd > MAX_YEAR ? MAX_YEAR : newEnd]);
      }
    },
    [viewRange],
  );

  // ── Drag / paneo ────────────────────────────────────────────────────────
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startRange: [number, number];
  }>({ active: false, startX: 0, startRange: [1992, 2028] });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { active: true, startX: e.clientX, startRange: [...viewRange] };
    if (svgContainerRef.current) svgContainerRef.current.style.cursor = "grabbing";
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      if (svgContainerRef.current) {
        const rect = svgContainerRef.current.getBoundingClientRect();
        const span = dragRef.current.startRange[1] - dragRef.current.startRange[0];
        const shift = -(dx / rect.width) * span;
        let newStart = dragRef.current.startRange[0] + shift;
        let newEnd = dragRef.current.startRange[1] + shift;
        if (newStart < MIN_YEAR) {
          newEnd = MIN_YEAR + span;
          newStart = MIN_YEAR;
        }
        if (newEnd > MAX_YEAR) {
          newStart = MAX_YEAR - span;
          newEnd = MAX_YEAR;
        }
        setViewRange([newStart, newEnd]);
      }
    };
    const onUp = () => {
      dragRef.current.active = false;
      if (svgContainerRef.current) svgContainerRef.current.style.cursor = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // ── Tooltip handlers ────────────────────────────────────────────────────
  const showTooltip = (
    e: React.MouseEvent,
    title: string,
    rows: [string, string][],
    hex: string,
  ) => {
    setTooltip({ x: e.clientX, y: e.clientY, title, rows, hex });
  };
  const hideTooltip = () => setTooltip(null);

  // ── Click en evento histórico → detalle ─────────────────────────────────
  const handleEventClick = (idx: number) => {
    setDetailMode(idx);
    // Pequeño pulso al panel
    gsap.fromTo(
      ".detail-panel-glitch",
      { borderColor: events[idx].color, boxShadow: `0 0 16px ${events[idx].color}20` },
      { borderColor: "var(--border-dim)", boxShadow: "none", duration: 0.6, ease: "power2.out" },
    );
  };

  // ── Cross-filtering: resaltar predicciones ──────────────────────────────
  const handleCrossFilter = () => {
    triggerChartHighlight();
    const target = document.getElementById("predicciones");
    if (target && lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ── Ticks ───────────────────────────────────────────────────────────────
  const [vs, ve] = viewRange;
  const vSpan = ve - vs;
  const yearTicks: number[] = [];
  const tickStep = vSpan > 20 ? 4 : vSpan > 10 ? 2 : 1;
  for (let y = Math.ceil(vs); y <= ve; y += tickStep) {
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
      {/* ── Header ──────────────────────────────────────────────────────── */}
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
            style={{ width: "24px", height: "1px", background: "var(--color-primary-dim)" }}
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

      {/* ── Layout 3 columnas ───────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px]"
        style={{ gap: "24px" }}
      >
        {/* ── COL IZQ: Selector ─────────────────────────────────────────── */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {models.map((m, i) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(i);
                setGlitchTick((p) => p + 1);
                setDetailMode("model");
              }}
              className="timeline-row"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                textAlign: "left",
                padding: "12px 14px",
                background: internalSelected === i ? "var(--color-primary-muted)" : "transparent",
                borderLeft: internalSelected === i ? `2px solid ${m.hex}` : "2px solid transparent",
                color: internalSelected === i ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flex: "1",
                minWidth: "140px",
              }}
              onMouseEnter={(e) => {
                if (internalSelected !== i) {
                  e.currentTarget.style.background = "var(--bg-elevated)";
                }
              }}
              onMouseLeave={(e) => {
                if (internalSelected !== i) {
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

        {/* ── COL CENTRAL: Gantt SVG ────────────────────────────────────── */}
        <div
          ref={svgContainerRef}
          style={{
            border: "1px solid var(--border-dim)",
            background: "var(--bg-surface)",
            padding: "16px",
            overflow: "hidden",
            position: "relative",
            cursor: viewRange[1] - viewRange[0] < RANGE ? "grab" : undefined,
            userSelect: "none",
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
        >
          {/* top accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, var(--color-primary-dim), transparent)",
            }}
          />

          {/* ═══ TACTICAL CONTROL DECK ═══════════════════════════════════ */}
          <div
            style={{
              marginBottom: "12px",
              padding: "10px",
              background: "var(--bg-elevated)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            {/* ── Row 1: Transport | Telemetry | Action ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "10px",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {/* ■ TRANSPORT CONTROL */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* Play / Pause — hardware switch */}
                <button
                  onClick={handlePlayToggle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  }}
                  style={{
                    position: "relative",
                    background: "linear-gradient(180deg, #0d1117 0%, #05070a 100%)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.3)",
                    padding: "6px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: isPlaying ? "#00ff88" : "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    transition: "border-color 0.15s",
                  }}
                >
                  {/* LED */}
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: isPlaying ? "#00ff88" : "#330000",
                      boxShadow: isPlaying
                        ? "0 0 6px #00ff88, 0 0 2px #00ff88"
                        : "inset 0 1px 2px rgba(0,0,0,0.5)",
                      animation: isPlaying ? "ledPulse 0.8s ease-in-out infinite alternate" : "none",
                    }}
                  />
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  {isPlaying ? "PAUSE" : "PLAY"}
                </button>

                {/* Reset */}
                <button
                  onClick={handleReset}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  }}
                  style={{
                    background: "linear-gradient(180deg, #0d1117 0%, #05070a 100%)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.3)",
                    padding: "6px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    transition: "border-color 0.15s",
                  }}
                >
                  <RotateCcw size={12} />
                  RESET
                </button>

                {/* Throttle */}
                <div
                  style={{
                    display: "flex",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
                    padding: "2px",
                  }}
                >
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaySpeed(s)}
                      style={{
                        background:
                          playSpeed === s
                            ? "linear-gradient(180deg, rgba(0,255,136,0.15), rgba(0,255,136,0.05))"
                            : "transparent",
                        border: playSpeed === s ? "1px solid rgba(0,255,136,0.3)" : "1px solid transparent",
                        boxShadow:
                          playSpeed === s
                            ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 6px rgba(0,255,136,0.1)"
                            : "none",
                        padding: "3px 8px",
                        cursor: "pointer",
                        color: playSpeed === s ? "#00ff88" : "var(--text-tertiary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        letterSpacing: "0.08em",
                        transition: "all 0.15s",
                      }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* ■ HUD / TELEMETRY DISPLAY */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "#020304",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "6px 16px",
                  minWidth: "140px",
                  position: "relative",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.2em",
                    marginBottom: "2px",
                  }}
                >
                  TELEMETRY
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "26px",
                    fontWeight: 400,
                    color:
                      playheadYear > 2019.9 && playheadYear < 2021.5
                        ? "#ff4444"
                        : playheadYear > 2008.5 && playheadYear < 2009.5
                        ? "var(--color-amber)"
                        : "var(--color-primary)",
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                    textShadow:
                      playheadYear > 2019.9 && playheadYear < 2021.5
                        ? "0 0 10px rgba(255,68,68,0.3)"
                        : playheadYear > 2008.5 && playheadYear < 2009.5
                        ? "0 0 10px rgba(255,170,0,0.3)"
                        : "0 0 10px rgba(0,255,136,0.2)",
                    transition: "color 0.3s, text-shadow 0.3s",
                  }}
                >
                  {playheadYear.toFixed(2)}
                </span>
              </div>

              {/* ■ ACTION — Cross-filter */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  onClick={handleCrossFilter}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = active.hex;
                    el.style.boxShadow = `0 0 16px ${active.hex}30`;
                    el.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = `${active.hex}40`;
                    el.style.boxShadow = "none";
                    el.style.color = active.color;
                  }}
                  style={{
                    background: `linear-gradient(180deg, ${active.hex}10, ${active.hex}05)`,
                    border: `1px solid ${active.hex}40`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    padding: "6px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: active.color,
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    transition: "all 0.2s",
                  }}
                >
                  <ChevronRight size={12} />
                  TARGET: CHART
                </button>

                {/* Zoom reset */}
                <button
                  onClick={() => setViewRange([1992, 2028])}
                  title="Reset zoom"
                  style={{
                    background: "linear-gradient(180deg, #0d1117 0%, #05070a 100%)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.3)",
                    padding: "6px",
                    cursor: "pointer",
                    color: "var(--text-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  }}
                >
                  <ZoomOut size={12} />
                </button>
              </div>
            </div>

            {/* ── Row 2: SCRUBBER ── */}
            <div
              ref={scrubTrackRef}
              onMouseDown={handleScrubDown}
              style={{
                position: "relative",
                height: "4px",
                background: "rgba(255,255,255,0.04)",
                cursor: isScrubbing ? "grabbing" : "grab",
                borderRadius: 0,
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {/* Fill track */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${((playheadYear - MIN_YEAR) / RANGE) * 100}%`,
                  background:
                    playheadYear > 2019.9 && playheadYear < 2021.5
                      ? "linear-gradient(90deg, #ff4444, #ff0000)"
                      : "linear-gradient(90deg, var(--color-primary), var(--color-primary-dim))",
                  boxShadow:
                    playheadYear > 2019.9 && playheadYear < 2021.5
                      ? "0 0 8px rgba(255,68,68,0.3)"
                      : "0 0 8px rgba(0,255,136,0.2)",
                  transition: "width 0.05s linear, background 0.3s",
                }}
              />
              {/* Handle */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${((playheadYear - MIN_YEAR) / RANGE) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: "10px",
                  height: "10px",
                  background: "#ffffff",
                  boxShadow: "0 0 6px rgba(255,255,255,0.4)",
                  cursor: isScrubbing ? "grabbing" : "grab",
                  transition: "left 0.05s linear",
                }}
              />
              {/* Tick marks scrubber */}
              {[1992, 2000, 2008, 2016, 2028].map((y) => (
                <div
                  key={y}
                  style={{
                    position: "absolute",
                    left: `${((y - MIN_YEAR) / RANGE) * 100}%`,
                    top: "-6px",
                    bottom: "-6px",
                    width: "1px",
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
          </div>

          <svg
            ref={svgRef}
            width="100%"
            height={trackHeight}
            viewBox={`0 0 ${svgWidth} ${trackHeight}`}
            preserveAspectRatio="none"
          >
            {/* ── Clip para playback: revela solo hasta playhead ──────── */}
            <defs>
              <clipPath id="playhead-clip">
                <rect x={0} y={0} width={scaleX(playheadYear, svgWidth, vs, ve)} height={trackHeight} />
              </clipPath>
            </defs>

            {/* Grid vertical */}
            {yearTicks.map((y) => {
              const x = scaleX(y, svgWidth, vs, ve);
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
                    fontSize="8"
                    textAnchor="middle"
                  >
                    {y}
                  </text>
                </g>
              );
            })}

            {/* Eventos históricos */}
            {events.map((ev, i) => {
              if (ev.type === "line" && ev.year != null) {
                const x = scaleX(ev.year, svgWidth, vs, ve);
                return (
                  <g
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEventClick(i)}
                    onMouseEnter={(e) =>
                      showTooltip(
                        e,
                        ev.label,
                        [
                          ["IMPACTO", ev.impact.substring(0, 40) + "…"],
                          ["DURACIÓN", ev.duration],
                        ],
                        ev.color,
                      )
                    }
                    onMouseMove={(e) =>
                      setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null))
                    }
                    onMouseLeave={hideTooltip}
                  >
                    <line
                      x1={x}
                      y1={4}
                      x2={x}
                      y2={trackHeight - 18}
                      stroke={ev.color}
                      strokeWidth="1.5"
                      opacity={0.7}
                    />
                    <text
                      x={x}
                      y={14}
                      fill={ev.color}
                      fontFamily="var(--font-mono)"
                      fontSize="8"
                      textAnchor="middle"
                      opacity={0.9}
                    >
                      {ev.icon} {ev.label}
                    </text>
                  </g>
                );
              }
              // Range
              const x1 = scaleX(ev.start!, svgWidth, vs, ve);
              const x2 = scaleX(ev.end!, svgWidth, vs, ve);
              return (
                <g
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEventClick(i)}
                  onMouseEnter={(e) =>
                    showTooltip(
                      e,
                      ev.label,
                      [
                        ["IMPACTO", ev.impact.substring(0, 40) + "…"],
                        ["DURACIÓN", ev.duration],
                      ],
                      ev.color,
                    )
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null))
                  }
                  onMouseLeave={hideTooltip}
                >
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
                    fill="rgba(255,255,255,0.45)"
                    fontFamily="var(--font-mono)"
                    fontSize="8"
                    textAnchor="middle"
                  >
                    {ev.icon} {ev.label}
                  </text>
                </g>
              );
            })}

            {/* Barras de modelos */}
            {models.map((m, i) => {
              const y = startY + i * barGap;
              const trainX = scaleX(m.trainStart, svgWidth, vs, ve);
              const trainW = scaleX(m.trainEnd, svgWidth, vs, ve) - trainX;
              const forecastX = scaleX(m.trainEnd, svgWidth, vs, ve);
              const forecastW = scaleX(m.forecastEnd, svgWidth, vs, ve) - forecastX;

              return (
                <g key={m.id}>
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

                  {/* Barra entrenamiento — interactive */}
                  <rect
                    className="train-bar"
                    x={trainX}
                    y={y}
                    width={trainW}
                    height={barHeight}
                    fill={m.hex}
                    opacity={0.35}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) =>
                      showTooltip(
                        e,
                        `${m.id} · ENTRENAMIENTO`,
                        [
                          ["PERIODO", `${m.trainStart}–${m.trainEnd}`],
                          ["AIC", m.aic],
                          ["ORDEN", m.order],
                        ],
                        m.hex,
                      )
                    }
                    onMouseMove={(e) =>
                      setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null))
                    }
                    onMouseLeave={hideTooltip}
                  />

                  {/* Barra forecast — interactive */}
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
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) =>
                      showTooltip(
                        e,
                        `${m.id} · FORECAST`,
                        [
                          ["PERIODO", `${m.trainEnd}–${m.forecastEnd}`],
                          ["AIC", m.aic],
                          ["AJUSTE", `${m.fit}%`],
                        ],
                        m.hex,
                      )
                    }
                    onMouseMove={(e) =>
                      setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null))
                    }
                    onMouseLeave={hideTooltip}
                  />

                  {/* Resaltar barra del modelo seleccionado */}
                  {internalSelected === i && (
                    <>
                      <rect
                        x={trainX - 1}
                        y={y - 2}
                        width={trainW + 2}
                        height={barHeight + 4}
                        fill="none"
                        stroke={m.hex}
                        strokeWidth="1"
                        opacity={0.5}
                        rx={0}
                      />
                      <rect
                        x={forecastX - 1}
                        y={y - 2}
                        width={forecastW + 2}
                        height={barHeight + 4}
                        fill="none"
                        stroke={m.hex}
                        strokeWidth="1"
                        opacity={0.5}
                        strokeDasharray="2 2"
                        rx={0}
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* Playhead line */}
            {isPlaying && (
              <g>
                <line
                  x1={scaleX(playheadYear, svgWidth, vs, ve)}
                  y1={0}
                  x2={scaleX(playheadYear, svgWidth, vs, ve)}
                  y2={trackHeight}
                  stroke="var(--color-amber)"
                  strokeWidth="1.5"
                  opacity={0.9}
                />
                <text
                  x={scaleX(playheadYear, svgWidth, vs, ve) + 4}
                  y={12}
                  fill="var(--color-amber)"
                  fontFamily="var(--font-mono)"
                  fontSize="9"
                  opacity={0.9}
                >
                  {playheadYear.toFixed(1)}
                </text>
              </g>
            )}
          </svg>

          {/* ── Leyenda ─────────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              flexWrap: "wrap",
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
              <span style={{ width: "12px", height: "4px", background: "var(--text-secondary)", opacity: 0.4 }} />
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
              <span style={{ width: "1px", height: "8px", background: "var(--color-amber)" }} />
              EVENTO · CLICK
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
              <span style={{ fontSize: "11px" }}>🖱</span>
              SCROLL = ZOOM · DRAG = PAN
            </span>
          </div>

          {/* ── Tooltip HUD ─────────────────────────────────────────────── */}
          {tooltip && (
            <div
              style={{
                position: "fixed",
                left: tooltip.x + 16,
                top: tooltip.y - 20,
                background: "rgba(4, 6, 8, 0.97)",
                border: `1px solid ${tooltip.hex}40`,
                padding: "10px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--text-primary)",
                letterSpacing: "0.05em",
                zIndex: 999,
                pointerEvents: "none",
                minWidth: "180px",
                boxShadow: `0 4px 20px rgba(0,0,0,0.6)`,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: tooltip.hex,
                  letterSpacing: "0.1em",
                  marginBottom: "6px",
                  paddingBottom: "6px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {tooltip.title}
              </div>
              {tooltip.rows.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ color: "var(--text-tertiary)", letterSpacing: "0.08em", fontSize: "9px" }}>
                    {k}
                  </span>
                  <span style={{ color: "var(--text-primary)", fontSize: "10px", textAlign: "right" }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── COL DERECHA: Panel de detalles ────────────────────────────── */}
        <div
          ref={detailPanelRef}
          className="detail-panel-glitch"
          style={{
            border: "1px solid var(--border-dim)",
            background: "var(--bg-surface)",
            padding: "20px",
            position: "relative",
          }}
        >
          {/* top accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                detailMode === "model" ? active.hex : events[detailMode]?.color ?? "var(--border-dim)",
              opacity: 0.5,
            }}
          />

          {detailMode === "model" ? (
            <>
              {/* Header modelo */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
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
                  <button
                    onClick={() => setDetailMode(0)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "8px",
                      color: "var(--text-tertiary)",
                      letterSpacing: "0.08em",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    VER EVENTOS →
                  </button>
                </div>
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
            </>
          ) : (
            /* Detalle de evento histórico */
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: events[detailMode]?.color ?? "var(--color-amber)",
                    letterSpacing: "0.15em",
                  }}
                >
                  EVENTO CRÍTICO
                </span>
                <button
                  onClick={() => setDetailMode("model")}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.08em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  ← VOLVER
                </button>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "20px",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  margin: "4px 0 12px",
                }}
              >
                {events[detailMode]?.icon} {events[detailMode]?.label}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1px",
                  background: "rgba(255,255,255,0.04)",
                  marginBottom: "16px",
                }}
              >
                <div
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
                    DURACIÓN
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "var(--text-primary)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {events[detailMode]?.duration}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                  letterSpacing: "0.01em",
                }}
              >
                {events[detailMode]?.impact}
              </p>

              {/* Botón para ver en ChartSection */}
              <button
                onClick={handleCrossFilter}
                style={{
                  marginTop: "16px",
                  width: "100%",
                  background: "none",
                  border: "1px solid var(--border-dim)",
                  padding: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: active.color,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                VER IMPACTO EN PREDICCIONES →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keyframe global para LED parpadeante */}
      <style>{`
        @keyframes ledPulse {
          0% { opacity: 0.4; box-shadow: 0 0 4px #00ff88; }
          100% { opacity: 1; box-shadow: 0 0 10px #00ff88, 0 0 4px #00ff88; }
        }
      `}</style>
    </section>
  );
}
