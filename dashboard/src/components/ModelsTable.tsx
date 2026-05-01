"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const rows = [
  {
    id: "GLB-01",
    name: "MODELO GLOBAL",
    sub: "Mercado nacional total",
    order: "(1,1,1)(1,1,1)[12]",
    aic: "2847.3",
    period: "1992–2022",
    s: "12",
    fit: 82,
    color: "var(--color-blue)",
  },
  {
    id: "AM-438",
    name: "AEROMÉXICO",
    sub: "Líder del mercado · AM",
    order: "(1,1,1)(1,1,1)[12]",
    aic: "1934.8",
    period: "1992–2022",
    s: "12",
    fit: 89,
    color: "var(--color-amber)",
  },
  {
    id: "VB-2712",
    name: "VIVA AEROBUS",
    sub: "Low-cost carrier · VB",
    order: "(1,1,1)(1,1,1)[12]",
    aic: "1756.2",
    period: "2006–2022",
    s: "12",
    fit: 91,
    color: "var(--color-primary)",
  },
];

export default function ModelsTable() {
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".models-table-header", {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".models-table-row", {
        x: -20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".fit-bar-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="modelos"
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
            MODELOS ENTRENADOS
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(28px, 6vw, 48px)",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          ARQUITECTURAS SARIMA
        </h2>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
      <div
        style={{ border: "1px solid var(--border-dim)", overflow: "hidden", minWidth: "720px" }}
      >
        {/* Table header */}
        <div
          className="models-table-header"
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 160px 120px 110px 70px 80px",
            padding: "8px 16px",
            borderBottom: "1px solid var(--border-dim)",
            background: "var(--bg-surface)",
          }}
        >
          {["ID", "MODELO", "ORDEN", "AIC", "PERÍODO", "S", "AJUSTE"].map(
            (h) => (
              <span
                key={h}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.15em",
                }}
              >
                {h}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        {rows.map((row, i) => (
          <div
            key={row.id}
            className="models-table-row"
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 160px 120px 110px 70px 80px",
              padding: "14px 16px",
              borderBottom:
                i < rows.length - 1 ? "1px solid var(--border-dim)" : "none",
              alignItems: "center",
              transition: "background 0.15s",
              cursor: "default",
              background:
                hovered === i ? "var(--color-primary-muted)" : "transparent",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* ID */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: row.color,
                letterSpacing: "0.05em",
              }}
            >
              {row.id}
            </span>

            {/* Name */}
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  display: "block",
                  letterSpacing: "0.02em",
                }}
              >
                {row.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--text-tertiary)",
                  display: "block",
                  letterSpacing: "0.05em",
                }}
              >
                {row.sub}
              </span>
            </div>

            {/* Order */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-secondary)",
              }}
            >
              {row.order}
            </span>

            {/* AIC */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--text-primary)",
              }}
            >
              {row.aic}
            </span>

            {/* Period */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-secondary)",
              }}
            >
              {row.period}
            </span>

            {/* S */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-secondary)",
              }}
            >
              s={row.s}
            </span>

            {/* Fit bar */}
            <div>
              <div
                style={{
                  height: "2px",
                  background: "var(--text-tertiary)",
                  marginBottom: "3px",
                  position: "relative",
                }}
              >
                <div
                  className="fit-bar-fill"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${row.fit}%`,
                    background: row.color,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: row.color,
                }}
              >
                {row.fit}%
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
