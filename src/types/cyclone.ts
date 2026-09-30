export type AssetType = 'hospital' | 'substation' | 'shelter' | 'road' | 'sluice_gate';

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: AssetType;
  lat: number;
  lon: number;
  criticality: number; // 0.0 to 1.0
  elevationM: number;
  exposureScore: number; // 0.0 to 1.0
  surgeEtaHours: number;
  status: 'critical' | 'high' | 'moderate' | 'safe';
  serves?: string[];
  accessRoad?: string;
  backupPower?: string;
  capacity?: number;
  currentOccupancy?: number;
  details: {
    address: string;
    contactOfficer: string;
    vulnerabilityNote: string;
    secondaryHazard: string;
  };
}

export interface TrackPoint {
  timeOffsetHours: number; // e.g. -6, -4, -2, 0 (landfall)
  label: string;
  lat: number;
  lon: number;
  windSpeedKmh: number;
  centralPressureHpa: number;
  surgeHeightM: number;
  stage: string;
}

export interface CycloneScenario {
  id: string;
  name: string;
  codeName: string;
  year: number;
  region: string;
  category: string;
  peakWindKmh: number;
  minPressureHpa: number;
  maxSurgeM: number;
  targetLandfallDate: string;
  summary: string;
  trackPoints: TrackPoint[];
  centerLat: number;
  centerLon: number;
  baseZoom: number;
  isUpcoming?: boolean;
  forecastModel?: string;
  confidencePct?: number;
  leadTimeHours?: number;
  sstAnomalyC?: number;
}

export interface ResourceLedger {
  ambulances: { total: number; allocated: number };
  buses: { total: number; allocated: number };
  repairCrews: { total: number; allocated: number };
  shelterCapacity: { total: number; allocated: number };
}

export interface DecisionAction {
  id: string;
  action: string;
  deadline: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  justification: string;
  resource_allocated: string;
  lead_officer?: string;
  status?: 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED';
  dispatchedAt?: string;
  deliveryHash?: string;
}

export interface RoleDispatch {
  role: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  target_jurisdiction?: string;
  target_facility?: string;
  target_grid?: string;
  time_window_remaining: string;
  actions: DecisionAction[];
}

export interface ParametricTrigger {
  trigger_id: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  hazard_type: string;
  simulated_surge_height_m: number;
  policy_threshold_m: number;
  breach: boolean;
  confidence_level: string;
  parametric_payout_usd: string;
  payout_beneficiary: string;
  timestamp: string;
  scenario_ref: string;
  verification_hash: string;
}

export interface CompiledDecisionsResult {
  municipal_dispatch: RoleDispatch;
  hospital_dispatch: RoleDispatch;
  grid_dispatch: RoleDispatch;
  parametric_trigger: ParametricTrigger;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  stage: string;
  event: string;
  inputHash: string;
  hash?: string;
  status: 'SUCCESS' | 'ACTIVE' | 'VERIFIED';
  details: string;
}

export interface SystemStatusState {
  geeConnected: boolean;
  metFeedReady: boolean;
  osmGraphReady: boolean;
  geminiReady: boolean;
  activeScenarioId: string;
  currentTimeOffset: number; // e.g. -6 to 0
}
