import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Recycle, ArrowLeft, Lightbulb } from "lucide-react";

interface DashboardPageProps {
  onBack: () => void;
}

const DashboardPage = ({ onBack }: DashboardPageProps) => {
  const [area, setArea] = useState(1000);
  const [type, setType] = useState("RCC");
  const [distance, setDistance] = useState(25);
  const [recycling, setRecycling] = useState(10);
  const [fuel, setFuel] = useState(50);

  const stats = useMemo(() => {
    const wasteKg = area * 0.0929 * 150;
    const baseCarbon = (wasteKg * 0.15) / 1000;
    const fuelCarbon = (fuel * 2.68) / 1000;
    const transportCarbon = distance * wasteKg * 0.0001;
    const savings = baseCarbon * (recycling / 100);
    const total = Math.max(0, baseCarbon + fuelCarbon + transportCarbon - savings);

    return {
      total: total.toFixed(2),
      totalNum: total,
      breakdown: [
        { label: "Materials", val: baseCarbon, color: "bg-emerald-deep" },
        { label: "Machinery", val: fuelCarbon, color: "bg-accent" },
        { label: "Transport", val: transportCarbon, color: "bg-emerald-light" },
      ],
      savings: savings.toFixed(2),
      savingsNum: savings,
    };
  }, [area, type, distance, recycling, fuel]);

  const breakdownTotal = stats.breakdown.reduce((s, b) => s + b.val, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-[380px] bg-card border-b lg:border-b-0 lg:border-r border-border p-6 lg:p-8 flex flex-col gap-6 lg:overflow-y-auto lg:min-h-screen">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-accent" /> Carbon Simulator
          </h2>

          <div className="space-y-5">
            <InputField label="Project Area (sq ft)">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value) || 0)}
                className="w-full p-3 rounded-button border border-border bg-background focus:ring-2 focus:ring-accent/40 outline-none transition-all text-sm"
              />
            </InputField>

            <InputField label="Building Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-button border border-border bg-background outline-none text-sm"
              >
                <option value="RCC">RCC Structure</option>
                <option value="Brick">Brick & Mortar</option>
              </select>
            </InputField>

            <SliderField
              label="Disposal Distance"
              value={distance}
              unit="km"
              min={1}
              max={200}
              onChange={setDistance}
            />

            <SliderField
              label="Recycling Rate"
              value={recycling}
              unit="%"
              min={0}
              max={50}
              onChange={setRecycling}
            />

            <InputField label="Fuel Used (liters)">
              <input
                type="number"
                value={fuel}
                onChange={(e) => setFuel(Number(e.target.value) || 0)}
                className="w-full p-3 rounded-button border border-border bg-background focus:ring-2 focus:ring-accent/40 outline-none transition-all text-sm"
              />
            </InputField>
          </div>
        </div>

        <div className="mt-auto p-4 bg-secondary rounded-card border border-dashed border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Formula:</strong> (W × 0.15) + (F × 2.68) + (D × W × 0.1) − Recycling Savings.
            Values update in real-time.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">
            Live Analysis
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Carbon Footprint Output
          </h1>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Hero Metric */}
          <div className="col-span-12 lg:col-span-7 bg-emerald-deep rounded-card p-10 lg:p-16 flex flex-col justify-center items-center text-center shadow-elevated">
            <p className="text-emerald-light font-medium mb-2 text-sm">
              Estimated Total Emissions
            </p>
            <motion.div
              key={stats.total}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-6xl lg:text-8xl font-extrabold text-primary-foreground tabular-nums"
            >
              {stats.total}
            </motion.div>
            <p className="text-xl lg:text-2xl text-emerald-light mt-2">
              Tons CO₂e
            </p>
          </div>

          {/* Insights + Savings */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-card rounded-card p-6 shadow-card flex-1">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-sm">
                <Lightbulb size={16} className="text-accent" /> Smart Insights
              </h4>
              <ul className="space-y-4">
                <li className="text-sm flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>
                    Increasing recycling to 40% would save an additional{" "}
                    <strong>
                      {(stats.totalNum * 0.3).toFixed(2)} tons
                    </strong>
                    .
                  </span>
                </li>
                <li className="text-sm flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>
                    Transport accounts for{" "}
                    <strong>
                      {stats.totalNum > 0
                        ? (
                            (stats.breakdown[2].val / stats.totalNum) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </strong>{" "}
                    of your footprint.
                  </span>
                </li>
                <li className="text-sm flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>
                    Higher disposal distance significantly increases emissions.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-bg rounded-card p-6">
              <p className="text-xs font-bold text-accent uppercase mb-1 tracking-wider">
                Recycling Credit
              </p>
              <div className="flex items-center gap-2">
                <Recycle size={20} className="text-accent" />
                <motion.span
                  key={stats.savings}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-emerald-deep"
                >
                  −{stats.savings} Tons
                </motion.span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="col-span-12 bg-card rounded-card p-6 shadow-card">
            <h4 className="font-bold mb-6">Emissions Breakdown</h4>
            <div className="flex h-10 w-full rounded-full overflow-hidden bg-secondary">
              {stats.breakdown.map((item, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: `${breakdownTotal > 0 ? (item.val / breakdownTotal) * 100 : 33}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`h-full ${item.color}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-6 mt-5">
              {stats.breakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {item.val.toFixed(2)}t
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Helpers */
const InputField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    {children}
  </div>
);

const SliderField = ({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <span className="text-sm font-bold text-accent tabular-nums">
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-accent h-2 rounded-full cursor-pointer"
      style={{ accentColor: "hsl(158, 64%, 45%)" }}
    />
  </div>
);

export default DashboardPage;
