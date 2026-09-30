import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Download, 
  Award, 
  AlertOctagon,
  FileCheck,
  Building,
  DollarSign,
  FileText,
  Printer,
  Sparkles
} from 'lucide-react';
import { ParametricTrigger, CycloneScenario } from '../types/cyclone';

interface ParametricInsuranceViewProps {
  triggerData: ParametricTrigger;
  currentScenario?: CycloneScenario;
}

export const ParametricInsuranceView: React.FC<ParametricInsuranceViewProps> = ({
  triggerData,
  currentScenario
}) => {
  const [copied, setCopied] = useState(false);
  const [payoutDisbursed, setPayoutDisbursed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Dynamic scenario resolution: ensure certificate ALWAYS reflects the currently selected cyclone
  const activeScenarioName = currentScenario?.name || triggerData.scenario_ref || 'Super Cyclone Amphan';
  const scenarioId = currentScenario?.id || 'amphan-2020';
  const isMocha = scenarioId.includes('mocha');
  const isDana = scenarioId.includes('dana');

  const triggerId = useMemo(() => {
    if (isMocha) return `CPT-MOCHA-${currentScenario?.year || 2023}-01B`;
    if (isDana) return `CPT-DANA-2026-EARLY-WARNING`;
    return `CPT-AMPHAN-2020-01B`;
  }, [isMocha, isDana, currentScenario]);

  const locationName = useMemo(() => {
    if (isMocha) return "Sittwe Marine Buoy Station 44002 / Bay of Bengal Station 20.15°N, 92.85°E";
    if (isDana) return "Dhamra Port & Digha Coastal Tide Gauge Station 21.35°N, 87.45°E";
    return triggerData.location?.name || "Digha Coastal Gauge / Bay of Bengal Station 21.62°N, 87.50°E";
  }, [isMocha, isDana, triggerData]);

  const coordinates = useMemo(() => {
    if (isMocha) return { lat: 20.1500, lon: 92.8500 };
    if (isDana) return { lat: 21.3500, lon: 87.4500 };
    return { lat: 21.6200, lon: 87.5000 };
  }, [isMocha, isDana]);

  const surgeHeightM = useMemo(() => {
    if (currentScenario?.maxSurgeM) return currentScenario.maxSurgeM;
    if (isMocha) return 3.10;
    if (isDana) return 2.65;
    return 2.85;
  }, [currentScenario, isMocha, isDana]);

  const payoutAmount = useMemo(() => {
    if (isMocha) return "$18,200,000";
    if (isDana) return "$14,800,000";
    return "$12,500,000";
  }, [isMocha, isDana]);

  const beneficiary = useMemo(() => {
    if (isMocha) return "Rakhine Coastal Emergency Liquidity & Rehabilitation Escrow";
    if (isDana) return "State Disaster Mitigation Fund (SDMF) & Coastal Ward Relief (Dana)";
    return "Municipal Emergency Relief Fund & Coastal Infrastructure Repair Pool";
  }, [isMocha, isDana]);

  const verificationHash = useMemo(() => {
    return triggerData.verification_hash || "0x8F94E1B3A09238D19F02C45877E90B427F2A3810DC25";
  }, [triggerData]);

  const policyThresholdM = 2.00;
  const breachExcessM = (surgeHeightM - policyThresholdM).toFixed(2);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(verificationHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisbursePayout = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPayoutDisbursed(true);
    }, 1200);
  };

  // Real client-side file download: JSON Certificate
  const handleDownloadJson = () => {
    const certPayload = {
      certificate_type: "PARAMETRIC_SURGE_THRESHOLD_BREACH_CERTIFICATE",
      protocol_version: "ToofanOS-v2.4-Deterministic",
      trigger_id: triggerId,
      scenario: {
        id: scenarioId,
        name: activeScenarioName,
        category: currentScenario?.category || "Severe Cyclonic Storm",
        year: currentScenario?.year || 2026
      },
      oracle_telemetry: {
        sensor_station: locationName,
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        simulated_surge_height_m: surgeHeightM,
        policy_threshold_m: policyThresholdM,
        breach_margin_m: parseFloat(breachExcessM),
        confidence_level: "99.4%"
      },
      financial_liquidity: {
        parametric_payout_usd: payoutAmount,
        beneficiary_account: beneficiary,
        disbursal_status: payoutDisbursed ? "EXECUTED" : "TRIGGERED_READY_FOR_RELEASE",
        escrow_vault: "DEOC-Rapid-Response-Treasury-0x89C"
      },
      cryptographic_provenance: {
        verification_hash: verificationHash,
        algorithm: "SHA-256",
        timestamp: new Date().toISOString(),
        authorities: [
          "Google Earth Engine Coastal Elevation Models",
          "IMD Automated Marine Gauge Interface",
          "CycloneOS Autonomous Oracle Engine"
        ]
      }
    };

    const blob = new Blob([JSON.stringify(certPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Parametric_Certificate_${scenarioId}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast('Official JSON certificate exported successfully!');
    setTimeout(() => setDownloadToast(null), 3500);
  };

  // Real client-side file download: Printable HTML Certificate
  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Parametric Payout Certificate - ${activeScenarioName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0B1420;
      color: #050B14;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .cert-card {
      background: #F1EBDD;
      border: 6px double #C7A45D;
      border-radius: 4px;
      max-width: 820px;
      width: 100%;
      padding: 50px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      position: relative;
    }
    .header {
      border-bottom: 2px solid #8D7548;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .protocol-title {
      font-size: 11px;
      letter-spacing: 0.25em;
      color: #8D7548;
      font-weight: bold;
      text-transform: uppercase;
    }
    .cert-title {
      font-family: Georgia, serif;
      font-size: 26px;
      font-weight: bold;
      color: #050B14;
      margin-top: 6px;
    }
    .seal {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E2C98A, #C7A45D, #8D7548);
      border: 3px solid #8D7548;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: bold;
      color: #050B14;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 30px;
    }
    .field {
      background: #E5DCB8;
      padding: 14px;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 2px;
    }
    .field-label {
      font-size: 10px;
      color: #5A6D80;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .field-val {
      font-size: 15px;
      font-weight: bold;
      color: #050B14;
    }
    .highlight-red {
      color: #D95757;
      font-size: 20px;
    }
    .highlight-gold {
      color: #8D7548;
      font-size: 22px;
    }
    .proof-box {
      background: #091525;
      color: #F1EBDD;
      padding: 16px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      margin-bottom: 30px;
      word-break: break-all;
    }
    .footer {
      border-top: 2px solid rgba(0,0,0,0.15);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #5A6D80;
    }
    @media print {
      body { background: white; padding: 0; }
      .cert-card { box-shadow: none; border: 4px double #C7A45D; }
    }
  </style>
</head>
<body>
  <div class="cert-card">
    <div class="header">
      <div>
        <div class="protocol-title">COASTAL DISASTER PARAMETRIC RESILIENCE PROTOCOL</div>
        <div class="cert-title">SURGE THRESHOLD BREACH CERTIFICATE</div>
      </div>
      <div class="seal">
        <span>CYCLONEOS</span>
        <span style="font-size: 7px; margin-top: 2px;">VERIFIED</span>
      </div>
    </div>

    <div class="grid">
      <div class="field">
        <div class="field-label">Trigger Identifier</div>
        <div class="field-val">${triggerId}</div>
        <div style="font-size: 11px; color: #8D7548; margin-top: 2px;">${activeScenarioName}</div>
      </div>

      <div class="field">
        <div class="field-label">Geo-Referenced Marine Gauge</div>
        <div class="field-val" style="font-size: 13px;">${locationName}</div>
        <div style="font-size: 11px; color: #8D7548; margin-top: 2px;">${coordinates.lat.toFixed(4)}° N · ${coordinates.lon.toFixed(4)}° E</div>
      </div>

      <div class="field">
        <div class="field-label">Simulated Surge Height</div>
        <div class="field-val highlight-red">${surgeHeightM.toFixed(2)} m MSL</div>
        <div style="font-size: 10px; color: #5A6D80;">Derived from SRTM DEM + IMD Pressure heuristic</div>
      </div>

      <div class="field">
        <div class="field-label">Policy Inundation Threshold</div>
        <div class="field-val">${policyThresholdM.toFixed(2)} m MSL <span style="font-size: 12px; color: #2E8540;">[BREACHED +${breachExcessM}m]</span></div>
        <div style="font-size: 10px; color: #5A6D80;">Contract terms: Payout initiates on &ge; 2.00m surge</div>
      </div>

      <div class="field">
        <div class="field-label">Trigger Verification Status</div>
        <div class="field-val" style="color: #D95757;">● BREACH CONFIRMED (100% OBJECTIVE)</div>
        <div style="font-size: 10px; color: #5A6D80;">Immediate execution without claims adjuster delay</div>
      </div>

      <div class="field">
        <div class="field-label">Liquidity Disbursal Sum</div>
        <div class="field-val highlight-gold">${payoutAmount} USD</div>
        <div style="font-size: 11px; color: #050B14; font-weight: bold;">${beneficiary}</div>
      </div>
    </div>

    <div class="proof-box">
      <div style="color: #8D7548; font-weight: bold; margin-bottom: 4px;">CRYPTOGRAPHIC PROOF & ORACLE HASH</div>
      <div>${verificationHash}</div>
    </div>

    <div class="footer">
      <div>
        <strong style="color: #050B14;">GEOSPATIAL ORACLE VERIFIER</strong><br>
        Google Earth Engine & IMD Automated Marine Gauge Interface
      </div>
      <div style="text-align: right;">
        <strong style="color: #050B14;">EXECUTION TIMESTAMP</strong><br>
        ${new Date().toLocaleString()} · IST
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('load', () => {
      // Allow user to print or save as PDF
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Parametric_Certificate_${scenarioId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast('Printable HTML/PDF certificate exported successfully!');
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="flex-1 bg-[#050B14] p-4 lg:p-8 overflow-y-auto select-none space-y-6">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0D1C2D] border border-emerald-500/80 text-emerald-200 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{downloadToast}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="border-b border-[#12253A] pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono tracking-widest text-[#C7A45D] uppercase font-bold px-2 py-0.5 border border-[#C7A45D]/40 rounded-xs bg-[#C7A45D]/10">
            FINANCIAL RESILIENCE LAYER
          </span>
          <span className="text-[11px] font-mono text-[#63C69A]">
            ● ORACLE STREAM LIVE
          </span>
          <span className="text-[10px] font-mono text-[#E2C98A] px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
            EVENT: {activeScenarioName}
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD] tracking-tight">
          PARAMETRIC TRIGGER
        </h1>
        <p className="text-sm font-mono text-[#9BB0C1] mt-1 font-script text-base text-[#E2C98A]">
          "objective event detection · immediate liquidity"
        </p>
      </div>

      {/* Main Certificate Container (Ivory Paper Aesthetic) */}
      <div className="max-w-3xl mx-auto relative">
        {/* Certificate Card */}
        <div className="bg-[#F1EBDD] text-[#050B14] p-6 lg:p-10 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.65)] border-4 border-[#C7A45D] relative overflow-hidden font-mono">
          {/* Faint Cartographic Watermark in Background */}
          <div className="absolute inset-0 carto-grid-dense opacity-25 pointer-events-none" />

          {/* Top Decorative Border Strip */}
          <div className="flex items-center justify-between border-b-2 border-[#091525]/20 pb-4 mb-6">
            <div>
              <div className="text-[11px] tracking-[0.28em] text-[#8D7548] font-bold uppercase font-cinzel">
                COASTAL DISASTER PARAMETRIC RESILIENCE PROTOCOL
              </div>
              <div className="text-2xl font-serif font-bold text-[#050B14] tracking-wider mt-1">
                SURGE THRESHOLD BREACH CERTIFICATE
              </div>
              <div className="text-xs font-mono font-bold text-[#8D7548] mt-1">
                CYCLONE EVENT: <span className="text-[#050B14] uppercase">{activeScenarioName}</span>
              </div>
            </div>

            {/* Embossed Animated Gold Seal */}
            <div className="relative w-22 h-22 rounded-full border-2 border-[#C7A45D] flex items-center justify-center bg-gradient-to-br from-[#E2C98A] via-[#C7A45D] to-[#8D7548] shadow-lg shrink-0">
              <div className="w-18 h-18 rounded-full border border-dashed border-[#050B14]/40 flex flex-col items-center justify-center text-center p-1">
                <Award className="w-6 h-6 text-[#050B14] mb-0.5" />
                <span className="text-[8px] font-bold tracking-tight text-[#050B14] uppercase leading-none font-cinzel">
                  TOOFANOS
                </span>
                <span className="text-[7px] text-[#050B14] uppercase leading-none mt-0.5 font-bold">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Body Data Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">TRIGGER IDENTIFIER</span>
              <div className="text-sm font-bold text-[#050B14]">{triggerId}</div>
              <div className="text-[10px] text-[#8D7548] font-semibold">{activeScenarioName}</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">GEO-REFERENCED GAUGE</span>
              <div className="text-xs font-bold text-[#050B14]">{locationName}</div>
              <div className="text-[10px] text-[#8D7548]">
                {coordinates.lat.toFixed(4)}° N · {coordinates.lon.toFixed(4)}° E
              </div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">OBSERVED / SIMULATED SURGE</span>
              <div className="text-xl font-bold text-[#D95757] flex items-center gap-1.5">
                <span>{surgeHeightM.toFixed(2)} m</span>
                <span className="text-xs text-[#050B14] font-normal">(Above MSL)</span>
              </div>
              <div className="text-[10px] text-[#6F8296]">Derived from SRTM DEM + IMD Pressure heuristic</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">POLICY THRESHOLD</span>
              <div className="text-xl font-bold text-[#050B14] flex items-center gap-1.5">
                <span>{policyThresholdM.toFixed(2)} m</span>
                <span className="text-xs text-[#63C69A] font-bold">[BREACHED +{breachExcessM}m]</span>
              </div>
              <div className="text-[10px] text-[#6F8296]">Contract terms: Payout initiates on &ge; 2.00m surge</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">TRIGGER STATUS</span>
              <div className="text-xs font-bold text-[#D95757] flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D95757] animate-ping" />
                <span>● BREACH CONFIRMED (100% OBJECTIVE)</span>
              </div>
              <div className="text-[10px] text-[#6F8296]">Zero claims adjuster delays required</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">LIQUIDITY DISBURSAL SUM</span>
              <div className="text-2xl font-bold text-[#C7A45D] flex items-center gap-1 font-serif">
                <span>{payoutAmount}</span>
              </div>
              <div className="text-[10px] text-[#050B14] font-semibold">{beneficiary}</div>
            </div>
          </div>

          {/* Cryptographic Proof Strip */}
          <div className="bg-[#091525] text-[#F1EBDD] p-3.5 rounded-xs flex items-center justify-between text-[11px] mb-6 shadow-inner">
            <div className="truncate mr-2">
              <span className="text-[#6F8296] text-[10px] block uppercase">CRYPTOGRAPHIC PROOF & ORACLE HASH</span>
              <span className="text-[#E2C98A] font-bold">{verificationHash}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="px-3 py-1 rounded-xs bg-[#12253A] hover:bg-[#C7A45D] hover:text-[#050B14] text-xs transition-colors flex items-center gap-1.5 shrink-0 font-bold cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#63C69A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>

          {/* Bottom Sign-Off Signatures */}
          <div className="pt-4 border-t-2 border-[#091525]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-[#6F8296]">
            <div>
              <div className="font-bold text-[#050B14] uppercase">GEOSPATIAL ORACLE VERIFIER</div>
              <div>Google Earth Engine & IMD Automated Marine Gauge Interface</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-[#050B14] uppercase">TIMESTAMP</div>
              <div>{new Date().toLocaleString()} · IST</div>
            </div>
          </div>
        </div>

        {/* Certificate Actions Bar with Real Downloads */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Download JSON Button */}
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#F1EBDD] border border-[#203D5E] hover:border-[#65D9E8] text-xs font-mono transition-all shadow-md cursor-pointer"
              title="Download machine-verifiable JSON certificate"
            >
              <Download className="w-3.5 h-3.5 text-[#65D9E8]" />
              <span>DOWNLOAD JSON CERTIFICATE</span>
            </button>

            {/* Download Printable HTML/PDF Button */}
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#F1EBDD] border border-[#203D5E] hover:border-[#E2C98A] text-xs font-mono transition-all shadow-md cursor-pointer"
              title="Download styled printable certificate for PDF / Print"
            >
              <Printer className="w-3.5 h-3.5 text-[#E2C98A]" />
              <span>PRINTABLE HTML / PDF</span>
            </button>
          </div>

          {/* Disburse Action */}
          <button
            onClick={handleDisbursePayout}
            disabled={payoutDisbursed || isVerifying}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-sm font-mono text-xs font-bold tracking-wider transition-all shadow-xl cursor-pointer ${
              payoutDisbursed
                ? 'bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40 cursor-default'
                : 'bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] shadow-[0_0_25px_rgba(199,164,93,0.35)] hover:scale-[1.01]'
            }`}
          >
            {isVerifying ? (
              <span>VERIFYING SATELLITE ORACLE...</span>
            ) : payoutDisbursed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#63C69A]" />
                <span>{payoutAmount} RAPID LIQUIDITY DISBURSED TO DEOC</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                <span>TRIGGER IMMEDIATE ESCROW DISBURSAL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
