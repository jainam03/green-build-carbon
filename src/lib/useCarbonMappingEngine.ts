import { useState, useMemo } from "react";

// Simplified Project Inputs required by the Contractor
export interface ProjectInputs {
  // Basic Info
  areaSqft: number;
  demolitionType: "Manual" | "Semi-mechanical" | "Mechanical";
  
  // Material Composition sliders (sum to 100 is ideal, but handled loosely)
  concretePercent: number;
  steelPercent: number;
  bricksPercent: number;
  othersPercent: number;
  
  // Compliance
  rulesFollowed: "Yes" | "No" | "Not sure";
  complianceType: "BMC guidelines" | "CPCB rules" | "Informal / none";
}

export interface ActivityLog {
  id: string;
  date: string;
  dieselLiters: number; // If 0, use qualitative category below
  machineryUsage: "Low" | "Medium" | "High";
  transportDistanceKm: number;
  disposalType: "Dumping" | "Mixed" | "Recycling";
  truckLoads: number; // Represents daily volume moved
}

// Flat Impact LEDGER
export interface ImpactLedger {
  materialImpact: number;
  machineImpact: number;
  transportImpact: number;
  processingImpact: number;
  recyclingBenefit: number; 
  compliancePenalty: number;
  totalEmissions: number;
  isEstimated: boolean; // Flag to indicate if the 10% penalty was applied
  isProjected: boolean; // Flag to indicate if operations were projected to full mass
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
  // Defaults if exact diesel isn't provided (Liters per average 20-ton truck load)
  defaultMachineryFuelPerLoad: {
    "Low": 10,
    "Medium": 30,
    "High": 60,
  },
  transport: 0.10, // kg CO2/ton-km
  processing: {
    "Dumping": 0.05, 
    "Mixed": 0.03,
    "Recycling": 0.015,
  },
  recoveryAvoidance: 0.50, // Avoided tCO2/ton when recycled
  tonsPerTruckLoad: 20, // Assumed average tons per truck
};

export function useCarbonMappingEngine() {
  const [projectInputs, setProjectInputs] = useState<ProjectInputs>({
    areaSqft: 0,
    demolitionType: "Mechanical",
    concretePercent: 0,
    steelPercent: 0,
    bricksPercent: 0,
    othersPercent: 0,
    rulesFollowed: "Not sure",
    complianceType: "Informal / none",
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [simulationActive, setSimulationActive] = useState(false);

  // The core calculation logic abstracted
  const calculateImpact = (project: ProjectInputs, logs: ActivityLog[]): ImpactLedger => {
    // 1. Estimate total mass (Area x Density). Convert sqft to sqm first (1 sqm = 10.7639 sqft)
    const areaSqm = project.areaSqft ? project.areaSqft / 10.7639 : 0;
    const totalMassTons = (areaSqm * FACTORS.materialDensity) / 1000;

    // Split materials
    const sumP = project.concretePercent + project.steelPercent + project.bricksPercent + project.othersPercent;
    const activeSum = sumP > 0 ? sumP : 100; // avoid div by zero
    
    const qCon = totalMassTons * (project.concretePercent / activeSum);
    const qSteel = totalMassTons * (project.steelPercent / activeSum);
    const qBricks = totalMassTons * (project.bricksPercent / activeSum);
    const qOthers = totalMassTons * (project.othersPercent / activeSum);

    // Material Impact (Static based on building properties)
    const materialImpact = 
      (qCon * FACTORS.material.concrete) + 
      (qSteel * FACTORS.material.steel) + 
      (qBricks * FACTORS.material.bricks) + 
      (qOthers * FACTORS.material.others);

    // Dynamic Impacts from Logs
    let loggedMachineImpact = 0;
    let loggedTransportImpact = 0;
    let loggedProcessingImpact = 0;
    let loggedRecyclingBenefit = 0;
    let loggedTons = 0;
    let isEstimated = false;

    // Apply multiplier based on Demolition Type
    const demoTypeMultiplier = project.demolitionType === "Manual" ? 0.2 : project.demolitionType === "Semi-mechanical" ? 0.6 : 1.0;

    logs.forEach(log => {
      const dailyTons = log.truckLoads * FACTORS.tonsPerTruckLoad;
      loggedTons += dailyTons;

      // 2. Machine Impact (Diesel)
      if (log.dieselLiters > 0) {
        loggedMachineImpact += (log.dieselLiters * FACTORS.fuelCarbon) / 1000;
      } else {
        // Estimate based on loads, scaled by demolition type.
        const estimatedFuel = log.truckLoads * FACTORS.defaultMachineryFuelPerLoad[log.machineryUsage] * demoTypeMultiplier;
        loggedMachineImpact += (estimatedFuel * FACTORS.fuelCarbon) / 1000;
        isEstimated = true;
      }

      // 3. Transport Impact
      loggedTransportImpact += (log.transportDistanceKm * dailyTons * FACTORS.transport) / 1000;

      // 4. Processing Impact
      loggedProcessingImpact += dailyTons * FACTORS.processing[log.disposalType];

      // 5. Recycling Benefit
      if (log.disposalType === "Recycling") {
        loggedRecyclingBenefit += (dailyTons * 0.80) * FACTORS.recoveryAvoidance;
      } else if (log.disposalType === "Mixed") {
        loggedRecyclingBenefit += (dailyTons * 0.30) * FACTORS.recoveryAvoidance;
      }
    });

    // Forecast / Project operational impacts to the WHOLE building size!
    // This allows the pie chart to be highly accurate based on current workflow rate.
    let machineImpact = 0;
    let transportImpact = 0;
    let processingImpact = 0;
    let recyclingBenefit = 0;
    let isProjected = false;

    if (loggedTons > 0 && totalMassTons > 0) {
      // e.g. If logged 100 tons out of 5000, multiply impacts by 50 to forecast total.
      const projectionScale = Math.max(1, totalMassTons / loggedTons);
      machineImpact = loggedMachineImpact * projectionScale;
      transportImpact = loggedTransportImpact * projectionScale;
      processingImpact = loggedProcessingImpact * projectionScale;
      recyclingBenefit = loggedRecyclingBenefit * projectionScale;
      isProjected = projectionScale > 1.01;
    }

    // 6. Data Quality Adjustment (The 10% penalty if ANY logs use estimated fuel)
    let opsTotal = machineImpact + transportImpact + processingImpact - recyclingBenefit;
    if (isEstimated) {
      opsTotal = opsTotal * 1.10; // Apply 10% adjustment penalty to operations
    }

    // 7. Compliance Penalty (Add 5% to overall if rules entirely ignored or informal)
    let rawTotal = materialImpact + opsTotal;
    let compliancePenalty = 0;
    const isNonCompliant = project.rulesFollowed === "No" || project.complianceType === "Informal / none";
    
    if (isNonCompliant && rawTotal > 0) {
      compliancePenalty = rawTotal * 0.05;
      rawTotal += compliancePenalty;
    }

    return {
      materialImpact,
      machineImpact,
      transportImpact,
      processingImpact: processingImpact + compliancePenalty, // roll penalty into processing/other for now
      recyclingBenefit,
      compliancePenalty,
      totalEmissions: Math.max(0, rawTotal),
      isEstimated,
      isProjected
    };
  };

  const currentImpact = useMemo(() => calculateImpact(projectInputs, activityLogs), [projectInputs, activityLogs]);

  // Simulated "What if I improve this?" Baseline 
  const simulatedImpact = useMemo(() => {
    // We optimize existing logs dynamically
    const optimizedLogs = activityLogs.map(log => ({
      ...log,
      transportDistanceKm: Math.min(10, log.transportDistanceKm * 0.5), // Shorten route
      disposalType: "Recycling" as const, // Force circularity
      dieselLiters: log.dieselLiters > 0 ? log.dieselLiters * 0.8 : 0, // Optimize exact fuel if tracked
      machineryUsage: "Low" as const, // Optimize machinery runtimes
    }));

    // We also make compliance perfect
    const optimizedProject = {
      ...projectInputs,
      rulesFollowed: "Yes" as const,
      complianceType: "BMC guidelines" as const,
      demolitionType: "Manual" as const, // manual is less carbon intensive
    }

    return calculateImpact(optimizedProject, optimizedLogs);
  }, [projectInputs, activityLogs]);

  const toggleSimulation = () => setSimulationActive(!simulationActive);

  // Expose active view depending on simulation state
  const activeImpact = simulationActive ? simulatedImpact : currentImpact;

  return {
    projectInputs,
    setProjectInputs,
    activityLogs,
    setActivityLogs,
    currentImpact,
    simulatedImpact,
    activeImpact,
    simulationActive,
    toggleSimulation
  };
}
