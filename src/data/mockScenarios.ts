import { CycloneScenario, InfrastructureAsset, ResourceLedger, CompiledDecisionsResult, AuditRecord } from '../types/cyclone';

export const SCENARIOS: CycloneScenario[] = [
  {
    id: 'amphan-2020',
    name: 'Super Cyclone Amphan',
    codeName: 'AMPHAN · 01B',
    year: 2020,
    region: 'Bay of Bengal · Bengal Delta & Digha Corridor',
    category: 'Category 5 Super Cyclonic Storm',
    peakWindKmh: 260,
    minPressureHpa: 907,
    maxSurgeM: 2.85,
    targetLandfallDate: '20 May 2020 · 17:30 IST',
    summary: 'One of the most destructive cyclones recorded in the Bay of Bengal. Generated catastrophic storm surge across the Sundarbans and inundated coastal arterial roads across East Midnapore.',
    centerLat: 21.62,
    centerLon: 87.55,
    baseZoom: 11,
    trackPoints: [
      {
        timeOffsetHours: -6,
        label: 'T−06:00',
        lat: 20.85,
        lon: 87.20,
        windSpeedKmh: 215,
        centralPressureHpa: 935,
        surgeHeightM: 1.40,
        stage: 'Outer Rainbands Reaching Coastline'
      },
      {
        timeOffsetHours: -4,
        label: 'T−04:00',
        lat: 21.18,
        lon: 87.38,
        windSpeedKmh: 230,
        centralPressureHpa: 924,
        surgeHeightM: 1.95,
        stage: 'Surge Inundation Perimeter Breach'
      },
      {
        timeOffsetHours: -2,
        label: 'T−02:00',
        lat: 21.48,
        lon: 87.49,
        windSpeedKmh: 245,
        centralPressureHpa: 914,
        surgeHeightM: 2.42,
        stage: 'Peak Surge & Arterial Cutoff'
      },
      {
        timeOffsetHours: 0,
        label: 'T−00:00 (Landfall)',
        lat: 21.65,
        lon: 87.58,
        windSpeedKmh: 260,
        centralPressureHpa: 907,
        surgeHeightM: 2.85,
        stage: 'Eye Landfall at Digha/Bakkhali'
      }
    ]
  },
  {
    id: 'mocha-2023',
    name: 'Extremely Severe Cyclone Mocha',
    codeName: 'MOCHA · 01B',
    year: 2023,
    region: 'Bay of Bengal · Northeast Coast',
    category: 'Category 5 Tropical Cyclone',
    peakWindKmh: 275,
    minPressureHpa: 918,
    maxSurgeM: 3.10,
    targetLandfallDate: '14 May 2023 · 12:30 UTC',
    summary: 'Violent Category 5 equivalent cyclone producing severe sea surge, tearing down transmission lines and flooding coastal health outposts.',
    centerLat: 20.15,
    centerLon: 92.85,
    baseZoom: 10,
    trackPoints: [
      {
        timeOffsetHours: -6,
        label: 'T−06:00',
        lat: 19.30,
        lon: 91.80,
        windSpeedKmh: 220,
        centralPressureHpa: 940,
        surgeHeightM: 1.6,
        stage: 'Approach through deep offshore trench'
      },
      {
        timeOffsetHours: -4,
        label: 'T−04:00',
        lat: 19.65,
        lon: 92.25,
        windSpeedKmh: 240,
        centralPressureHpa: 928,
        surgeHeightM: 2.2,
        stage: 'Extreme coastal wave setup'
      },
      {
        timeOffsetHours: -2,
        label: 'T−02:00',
        lat: 19.95,
        lon: 92.60,
        windSpeedKmh: 260,
        centralPressureHpa: 920,
        surgeHeightM: 2.75,
        stage: 'Critical infrastructure cutoff'
      },
      {
        timeOffsetHours: 0,
        label: 'T−00:00 (Landfall)',
        lat: 20.15,
        lon: 92.85,
        windSpeedKmh: 275,
        centralPressureHpa: 918,
        surgeHeightM: 3.10,
        stage: 'Landfall with catastrophic storm tide'
      }
    ]
  },
  {
    id: 'upcoming-dana-2026',
    name: 'Upcoming Cyclone Dana (AI Forecast)',
    codeName: 'DANA · BOB-03 · EARLY WARNING',
    year: 2026,
    region: 'Bay of Bengal · Odisha & Bengal Coastal Border',
    category: 'Category 3 Very Severe Cyclonic Storm (Rapid Intensification)',
    peakWindKmh: 195,
    minPressureHpa: 968,
    maxSurgeM: 2.65,
    targetLandfallDate: 'Upcoming Forecast · Projected Landfall T+48h',
    summary: 'Active Cyclonic Disturbance tracked in Central Bay of Bengal. Gemma 4 / Gemini predictive hydrodynamics indicate rapid intensification fueled by +2.2°C SST anomaly, with storm surge forcing over the Digha and Dhamra coastal barriers.',
    centerLat: 21.32,
    centerLon: 87.42,
    baseZoom: 11,
    isUpcoming: true,
    forecastModel: 'Gemma 4 Cyclogenesis + ECMWF ENS (94.2% track confidence)',
    confidencePct: 94.2,
    leadTimeHours: 48,
    sstAnomalyC: 2.2,
    trackPoints: [
      {
        timeOffsetHours: -6,
        label: 'T−06:00 (Anticipatory Window)',
        lat: 20.50,
        lon: 87.05,
        windSpeedKmh: 165,
        centralPressureHpa: 980,
        surgeHeightM: 1.25,
        stage: 'Rapid Intensification Over Warm Eddy'
      },
      {
        timeOffsetHours: -4,
        label: 'T−04:00 (Coastal Alarm)',
        lat: 20.80,
        lon: 87.18,
        windSpeedKmh: 180,
        centralPressureHpa: 974,
        surgeHeightM: 1.85,
        stage: 'Outer Rainbands Striking Digha & Dhamra'
      },
      {
        timeOffsetHours: -2,
        label: 'T−02:00 (Substation Cutoff)',
        lat: 21.10,
        lon: 87.32,
        windSpeedKmh: 190,
        centralPressureHpa: 970,
        surgeHeightM: 2.30,
        stage: 'Estuarine Surge Backflow & Road Severance'
      },
      {
        timeOffsetHours: 0,
        label: 'T−00:00 (Projected Landfall)',
        lat: 21.35,
        lon: 87.45,
        windSpeedKmh: 195,
        centralPressureHpa: 968,
        surgeHeightM: 2.65,
        stage: 'Eye Landfall South of Digha / Bhadrak Coast'
      }
    ]
  },
  {
    id: 'upcoming-varun-2027',
    name: 'Upcoming Cyclone Varun (Arabian Sea Warning)',
    codeName: 'VARUN · ARB-02 · 72H OUTLOOK',
    year: 2027,
    region: 'North Arabian Sea · Gujarat & Saurashtra Coast',
    category: 'Category 4 Extremely Severe Cyclone (Anticipatory Outlook)',
    peakWindKmh: 220,
    minPressureHpa: 950,
    maxSurgeM: 3.40,
    targetLandfallDate: 'Projected Genesis · Landfall T+72h',
    summary: 'Anticipatory deep depression model in North Arabian Sea. AI physics synthesis warns of catastrophic storm surge across low-lying port facilities in Kandla and Jamnagar refineries with high tide confluence.',
    centerLat: 22.45,
    centerLon: 69.85,
    baseZoom: 10,
    isUpcoming: true,
    forecastModel: 'Gemma 4 Deep Ocean Model + IMD Bathtub Ensemble',
    confidencePct: 91.8,
    leadTimeHours: 72,
    sstAnomalyC: 2.8,
    trackPoints: [
      {
        timeOffsetHours: -6,
        label: 'T−06:00',
        lat: 21.60,
        lon: 69.10,
        windSpeedKmh: 185,
        centralPressureHpa: 965,
        surgeHeightM: 1.60,
        stage: 'Approaching Gulf of Kutch Funnel'
      },
      {
        timeOffsetHours: -4,
        label: 'T−04:00',
        lat: 21.95,
        lon: 69.40,
        windSpeedKmh: 200,
        centralPressureHpa: 958,
        surgeHeightM: 2.40,
        stage: 'Port Crane & Pipeline Preemptive Lockdown'
      },
      {
        timeOffsetHours: -2,
        label: 'T−02:00',
        lat: 22.25,
        lon: 69.65,
        windSpeedKmh: 215,
        centralPressureHpa: 952,
        surgeHeightM: 3.00,
        stage: 'Surge Penetration into Salt Flats'
      },
      {
        timeOffsetHours: 0,
        label: 'T−00:00 (Projected Landfall)',
        lat: 22.48,
        lon: 69.90,
        windSpeedKmh: 220,
        centralPressureHpa: 950,
        surgeHeightM: 3.40,
        stage: 'Coastal Impact at Saurashtra Basin'
      }
    ]
  }
];

export const MOCK_ASSETS: InfrastructureAsset[] = [
  {
    id: 'asset-hosp-1',
    name: 'District Hospital A',
    type: 'hospital',
    lat: 21.628,
    lon: 87.512,
    criticality: 1.0,
    elevationM: 1.4,
    exposureScore: 0.87,
    surgeEtaHours: 4.2,
    status: 'critical',
    serves: ['Ward 1-8 Populations', 'Coastal Emergency Caseload'],
    accessRoad: 'NH-116B Highway Corridor',
    backupPower: 'Substation B (Ramnagar 33kV)',
    capacity: 180,
    currentOccupancy: 142,
    details: {
      address: 'Old Digha Medical Compound, East Midnapore',
      contactOfficer: 'Dr. A. Roy, Medical Superintendent',
      vulnerabilityNote: 'Ground floor emergency triage sits at +1.4m. Inundation depth modeled at 0.9m.',
      secondaryHazard: 'Loss of external power feed and arterial road flooding.'
    }
  },
  {
    id: 'asset-sub-1',
    name: 'Substation B',
    type: 'substation',
    lat: 21.642,
    lon: 87.535,
    criticality: 0.95,
    elevationM: 1.8,
    exposureScore: 0.81,
    surgeEtaHours: 3.1,
    status: 'critical',
    serves: ['District Hospital A', 'Ward 4 Multi-Purpose Shelter', 'Digha Municipal Water Works'],
    accessRoad: 'Substation Approach By-Pass',
    capacity: 33, // kV
    details: {
      address: 'Ramnagar 33/11kV Distribution Yard',
      contactOfficer: 'Er. M. Das, Divisional Engineer (Transmission)',
      vulnerabilityNote: 'Switchyard transformer plinths vulnerable to salt-water corrosion if flooded beyond 0.5m.',
      secondaryHazard: 'Upstream cascade trip disconnecting 42,000 households and hospital triage.'
    }
  },
  {
    id: 'asset-shelter-1',
    name: 'Ward 4 Shelter',
    type: 'shelter',
    lat: 21.621,
    lon: 87.498,
    criticality: 0.90,
    elevationM: 3.2,
    exposureScore: 0.74,
    surgeEtaHours: 4.7,
    status: 'high',
    serves: ['Coastal Fisherman Settlement', 'Beachfront Ward 4'],
    accessRoad: 'Seafront Marine Drive Link',
    capacity: 240,
    currentOccupancy: 80,
    details: {
      address: 'Cyclone Shelter Compound #4, New Digha Sector',
      contactOfficer: 'Officer S. Banerjee, Municipal Ward Head',
      vulnerabilityNote: 'Structural stilt foundation safe, but access causeway cuts off at +1.2m surge.',
      secondaryHazard: 'Drinking water pump depends on Substation B feeder line.'
    }
  },
  {
    id: 'asset-road-1',
    name: 'NH-116B Highway Corridor',
    type: 'road',
    lat: 21.635,
    lon: 87.520,
    criticality: 0.85,
    elevationM: 0.9,
    exposureScore: 0.89,
    surgeEtaHours: 3.5,
    status: 'critical',
    serves: ['Sole inland ambulance transfer corridor to Contai Super-Specialty Hospital'],
    details: {
      address: 'Kilometer marker 12.4 - 18.2, Coastal Arterial',
      contactOfficer: 'Highway Patrol Inspector S. Ghosh',
      vulnerabilityNote: 'Low-lying culvert section prone to 1.3m standing surge water.',
      secondaryHazard: 'Complete severance of patient transit if not evacuated prior to T-03:30.'
    }
  },
  {
    id: 'asset-gate-1',
    name: 'Sluice Gate Complex #4',
    type: 'sluice_gate',
    lat: 21.615,
    lon: 87.485,
    criticality: 0.78,
    elevationM: 0.4,
    exposureScore: 0.92,
    surgeEtaHours: 2.5,
    status: 'critical',
    serves: ['Freshwater Drainage Basin & Aquaculture Zones'],
    details: {
      address: 'Champa River Outfall Sluice Channel',
      contactOfficer: 'Assistant Engineer, Irrigation & Waterways',
      vulnerabilityNote: 'Backflow flap valves require manual sandbag bracing against reverse marine surge.',
      secondaryHazard: 'Saltwater intrusion into 1,200 acres of paddy agriculture.'
    }
  },
  {
    id: 'asset-hosp-2',
    name: 'Sagar Island Rural Health Hub',
    type: 'hospital',
    lat: 21.650,
    lon: 87.620,
    criticality: 0.88,
    elevationM: 1.2,
    exposureScore: 0.79,
    surgeEtaHours: 3.8,
    status: 'high',
    serves: ['Sagar South Island Population'],
    backupPower: 'On-site 50kVA diesel generator (60h fuel reserve)',
    capacity: 60,
    currentOccupancy: 45,
    details: {
      address: 'Muriganga Island Reach, South 24 Parganas',
      contactOfficer: 'Dr. T. Bhattacharya, Block Health Officer',
      vulnerabilityNote: 'Isolated island health post; ferry jetty submerges at high tide.',
      secondaryHazard: 'No direct road link to mainland.'
    }
  },
  {
    id: 'asset-shelter-2',
    name: 'Frazerganj Marine Harbor Shelter',
    type: 'shelter',
    lat: 21.585,
    lon: 87.680,
    criticality: 0.85,
    elevationM: 2.9,
    exposureScore: 0.82,
    surgeEtaHours: 3.2,
    status: 'high',
    capacity: 300,
    currentOccupancy: 110,
    details: {
      address: 'Harbor Road Cyclone Bunker, Bakkhali Coastal Reach',
      contactOfficer: 'Fisheries Extension Officer',
      vulnerabilityNote: 'High tidal surge potential in harbor mouth.',
      secondaryHazard: 'Moored mechanized fishing trawlers break moorings and crash into seawall.'
    }
  },
  {
    id: 'asset-hosp-safe',
    name: 'Contai Base Super-Specialty Hospital',
    type: 'hospital',
    lat: 21.780,
    lon: 87.750,
    criticality: 0.92,
    elevationM: 9.8,
    exposureScore: 0.12,
    surgeEtaHours: 99,
    status: 'safe',
    serves: ['Designated High-Ground Evacuation & Trauma Receiving Facility'],
    capacity: 450,
    currentOccupancy: 190,
    details: {
      address: 'Central Highway Campus, Contai Mainland',
      contactOfficer: 'Chief Medical Officer of Health',
      vulnerabilityNote: 'Elevated terrain; immune to storm surge inundation.',
      secondaryHazard: 'Gale wind structural precautions only.'
    }
  }
];

export const INITIAL_RESOURCE_LEDGER: ResourceLedger = {
  ambulances: { total: 8, allocated: 6 },
  buses: { total: 10, allocated: 4 },
  repairCrews: { total: 8, allocated: 2 },
  shelterCapacity: { total: 240, allocated: 160 }
};

export const INITIAL_COMPILED_DECISIONS: CompiledDecisionsResult = {
  municipal_dispatch: {
    role: "Municipal Disaster Officer",
    priority: "HIGH",
    target_jurisdiction: "East Midnapore / Digha Coastal Belt",
    time_window_remaining: "01:40:00",
    actions: [
      {
        id: "mun-1",
        action: "Begin Ward 4 & coastal fisherman colony evacuation staging",
        deadline: "01:40",
        urgency: "HIGH",
        justification: "Surge inundation ETA is 03:08. Ward 4 shelter has 160 available capacities. Access routes cross 1.2m surge contour.",
        resource_allocated: "4 Electric Coastal Transit Buses · 2 Emergency Vans",
        lead_officer: "Officer S. Banerjee, Coastal Sector 3",
        status: "PENDING"
      },
      {
        id: "mun-2",
        action: "Deploy sandbag barriers along Digha storm drain sluice gates #4 and #7",
        deadline: "02:30",
        urgency: "MEDIUM",
        justification: "Counteract back-flow saltwater penetration into freshwater agricultural ponds.",
        resource_allocated: "Civil Defense Corps Unit 9 · 4,000 poly-weave sandbags",
        lead_officer: "Irrigation Sub-Divisional Officer",
        status: "PENDING"
      }
    ]
  },
  hospital_dispatch: {
    role: "Hospital Administrator",
    priority: "CRITICAL",
    target_facility: "District Hospital A (Digha Sub-Divisional Hospital)",
    time_window_remaining: "02:10:00",
    actions: [
      {
        id: "hosp-1",
        action: "Prepare patient transfer corridor to Inland Base Hospital Contai",
        deadline: "02:10",
        urgency: "CRITICAL",
        justification: "Primary coastal arterial highway NH-116B reaches surge vulnerability index 0.87 at T-04:12. NICU and ventilator patients must clear corridor before cut-off.",
        resource_allocated: "6 Advanced Life Support (ALS) Ambulances · 1 Police Escort",
        lead_officer: "Dr. A. Roy, Medical Superintendent",
        status: "PENDING"
      },
      {
        id: "hosp-2",
        action: "Elevate critical pharmaceuticals & activate rooftop diesel gen-set tank reserve",
        deadline: "01:15",
        urgency: "HIGH",
        justification: "Ground floor flood threshold modeled at +1.4m. Substation B expected to de-energize by 03:08.",
        resource_allocated: "Hospital Facilities Engineering Team (4 technicians)",
        lead_officer: "Chief Pharmacist & Facilities Engineer",
        status: "PENDING"
      }
    ]
  },
  grid_dispatch: {
    role: "Grid Operator",
    priority: "HIGH",
    target_grid: "WBSEDCL Coastal Transmission Zone 4",
    time_window_remaining: "01:05:00",
    actions: [
      {
        id: "grid-1",
        action: "Pre-position 500kVA mobile generator at District Hospital A & prepare Substation B sectional isolation",
        deadline: "01:05",
        urgency: "CRITICAL",
        justification: "Substation B 33kV switchyard sits at +1.8m elevation; modeled surge breach is 2.4m at 03:08. Preemptive de-energizing prevents permanent transformer terminal damage while hospital continuity is preserved.",
        resource_allocated: "WBSEDCL Emergency Crew Alpha · 1 Mobile Substation Trailer",
        lead_officer: "Executive Engineer (Transmission)",
        status: "PENDING"
      },
      {
        id: "grid-2",
        action: "Isolate marine feeder lines 4A and 4B along the coastline",
        deadline: "01:50",
        urgency: "HIGH",
        justification: "Prevent high-voltage arcing across inundated salt-water flood zones.",
        resource_allocated: "Linesman Team 2",
        lead_officer: "Substation Shift In-Charge",
        status: "PENDING"
      }
    ]
  },
  parametric_trigger: {
    trigger_id: "CPT-AMPHAN-09X2B",
    location: {
      name: "Digha Coastal Gauge / Bay of Bengal Station 21.62°N, 87.50°E",
      latitude: 21.6200,
      longitude: 87.5000
    },
    hazard_type: "storm_surge_inundation",
    simulated_surge_height_m: 2.42,
    policy_threshold_m: 2.00,
    breach: true,
    confidence_level: "99.4%",
    parametric_payout_usd: "$12,500,000",
    payout_beneficiary: "Municipal Emergency Relief Fund & Coastal Infrastructure Repair Pool",
    timestamp: "2026-09-27T18:41:08.412Z",
    scenario_ref: "Cyclone Amphan Replay #14",
    verification_hash: "0x8F94E1B3A09238D19F02C45877E90B427F2A3810DC25"
  }
};

export const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'aud-001',
    timestamp: '23:41:08.120',
    stage: 'INGESTION',
    event: 'GEE Terrain & Sentinel-1 SAR ingestion completed',
    inputHash: 'sha256:d8a2...3f1c',
    status: 'VERIFIED',
    details: 'SRTM 30m DEM + JAXA ALOS coastal elevation ingested for 21.4N - 22.0N, 87.2E - 88.0E.'
  },
  {
    id: 'aud-002',
    timestamp: '23:41:10.450',
    stage: 'SIMULATION',
    event: 'Hydro-Inundation Bathtub Surge model compiled',
    inputHash: 'sha256:7b1e...09d4',
    status: 'SUCCESS',
    details: 'Surge height 2.42m applied with coastal flood-fill topology. 18.4 sq km inundated.'
  },
  {
    id: 'aud-003',
    timestamp: '23:41:12.890',
    stage: 'EXPOSURE_SCORING',
    event: 'Infrastructure graph intersection & criticality weighting',
    inputHash: 'sha256:4c22...88aa',
    status: 'SUCCESS',
    details: 'District Hospital A (0.87), Substation B (0.81), NH-116B (0.89) ranked in top hazard tier.'
  },
  {
    id: 'aud-004',
    timestamp: '23:41:15.620',
    stage: 'COMPILER_GEMINI',
    event: 'Gemini 3.8 Reasoning Decision Compiler synthesized 3 role action matrices',
    inputHash: 'sha256:1a89...ef02',
    status: 'SUCCESS',
    details: '6 time-bound directives generated under deterministic resource constraints.'
  },
  {
    id: 'aud-005',
    timestamp: '23:41:18.910',
    stage: 'FINANCIAL_PARAMETRIC',
    event: 'Parametric Insurance Trigger Certificate generated',
    inputHash: 'sha256:8f94...dc25',
    status: 'VERIFIED',
    details: 'Surge threshold 2.00m breached at Gauge 21.62N/87.50E (+2.42m). Verification hash stamped.'
  }
];
