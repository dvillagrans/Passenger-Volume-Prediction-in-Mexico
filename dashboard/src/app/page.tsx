import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ChartSection from "@/components/ChartSection";
import ModelsTable from "@/components/ModelsTable";
import MethodologySection from "@/components/MethodologySection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
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
      <MethodologySection />
      <AboutSection />
      <Footer />
    </div>
  );
}
