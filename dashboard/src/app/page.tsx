"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Plane, TrendingUp, Calendar, ArrowRight, BarChart2,
  Database, GitBranch, Activity, Globe, Award, Cpu, ChevronDown,
  Radio, Wind, Compass,
} from "lucide-react";
import PredictionChart from "@/components/PredictionChart";

/* ─── Animated counter ────────────────────────────────────────────────────── */
function AnimatedCounter({
  end, suffix = "", decimals = 0,
}: { end: number; suffix?: string; decimals?: number }) {
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
      if (current >= end) { setValue(end); clearInterval(interval); }
      else setValue(parseFloat(current.toFixed(decimals)));
    }, duration / frames);
    return () => clearInterval(interval);
  }, [inView, end, decimals]);

  return <span ref={ref}>{decimals ? value.toFixed(decimals) : value.toLocaleString("es-MX")}{suffix}</span>;
}

/* ─── Mini radar widget ───────────────────────────────────────────────────── */
function RadarWidget() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* rings */}
      {[28, 44, 56].map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-[#22d3a5]/20"
          style={{ width: r * 2, height: r * 2 }}
        />
      ))}
      {/* crosshairs */}
      <div className="absolute w-full h-px bg-[#22d3a5]/15" />
      <div className="absolute w-px h-full bg-[#22d3a5]/15" />
      {/* sweep arm */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden animate-radar-sweep"
        style={{ transformOrigin: "center" }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
          style={{
            background: "linear-gradient(90deg, transparent, #22d3a5)",
            boxShadow: "0 0 8px 2px #22d3a540",
          }}
        />
      </div>
      {/* blips */}
      <div className="absolute top-1/2 left-[62%] w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#22d3a5] animate-beacon" />
      <div className="absolute top-[35%] left-[38%] w-1 h-1 rounded-full bg-amber-400 animate-beacon" style={{ animationDelay: "0.7s" }} />
      {/* center dot */}
      <div className="w-2 h-2 rounded-full bg-[#22d3a5] shadow-[0_0_8px_3px_#22d3a5]" />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#04080f] text-[#e8e0cc] font-sans overflow-x-hidden selection:bg-amber-500/30">

      {/* ── Background layers ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* Horizon glow — amber/gold like a sunrise above clouds */}
      <div className="fixed top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />

      {/* Ambient glows */}
      <div className="fixed top-[-60px] left-[25%] w-[540px] h-[360px] bg-[#22d3a5]/5 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="fixed top-[180px] right-[10%] w-[380px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "2.5s" }} />
      <div className="fixed bottom-10 left-[43%] w-[260px] h-[260px] bg-sky-500/4 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "4.5s" }} />

      {/* Flying plane */}
      <div className="fixed top-[15%] z-10 pointer-events-none">
        <div className="animate-plane opacity-0">
          <Plane className="w-5 h-5 text-amber-400/50 -rotate-12" />
        </div>
      </div>

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 glass border-b border-[#22d3a5]/10"
      >
        {/* Logo — like an airline callsign */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg bg-[#0a1a0d] border border-[#22d3a5]/30 flex items-center justify-center overflow-hidden">
            <Plane className="w-4 h-4 text-[#22d3a5] -rotate-12" />
            <div className="absolute inset-0 bg-[#22d3a5]/5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-widest text-[#e8e0cc] uppercase">
              Aero<span className="text-[#22d3a5]">Predict</span>
            </span>
            <div className="text-[9px] tracking-[0.2em] text-[#22d3a5]/50 uppercase font-mono">México · SARIMA</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#e8e0cc]/40 tracking-widest uppercase">
          {[
            ["#predicciones", "Predicciones"],
            ["#modelos", "Modelos"],
            ["#metodologia", "Metodología"],
            ["#acerca", "Acerca"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="relative group py-1">
              <span className="group-hover:text-[#22d3a5] transition-colors duration-200">{label}</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#22d3a5] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* ATC-style status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#22d3a5]/20 bg-[#22d3a5]/6 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3a5] animate-beacon" />
          <span className="text-[10px] text-[#22d3a5] tracking-widest">ATC ON</span>
        </div>
      </motion.nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-24 pb-8 max-w-7xl mx-auto">

        {/* Top-right radar widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="absolute top-20 right-8 hidden lg:block"
        >
          <RadarWidget />
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">

          {/* Callsign badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-8">
            <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded text-amber-400 font-mono text-xs tracking-widest">
              FLT-2023/28
            </span>
            <span className="h-px w-12 bg-amber-500/30" />
            <span className="text-xs tracking-widest text-[#e8e0cc]/30 uppercase font-mono">Series de tiempo · ML</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.92]">
            <span className="text-[#e8e0cc]">Volumen de</span>
            <br />
            <span
              className="animate-gradient bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg,#22d3a5,#0ea5e9,#f59e0b,#22d3a5)" }}
            >
              Pasajeros
            </span>
            <br />
            <span className="text-[#e8e0cc]/60 font-light tracking-normal text-4xl lg:text-5xl">en México</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base text-[#e8e0cc]/50 max-w-xl leading-relaxed mb-10 font-mono">
            Modelos SARIMA entrenados con{" "}
            <span className="text-[#22d3a5]">+30 años</span> de registros de la DGAC.
            Proyecciones mensuales de{" "}
            <span className="text-amber-400">Aeroméxico</span> y{" "}
            <span className="text-amber-400">Viva Aerobus</span> hasta 2028.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#predicciones"
              className="group inline-flex items-center gap-2 bg-[#22d3a5] hover:bg-[#1ab890] text-[#04080f] font-bold px-7 py-3.5 rounded text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_0_24px_#22d3a530] hover:shadow-[0_0_36px_#22d3a550] hover:-translate-y-0.5"
            >
              <Radio className="w-4 h-4" />
              Ver proyecciones
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#metodologia"
              className="inline-flex items-center gap-2 glass border border-[#22d3a5]/20 hover:border-[#22d3a5]/50 text-[#e8e0cc]/70 hover:text-[#e8e0cc] px-7 py-3.5 rounded text-sm tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              Metodología
            </a>
          </motion.div>
        </motion.div>

        {/* Runway decoration */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
          className="runway-dash mt-20 origin-left"
        />

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="flex justify-center mt-10">
          <a href="#stats" className="flex flex-col items-center gap-2 text-[#22d3a5]/30 hover:text-[#22d3a5]/70 transition-colors">
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Descender</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </a>
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section id="stats" className="px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { label: "Años hist.", value: 31, icon: <Database className="w-4 h-4" />, accent: "#22d3a5", tag: "DATOS" },
            { label: "Aerolíneas", value: 2, icon: <Plane className="w-4 h-4" />, accent: "#f59e0b", tag: "FLOTAS" },
            { label: "Meses proyect.", value: 60, icon: <Calendar className="w-4 h-4" />, accent: "#0ea5e9", tag: "FORECAST" },
            { label: "Precisión aprox.", value: 95, suffix: "%", icon: <Award className="w-4 h-4" />, accent: "#22d3a5", tag: "ACCURACY" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="glass border rounded-xl p-5 group cursor-default relative overflow-hidden"
              style={{ borderColor: `${s.accent}20` }}
            >
              {/* corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: s.accent }} />
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: `${s.accent}99` }}>{s.tag}</span>
                <span style={{ color: s.accent }} className="opacity-60 group-hover:opacity-100 transition-opacity">{s.icon}</span>
              </div>
              <div className="text-3xl font-black tabular-nums mb-1" style={{ color: s.accent }}>
                <AnimatedCounter end={s.value} suffix={s.suffix ?? ""} />
              </div>
              <div className="text-xs text-[#e8e0cc]/30 font-mono">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Chart section ─────────────────────────────────────────────────── */}
      <section id="predicciones" className="px-6 pb-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
        >
          {/* Header bar — instrument panel style */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#22d3a5]/60">DISPLAY · CHT-01</span>
                <span className="h-px flex-1 bg-[#22d3a5]/10" />
              </div>
              <h2 className="text-2xl font-bold text-[#e8e0cc]">Proyección Global 2023–2028</h2>
              <p className="text-xs text-[#e8e0cc]/35 font-mono mt-0.5">
                Pasajeros mensuales · IC 95% · Modelos SARIMA
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-[10px] font-mono text-[#e8e0cc]/30 tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="w-5 h-0.5 rounded-full" style={{ background: "#22d3a5" }} /> Esperado
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 h-2.5 rounded opacity-40" style={{ background: "#22d3a5" }} /> IC 95%
              </span>
            </div>
          </div>

          {/* Chart card */}
          <div className="relative glass border border-[#22d3a5]/10 rounded-xl p-5 md:p-7 overflow-hidden">
            {/* corner glows */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#22d3a5]/4 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-500/3 rounded-full blur-3xl" />
            {/* top border accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22d3a5]/40 to-transparent" />
            <div className="h-[420px] w-full relative z-10">
              <PredictionChart />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Model cards ───────────────────────────────────────────────────── */}
      <section id="modelos" className="px-6 pb-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-amber-400/60">Modelos entrenados</span>
          <h2 className="text-2xl font-bold text-[#e8e0cc] mt-1">Arquitecturas SARIMA</h2>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4"
        >
          {[
            {
              callsign: "GLB-01", title: "Modelo Global", sub: "Mercado nacional total",
              grad: "from-[#22d3a5] to-[#0ea5e9]", accent: "#22d3a5",
              border: "#22d3a520", tag: "GLOBAL",
              order: "(1,1,1)(1,1,1)[12]", aic: "2847.3", period: "1992–2022", bar: 82,
              icon: <Globe className="w-5 h-5" />,
            },
            {
              callsign: "AM-438", title: "Aeroméxico", sub: "AM · Líder del mercado",
              grad: "from-amber-400 to-orange-500", accent: "#fbbf24",
              border: "#f59e0b20", tag: "AEROMÉXICO",
              order: "(1,1,1)(1,1,1)[12]", aic: "1934.8", period: "1992–2022", bar: 89,
              icon: <Plane className="w-5 h-5" />,
            },
            {
              callsign: "VB-2712", title: "Viva Aerobus", sub: "VB · Low-cost carrier",
              grad: "from-sky-400 to-[#22d3a5]", accent: "#38bdf8",
              border: "#0ea5e920", tag: "VIVA AEROBUS",
              order: "(1,1,1)(1,1,1)[12]", aic: "1756.2", period: "2006–2022", bar: 91,
              icon: <Wind className="w-5 h-5" />,
            },
          ].map((m, i) => (
            <motion.div
              key={i} variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.18 } }}
              className="relative glass rounded-xl border p-6 overflow-hidden cursor-default group"
              style={{ borderColor: m.border }}
            >
              {/* glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity"
                style={{ background: m.accent }} />

              {/* callsign header */}
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: `${m.accent}99` }}>
                  {m.tag}
                </span>
                <span className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded border" style={{ color: m.accent, borderColor: `${m.accent}30`, background: `${m.accent}10` }}>
                  {m.callsign}
                </span>
              </div>

              {/* icon */}
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.grad} flex items-center justify-center mb-4 text-[#04080f] shadow-lg`}>
                {m.icon}
              </div>

              <h3 className="text-lg font-bold text-[#e8e0cc] mb-0.5">{m.title}</h3>
              <p className="text-xs text-[#e8e0cc]/30 font-mono mb-5">{m.sub}</p>

              {/* params table */}
              <div className="space-y-2 mb-5 font-mono text-xs">
                {[
                  ["ORDEN", m.order],
                  ["AIC", m.aic],
                  ["PERIODO", m.period],
                  ["SEASONAL", "s=12"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[#e8e0cc]/20 tracking-widest">{k}</span>
                    <span className="text-[#e8e0cc]/60">{v}</span>
                  </div>
                ))}
              </div>

              {/* fit bar */}
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-[#e8e0cc]/20 tracking-widest uppercase">Ajuste</span>
                  <span className="font-bold" style={{ color: m.accent }}>{m.bar}%</span>
                </div>
                <div className="w-full h-px bg-[#e8e0cc]/5 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.bar}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${m.grad}`}
                    style={{ boxShadow: `0 0 8px ${m.accent}80` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Methodology ───────────────────────────────────────────────────── */}
      <section id="metodologia" className="px-6 pb-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#22d3a5]/60">Procedimiento</span>
          <h2 className="text-2xl font-bold text-[#e8e0cc] mt-1">Fases de vuelo del análisis</h2>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="space-y-3"
        >
          {[
            {
              phase: "A1", icon: <Database className="w-4 h-4" />, accent: "#22d3a5",
              title: "Recopilación de datos",
              desc: "Registros mensuales de la DGAC sobre pasajeros nacionales e internacionales 1992–2022. Fuente oficial de aeronáutica civil.",
            },
            {
              phase: "A2", icon: <GitBranch className="w-4 h-4" />, accent: "#0ea5e9",
              title: "Limpieza y normalización",
              desc: "Detección de outliers, imputación del periodo COVID-2020, segmentación por aerolínea y conversión a formato mensual.",
            },
            {
              phase: "A3", icon: <Cpu className="w-4 h-4" />, accent: "#fbbf24",
              title: "Identificación SARIMA",
              desc: "Análisis ACF/PACF, pruebas de estacionariedad (ADF, KPSS), selección óptima de parámetros (p,d,q)(P,D,Q)[12] por AIC/BIC.",
            },
            {
              phase: "A4", icon: <BarChart2 className="w-4 h-4" />, accent: "#22d3a5",
              title: "Validación y proyección",
              desc: "Walk-forward cross-validation temporal. 60 puntos mensuales proyectados (2023–2028) con intervalos de confianza al 95%.",
            },
          ].map((s, i) => (
            <motion.div
              key={i} variants={fadeUp}
              whileHover={{ x: 5, transition: { duration: 0.15 } }}
              className="flex gap-5 glass border border-[#e8e0cc]/5 rounded-xl p-5 group"
            >
              {/* phase badge */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center border"
                  style={{ borderColor: `${s.accent}30`, background: `${s.accent}10`, color: s.accent }}>
                  {s.icon}
                </div>
                <span className="font-mono text-[9px] tracking-widest" style={{ color: `${s.accent}50` }}>{s.phase}</span>
              </div>
              <div className="pt-0.5">
                <h3 className="font-bold text-[#e8e0cc] text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-[#e8e0cc]/35 leading-relaxed font-mono">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section id="acerca" className="px-6 pb-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative glass border border-[#22d3a5]/10 rounded-xl p-7 md:p-10 grid md:grid-cols-2 gap-10 overflow-hidden"
        >
          {/* decorative top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#22d3a5]/3 rounded-full blur-3xl" />

          {/* left */}
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-amber-400/60">Contexto</span>
            <h2 className="text-2xl font-bold text-[#e8e0cc] mt-1 mb-4">Acerca del proyecto</h2>
            <p className="text-xs text-[#e8e0cc]/40 leading-relaxed mb-7 font-mono">
              Análisis y proyección del tráfico aéreo de México mediante modelos SARIMA.
              Tres décadas de datos incluyendo la crisis financiera de 2008, la pandemia COVID-2020
              y la posterior recuperación del sector aviación.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: <Database className="w-3.5 h-3.5" />, label: "Hist. datos", val: "1992–2022", accent: "#22d3a5" },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: "Proyección", val: "2023–2028", accent: "#0ea5e9" },
                { icon: <Activity className="w-3.5 h-3.5" />, label: "Librería", val: "Statsmodels", accent: "#fbbf24" },
                { icon: <Award className="w-3.5 h-3.5" />, label: "MAPE", val: "< 5%", accent: "#22d3a5" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-2.5 p-3 rounded-lg border"
                  style={{ borderColor: `${item.accent}15`, background: `${item.accent}06` }}
                >
                  <span style={{ color: item.accent }}>{item.icon}</span>
                  <div>
                    <div className="text-[9px] font-mono tracking-widest text-[#e8e0cc]/25 uppercase">{item.label}</div>
                    <div className="text-xs font-bold text-[#e8e0cc]/80 font-mono">{item.val}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* right — stack */}
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#22d3a5]/60">Stack técnico</span>
            <div className="mt-4 space-y-3.5">
              {[
                { tech: "Python 3.11", role: "Análisis y modelado", pct: 100, color: "#22d3a5" },
                { tech: "Statsmodels", role: "SARIMA · ajuste y forecast", pct: 90, color: "#0ea5e9" },
                { tech: "Pandas / NumPy", role: "Manipulación de datos", pct: 95, color: "#fbbf24" },
                { tech: "Next.js + Recharts", role: "Dashboard interactivo", pct: 85, color: "#22d3a5" },
                { tech: "Framer Motion", role: "Animaciones de UI", pct: 80, color: "#0ea5e9" },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#e8e0cc]/80">{t.tech}</span>
                      <span className="font-mono text-[10px] text-[#e8e0cc]/25 ml-2">{t.role}</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold" style={{ color: t.color }}>{t.pct}%</span>
                  </div>
                  <div className="w-full h-px bg-[#e8e0cc]/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#22d3a5]/10 px-6 py-7">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0a1a0d] border border-[#22d3a5]/20 flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-[#22d3a5] -rotate-12" />
            </div>
            <span className="font-mono text-xs tracking-widest text-[#e8e0cc]/40 uppercase">AeroPredictMx</span>
          </div>
          <p className="font-mono text-[10px] text-[#e8e0cc]/20 tracking-widest">
            © 2024 · Passenger Volume Prediction · México · SARIMA
          </p>
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#e8e0cc]/20 tracking-widest">
            <span>NEXT.JS</span><span className="text-[#22d3a5]/40">·</span>
            <span>FRAMER</span><span className="text-[#22d3a5]/40">·</span>
            <span>RECHARTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
