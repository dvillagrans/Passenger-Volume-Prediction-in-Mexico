import { Plane, TrendingUp, Calendar, ArrowRight, BarChart } from "lucide-react";
import PredictionChart from "@/components/PredictionChart";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar Minimalista */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Plane className="w-6 h-6" />
          <span>AeroPredict Mx</span>
        </div>
        <div className="text-sm font-medium text-slate-500 hidden md:flex gap-6">
          <a href="#models" className="hover:text-blue-600 transition-colors">Modelos SARIMA</a>
          <a href="#predictions" className="hover:text-blue-600 transition-colors">Predicciones (5 años)</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">Acerca del Proyecto</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-20 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" /> Machine Learning Aplicado
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Predicción de <span className="text-blue-600">Volumen de Pasajeros</span> en México
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Una plataforma analítica basada en modelos SARIMA para la predicción del tráfico aéreo nacional e internacional, enfocado en Aeroméxico y Viva Aerobus a lo largo de las próximas décadas.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md flex justify-center items-center gap-2">
              Ver Análisis <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm">
              Explorar Notebook
            </button>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Proyección Global a 5 años (2023-2028)</h3>
                <p className="text-sm text-slate-500">Volumen mensual esperado e intervalos de confianza</p>
              </div>
              <BarChart className="text-blue-500 w-6 h-6" />
            </div>
            <div className="h-64 sm:h-80 w-full bg-white rounded-xl flex items-center justify-center -ml-2">
              <PredictionChart />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
