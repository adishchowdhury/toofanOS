import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  addDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore (using specific databaseId if provided)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test on boot
export async function verifyFirestoreConnection(): Promise<boolean> {
  try {
    // Attempt a lightweight server fetch to verify security rules and connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'init'));
    console.log('[ToofanOS] Firebase Firestore connection verified successfully');
    return true;
  } catch (err: any) {
    // A permission-denied error still confirms the connection to Firestore is live and rules are running
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      console.log('[ToofanOS] Firestore connection verified (rules active)');
      return true;
    }
    console.warn('[ToofanOS] Firestore connection status:', err?.message || err);
    return false;
  }
}

// Real-time synchronization service for Citizen SOS Reports
export interface FirestoreCitizenReport {
  id: string;
  timestamp: string;
  lat: number;
  lon: number;
  category: string;
  waterDepthM: number;
  notes: string;
  reporterName?: string;
  phone?: string;
  status: 'PENDING_DISPATCH' | 'RESCUE_EN_ROUTE' | 'VERIFIED' | 'RESOLVED';
  distanceToEyeKm?: number;
}

// Submit a new citizen report to Firestore
export async function saveCitizenReportToFirestore(report: FirestoreCitizenReport): Promise<boolean> {
  try {
    const reportRef = doc(db, 'citizen_reports', report.id);
    await setDoc(reportRef, {
      ...report,
      createdAt: new Date().toISOString()
    });
    console.log('[ToofanOS] Citizen SOS saved to Firestore:', report.id);
    return true;
  } catch (err: any) {
    console.warn('[ToofanOS] Failed to write report to Firestore, falling back to local memory:', err?.message);
    return false;
  }
}

// Subscribe to real-time citizen reports stream
export function subscribeToCitizenReports(
  onUpdate: (reports: FirestoreCitizenReport[]) => void,
  onError?: (err: any) => void
) {
  try {
    const q = query(collection(db, 'citizen_reports'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const reports: FirestoreCitizenReport[] = [];
        snapshot.forEach((docSnap) => {
          reports.push(docSnap.data() as FirestoreCitizenReport);
        });
        // Sort descending by timestamp
        reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        onUpdate(reports);
      },
      (err) => {
        console.warn('[ToofanOS] Real-time Firestore snapshot error:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('[ToofanOS] Snapshot subscription error:', err);
    return () => {};
  }
}

// Save Operational Directive Dispatch to Firestore
export async function saveOperationalDirectiveToFirestore(directive: {
  id: string;
  role: string;
  action: string;
  targetAsset?: string;
  deadlineOffsetHours?: number;
  status: string;
  timestamp: string;
}): Promise<boolean> {
  try {
    const dirRef = doc(db, 'operational_directives', directive.id);
    await setDoc(dirRef, directive);
    console.log('[ToofanOS] Operational directive persisted to Firestore:', directive.id);
    return true;
  } catch (err: any) {
    console.warn('[ToofanOS] Failed to save directive to Firestore:', err?.message);
    return false;
  }
}

// Save Parametric Payout Certificate to Firestore
export async function saveParametricCertificateToFirestore(cert: {
  id: string;
  scenarioName: string;
  triggeredAt: string;
  payoutAmountUsd: number;
  telemetryTrigger: string;
  recipient: string;
}): Promise<boolean> {
  try {
    const certRef = doc(db, 'parametric_certificates', cert.id);
    await setDoc(certRef, cert);
    console.log('[ToofanOS] Parametric certificate persisted to Firestore:', cert.id);
    return true;
  } catch (err: any) {
    console.warn('[ToofanOS] Failed to save parametric certificate to Firestore:', err?.message);
    return false;
  }
}
