import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MethodologyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/docs/formulas", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <p className="font-semibold italic">Redirecting to new documentation...</p>
    </div>
  );
}
