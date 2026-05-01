"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import RadarWidget from "./RadarWidget";

const statRows = [
  { code: "DATOS", value: 31, unit: "AÑOS HIST.", color: "var(--color-primary)" },
  { code: "FLOTAS", value: 2, unit: "AEROLÍNEAS", color: "var(--color-primary)" },
  { code: "FCAST", value: 60, unit: "MESES PROY.", color: "var(--color-amber)" },
  { code: "ACC", value: 95, unit: "% PRECISIÓN", color: "var(--color-amber)" },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeTextRef = useRef<HTMLSpanElement>(null);

  // Decodificación de caracteres del badge
  useEffect(() => {
    const badge = badgeTextRef.current;
    if (!badge) return;
    const finalText = "FLT-2023/28";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-";
    let iterations = 0;
    const maxIterations = finalText.length * 4;

    const interval = setInterval(() => {
      badge.textContent = finalText
        .split("")
        .map((char, idx) => {
          if (idx < Math.floor(iterations / 4)) return char;
          if (char === " " || char === "·") return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      iterations++;
      if (iterations >= maxIterations) {
        badge.textContent = finalText;
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  // Boot sequence GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // 1. Badge línea
      tl.from(".hero-badge-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.4,
        ease: "power2.inOut",
      });

      // 2. Badge subtitle
      tl.from(".hero-badge-subtitle", {
        opacity: 0,
        duration: 0.3,
        ease: "none",
      }, "-=0.15");

      // 3. Headline words
      tl.from(".hero-word", {
        y: -40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.1");

      // 4. Geo
      tl.from(".hero-geo", {
        opacity: 0,
        x: -10,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");

      // 5. Description
      tl.from(".hero-desc", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.2");

      // 6. CTAs
      tl.from(".hero-cta", {
        opacity: 0,
        y: 8,
        stagger: 0.08,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");

      // 7. Panel border line scaleY
      tl.from(".hero-panel-line", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.6,
        ease: "power3.inOut",
      }, "-=0.6");

      // 8. Radar
      tl.from(".hero-radar", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.4");

      // 9. Stat rows
      tl.from(".hero-stat-row", {
        opacity: 0,
        x: 10,
        stagger: 0.08,
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.3");

      // 10. Counter animation with snap
      document.querySelectorAll(".hero-stat-value").forEach((el) => {
        const target = parseInt(el.getAttribute("data-value") ?? "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.9,
          snap: { val: 1 },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val));
          },
        });
      });

      // 11. Timestamp
      tl.from(".hero-timestamp", {
        opacity: 0,
        duration: 0.3,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="grid grid-cols-1 lg:grid-cols-[1fr_380px]"
      style={{
        gap: 0,
        minHeight: "100vh",
        padding: "80px 16px 48px",
        alignItems: "center",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* COLUMNA IZQUIERDA */}
      <div className="lg:pr-12" style={{ paddingRight: 0 }}>
        {/* Flight tag */}
        <div
          className="mb-6 lg:mb-8"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            ref={badgeTextRef}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-primary)",
              padding: "3px 8px",
              border: "1px solid var(--border-normal)",
              letterSpacing: "0.12em",
              flexShrink: 0,
            }}
          >
            FLT-2023/28
          </span>
          <div
            className="hidden sm:block hero-badge-line"
            style={{
              width: "40px",
              height: "1px",
              background: "var(--color-primary-dim)",
            }}
          />
          <span
            className="hidden sm:inline hero-badge-subtitle"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-secondary)",
              letterSpacing: "0.15em",
            }}
          >
            SERIES DE TIEMPO · ML · DGAC
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(44px, 12vw, 110px)",
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          <span className="hero-word" style={{ display: "block" }}>VOLUMEN</span>
          <span className="hero-word" style={{ display: "block" }}>DE</span>
          <span className="hero-word" style={{ display: "block", color: "var(--color-primary)" }}>PASAJEROS</span>
        </h1>

        {/* Subtítulo geográfico */}
        <div
          className="flex-wrap hero-geo"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            color: "var(--text-secondary)",
            letterSpacing: "0.2em",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span>EN MÉXICO</span>
          <span style={{ color: "var(--text-tertiary)" }}>·</span>
          <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
            19.4363°N 99.0721°W
          </span>
        </div>

        {/* Descripción */}
        <p
          className="hero-desc"
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 300,
            fontSize: "15px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: "480px",
            marginBottom: "36px",
          }}
        >
          Modelos SARIMA entrenados con 31 años de registros DGAC. Proyecciones
          mensuales de Aeroméxico y Viva Aerobus hasta 2028 con intervalos de
          confianza al 95%.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row" style={{ gap: "12px" }}>
          <a
            href="#predicciones"
            className="hero-cta"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              padding: "10px 20px",
              background: "var(--color-primary)",
              color: "#040608",
              border: "none",
              cursor: "pointer",
              fontWeight: 400,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              borderRadius: 0,
              transition: "box-shadow 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 20px rgba(0,255,136,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
          >
            ▶ VER PROYECCIONES
          </a>
          <a
            href="#metodologia"
            className="hero-cta"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              padding: "10px 20px",
              background: "transparent",
              color: "var(--color-primary)",
              border: "1px solid var(--border-normal)",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              borderRadius: 0,
              transition: "border-color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-bright)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-normal)")
            }
          >
            ◈ METODOLOGÍA
          </a>
        </div>
      </div>

      {/* COLUMNA DERECHA: panel técnico */}
      <div
        className="mt-12 lg:mt-0 relative"
        style={{
          paddingLeft: "24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {/* Border line animada */}
        <div
          className="hero-panel-line hidden lg:block"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "1px",
            background: "var(--border-dim)",
          }}
        />

        {/* Radar */}
        <div className="hero-radar" style={{ display: "flex", justifyContent: "center" }}>
          <RadarWidget />
        </div>

        {/* Stats rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            background: "var(--border-dim)",
          }}
        >
          {statRows.map(({ code, value, unit, color }) => (
            <div
              key={code}
              className="hero-stat-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "var(--bg-surface)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.12em",
                  width: "48px",
                }}
              >
                {code}
              </span>
              <span
                className="hero-stat-value"
                data-value={value}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "28px",
                  fontWeight: 400,
                  color,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                0
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.1em",
                  textAlign: "right",
                }}
              >
                {unit}
              </span>
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div
          className="hero-timestamp"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          LAST UPDATE: 2022-12-31 · DGAC MÉXICO
        </div>
      </div>
    </section>
  );
}
