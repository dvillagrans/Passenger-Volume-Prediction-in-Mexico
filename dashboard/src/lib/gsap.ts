import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Solo registra en el cliente
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Configuración global — eases del sistema ATC
// Mecánico, preciso, sin rebotes
gsap.defaults({
  ease: "power3.out",
  duration: 0.6,
});

export { gsap, ScrollTrigger };
