"use client";

import { useState } from "react";
import { Plane, Menu, X } from "lucide-react";

const links = ["PREDICCIONES", "MODELOS", "METODOLOGÍA", "ACERCA"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border-dim)",
          background: "rgba(4, 6, 8, 0.92)",
          backdropFilter: "blur(8px)",
        }}
        className="md:!px-12"
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-normal)",
              background: "var(--bg-surface)",
              flexShrink: 0,
            }}
          >
            <Plane className="w-3.5 h-3.5" style={{ color: "var(--color-primary)", transform: "rotate(-12deg)" }} />
          </div>
          <div className="hidden md:block">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-primary)",
                letterSpacing: "0.05em",
                display: "block",
                lineHeight: 1,
              }}
            >
              AEROPREDICT
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.2em",
                display: "block",
                lineHeight: 1,
                marginTop: "2px",
              }}
            >
              MÉXICO · SARIMA
            </span>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.15s",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              {link}
            </button>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              border: "1px solid var(--border-normal)",
              background: "var(--color-primary-muted)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                boxShadow: "0 0 6px var(--color-primary)",
                animation: "atc-pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--color-primary)",
                letterSpacing: "0.1em",
              }}
            >
              ATC ON
            </span>
          </div>

          <a
            href="https://dvillagrans.dev"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              color: "var(--text-tertiary)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-tertiary)")
            }
          >
            ← dvillagrans.dev
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: "4px",
          }}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "53px",
            left: 0,
            right: 0,
            zIndex: 49,
            background: "rgba(4, 6, 8, 0.97)",
            borderBottom: "1px solid var(--border-dim)",
            backdropFilter: "blur(12px)",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {links.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  color: "var(--text-secondary)",
                  textAlign: "left",
                  padding: "12px 8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border-dim)",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                  e.currentTarget.style.background = "var(--color-primary-muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "none";
                }}
              >
                {link}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  boxShadow: "0 0 6px var(--color-primary)",
                  animation: "atc-pulse 2s infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--color-primary)",
                  letterSpacing: "0.1em",
                }}
              >
                ATC ON
              </span>
            </div>
            <a
              href="https://dvillagrans.dev"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.08em",
                color: "var(--text-tertiary)",
                textDecoration: "none",
              }}
            >
              ← dvillagrans.dev
            </a>
          </div>
        </div>
      )}
    </>
  );
}
