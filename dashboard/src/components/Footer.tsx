"use client";

import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-dim)",
        padding: "24px 48px",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-dim)",
              background: "var(--bg-surface)",
            }}
          >
            <Plane style={{ width: "12px", height: "12px", color: "var(--color-primary)", transform: "rotate(-12deg)" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              letterSpacing: "0.1em",
              display: "block",
            }}
          >
            AEROPREDICTMX
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            letterSpacing: "0.08em",
            display: "block",
          }}
        >
          © 2024 · PASSENGER VOLUME PREDICTION · MÉXICO · SARIMA
        </span>
      </div>

      {/* Stack */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            letterSpacing: "0.12em",
          }}
        >
          NEXT.JS · FRAMER · RECHARTS
        </span>
      </div>

      {/* Author */}
      <div style={{ textAlign: "right" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            letterSpacing: "0.05em",
            display: "block",
          }}
        >
          Diego Villagran
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            display: "block",
            marginTop: "2px",
            marginBottom: "8px",
          }}
        >
          Data Science · ESCOM-IPN
        </span>
        <a
          href="https://dvillagrans.dev"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
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
          ← PORTFOLIO COMPLETO
        </a>
      </div>
    </footer>
  );
}
