import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft, CheckCircle, Search, Database, Calculator } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans leading-relaxed">
      
      {/* Non-Printable Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Return to Dashboard
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded shadow hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Printable Report Document */}
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 my-8 shadow-sm border border-slate-200 print:m-0 print:border-none print:shadow-none print:p-0">
        
        {/* Cover Section */}
        <header className="border-b-2 border-slate-800 pb-8 mb-10">
          <p className="text-emerald-700 font-bold tracking-widest uppercase text-xs mb-2">Veridian Enterprise Intelligence</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            LCA Methodology & Data Quality Protocol
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Formal technical documentation detailing the core algorithmic boundary-mapping, mathematical logic, and data uncertainty margins utilized within the Carbon Simulator. 
          </p>
        </header>

        {/* Section 1: Standard Alignments */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold border-l-4 border-emerald-500 pl-4 mb-4 flex items-center gap-2 text-slate-800">
            <CheckCircle className="w-6 h-6 text-emerald-600"/> Standard Framework Compliance
          </h2>
          <p className="mb-4">The simulator strictly adheres to the following environmental mapping standards:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium bg-slate-50 p-6 rounded-lg border border-slate-100">
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> <strong>ISO 14040/14044:</strong> Life Cycle Assessment Principles & Frameworks.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> <strong>GHG Protocol:</strong> Scope 1 and Scope 3 Value Chain accounting.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> <strong>GRI 305:</strong> Emissions reporting baseline.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> <strong>EN 15978:</strong> Sustainability of construction works (C1-C4 boundaries).</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> <strong>CPCB & BIS:</strong> Indian national benchmarks for waste density and tracking.</li>
          </ul>
        </section>

        {/* Section 2: Mathematical Engine */}
        <section className="mb-12 print:break-inside-avoid">
          <h2 className="text-2xl font-bold border-l-4 border-slate-800 pl-4 mb-4 flex items-center gap-2 text-slate-800">
            <Calculator className="w-6 h-6 text-slate-700"/> Core Mathematical Formula
          </h2>
          <p className="mb-4">The overarching calculation governing total lifecycle emissions across all scopes relies on the integration of mass quantification, standardized emission factors, and data quality modifiers:</p>
          
          <div className="bg-slate-900 text-emerald-400 p-6 rounded-lg font-mono text-center text-lg shadow-inner mb-4 overflow-x-auto">
            E_total = Σ(Q × EF × DQ) + Σ(Activity × EF × DQ) − Σ(Recovery × Avoided EF)
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-sm space-y-3">
            <p><strong>E_total:</strong> Aggregate Net Emissions in tCO₂e (Metric Tons Carbon Dioxide Equivalent).</p>
            <p><strong>Q:</strong> Material Quantities (tons), derived dynamically from Built-up Area × Floors × Material Density.</p>
            <p><strong>EF:</strong> Emissions Factor (e.g. 2.68 kg CO₂ per Liter of Diesel; 0.10 kg CO₂ per ton-km of Transport).</p>
            <p><strong>DQ:</strong> Unitless Data Quality multiplier applied directly as a defensive margin of error against estimations.</p>
            <p><strong>Recovery (Avoided EF):</strong> Credits applied when virgin material extraction is fundamentally diverted by recycled aggregation.</p>
          </div>
        </section>

        {/* Section 3: Boundary & Scope Definitions */}
        <section className="mb-12 print:break-inside-avoid">
          <h2 className="text-2xl font-bold border-l-4 border-blue-500 pl-4 mb-4 flex items-center gap-2 text-slate-800">
            <Search className="w-6 h-6 text-blue-600"/> Lifecycle Boundary Explanations
          </h2>
          <p className="mb-6">Emissions are routed into exactly discrete ISO modules to ensure transparent reporting devoid of double-counting:</p>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center font-black text-blue-700 text-2xl shrink-0">C1</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Deconstruction / Demolition</h3>
                <p className="text-sm text-slate-600 mb-2">MAPPED TO: <strong>Scope 1 (Direct)</strong></p>
                <p className="text-sm">Includes fuel combusted on-site by machinery (excavators, loaders). The algorithm routes 0.5 to 3.0 Liters/ton of diesel depending on qualitative structural input (Manual vs Mechanical).</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="w-16 h-16 bg-amber-100 rounded flex items-center justify-center font-black text-amber-700 text-2xl shrink-0">C2</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Transport</h3>
                <p className="text-sm text-slate-600 mb-2">MAPPED TO: <strong>Scope 3 (Value Chain / Downstream)</strong></p>
                <p className="text-sm">Accounts for the logistical movement of raw demolition waste to MRFs or Landfills via heavy diesel transport, calculated natively using ton-kilometer (tkm) logic.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded flex items-center justify-center font-black text-purple-700 text-2xl shrink-0">C3 / 4</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Waste Processing & Disposal</h3>
                <p className="text-sm text-slate-600 mb-2">MAPPED TO: <strong>Scope 3 (Value Chain / Downstream)</strong></p>
                <p className="text-sm">Operations occurring at sorting facilities (C3) and terminal regulated landfill sites (C4). The facility capability selected natively adjusts the EF factor here.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-4 border border-emerald-200 rounded-lg bg-emerald-50">
              <div className="w-16 h-16 bg-emerald-200 rounded flex items-center justify-center font-black text-emerald-800 text-xl shrink-0">Mod D</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Recovery & Reuse</h3>
                <p className="text-sm text-slate-600 mb-2">MAPPED TO: <strong>Offsets (Outside System Boundary)</strong></p>
                <p className="text-sm">Represents the massive ecological benefits of circularity. Whenever waste is diverted and crushed into recycled aggregates, it directly halts future virgin material extraction. Scored strictly as a negative carbon ledger.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Data Quality Margins */}
        <section className="mb-8 print:break-inside-avoid">
          <h2 className="text-2xl font-bold border-l-4 border-amber-500 pl-4 mb-4 flex items-center gap-2 text-slate-800">
             <Database className="w-6 h-6 text-amber-600"/> Data Quality (DQ) Modifiers
          </h2>
          <p className="mb-4">Enterprise LCA relies heavily on data pedigree. To prevent "green-washing" via optimistic estimations, our system forcibly penalizes unverified data by inflating gross emissions assumptions through DQ multiplication factors.</p>
          
          <table className="w-full text-left border-collapse border border-slate-200 mb-6">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-200 p-3 text-sm font-bold">DQ Label</th>
                <th className="border border-slate-200 p-3 text-sm font-bold">Multiplier (Margin)</th>
                <th className="border border-slate-200 p-3 text-sm font-bold">Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 p-3 text-sm font-semibold text-emerald-700">Measured</td>
                <td className="border border-slate-200 p-3 text-sm tabular-nums font-mono">1.00 (±0%)</td>
                <td className="border border-slate-200 p-3 text-sm">Hard primary data sourced via invoices, sensors, or verified spatial models.</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-3 text-sm font-semibold text-amber-600">Estimated</td>
                <td className="border border-slate-200 p-3 text-sm tabular-nums font-mono">1.15 (+15%)</td>
                <td className="border border-slate-200 p-3 text-sm">Secondary data constructed through predictive logic or industry averages rather than exact measurement.</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-3 text-sm font-semibold text-red-600">Default</td>
                <td className="border border-slate-200 p-3 text-sm tabular-nums font-mono">1.30 (+30%)</td>
                <td className="border border-slate-200 p-3 text-sm">System fallback data used for entirely unknown variables. Highly penalized to ensure worst-case compliance safety.</td>
              </tr>
            </tbody>
          </table>
          
          <p className="text-xs text-slate-500 italic mt-6 border-t pt-4">This document was generated live via the Veridian Scenario Simulator. Values represent algorithmic architecture, not formal audit certifications.</p>
        </section>

      </div>
    </div>
  );
}
