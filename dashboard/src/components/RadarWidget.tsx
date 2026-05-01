"use client";

export default function RadarWidget() {
  return (
    <div
      style={{
        position: "relative",
        width: "160px",
        height: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      {/* rings */}
      {[32, 52, 68].map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.12)",
          }}
        />
      ))}
      {/* crosshairs */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "1px",
          background: "rgba(0, 255, 136, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "100%",
          background: "rgba(0, 255, 136, 0.08)",
        }}
      />
      {/* sweep arm */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          transformOrigin: "center",
          animation: "radar-sweep 6s linear infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "50%",
            height: "1px",
            transformOrigin: "left center",
            background: "linear-gradient(90deg, transparent, var(--color-primary))",
            boxShadow: "0 0 8px 2px rgba(0,255,136,0.25)",
          }}
        />
      </div>
      {/* blips */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "58%",
          width: "6px",
          height: "6px",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          background: "var(--color-primary)",
          animation: "blink-beacon 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "40%",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "var(--color-amber)",
          animation: "blink-beacon 1.4s ease-in-out infinite",
          animationDelay: "0.7s",
        }}
      />
      {/* center dot */}
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "var(--color-primary)",
          boxShadow: "0 0 10px 3px rgba(0,255,136,0.6)",
        }}
      />
    </div>
  );
}
