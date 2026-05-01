"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

interface PredictionData {
  Fecha: string;
  Pasajeros_Esperados: number;
  Lower_CI: number;
  Upper_CI: number;
}

// ── Tooltip técnico estilo ATC ──────────────────────────────────────────────
const AeroTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-MX").format(Math.round(n));

  // El CSV empieza en 2023-04, así que todo es forecast
  // Si tienes datos históricos desde antes de 2023-01, ajusta este check
  const isForecast = label >= "2023-01";

  return (
    <div
      style={{
        background: "rgba(4, 6, 8, 0.97)",
        border: `1px solid ${isForecast ? "rgba(0,255,136,0.35)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 0,
        padding: "12px 16px",
        fontFamily: "'Share Tech Mono', monospace",
        minWidth: "200px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isForecast ? "#00ff88" : "rgba(255,255,255,0.4)",
          }}
        />
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: isForecast ? "#00ff88" : "rgba(255,255,255,0.4)",
          }}
        >
          {isForecast ? "FORECAST" : "HISTÓRICO"} · {label}
        </span>
      </div>

      {/* Valores */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
            ESPERADO
          </span>
          <span style={{ fontSize: "13px", color: "#00ff88", fontWeight: 400 }}>
            {fmt(payload[2]?.value ?? 0)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
            IC SUP 95%
          </span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
            {fmt(payload[0]?.value ?? 0)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
            IC INF 95%
          </span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
            {fmt(payload[1]?.value ?? 0)}
          </span>
        </div>
        {isForecast && (
          <div
            style={{
              marginTop: "6px",
              paddingTop: "6px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: "10px",
              color: "rgba(255,170,0,0.6)",
              letterSpacing: "0.08em",
            }}
          >
            MAPE {"<"} 5% · SARIMA (1,1,1)(1,1,1)[12]
          </div>
        )}
      </div>
    </div>
  );
};

// ── Loading state estilo terminal ───────────────────────────────────────────
const AeroLoading = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* Radar scan animado simple con CSS */}
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "1px solid rgba(0,255,136,0.3)",
          borderRadius: "50%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "4px",
            border: "1px solid rgba(0,255,136,0.15)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#00ff88",
            boxShadow: "0 0 8px #00ff88",
            animation: "atcPulse 1.2s ease-in-out infinite",
          }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#00ff88",
            marginBottom: "4px",
          }}
        >
          PROCESANDO SERIES DE TIEMPO{dots}
        </div>
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          SARIMA · DGAC · 1992–2022
        </div>
      </div>

      <style>{`
        @keyframes atcPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

// ── Componente principal ────────────────────────────────────────────────────
export default function PredictionChart() {
  const [data, setData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      fetch("/predictions.csv")
        .then((res) => res.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
              const parsedData = (results.data as PredictionData[]).filter(
                (row) => row.Fecha && row.Pasajeros_Esperados
              );
              const formattedData = parsedData.map((d) => ({
                ...d,
                Fecha: d.Fecha.substring(0, 7),
              }));
              setData(formattedData);
              setLoading(false);
            },
          });
        });
    }, 800);
  }, []);

  if (loading) return <AeroLoading />;

  // Detecta la primera fecha del dataset para la ReferenceLine
  // Si todos los datos son forecast (empiezan en 2023), pon la línea al inicio
  const firstDate = data[0]?.Fecha ?? "2023-01";

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradiente principal: verde fósforo */}
            <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.01} />
            </linearGradient>

            {/* Gradiente del IC: sutil */}
            <linearGradient id="gradCI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.00} />
            </linearGradient>
          </defs>

          {/* Grid: horizontal only, muy sutil */}
          <CartesianGrid
            strokeDasharray="2 6"
            vertical={false}
            stroke="rgba(255,255,255,0.04)"
          />

          {/* Área sombreada de forecast — toda la zona */}
          <ReferenceArea
            x1={firstDate}
            x2={data[data.length - 1]?.Fecha}
            fill="rgba(0,255,136,0.02)"
            stroke="none"
          />

          {/* Línea de inicio del forecast */}
          <ReferenceLine
            x={firstDate}
            stroke="rgba(255,170,0,0.4)"
            strokeWidth={1}
            strokeDasharray="4 4"
            label={{
              value: "FORECAST →",
              position: "insideTopRight",
              style: {
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "9px",
                fill: "rgba(255,170,0,0.6)",
                letterSpacing: "0.1em",
              },
            }}
          />

          <XAxis
            dataKey="Fecha"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "rgba(255,255,255,0.2)",
              fontSize: 10,
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.05em",
            }}
            minTickGap={48}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "rgba(255,255,255,0.2)",
              fontSize: 10,
              fontFamily: "'Share Tech Mono', monospace",
            }}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
            dx={-8}
            width={48}
          />

          <Tooltip
            cursor={{
              stroke: "rgba(0,255,136,0.2)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            content={<AeroTooltip />}
          />

          {/* IC Superior */}
          <Area
            type="monotone"
            dataKey="Upper_CI"
            stroke="none"
            fill="url(#gradCI)"
            isAnimationActive={true}
            animationDuration={1200}
          />

          {/* IC Inferior — "borra" la parte de abajo del IC */}
          <Area
            type="monotone"
            dataKey="Lower_CI"
            stroke="none"
            fill="rgba(4,6,8,1)"
            isAnimationActive={false}
          />

          {/* Línea principal: verde fósforo */}
          <Area
            type="monotone"
            dataKey="Pasajeros_Esperados"
            stroke="#00ff88"
            strokeWidth={1.5}
            fill="url(#gradForecast)"
            isAnimationActive={true}
            animationDuration={2000}
            dot={false}
            activeDot={{
              r: 4,
              fill: "#00ff88",
              stroke: "rgba(4,6,8,1)",
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
