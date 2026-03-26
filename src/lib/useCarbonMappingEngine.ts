import { useState, useMemo } from "react";

// Simplified Project Inputs required by the Contractor
export interface ContractorInputs {
  // Basic Info
  areaSqft: number;
  demolitionType: "Manual" | "Semi-mechanical" | "Mechanical";
  
  // Material Composition sliders (sum to 100 is ideal, but handled loosely)
  concretePercent: number;
  steelPercent: number;
  bricksPercent: number;
  othersPercent: number;
  
  // Waste Handling
  transportDistanceKm: number;
  disposalType: "Dumping" | "Mixed" | "Recycling";
  
  // Activity Inputs (Fuel)
  dieselLiters: number; // If 0, use qualitative category below
  machineryUsage: "Low" | "Medium" | "High";
  
  // Compliance
  rulesFollowed: "Yes" | "No" | "Not sure";
  complianceType: "BMC guidelines" | "CPCB rules" | "Informal / none";
}

// Flat Impact LEDGER
export interface ImpactLedger {
  materialImpact: number;
  machineImpact: number;
  transportImpact: number;
  processingImpact: number;
  recyclingBenefit: number; 
  totalEmissions: number;
  isEstimated: boolean; // Flag to indicate if the 10% penalty was applied
}

// Methodology Factors (Hidden Backend Rigor)
const FACTORS = {
  materialDensity: 1400, // kg/m2 (default C&D assumption)
  material: {
    concrete: 0.12, // tCO2/ton
    steel: 2.15,
    bricks: 0.30,
    others: 0.05,
  },
  fuelCarbon: 2.68, // kg CO2/L
  // Defaults if exact diesel isn't provided (Liters per ton of waste)
  defaultMachineryFuel: {
    "Low": 0.5,
    "Medium": 1.5,
    "High": 3.0,
  },
  transport: 0.10, // kg CO2/ton-km
  processing: {
    "Dumping": 0.05, 
    "Mixed": 0.03,
    "Recycling": 0.015,
  },
  recoveryAvoidance: 0.50, // Avoided tCO2/ton when recycled
};

export function useCarbonMappingEngine() {
  const [inputs, setInputs] = useState<ContractorInputs>({
    areaSqft: 50000,
    demolitionType: "Mechanical",
    concretePercent: 60,
    steelPercent: 15,
    bricksPercent: 15,
    othersPercent: 10,
    transportDistanceKm: 45,
    disposalType: "Dumping",
    dieselLiters: 0,
    machineryUsage: "High",
    rulesFollowed: "No",
    complianceType: "Informal / none",
  });

  const [simulationActive, setSimulationActive] = useState(false);

  // The core calculation logic abstracted
  const calculateImpact = (data: ContractorInputs): ImpactLedger => {
    // 1. Estimate total mass (Area x Density). Convert sqft to sqm first (1 sqm = 10.7639 sqft)
    const areaSqm = data.areaSqft / 10.7639;
    const totalMassTons = (areaSqm * FACTORS.materialDensity) / 1000;

    // Split materials
    const qCon = totalMassTons * (data.concretePercent / 100);
    const qSteel = totalMassTons * (data.steelPercent / 100);
    const qBricks = totalMassTons * (data.bricksPercent / 100);
    const qOthers = totalMassTons * (data.othersPercent / 100);

    // Material Impact
    const materialImpact = 
      (qCon * FACTORS.material.concrete) + 
      (qSteel * FACTORS.material.steel) + 
      (qBricks * FACTORS.material.bricks) + 
      (qOthers * FACTORS.material.others);

    // 2. Machine Impact (Diesel)
    let machineImpact = 0;
    let isEstimated = false;
    if (data.dieselLiters > 0) {
      machineImpact = (data.dieselLiters * FACTORS.fuelCarbon) / 1000;
    } else {
      // User didn't track fuel accurately. Use default + exact 10% penalty later on total.
      const fuelLiters = totalMassTons * FACTORS.defaultMachineryFuel[data.machineryUsage];
      machineImpact = (fuelLiters * FACTORS.fuelCarbon) / 1000;
      isEstimated = true;
    }

    // 3. Transport Impact
    const transportImpact = (data.transportDistanceKm * totalMassTons * FACTORS.transport) / 1000;

    // 4. Processing Impact
    const processingImpact = totalMassTons * FACTORS.processing[data.disposalType];

    // 5. Recycling Benefit
    let recyclingBenefit = 0;
    if (data.disposalType === "Recycling") {
      // Assume 80% recovery at true recycling plant
      recyclingBenefit = (totalMassTons * 0.80) * FACTORS.recoveryAvoidance;
    } else if (data.disposalType === "Mixed") {
      // Assume 30% recovery at mixed MRF
      recyclingBenefit = (totalMassTons * 0.30) * FACTORS.recoveryAvoidance;
    }

    // 6. Data Quality Adjustment (The 10% penalty for unmeasured fuel/estimates)
    let rawTotal = materialImpact + machineImpact + transportImpact + processingImpact - recyclingBenefit;
    if (isEstimated) {
      rawTotal = rawTotal * 1.10; // Apply 10% adjustment penalty
    }

    return {
      materialImpact,
      machineImpact,
      transportImpact,
      processingImpact,
      recyclingBenefit,
      totalEmissions: Math.max(0, rawTotal),
      isEstimated
    };
  };

  const currentImpact = useMemo(() => calculateImpact(inputs), [inputs]);

  // Simulated "What if I improve this?" Baseline (Lower transport, exact fuel, recycling)
  const simulatedImpact = useMemo(() => {
    return calculateImpact({
      ...inputs,
      transportDistanceKm: Math.min(10, inputs.transportDistanceKm * 0.5), // Shorten route
      disposalType: "Recycling", // Force circularity
      // Assuming they measure diesel if they are optimizing
      dieselLiters: inputs.dieselLiters > 0 ? inputs.dieselLiters * 0.8 : 0, 
      machineryUsage: "Low", // Optimize machinery runtimes
    });
  }, [inputs]);

  const toggleSimulation = () => setSimulationActive(!simulationActive);

  // Expose active view depending on simulation state
  const activeImpact = simulationActive ? simulatedImpact : currentImpact;

  return {
    inputs,
    setInputs,
    currentImpact,
    simulatedImpact,
    activeImpact,
    simulationActive,
    toggleSimulation
  };
}
