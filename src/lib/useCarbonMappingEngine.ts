import { useState, useMemo, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";

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
  timelineData: { date: string, impact: number }[];
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

export function useCarbonMappingEngine(userId: string | undefined) {
  const [projectInputs, setProjectInputsState] = useState<ProjectInputs>({
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
  const [isLoading, setIsLoading] = useState(true);

  // Load Initial Data & Subscribe to Firestore
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    // Fetch static project inputs (debounced local state allows us to just pull on mount)
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, "users", userId, "project", "config");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProjectInputsState(docSnap.data() as ProjectInputs);
        }
      } catch (err) {
        console.error("Error fetching project config", err);
      }
    };
    fetchConfig();

    // Subscribe to Activity Logs
    const logsRef = collection(db, "users", userId, "activityLogs");
    const unsubscribe = onSnapshot(logsRef, (snapshot) => {
      const dbLogs: ActivityLog[] = [];
      snapshot.forEach(docSnap => {
        dbLogs.push({ ...docSnap.data(), id: docSnap.id } as ActivityLog);
      });
      setActivityLogs(dbLogs);
      setIsLoading(false); // Stop loading once first snapshot arrives
    }, (error) => {
      console.error("Error fetching logs", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Wrapper to sync inputs to cloud seamlessly
  const setProjectInputs = (newInputs: ProjectInputs) => {
    setProjectInputsState(newInputs);
    if (userId) {
      const docRef = doc(db, "users", userId, "project", "config");
      setDoc(docRef, newInputs, { merge: true }).catch(e => console.error("Cloud Save Error:", e));
    }
  };

  const addActivityLog = async (log: Omit<ActivityLog, 'id'>) => {
    if (!userId) return;
    const logsRef = collection(db, "users", userId, "activityLogs");
    await addDoc(logsRef, log);
  };

  const deleteActivityLog = async (logId: string) => {
    if (!userId) return;
    const docRef = doc(db, "users", userId, "activityLogs", logId);
    await deleteDoc(docRef);
  };

  // The core calculation logic abstracted based on Methodology Formula
  const calculateImpact = (project: ProjectInputs, logs: ActivityLog[]): ImpactLedger => {
    // 0. Determine Data Quality (DQ) factors
    // "Compliance Check" modifies the Data Quality for processing and materials
    const isNonCompliant = project.rulesFollowed === "No" || project.complianceType === "Informal / none";
    const DQ_material = isNonCompliant ? 1.05 : 1.0;
    const DQ_processing = isNonCompliant ? 1.05 : 1.0;
    const DQ_transport = 1.0; // Standard tracking assumption
    
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

    // Material Impact: Σ(Q_i × EF_i × DQ_i)
    const materialImpact = (
      (qCon * FACTORS.material.concrete) + 
      (qSteel * FACTORS.material.steel) + 
      (qBricks * FACTORS.material.bricks) + 
      (qOthers * FACTORS.material.others)
    ) * DQ_material;

    // Dynamic Impacts from Logs
    let loggedMachineImpact = 0;
    let loggedTransportImpact = 0;
    let loggedProcessingImpact = 0;
    let loggedRecyclingBenefit = 0;
    let loggedTons = 0;
    let isEstimated = false;

    // "Type of demolition" scales the Fuel estimator
    const demoTypeMultiplier = project.demolitionType === "Manual" ? 0.2 : project.demolitionType === "Semi-mechanical" ? 0.6 : 1.0;

    // TIMELINE TREND: Sort tools chronologically and track accumulated real emissions (not projected) over time
    const sortedLogs = [...logs].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const timelineData: { date: string, impact: number }[] = [];
    
    // Day 0: Begin with static material burden
    let runningCumulative = materialImpact;
    if (sortedLogs.length > 0) {
      const firstDate = new Date(sortedLogs[0].date);
      firstDate.setDate(firstDate.getDate() - 1);
      timelineData.push({ date: firstDate.toISOString().split("T")[0], impact: Math.round(runningCumulative) });
    } else {
      timelineData.push({ date: "Day 0", impact: Math.round(runningCumulative) });
    }

    sortedLogs.forEach(log => {
      const dailyTons = log.truckLoads * FACTORS.tonsPerTruckLoad;
      loggedTons += dailyTons;
      const DQ_fuel = log.dieselLiters > 0 ? 1.0 : 1.10;

      // 2. Machine Impact (Diesel): (Fuel × 2.68 / 1000) × DQ_fuel
      let fuelUsed = 0;
      if (log.dieselLiters > 0) {
        fuelUsed = log.dieselLiters;
      } else {
        fuelUsed = log.truckLoads * FACTORS.defaultMachineryFuelPerLoad[log.machineryUsage] * demoTypeMultiplier;
        isEstimated = true;
      }
      const logMachineImpact = ((fuelUsed * FACTORS.fuelCarbon) / 1000) * DQ_fuel;
      loggedMachineImpact += logMachineImpact;

      // 3. Transport Impact: (Distance × Waste × EF_transport × DQ_transport)
      const logTransportImpact = ((log.transportDistanceKm * dailyTons * FACTORS.transport) / 1000) * DQ_transport;
      loggedTransportImpact += logTransportImpact;

      // 4. Processing Impact: (Waste × EF_processing × DQ_processing)
      const logProcessingImpact = (dailyTons * FACTORS.processing[log.disposalType]) * DQ_processing;
      loggedProcessingImpact += logProcessingImpact;

      // --- Calculate dynamic avoidance factor ---
      // Instead of an arbitrary fixed 0.50 which over-credits concrete recycling,
      // calculate the average embodied factor per ton based on user's material mix.
      const blendedMaterialFactor = totalMassTons > 0 ? (materialImpact / totalMassTons) : 0;
      // Assume recycling avoids 85% of virgin extraction emissions for those materials
      const dynamicRecoveryAvoidance = blendedMaterialFactor * 0.85;

      // 5. Recycling Benefit: Σ(Recycled_i × EF_avoided,i)
      let logRecyclingBenefit = 0;
      if (log.disposalType === "Recycling") {
        logRecyclingBenefit = (dailyTons * 0.80) * dynamicRecoveryAvoidance;
      } else if (log.disposalType === "Mixed") {
        logRecyclingBenefit = (dailyTons * 0.30) * dynamicRecoveryAvoidance;
      }
      loggedRecyclingBenefit += logRecyclingBenefit;

      // --- Accumulate for the timeline ---
      // We ensure the log impact reflects the net daily addition to the carbon debt
      runningCumulative += (logMachineImpact + logTransportImpact + logProcessingImpact - logRecyclingBenefit);
      
      const existingItem = timelineData.find(t => t.date === log.date);
      if (existingItem) {
        existingItem.impact = Math.max(0, Math.round(runningCumulative));
      } else {
        // Output date as short form (e.g., Apr 03)
        const dt = new Date(log.date);
        const shortDate = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        timelineData.push({ date: shortDate, impact: Math.max(0, Math.round(runningCumulative)) });
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
    
    // Formula Aggregation: E_total = Material + Machine + Transport + Processing - Recycling
    const totalEmissions = Math.max(0, materialImpact + machineImpact + transportImpact + processingImpact - recyclingBenefit);
    
    // Calculate how much extra carbon came specifically from the DQ processing/material penalty for UI
    const compliancePenalty = (materialImpact - (materialImpact / DQ_material)) + (processingImpact - (processingImpact / DQ_processing));

    return {
      materialImpact,
      machineImpact,
      transportImpact,
      processingImpact,
      recyclingBenefit,
      compliancePenalty,
      totalEmissions,
      isEstimated,
      isProjected,
      timelineData
    };
  };

  const currentImpact = useMemo(() => calculateImpact(projectInputs, activityLogs), [projectInputs, activityLogs]);

  // Simulated "What if I improve this?" Baseline 
  const simulatedImpact = useMemo(() => {
    // The "ideal simulation" focuses ONLY on things the contractor controls practically:
    // 1. We maximize circular economy routing by enforcing Recycling.
    // 2. We remove Data Quality uncertainty penalties (e.g., simulating exact fuel tracking).
    // Physical distances and baseline mathematical parameters remain strictly unchanged.
    const optimizedLogs = activityLogs.map(log => ({
      ...log,
      disposalType: "Recycling" as const, // Fixes: Maximizes EF_avoided
      dieselLiters: log.dieselLiters > 0 ? log.dieselLiters : 0.001, // Hack to bypass the DQ_fuel penalty (makes fuel EXACT rather than estimated)
    }));

    // We make compliance perfect (removing DQ_material and DQ_processing penalties)
    const optimizedProject = {
      ...projectInputs,
      rulesFollowed: "Yes" as const,
      complianceType: "BMC guidelines" as const,
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
    addActivityLog,
    deleteActivityLog,
    currentImpact,
    simulatedImpact,
    activeImpact,
    simulationActive,
    toggleSimulation,
    isLoading
  };
}
