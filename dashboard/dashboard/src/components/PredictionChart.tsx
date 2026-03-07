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
  ComposedChart
} from "recharts";
import { motion } from "framer-motion";

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
    // Simular una ligera carga extra para la animación
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
              
              const formattedData = parsedData.map(d => ({
                ...d,
                Fecha: d.Fecha.substring(0, 7)
              }));
              
              setData(formattedData);
              setLoading(false);
            },
          });
        });
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center flex-col gap-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="absolute inset-0 border-4 border-indigo-100 rounded-full"></span>
            <span className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></span>
        </div>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
          className="text-indigo-600/80 text-sm font-bold tracking-widest uppercase"
        >
          Procesando Series De Tiempo...
        </motion.span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formatNum = (num: number) => new Intl.NumberFormat('es-MX').format(Math.round(num));
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 outline-none">
          <p className="font-extrabold text-slate-800 mb-2 border-b border-slate-100 pb-2">{label}</p>
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-indigo-600 flex justify-between gap-4">
              <span>Esperado:</span> 
              <span>{formatNum(payload[0]?.value || 0)}</span>
            </p>
            <p className="text-xs font-semibold text-slate-400 flex justify-between gap-4">
              <span>Upper CI:</span>
              <span>{formatNum(payload[1]?.value || 0)}</span>
            </p>
            <p className="text-xs font-semibold text-slate-400 flex justify-between gap-4">
              <span>Lower CI:</span>
              <span>{formatNum(payload[2]?.value || 0)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPasajeros" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f8fafc" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
          
          <XAxis 
            dataKey="Fecha" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            minTickGap={40}
            dy={10}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            dx={-10}
          />
          
          <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
          
          {/* Sombras de intervalo de confianza (CI) */}
          <Area 
            type="monotone" 
            dataKey="Upper_CI" 
            stroke="none" 
            fill="url(#colorCi)" 
            isAnimationActive={true}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="Lower_CI" 
            stroke="none" 
            fill="#ffffff" 
            isAnimationActive={false}
          />
          
          {/* Main Area / Line */}
          <Area 
            type="monotone" 
            dataKey="Pasajeros_Esperados" 
            stroke="#4f46e5" 
            strokeWidth={4}
            fill="url(#colorPasajeros)"
            isAnimationActive={true}
            animationDuration={2000}
            activeDot={{ r: 6, fill: "#4f46e5", stroke: "#ffffff", strokeWidth: 3, className: "drop-shadow-md" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
