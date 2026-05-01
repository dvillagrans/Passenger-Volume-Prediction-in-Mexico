"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CX = 80;
const CY = 80;
const BLIPS = [
  { angle: 0, radius: 45, color: "#00ff88", delayOffset: 0 },
  { angle: 220, radius: 38, color: "#ffaa00", delayOffset: 0.7 },
];

export default function RadarWidget() {
  const svgRef = useRef<SVGSVGElement>(null);
  const sweepRef = useRef<SVGPathElement>(null);
  const blipRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sweep arm: rotación constante 360° en 4s
      gsap.to(sweepRef.current, {
        rotation: 360,
        duration: 4,
        ease: "none",
        repeat: -1,
        transformOrigin: `${CX}px ${CY}px`,
      });

      // Cada blip destella cuando el sweep lo pasa
      BLIPS.forEach((blip, i) => {
        const el = blipRefs.current[i];
        if (!el) return;

        const triggerTime = (blip.angle / 360) * 4;

        gsap
          .timeline({ repeat: -1, delay: triggerTime })
          .set(el, { opacity: 0.15, scale: 1 })
          .to(el, {
            opacity: 1,
            scale: 1.6,
            duration: 0.08,
            ease: "power2.out",
          })
          .to(el, {
            opacity: 0.3,
            scale: 1,
            duration: 0.4,
            ease: "power2.in",
          })
          .to(el, {
            opacity: 0.15,
            duration: 3.52,
            ease: "none",
          });
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      width="160"
      height="160"
      viewBox="0 0 160 160"
      style={{ display: "block" }}
    >
      {/* Rings */}
      {[32, 52, 68].map((r) => (
        <circle
          key={r}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke="rgba(0, 255, 136, 0.12)"
          strokeWidth="1"
        />
      ))}

      {/* Crosshairs */}
      <line
        x1={0}
        y1={CY}
        x2={160}
        y2={CY}
        stroke="rgba(0, 255, 136, 0.08)"
        strokeWidth="1"
      />
      <line
        x1={CX}
        y1={0}
        x2={CX}
        y2={160}
        stroke="rgba(0, 255, 136, 0.08)"
        strokeWidth="1"
      />

      {/* Sweep arm group */}
      <g ref={sweepRef}>
        <path
          d={`M ${CX} ${CY} L ${CX + 68} ${CY}`}
          stroke="url(#sweepGrad)"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 4px rgba(0,255,136,0.4))" }}
        />
      </g>

      {/* Blips */}
      {BLIPS.map((blip, i) => {
        const rad = (blip.angle * Math.PI) / 180;
        const x = CX + blip.radius * Math.cos(rad);
        const y = CY + blip.radius * Math.sin(rad);
        return (
          <circle
            key={i}
            ref={(el) => { blipRefs.current[i] = el; }}
            cx={x}
            cy={y}
            r={i === 0 ? 3 : 2.5}
            fill={blip.color}
            opacity={0.15}
          />
        );
      })}

      {/* Center dot */}
      <circle
        cx={CX}
        cy={CY}
        r={4}
        fill="#00ff88"
        style={{ filter: "drop-shadow(0 0 6px rgba(0,255,136,0.6))" }}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,255,136,0.6)" />
          <stop offset="40%" stopColor="rgba(0,255,136,0.2)" />
          <stop offset="100%" stopColor="rgba(0,255,136,0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
