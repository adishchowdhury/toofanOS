# ToofanOS — Anticipatory Action Operating System (AA-OS)

> **"From Forecast to Action Before Impact"**  
> An autonomous geospatial intelligence compiler and emergency response system that translates raw meteorological hazard forecasts into deterministic, time-bound operational orders, citizen lifelines, and instant parametric insurance liquidity before coastal cyclone landfall.

---

## 🌪️ Executive Summary

Traditional disaster management suffers from a fatal **"Last-Mile Action Deficit"**: meteorological agencies (e.g., IMD, NOAA, ECMWF) provide accurate forecasts (*"Category 4 Cyclone, 215 km/h winds, landfall in 6 hours"*), yet emergency operations centers (EOCs) are forced to coordinate across fragmented phone trees, static PDF bulletins, and ad-hoc spreadsheets.

**ToofanOS replaces manual coordination with a unified, autonomous operating system:**
1. **At $T-06:00$ (Anticipatory Window)**: Hydro-inundation bathtub modeling identifies low-lying coastal sectors and automatically dispatches high-clearance evacuation transit buses.
2. **At $T-04:00$ (Critical Asset Defense)**: Models exact surge breach depth at coastal power substations, ordering sectional grid de-energization to prevent multimillion-dollar transformer terminal explosions.
3. **At $T-02:00$ (Medical Continuity)**: Identifies threatened ground-floor hospital wards and establishes an emergency diesel fuel corridor to power ICU ventilators through the blackout.
4. **At $T-00:00$ (Landfall & Immediate Liquidity)**: Verifies objective storm surge thresholds ($\ge 2.00\text{m}$) via satellite marine oracles and instantly executes smart parametric disaster insurance payouts directly into municipal relief accounts.
5. **Ground-Truth Feedback Loop**: Citizens trapped in the surge corridor can broadcast one-tap GPS emergency alerts, report overtopped dikes, locate nearest elevated shelters, and feed live ground truth directly back into the government command desk.

---

## 🏛️ Dual-Audience Architecture

ToofanOS is architected around two complementary user tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 TOOFANOS                                    │
└───────────────────────┬─────────────────────────────┬───────────────────────┘
                        │                             │
                        ▼                             ▼
        ┌──────────────────────────────┐ ┌──────────────────────────────┐
        │   GOVERNMENT EOC PLATFORM    │ │   CITIZEN LIFELINE & SCOUT   │
        │   (Incident Commanders)      │ │   (Public Coastal Residents) │
        ├──────────────────────────────┤ ├──────────────────────────────┤
        │ • Multi-role Action Compiler │ │ • 1-Tap Hardware GPS Lock    │
        │ • Geospatial Exposure Digital│ │ • Dynamic Surge Danger Meter │
        │   Twin (Google Maps Satellite│ │ • Nearest Shelters (+9m MSL) │
        │ • Infrastructure Graph Matrix│ │ • Crowdsourced SOS Reporting │
        │ • Parametric Insurance Engine│ │ • One-Touch Helplines (112)  │
        │ • Immutable Audit Ledger     │ │ • Real-Time Hazard Feed      │
        └──────────────────────────────┘ └──────────────────────────────┘
                        │                             │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │    FIREBASE CLOUD FIRESTORE SYNC    │
                    │ (Live SOS Stream & Directive Store) │
                    └─────────────────────────────────────┘
```

### 1. Incident Command Center (EOC)
Built for **District Magistrates/Collectors**, **NDRF / SDRF Incident Commanders**, **Municipal Commissioners**, **Hospital Chief Medical Officers (CMOs)**, and **State Power Transmission Operators (WBSEDCL / OPTCL)**.

### 2. Citizen Lifeline & Ground Scout
Built specifically for **coastal citizens and field volunteers** facing imminent storm surge. Stripped of government complexity, this interface focuses on three life-critical tasks:
- **Where am I relative to the storm eye?**
- **Where is the nearest safe, high-ground shelter with capacity?**
- **How can I warn the government that the local sea dike has breached?**

---

## ⚡ Core Modules & Implemented Features

### Module 1: AI Decision Compiler (Gemini 3.8 / Gemma 4 / Gemini 3.7 Flash)
- **Physics-to-Action Synthesis**: Ingests atmospheric pressure, central wind speeds, tidal tables, and SRTM digital elevation data to generate deterministic, role-specific action matrices.
- **Strict JSON Schema Enforcement**: Guarantees zero hallucinations and deterministic structure using `@google/genai` Structured Outputs (`responseSchema`).
- **Tri-Model Resilient Cascade**:
  - `gemma-4-26b-a4b-it`: Primary reasoner for spatial decision logic.
  - `gemini-3.7-flash`: High-throughput parallel action planner.
  - `gemini-3.8-flash`: Multimodal fallback and live speech synthesis.
- **Offline Deterministic Fallback**: Built-in heuristic rulebook guarantees that even under complete network severing, high-fidelity operational orders continue to dispatch.

### Module 2: Geospatial & Hydrodynamic Digital Twin
- **Google Maps Platform Integration**: Powered by `@vis.gl/react-google-maps` supporting **Hybrid Satellite**, **Terrain**, and **Vector** perspectives.
- **Bathymetric & Surge Inundation Polygons**: Visualizes the predicted 2.4m - 3.1m coastal flood fringe across estuaries, sea dikes, and arterial highways.
- **Criticality-Weighted Infrastructure Graph**: Tracks key coastal assets (Digha Sub-Divisional Hospital, Contai Base Hospital, 33kV Coastal Substations, National Highway NH-116B, Multi-Purpose Cyclone Shelters) with real-time exposure scores ($0.0 - 1.0$).
- **Live Storm Track Vector**: Rendered historical and forecast track points from $T-06:00$ to Landfall ($T-00:00$) with dynamic central pressure (hPa) and wind velocity (km/h).
- **Live User Location (`[MY GPS]`)**: Integrated top-bar locator button pans the Google Map camera to your exact GPS coordinates and animates an active radar beacon.
- **Windy.com ECMWF Particle Radar**: Integrated live atmospheric particle radar visualizes cyclonic wind rotation and pressure fields in real time.

### Module 3: Citizen Lifeline & Public SOS (Ground Truth Scout)
- **High-Precision Satellite GPS Lock**: Native `navigator.geolocation` integration with `enableHighAccuracy: true`, displaying real-time accuracy down to meters (e.g., `±8m`).
- **Reverse Geocoding**: Automatically translates coordinates into locality, town, district, and state using OpenStreetMap Nominatim.
- **Network IP Fallback**: Gracefully detects the user's city and region via network IP if browser GPS is restricted or unavailable on desktop hardware.
- **Great-Circle Haversine Engine**: Computes live distance to the cyclone eye in kilometers and outputs dynamic danger levels:
  - *Extreme Surge Danger* ($\le 45\text{km}$ & $<6\text{m}$ MSL): Immediate evacuation directive.
  - *High Cyclonic Threat* ($\le 90\text{km}$): Gale wind warnings and utility breaker shutdown advice.
  - *Moderate Peripheral Risk* ($> 90\text{km}$): Outer rainband precautions.
- **Nearest Safe High-Ground Shelters**: Dynamically sorts verified concrete shelters (e.g., *Digha Government Multipurpose Shelter*, *Mandarmani Coastal Community Center*, *Ramnagar Block High School*) by live GPS distance, elevation (+9.4m MSL), and capacity.
- **Crowdsourced Hazard SOS Submissions**: Citizens submit instant ground-truth reports (Sea Dike Overtopped, Road Inundated, Power Line Snapped, Villagers Trapped) with water depth sliders ($0.2\text{m} - 3.5\text{m}$).
- **One-Touch Emergency Helplines**: Pre-configured dialing triggers for **112** (National Emergency), **1070** (State Relief), **1077** (District EOC), and **108** (Ambulance).

### Module 4: Parametric Disaster Insurance Protocol
- **Objective Threshold Triggering**: Automatically detects coastal marine gauge surges exceeding policy triggers ($\ge 2.00\text{m}$), removing the need for post-disaster insurance adjusters.
- **Multi-Event Scenario Synchronization**: The certificate dynamically binds to whichever cyclone scenario is active:
  - **Super Cyclone Amphan (2020)**: `CPT-AMPHAN-2020-01B` · Digha Coastal Gauge · 2.85m Surge · $12.5M Liquidity.
  - **Extremely Severe Cyclone Mocha (2023)**: `CPT-MOCHA-2023-01B` · Sittwe Marine Buoy 44002 · 3.10m Surge · $18.2M Liquidity.
  - **Upcoming Cyclone Dana (2026 Forecast)**: `CPT-DANA-2026-EARLY-WARNING` · Dhamra Port Tide Gauge · 2.65m Surge · $14.8M Liquidity.
- **Real Client-Side File Downloads**:
  - `[📥 DOWNLOAD JSON CERTIFICATE]`: Downloads machine-verifiable `.json` audit artifact with full SHA-256 cryptographic proof.
  - `[📜 PRINTABLE HTML / PDF]`: Downloads an ivory-paper watermarked certificate with an embossed golden seal, complete signatures, and print stylesheet for PDF archival.
- **Simulated Escrow Disbursal**: Executes mock liquidity release to municipal emergency relief funds within seconds of trigger confirmation.

### Module 5: Real-Time Firebase Cloud Integration
- **Database Provisioned**: Live Google Cloud Firestore database (`gen-lang-client-0123543324`) and Firebase Authentication.
- **Intermediate Representation Blueprint (`firebase-blueprint.json`)**: Formally defines entity models for `CitizenReport`, `OperationalDirective`, and `ParametricPayoutCertificate`.
- **Hardened Security Rules (`firestore.rules`)**: Deployed via `DeployRules` RPC with ID length validation (`isValidId`), immutable history constraints, and schema checking.
- **Real-Time Bidirectional Sync (`src/lib/firebase.ts`)**:
  - Citizen SOS reports written to Firestore immediately broadcast to all connected command terminals via `onSnapshot`.
  - Operational directives dispatched by Incident Commanders are persisted with delivery hashes and timestamps.
  - Parametric payout trigger records are stored for financial auditability.
  - Automatic connection verification on startup (`verifyFirestoreConnection`).

### Module 6: Voice Directives & Speech Command Console
- **Multi-Layer Speech Recognition**: Employs Web Speech API with fallback to server-side multimodal audio transcription via Gemini.
- **Natural Language Command Parsing**: Recognizes spoken orders such as:
  - *"Evacuate Ward 4 and dispatch transit buses"*
  - *"Send diesel fuel to Digha Hospital generator"*
  - *"De-energize coastal transmission substation"*
  - *"Export parametric payout certificate"*
- **Dismissible Toast Banners**: Quick close ("✕") button and `[ESC]` dismiss on all audio notifications and voice consoles.

### Module 7: Cryptographic Audit Trail & Provenance Ledger
- **Immutable Action Verification**: Logs every pipeline event from initial Satellite SAR ingestion to hydro-modeling, Gemini decision synthesis, and webhook delivery.
- **Cryptographic Provenance**: Every entry includes a SHA-256 hash verifying input data integrity and model lineage.

### Module 8: 2-Minute Autonomous Judge Walkthrough
- **Guided Hackathon Tour**: Step-by-step interactive overlay walking evaluators through the full platform in under two minutes:
  1. *Landing Page & Mission Briefing*
  2. *Geospatial Hazard & Asset Exposure Map*
  3. *Gemini 3.8 Reasoning Decision Compiler*
  4. *Multi-Role Tactical Dispatches*
  5. *Critical Infrastructure Vulnerability Graph*
  6. *Parametric Insurance Liquidity Release*
  7. *Citizen Lifeline & Ground Truth Loop*

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS v4, Lucide React Icons, Motion |
| **Geospatial & Mapping** | Google Maps Platform (`@vis.gl/react-google-maps`), OpenStreetMap Nominatim, Windy Embed |
| **AI & LLM Reasoning** | `@google/genai` TypeScript SDK (`gemini-3.8-flash`, `gemini-3.7-flash`, `gemma-4-26b-a4b-it`) |
| **Backend & API Server** | Express.js running on Node.js / `tsx` |
| **Database & Cloud Sync** | Google Cloud Firestore (Firebase SDK v12) |
| **Security & Access Rules** | Firestore Security Rules v2 deployed via Firebase RPC |
| **Audio & Speech Engine** | Web Speech API, MediaRecorder, Custom Audio Synthesizer |

---

## 📡 API Endpoints Reference

The backend Express server (`server.ts`) exposes the following endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | System health, model readiness, and telemetry feed state. |
| `GET` | `/api/models` | Lists available Gemini and Gemma models with configuration checks. |
| `GET` | `/api/maps-config` | Proxies Google Maps Platform credentials safely to the client. |
| `POST` | `/api/compile-decisions` | Ingests storm parameters and compiles role-specific directives & parametric triggers. |
| `POST` | `/api/dispatch` | Dispatches tactical directives and generates cryptographic delivery hashes. |
| `POST` | `/api/citizen-sos` | Ingests crowdsourced citizen emergency reports and queues them for rescue dispatch. |
| `POST` | `/api/speech-to-text` | Multimodal transcription of base64 audio directives. |
| `POST` | `/api/predict-upcoming` | Generates early warning AI projections for emerging cyclonic disturbances (e.g. Cyclone Dana). |

---

## 🚀 Local Development & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root (see `.env.example`):
```env
# Google GenAI API Key (Gemini & Gemma models)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps Platform JavaScript API Key
GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Port Configuration
PORT=3000
```

### 3. Running the Development Server
Start the unified full-stack server (Express backend + Vite middleware):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Lint & Typecheck
Validate the entire codebase for TypeScript integrity:
```bash
npm run lint
```

### 5. Production Build
Compile client assets and verify bundle correctness:
```bash
npm run build
npm start
```

---

## 🚀 Deploying to Vercel (1-Click Ready)

ToofanOS is pre-configured for full-stack deployment on **Vercel** with zero extra setup:
- **Frontend**: Automatically built into static files (`dist`) via Vite.
- **Backend API**: Automatically routed as serverless functions via `api/index.ts` and `vercel.json`.

### Steps to Deploy on Vercel:
1. **Push your repository to GitHub / GitLab**.
2. Go to [vercel.com/new](https://vercel.com/new) and **Import** the repository.
3. In **Project Settings > Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google GenAI API Key.
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps Platform API Key.
4. Click **Deploy**. Vercel will automatically run `npm run build` and launch both the React frontend and Express serverless APIs (`/api/*`).

---

## 🔒 Security & Privacy Architecture

- **No Hardcoded API Keys**: All external API keys (Google Maps, Gemini AI) are maintained server-side in proxy endpoints; keys are never exposed in client git commits.
- **Strict Firestore Rules**: Only permitted paths can be written; report payloads are validated for string and number bounds to prevent injection attacks.
- **Client Frame Permissions**: Native hardware GPS permissions (`requestFramePermissions: ["geolocation"]`) are explicitly configured in `metadata.json` for secure iframe operation.
- **Cryptographic Auditability**: Every synthesized directive and insurance certificate produces a deterministic SHA-256 checksum for legal verification.

---

## 📄 License & Attribution
Built for the *Code for Communities**.  
Cartographic data courtesy of **Google Maps Platform** & **OpenStreetMap**. Meteorological satellite streamlines courtesy of **Windy.com** and **India Meteorological Department (IMD)**.
