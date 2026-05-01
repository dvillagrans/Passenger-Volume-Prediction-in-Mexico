"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const systemData = [
  { label: "SYS", value: "AEROPREDICTMX" },
  { label: "VER", value: "2024.1" },
  { label: "STATUS", value: "OPERATIONAL", color: "var(--color-primary)" },
  { label: "MODEL", value: "SARIMA(1,1,1)(1,1,1)[12]" },
];

const stackData = [
  { label: "FE", value: "NEXT.JS 16" },
  { label: "VIZ", value: "RECHARTS" },
  { label: "MOTION", value: "GSAP + LENIS" },
  { label: "STYLING", value: "TAILWIND" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-row", {
        opacity: 0,
        y: 8,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
          once: true,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="px-4 md:px-12"
      style={{
        borderTop: "1px solid var(--border-dim)",
        maxWidth: "1400px",
        margin: "0 auto",
        paddingTop: "20px",
        paddingBottom: "24px",
      }}
    >
      {/* Fila 1: datos del sistema */}
      <div
        className="footer-row flex-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "12px",
          paddingBottom: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {systemData.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.15em",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: item.color ?? "var(--text-secondary)",
                letterSpacing: "0.05em",
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Fila 2: stack técnico */}
      <div
        className="footer-row flex-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "16px",
        }}
      >
        {stackData.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.15em",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--text-secondary)",
                letterSpacing: "0.05em",
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Fila 3: separador + copyright + autor */}
      <div
        className="footer-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          paddingTop: "12px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          © 2024 · PASSENGER VOLUME PREDICTION · MÉXICO
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
            }}
          >
            DIEGO VILLAGRAN · ESCOM-IPN
          </span>
          <a
            href="https://dvillagrans.dev"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-primary)",
              textDecoration: "none",
              letterSpacing: "0.08em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-primary)")
            }
          >
            ← PORTFOLIO
          </a>
        </div>
      </div>
    </footer>
  );
}
