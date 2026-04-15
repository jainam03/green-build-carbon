# Green Build Carbon Dashboard & Calculations Documentation (v1.1 Corrected)

## Overview
Green Build Carbon is designed to be a highly intuitive, contractor-friendly carbon tracking dashboard. Unlike traditional enterprise Life Cycle Assessment (LCA) tools that rely on overly granular inputs and static reports, this platform prioritizes practical on-site tracking. It uses standard physical inputs (square footage, truckloads, basic percentages) alongside an intelligent dynamic extrapolation engine to forecast and visualize total project emissions in real-time.

---

## 1. Project Baseline & Embodied Carbon
The system automatically calculates a baseline embodied carbon footprint from simplified project parameters.

### Material Mass Calculation
Instead of requiring exact material manifests, mass is derived from typical building density.
* `Area (sqm) = Area (sqft) / 10.7639`
* `Total Project Mass (tons) = (Area (sqm) × 1400 kg/m²) / 1000`

### Baseline Material Impact
The total mass is divided based on user-defined material mix percentages (Concrete, Steel, Bricks, Others) and multiplied by built-in emission factors:
* **Concrete:** 0.12 tCO₂/ton
* **Steel:** 2.15 tCO₂/ton
* **Bricks:** 0.30 tCO₂/ton
* **Others:** 0.05 tCO₂/ton

**Formula:**
`Material Impact = Σ (Mass_material × Emission Factor) × DQ_material`

---

## 2. Activity Logging & Operational Tracking
Daily activities are logged using contractor terms. The system dynamically translates these to emissions across three categories:

### A. Machine Impact (Fuel Emissions)
Calculates emissions from operating machinery on site.
* **Fuel Estimation:** If exact diesel liters are not entered, the system calculates usage using an activity-based scaler:
    * `Usage_Base = Truckloads × Default_Fuel_Usage` (Low: 10L, Medium: 30L, High: 60L)
    * `Fuel_Estimated = Usage_Base × Demolition_Multiplier` (Manual: 0.2, Semi: 0.6, Mechanical: 1.0)
* **Factor:** 2.68 kg CO₂ per Liter of Diesel
* **Formula:** `Machine Impact = ((Fuel_Consumed × 2.68) / 1000) × DQ_fuel`

### B. Transport Impact
Calculates emissions from hauling material to waste facilities.
* **Variable:** 1 Truckload is standardized to average 20 tons of material.
* **Factor:** 0.10 kg CO₂ per ton-km
* **Formula:** `Transport Impact = ((Distance × Truckloads × 20 tons × 0.10) / 1000) × DQ_transport`

### C. Processing & Disposal Impact
Calculates the end-of-life impact of waste handling.
* **Factors based on Disposal Type:** 
    * Dumping: 0.05 tCO₂/ton
    * Mixed Disposal: 0.03 tCO₂/ton
    * Pure Recycling: 0.015 tCO₂/ton
* **Formula:** `Processing Impact = (Truckloads × 20 tons × Disposal Factor) × DQ_processing`

---

## 3. Recycling Incentives & Carbon Credits
Recovering materials creates a **Recycling Benefit** that acts as a negative carbon credit.

Instead of a static number, the recovery value dynamically scales based on the project's specific material mix:
* `Dynamic Avoidance Factor = Average Embodied Material Factor × 85%` 
* `Recycling Benefit = (Tons Logged × Recycling Yield %) × Dynamic Avoidance Factor`
    * *Yield is 80% for Pure Recycling loads and 30% for Mixed loads.*

---

## 4. The Projection Engine (Forecasting)
The engine projects the current operational pace over the entire project lifecycle.
* `Projection Scale = Total Project Mass (tons) / Total Logged Mass (tons)`

The engine multiplies current Machine, Transport, Processing, and Recycling metrics by this scale to provide a **Forecast of Terminal Emissions**.

---

## 5. Data Quality (DQ) Penalties & Default Behavior
To ensure accountability, mathematical penalties are added for estimations or lack of verification.

* **Estimation Penalty:** If diesel consumption is estimated instead of explicitly tracked, fuel emissions incur a **10% penalty** (`DQ_fuel = 1.10`).
* **Compliance Penalty:** Material and Processing results suffer a **5% penalty** (`DQ_material = 1.05`) if:
    1. Rules are explicitly not followed.
    2. **OR** the compliance type is "Informal / none" (The system defaults to this state initially).

---

## 6. Dashboard Visualization Logic
The master headline figure consolidates all components:
`Total CO₂ = (Material Baseline) + Projected(Machine + Transport + Processing - Recycling)`

**Note on Charts:** To maintain clarity, the **Emission Breakdown (Pie Chart)** displays only the three primary tangible impacts: **Material**, **Machine**, and **Transport**. Processing Impacts and Recycling Benefits are accounted for in the master total but excluded from the visual pie breakdown to avoid cluttering operational insights.
