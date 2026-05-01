import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ChartSection from "@/components/ChartSection";
import ModelsTable from "@/components/ModelsTable";
import SARIMATimeline from "@/components/SARIMATimeline";
import MethodologySection from "@/components/MethodologySection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Providers>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-base)",
          color: "var(--text-primary)",
          overflowX: "hidden",
        }}
      >
        <Navbar />
        <HeroSection />
        <ChartSection />
        <ModelsTable />
        <SARIMATimeline />
        <MethodologySection />
        <AboutSection />
        <Footer />
      </div>
    </Providers>
  );
}
