"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import {
  Area,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ComposedChart,
  Line,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Loader2 } from "lucide-react";

interface PredictionData {
  Fecha: string;
  Pasajeros_Esperados: number;
  Lower_CI: number;
  Upper_CI: number;
}

/* ─── Custom tooltip ─────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const fmt = (v: number) => new Intl.NumberFormat("es-MX").format(Math.round(v));

  const main  = payload.find((p: { dataKey: string }) => p.dataKey === "Pasajeros_Esperados");
  const upper = payload.find((p: { dataKey: string }) => p.dataKey === "Upper_CI");
  const lower = payload.find((p: { dataKey: string }) => p.dataKey === "Lower_CI");

  return (
    <div className="bg-[#060e18] border border-[#22d3a5]/20 rounded-xl p-4 shadow-2xl min-w-[200px] font-mono">
      <p className="text-[#22d3a5]/70 text-[10px] tracking-widest uppercase font-bold mb-3 pb-2 border-b border-[#22d3a5]/10">
        {label}
      </p>
      {main && (
        <div className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22d3a5]" style={{ boxShadow: "0 0 6px #22d3a5" }} />
            <span className="text-[#e8e0cc]/40 text-[10px] tracking-widest">ESPERADO</span>
          </div>
          <span className="text-[#e8e0cc] font-bold text-xs tabular-nums">{fmt(main.value)}</span>
        </div>
      )}
      {upper && lower && (
        <>
          <div className="flex items-center justify-between gap-6 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-px bg-[#22d3a5]/40" />
              <span className="text-[#e8e0cc]/25 text-[9px] tracking-widest">LIM. SUP.</span>
            </div>
            <span className="text-[#e8e0cc]/50 text-[10px] tabular-nums">{fmt(upper.value)}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-px bg-[#22d3a5]/40" />
              <span className="text-[#e8e0cc]/25 text-[9px] tracking-widest">LIM. INF.</span>
            </div>
            <span className="text-[#e8e0cc]/50 text-[10px] tabular-nums">{fmt(lower.value)}</span>
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function PredictionChart() {
  const [data, setData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/predictions.csv")
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const parsed = (results.data as PredictionData[]).filter(
              (row) => row.Fecha && row.Pasajeros_Esperados,
            );
            const formatted = parsed.map((d) => ({
              ...d,
              Fecha: d.Fecha.substring(0, 7),
            }));
            setData(formatted);
            setLoading(false);
          },
        });
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center flex-col gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-blue-400" />
        </motion.div>
        <span className="text-slate-500 text-sm">Cargando proyecciones...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full min-h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#22d3a5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.09} />
              <stop offset="100%" stopColor="#22d3a5" stopOpacity={0.02} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(34,211,165,0.05)"
          />

          <XAxis
            dataKey="Fecha"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#e8e0cc33", fontSize: 10, fontFamily: "monospace", letterSpacing: 1 }}
            minTickGap={40}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#e8e0cc33", fontSize: 10, fontFamily: "monospace" }}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
            width={46}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(34,211,165,0.12)", strokeWidth: 1 }} />

          {/* Year reference lines */}
          {["2024-01", "2025-01", "2026-01", "2027-01", "2028-01"].map((yr) => (
            <ReferenceLine
              key={yr}
              x={yr}
              stroke="rgba(34,211,165,0.08)"
              strokeDasharray="4 4"
              label={{ value: yr.split("-")[0], position: "top", fill: "#22d3a530", fontSize: 9, fontFamily: "monospace" }}
            />
          ))}

          {/* CI upper band */}
          <Area
            type="monotone"
            dataKey="Upper_CI"
            stroke="none"
            fill="url(#gradCI)"
            fillOpacity={1}
            isAnimationActive={false}
          />
          {/* CI lower band — fill with background to erase */}
          <Area
            type="monotone"
            dataKey="Lower_CI"
            stroke="none"
            fill="#04080f"
            fillOpacity={1}
            isAnimationActive={false}
          />

          {/* Lower CI dashed */}
          <Line
            type="monotone"
            dataKey="Lower_CI"
            stroke="#22d3a5"
            strokeWidth={1}
            strokeDasharray="3 4"
            strokeOpacity={0.2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          {/* Upper CI dashed */}
          <Line
            type="monotone"
            dataKey="Upper_CI"
            stroke="#22d3a5"
            strokeWidth={1}
            strokeDasharray="3 4"
            strokeOpacity={0.2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />

          {/* Main line — radar-green glow */}
          <Line
            type="monotone"
            dataKey="Pasajeros_Esperados"
            stroke="#22d3a5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#22d3a5", stroke: "#04080f", strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={2400}
            animationEasing="ease-out"
            style={{ filter: "drop-shadow(0 0 5px rgba(34,211,165,0.7))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

