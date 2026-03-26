import { useState, useMemo } from "react";

export type DataQuality = "Measured" | "Estimated" | "Default";

// DQ Multipliers: Lower quality = Higher penalty margin of error
const DQ_FACTORS: Record<DataQuality, number> = {
  "Measured": 1.0,
  "Estimated": 1.15,
  "Default": 1.30,
};

export interface QParam<T> {
  value: T;
  quality: DataQuality;
}

// Project level inputs that apply to both Baseline and Scenario
export interface ProjectInputs {
  builtUpArea: QParam<number>; // m2
  floors: QParam<number>;
  concretePercent: number; // 0-100
  steelPercent: number; // 0-100
  bricksPercent: number; // 0-100
  othersPercent: number; // 0-100
  materialDensity: QParam<number>; // kg/m2
}

export interface ScenarioInputs {
  demolitionType: "Manual" | "Semi-mechanical" | "Mechanical"; // Maps to default fuel assumptions
  transportDistance: QParam<number>; // km
  processingType: "Landfill" | "Mixed" | "Recycling";
  recyclingRate: QParam<number>; // %
}

const FACTORS = {
  material: {
    concrete: 0.12, // tCO2/ton
    steel: 2.15,
    bricks: 0.30,
    others: 0.05,
  },
  demolitionFuel: {
    "Manual": 0.5, // L/ton
    "Semi-mechanical": 1.5,
    "Mechanical": 3.0,
  },
  fuelCarbon: 2.68, // kg CO2/L
  transport: 0.10, // kg CO2/ton-km
  processing: {
    "Landfill": 0.05, 
    "Mixed": 0.03,
    "Recycling": 0.015,
  },
  recoveryAvoidance: 0.50, // Avoided tCO2/ton
};

export interface FootprintLedger {
  boundaries: {
    // E_total = Σ(Q × EF × DQ) + Σ(Activity × EF × DQ) − Σ(Recovery × Avoided EF)
    c1_demolition: number;
    c2_transport: number;
    c3_processing: number;
    c4_disposal: number;
    d_recovery: number; // Negative offset
  };
  scopes: {
    scope1: number; // Direct Fuel (C1)
    scope3: number; // Value Chain (C2, C3, C4)
  };
  netTotal: number;
  dataQualityScore: number; // 0-100% confidence rating
}

export function useCarbonMappingEngine() {
  const [projectInputs, setProjectInputs] = useState<ProjectInputs>({
    builtUpArea: { value: 5000, quality: "Measured" },
    floors: { value: 3, quality: "Measured" },
    concretePercent: 60,
    steelPercent: 15,
    bricksPercent: 15,
    othersPercent: 10,
    materialDensity: { value: 1400, quality: "Default" },
  });

  const [baselineScenario, setBaselineScenario] = useState<ScenarioInputs>({
    demolitionType: "Mechanical",
    transportDistance: { value: 45, quality: "Default" }, 
    processingType: "Landfill",
    recyclingRate: { value: 10, quality: "Default" }, 
  });

  const [alternativeScenario, setAlternativeScenario] = useState<ScenarioInputs>({
    demolitionType: "Semi-mechanical",
    transportDistance: { value: 15, quality: "Estimated" }, 
    processingType: "Recycling",
    recyclingRate: { value: 85, quality: "Estimated" }, 
  });

  const calculateLedger = (proj: ProjectInputs, scen: ScenarioInputs): FootprintLedger => {
    // Step 1: Material Quantification w/ DQ
    // We blend the DQ factors of the core structural variables to find the mass DQ multiplier
    const massDQ = (DQ_FACTORS[proj.builtUpArea.quality] + 
                    DQ_FACTORS[proj.floors.quality] + 
                    DQ_FACTORS[proj.materialDensity.quality]) / 3;
    
    const baseTons = (proj.builtUpArea.value * proj.floors.value * proj.materialDensity.value) / 1000;
    const totalMassTons = baseTons * massDQ; // Uncertainty increases mass estimation defensively

    // ISO Boundary C1: Demolition (Scope 1)
    const fuelLiters = totalMassTons * FACTORS.demolitionFuel[scen.demolitionType];
    const c1_demo = (fuelLiters * FACTORS.fuelCarbon) / 1000; 

    // ISO Boundary C2: Transport (Scope 3)
    const transportDQ = DQ_FACTORS[scen.transportDistance.quality];
    const c2_transport = ((scen.transportDistance.value * transportDQ) * totalMassTons * FACTORS.transport) / 1000; 

    // ISO Boundary C3 & C4: Processing & Disposal (Scope 3)
    // If landfill -> C4. If recycling/mixed -> C3.
    let c3_processing = 0;
    let c4_disposal = 0;
    const eProc = totalMassTons * FACTORS.processing[scen.processingType];
    
    if (scen.processingType === "Landfill") {
      c4_disposal = eProc; // Unregulated C4
    } else {
      c3_processing = eProc; // Regulated C3 Processing
    }

    // ISO Module D: Recovery & Benefits (Outside System Boundary Offset)
    const recycleDQ = DQ_FACTORS[scen.recyclingRate.quality];
    // Recycling rate shouldn't be penalized by DQ, but rather scaled safely. If it's a default assumption, we assume LESS recycling.
    // Inverse DQ for benefits: A high DQ factor (1.30) means we should divide the benefit to safely underestimate it.
    const safeRecyclingRate = (scen.recyclingRate.value / recycleDQ) / 100;
    
    const recycledTons = totalMassTons * safeRecyclingRate;
    const d_recovery = recycledTons * FACTORS.recoveryAvoidance; // tCO2 Avoided

    const netTotal = c1_demo + c2_transport + c3_processing + c4_disposal - d_recovery;

    // Calculate overall Confidence Score (0-100) based on DQ inputs
    const avgDQFactor = (massDQ + transportDQ + recycleDQ) / 3;
    // Factor 1.0 = 100%, 1.15 = 50% confidence, 1.30 = 0% confidence
    const confidenceScore = Math.max(0, Math.min(100, (1.30 - avgDQFactor) * (100 / 0.30)));

    return {
      boundaries: {
        c1_demolition: c1_demo,
        c2_transport: c2_transport,
        c3_processing: c3_processing,
        c4_disposal: c4_disposal,
        d_recovery: -d_recovery, // Displayed heavily negative
      },
      scopes: {
        scope1: c1_demo,
        scope3: c2_transport + c3_processing + c4_disposal,
      },
      netTotal,
      dataQualityScore: confidenceScore,
    };
  };

  const results = useMemo(() => {
    const baseline = calculateLedger(projectInputs, baselineScenario);
    const alternative = calculateLedger(projectInputs, alternativeScenario);

    const netSavings = baseline.netTotal - alternative.netTotal;
    const savingsPercent = (netSavings / baseline.netTotal) * 100;
    
    // Core baseline mass without DQ penalty for standard display
    const totalWasteTons = (projectInputs.builtUpArea.value * projectInputs.floors.value * projectInputs.materialDensity.value) / 1000;

    return {
      baseline,
      alternative,
      netSavings,
      savingsPercent,
      totalWasteTons
    };
  }, [projectInputs, baselineScenario, alternativeScenario]);

  return {
    projectInputs,
    setProjectInputs,
    baselineScenario,
    setBaselineScenario,
    alternativeScenario,
    setAlternativeScenario,
    results,
    factors: FACTORS,
  };
}
