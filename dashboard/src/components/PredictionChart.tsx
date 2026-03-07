"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ComposedChart
} from "recharts";
import { Loader2 } from "lucide-react";

interface PredictionData {
  Fecha: string;
  Pasajeros_Esperados: number;
  Lower_CI: number;
  Upper_CI: number;
}

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
            // Remove empty rows if any
            const parsedData = (results.data as PredictionData[]).filter(
              (row) => row.Fecha && row.Pasajeros_Esperados
            );
            
            // Format dates slightly for better visualization
            const formattedData = parsedData.map(d => ({
              ...d,
              Fecha: d.Fecha.substring(0, 7) // Keep YYYY-MM
            }));
            
            setData(formattedData);
            setLoading(false);
          },
        });
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-slate-500 text-sm font-medium">Cargando proyecciones...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPasajeros" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="Fecha" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            minTickGap={30}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: "bold", color: "#1e293b", marginBottom: '4px' }}
            formatter={(value: number, name: string) => {
              const formattedValue = new Intl.NumberFormat('es-MX').format(Math.round(value));
              if (name === "Pasajeros_Esperados") return [formattedValue, "Esperado"];
              if (name === "Upper_CI") return [formattedValue, "Límite Superior"];
              if (name === "Lower_CI") return [formattedValue, "Límite Inferior"];
              return [formattedValue, name];
            }}
          />
          
          {/* Rango de confianza */}
          <Area 
            type="monotone" 
            dataKey="Upper_CI" 
            stroke="none" 
            fill="url(#colorCi)" 
            fillOpacity={1}
          />
          <Area 
            type="monotone" 
            dataKey="Lower_CI" 
            stroke="none" 
            fill="#ffffff" 
            fillOpacity={1} 
          />
          {/* Línea principal */}
          <Line 
            type="monotone" 
            dataKey="Pasajeros_Esperados" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
