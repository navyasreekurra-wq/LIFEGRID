import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, Shield, AlertTriangle, Truck, Building2, Stethoscope, 
  Droplet, Radio, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, 
  RotateCw, RefreshCw, Send, ChevronRight, User, Phone, Check, X, 
  Layers, ArrowRight, ShieldAlert, Sparkles, Navigation, Info, Eye, 
  FileText, Sliders, Play, CornerDownRight, Volume2, ShieldCheck
} from 'lucide-react';

// ==========================================
// SEED DATA & CONSTANTS
// ==========================================
const STORAGE_KEY = 'lifegrid_state_v1';

const INITIAL_HOSPITALS = [
  {
    id: 'HOSP-01',
    name: 'Metro Trauma Center',
    type: 'Level 1 Trauma Center',
    coords: { x: 42, y: 35 },
    distanceKm: 4.2,
    baseTravelMin: 8,
    icuBeds: 4,
    icuTotal: 12,
    traumaLevel: 1,
    ventilators: 6,
    neuroAvailable: true,
    cardiacAvailable: true,
    burnUnit: false,
    pediatric: true,
    status: 'Ready',
    acceptanceRate: '98%',
    lastUpdated: '2 mins ago'
  },
  {
    id: 'HOSP-02',
    name: 'Apex Heart & Neuro Institute',
    type: 'Specialist Comprehensive',
    coords: { x: 72, y: 28 },
    distanceKm: 6.8,
    baseTravelMin: 12,
    icuBeds: 2,
    icuTotal: 8,
    traumaLevel: 2,
    ventilators: 4,
    neuroAvailable: true,
    cardiacAvailable: true,
    burnUnit: false,
    pediatric: false,
    status: 'Ready',
    acceptanceRate: '95%',
    lastUpdated: 'Just now'
  },
  {
    id: 'HOSP-03',
    name: 'St. Jude General Hospital',
    type: 'Community Hospital',
    coords: { x: 25, y: 70 },
    distanceKm: 3.1,
    baseTravelMin: 6,
    icuBeds: 0,
    icuTotal: 6,
    traumaLevel: 3,
    ventilators: 1,
    neuroAvailable: false,
    cardiacAvailable: false,
    burnUnit: false,
    pediatric: true,
    status: 'High Load',
    acceptanceRate: '82%',
    lastUpdated: '10 mins ago'
  },
  {
    id: 'HOSP-04',
    name: 'Sunrise Regional Medical',
    type: 'Level 2 Trauma Center',
    coords: { x: 80, y: 75 },
    distanceKm: 9.5,
    baseTravelMin: 18,
    icuBeds: 3,
    icuTotal: 10,
    traumaLevel: 2,
    ventilators: 5,
    neuroAvailable: true,
    cardiacAvailable: true,
    burnUnit: true,
    pediatric: true,
    status: 'Ready',
    acceptanceRate: '92%',
    lastUpdated: '5 mins ago'
  },
  {
    id: 'HOSP-05',
    name: 'Valley Care Urgent Pavilion',
    type: 'Urgent Ambulatory',
    coords: { x: 18, y: 20 },
    distanceKm: 5.0,
    baseTravelMin: 11,
    icuBeds: 0,
    icuTotal: 2,
    traumaLevel: 4,
    ventilators: 0,
    neuroAvailable: false,
    cardiacAvailable: false,
    burnUnit: false,
    pediatric: true,
    status: 'Ready',
    acceptanceRate: '99%',
    lastUpdated: '15 mins ago'
  }
];

const INITIAL_AMBULANCES = [
  { id: 'AMB-01', callSign: 'Unit 101 (ALS)', type: 'Advanced Life Support', coords: { x: 38, y: 40 }, status: 'Available', crew: 'Paramedic Lead Dave & EMT Sarah', equipment: ['Ventilator', 'Defibrillator', 'Telemetry'] },
  { id: 'AMB-02', callSign: 'Unit 102 (BLS)', type: 'Basic Life Support', coords: { x: 60, y: 30 }, status: 'Available', crew: 'EMT R. Miller', equipment: ['Oxygen', 'First Aid', 'AED'] },
  { id: 'AMB-03', callSign: 'Unit 103 (ALS)', type: 'Advanced Life Support', coords: { x: 75, y: 65 }, status: 'Busy', crew: 'Paramedic T. Evans', equipment: ['Ventilator', 'Lucas Device'] },
  { id: 'AMB-04', callSign: 'Unit 104 (BLS)', type: 'Basic Life Support', coords: { x: 22, y: 60 }, status: 'Available', crew: 'EMT J. Adams', equipment: ['Oxygen', 'Stretcher', 'AED'] },
  { id: 'AMB-05', callSign: 'Unit 105 (Rapid)', type: 'Rapid Response Unit', coords: { x: 50, y: 80 }, status: 'Available', crew: 'Dr. K. Patel (Physician fly-car)', equipment: ['Trauma Surgical Pack'] },
  { id: 'AMB-06', callSign: 'Unit 106 (ALS)', type: 'Advanced Life Support', coords: { x: 85, y: 20 }, status: 'Offline', crew: 'Off Duty', equipment: ['Standard ALS'] }
];

const INITIAL_BLOOD_BANKS = [
  { id: 'BB-01', name: 'Central Blood Depot', coords: { x: 45, y: 50 }, inventory: { 'O-': 6, 'O+': 22, 'A+': 35, 'B+': 18, 'AB+': 8 }, status: 'Operational' },
  { id: 'BB-02', name: 'Regional Transfusion Hub', coords: { x: 70, y: 40 }, inventory: { 'O-': 2, 'O+': 14, 'A+': 19, 'B+': 12, 'AB+': 4 }, status: 'Operational' },
  { id: 'BB-03', name: 'Red Cross Emergency Reserve', coords: { x: 30, y: 80 }, inventory: { 'O-': 0, 'O+': 8, 'A+': 12, 'B+': 6, 'AB+': 2 }, status: 'Critical Reserve Only' }
];

const INITIAL_CASES = [
  {
    id: 'LG-1024',
    timestamp: '12 mins ago',
    incidentType: 'Road Traffic Collision',
    severity: 'Immediate Review',
    locationText: 'Highway 101 Northbound, Exit 42',
    coords: { x: 40, y: 45 },
    affectedCount: 2,
    description: 'High-speed 2-vehicle rollover. Driver trapped with chest trauma and diminished breathing. Second passenger conscious with lacerations.',
    requirements: ['Level 1/2 Trauma', 'ICU Bed', 'ALS Transport'],
    status: 'Transporting',
    assignedAmbulanceId: 'AMB-01',
    assignedHospitalId: 'HOSP-01',
    initialHospitalId: 'HOSP-01',
    hospitalStatus: 'Pre-Alert Accepted',
    etaMinutes: 6,
    bloodRequested: { bloodGroup: 'O-', units: 2, status: 'Reserved' },
    clinicalNotes: ['Intubated at scene. Bilateral breath sounds diminished on right. IV access established x2.'],
    timeline: [
      { id: 't1', time: '12m ago', actor: 'Reporter', action: 'Emergency reported via Mobile Citizen Intake' },
      { id: 't2', time: '11m ago', actor: 'LIFEGRID AI', action: 'Identified Severe Trauma. Scored Metro Trauma #1 (94 pts).' },
      { id: 't3', time: '10m ago', actor: 'Dispatcher', action: 'Offered assignment to Unit 101 (ALS)' },
      { id: 't4', time: '9m ago', actor: 'Unit 101', action: 'Accepted dispatch. En route to scene.' },
      { id: 't5', time: '4m ago', actor: 'Unit 101', action: 'Patient extricated. Began transport to Metro Trauma Center.' }
    ]
  },
  {
    id: 'LG-1025',
    timestamp: '28 mins ago',
    incidentType: 'Chest Discomfort / Cardiac',
    severity: 'Urgent Review',
    locationText: '88 Market St, Financial Plaza 3rd Fl',
    coords: { x: 65, y: 35 },
    affectedCount: 1,
    description: '62yo male experiencing crushing substernal chest pressure radiating to left jaw. Diaphoretic.',
    requirements: ['Cardiac Cath Lab', 'Telemetry'],
    status: 'Arrived at Hospital',
    assignedAmbulanceId: 'AMB-02',
    assignedHospitalId: 'HOSP-02',
    initialHospitalId: 'HOSP-02',
    hospitalStatus: 'Handover in Progress',
    etaMinutes: 0,
    bloodRequested: null,
    clinicalNotes: ['STEMI alert transmitted via telemetry. Cath lab activation initiated.'],
    timeline: [
      { id: 't20', time: '28m ago', actor: 'Reporter', action: 'Emergency intake submitted.' },
      { id: 't21', time: '22m ago', actor: 'Apex Institute', action: 'Pre-alert acknowledged by Dr. Zhang.' },
      { id: 't22', time: '2m ago', actor: 'Unit 102', action: 'Arrived at Emergency Department.' }
    ]
  }
];

export default function App() {
  // App Navigation & Role State
  const [currentRole, setCurrentRole] = useState('command'); // 'reporter' | 'ambulance' | 'hospital' | 'doctor' | 'bloodbank' | 'command'
  const [selectedCaseId, setSelectedCaseId] = useState('LG-1024');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, time: 'Just now', text: 'LIFEGRID Active: Multi-node dynamic re-planning ready.', type: 'info', read: false },
    { id: 2, time: '4m ago', text: 'LG-1024 Unit 101 en route with severe trauma.', type: 'alert', read: false }
  ]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Core Persistent Domain State
  const [hospitals, setHospitals] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_hospitals`);
      return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
    } catch {
      return INITIAL_HOSPITALS;
    }
  });

  const [ambulances, setAmbulances] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ambulances`);
      return saved ? JSON.parse(saved) : INITIAL_AMBULANCES;
    } catch {
      return INITIAL_AMBULANCES;
    }
  });

  const [bloodBanks, setBloodBanks] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_blood`);
      return saved ? JSON.parse(saved) : INITIAL_BLOOD_BANKS;
    } catch {
      return INITIAL_BLOOD_BANKS;
    }
  });

  const [cases, setCases] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cases`);
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  // Re-planning State & UI Modals
  const [replanningEvent, setReplanningEvent] = useState(null);
  const [isSimulatingScenario, setIsSimulatingScenario] = useState(false);
  const [mapZoomTarget, setMapZoomTarget] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_hospitals`, JSON.stringify(hospitals));
      localStorage.setItem(`${STORAGE_KEY}_ambulances`, JSON.stringify(ambulances));
      localStorage.setItem(`${STORAGE_KEY}_blood`, JSON.stringify(bloodBanks));
      localStorage.setItem(`${STORAGE_KEY}_cases`, JSON.stringify(cases));
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [hospitals, ambulances, bloodBanks, cases]);

  // Active Selected Case
  const activeCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  // Helper to append a timeline log and notification
  const logEvent = (caseId, actor, action, notifyText = null, isAlert = false) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          timeline: [{ id: `evt-${Date.now()}-${Math.random()}`, time: timestamp, actor, action }, ...c.timeline]
        };
      }
      return c;
    }));

    if (notifyText) {
      setNotifications(prev => [
        { id: Date.now(), time: 'Just now', text: notifyText, type: isAlert ? 'alert' : 'info', read: false },
        ...prev
      ]);
    }
  };

  // ==========================================
  // DETERMINISTIC SCORING & EXPLAINABLE MATCHING
  // ==========================================
  const evaluateHospitalMatches = (caseItem, currentHospitalsList = hospitals) => {
    if (!caseItem) return [];

    return currentHospitalsList.map(hosp => {
      let score = 100;
      let reasons = [];
      let isExcluded = false;
      let exclusionReason = null;

      // Hard constraint 1: ICU Bed requirement
      const requiresIcu = caseItem.requirements?.some(r => r.toLowerCase().includes('icu'));
      if (requiresIcu && hosp.icuBeds <= 0) {
        isExcluded = true;
        exclusionReason = 'Excluded: 0 ICU beds available for critical care intake';
        score = 0;
      }

      // Hard constraint 2: Trauma Level requirement
      const requiresTrauma = caseItem.requirements?.some(r => r.toLowerCase().includes('trauma'));
      if (requiresTrauma && hosp.traumaLevel > 2) {
        if (!isExcluded) {
          isExcluded = true;
          exclusionReason = `Excluded: Facility is Trauma Level ${hosp.traumaLevel} (Level 1/2 required)`;
          score = 0;
        }
      }

      // Hard constraint 3: Cardiac Cath requirement
      const requiresCardiac = caseItem.requirements?.some(r => r.toLowerCase().includes('cardiac'));
      if (requiresCardiac && !hosp.cardiacAvailable) {
        if (!isExcluded) {
          isExcluded = true;
          exclusionReason = 'Excluded: No active 24/7 Cardiac Catheterization capability';
          score = 0;
        }
      }

      if (!isExcluded) {
        // Factor 1: Travel Time (Deduct 2 pts per minute above 5 mins)
        const travelPenalty = Math.max(0, (hosp.baseTravelMin - 5) * 2.5);
        score -= travelPenalty;
        reasons.push(`${hosp.baseTravelMin} min transit (-${travelPenalty.toFixed(0)} pts)`);

        // Factor 2: ICU Cushion
        if (hosp.icuBeds >= 3) {
          score += 10;
          reasons.push(`Strong ICU capacity (${hosp.icuBeds} free beds, +10 pts)`);
        } else if (hosp.icuBeds === 1) {
          score -= 8;
          reasons.push(`Constrained ICU capacity (only 1 bed free, -8 pts)`);
        }

        // Factor 3: Level 1 Trauma bonus for severe trauma
        if (requiresTrauma && hosp.traumaLevel === 1) {
          score += 15;
          reasons.push('Gold-standard Level 1 Comprehensive Trauma Center (+15 pts)');
        }

        // Factor 4: Facility status load
        if (hosp.status === 'High Load') {
          score -= 15;
          reasons.push('Facility under high emergency surge (-15 pts)');
        }
      }

      const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

      return {
        hospital: hosp,
        score: clampedScore,
        isExcluded,
        exclusionReason,
        reasons,
        eta: hosp.baseTravelMin
      };
    }).sort((a, b) => {
      if (a.isExcluded && !b.isExcluded) return 1;
      if (!a.isExcluded && b.isExcluded) return -1;
      return b.score - a.score;
    });
  };

  // Ambulance Matcher
  const rankAmbulances = (caseItem) => {
    return ambulances
      .filter(a => a.status === 'Available')
      .map(amb => {
        let score = 90;
        let reasons = [];
        const isALS = amb.type.includes('Advanced');
        const needsALS = caseItem.requirements?.some(r => r.toLowerCase().includes('als'));

        if (needsALS && isALS) {
          score += 15;
          reasons.push('Equipped with ALS critical care telemetry & ventilator');
        } else if (needsALS && !isALS) {
          score -= 25;
          reasons.push('BLS unit only; does not meet ALS protocol standard');
        }

        // Estimated transit from ambulance coordinate to incident
        const dist = Math.hypot((amb.coords.x - caseItem.coords.x), (amb.coords.y - caseItem.coords.y));
        const eta = Math.max(3, Math.round(dist * 0.25));
        score -= eta * 2;
        reasons.push(`Simulated ${eta} min response radius`);

        return {
          ambulance: amb,
          score: Math.max(10, Math.round(score)),
          eta,
          reasons
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  // ==========================================
  // DYNAMIC RE-PLANNING ENGINE (THE USP)
  // ==========================================
  const triggerDynamicReplanning = (caseId, causeReason, updatedHospitals = hospitals) => {
    const currentCase = cases.find(c => c.id === caseId);
    if (!currentCase) return;

    const previousHospital = updatedHospitals.find(h => h.id === currentCase.assignedHospitalId) ||
                             updatedHospitals.find(h => h.id === currentCase.initialHospitalId);

    // Re-evaluate with current state
    const newEvaluations = evaluateHospitalMatches(currentCase, updatedHospitals);
    const validMatches = newEvaluations.filter(m => !m.isExcluded);

    if (validMatches.length === 0) {
      logEvent(
        caseId,
        'LIFEGRID AI Engine',
        `CRITICAL ALERT: Dynamic Re-planning found NO viable destination hospitals meeting hard requirements! Immediate human triage supervisor diversion needed.`,
        `EMERGENCY: No viable hospital for ${caseId}`,
        true
      );
      setReplanningEvent({
        caseId,
        timestamp: new Date().toLocaleTimeString(),
        cause: causeReason,
        oldHospital: previousHospital,
        newHospital: null,
        reasons: ['All regional candidate facilities fail required constraints (ICU / Trauma / Capacity)'],
        confirmed: false
      });
      return;
    }

    const topRecommendation = validMatches[0];

    // Build Re-planning comparison event
    const eventData = {
      caseId,
      timestamp: new Date().toLocaleTimeString(),
      cause: causeReason,
      oldHospital: previousHospital,
      newHospital: topRecommendation.hospital,
      newScore: topRecommendation.score,
      etaDelta: topRecommendation.hospital.baseTravelMin - (previousHospital ? previousHospital.baseTravelMin : 0),
      reasons: [
        causeReason,
        `Re-ranked regional resources: ${topRecommendation.hospital.name} achieved top score (${topRecommendation.score}/100)`,
        `${topRecommendation.hospital.icuBeds} verified available ICU beds, Trauma Level ${topRecommendation.hospital.traumaLevel}`,
        `ETA updated to ${topRecommendation.hospital.baseTravelMin} mins`
      ],
      confirmed: false
    };

    setReplanningEvent(eventData);

    // Update case object
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          recommendedHospitalId: topRecommendation.hospital.id,
          status: 'Re-planning Active'
        };
      }
      return c;
    }));

    logEvent(
      caseId,
      'LIFEGRID AI Engine',
      `DYNAMIC RE-PLANNING TRIGGERED: ${causeReason}. Suggested alternative: ${topRecommendation.hospital.name}. Awaiting coordinator confirmation.`,
      `Re-planning triggered for Case ${caseId}: ${causeReason}`,
      true
    );
  };

  // Confirm Re-plan
  const confirmReplanningAction = () => {
    if (!replanningEvent || !replanningEvent.newHospital) return;

    const caseId = replanningEvent.caseId;
    const newHosp = replanningEvent.newHospital;

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          assignedHospitalId: newHosp.id,
          etaMinutes: newHosp.baseTravelMin,
          hospitalStatus: 'Re-routed & Pre-Alert Sent',
          status: 'Transporting'
        };
      }
      return c;
    }));

    logEvent(
      caseId,
      'Central Command Coordinator',
      `Re-routing confirmed to ${newHosp.name}. Telemetry and pre-alert diverted. Ambulance navigation updated.`,
      `Route confirmed to ${newHosp.name}`
    );

    setReplanningEvent(null);
  };

  // ==========================================
  // GOLDEN SCENARIO RUNNER
  // ==========================================
  const runGoldenScenario = () => {
    setIsSimulatingScenario(true);
    setSelectedCaseId('LG-1024');

    // Step 1: Reset Metro Trauma ICU to 0 to simulate sudden saturation
    setTimeout(() => {
      setHospitals(prev => prev.map(h => {
        if (h.id === 'HOSP-01') {
          return {
            ...h,
            icuBeds: 0,
            status: 'ICU Saturated',
            lastUpdated: 'Just now (Telemetry Drop)'
          };
        }
        return h;
      }));

      // Step 2: Trigger Engine Re-planning
      setTimeout(() => {
        const updatedList = hospitals.map(h => h.id === 'HOSP-01' ? { ...h, icuBeds: 0 } : h);
        triggerDynamicReplanning('LG-1024', 'Metro Trauma Center ICU dropped from 4 to 0 available beds (Capacity Saturated)', updatedList);
        setIsSimulatingScenario(false);
      }, 900);

    }, 600);
  };

  // Reset All to Demo Seed
  const handleResetData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_hospitals`);
    localStorage.removeItem(`${STORAGE_KEY}_ambulances`);
    localStorage.removeItem(`${STORAGE_KEY}_blood`);
    localStorage.removeItem(`${STORAGE_KEY}_cases`);
    setHospitals(INITIAL_HOSPITALS);
    setAmbulances(INITIAL_AMBULANCES);
    setBloodBanks(INITIAL_BLOOD_BANKS);
    setCases(INITIAL_CASES);
    setReplanningEvent(null);
    setSelectedCaseId('LG-1024');
    setNotifications([{ id: Date.now(), time: 'Just now', text: 'Demo environment reset to baseline state.', type: 'info', read: false }]);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* TOP REGULATORY & SAFETY BANNER */}
      <div className="bg-amber-500/10 border-b border-amber-500/25 px-3 py-1.5 text-xs text-amber-300 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-2 truncate">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="font-semibold tracking-wide uppercase text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">Hackathon Prototype</span>
          <span className="truncate">Simulated Data — Not for Real Emergencies — AI Decisions are Advisory Only</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={handleResetData}
            title="Reset simulation to initial seeds"
            className="flex items-center space-x-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded text-[11px] border border-slate-700 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* HEADER BAR */}
      <header className="bg-[#0e1726]/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-[33px] z-40 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">LIFEGRID</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-1.5 py-0.2 rounded-full font-mono font-medium">LIVE AI COORDINATION</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Healthcare Innovation Hackathon Engine</p>
            </div>
          </div>
        </div>

        {/* ACTIVE ROLE SWITCHER BADGE & ACTION */}
        <div className="flex items-center space-x-2">
          {/* Quick Case Switcher */}
          <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <span className="text-slate-500 px-2 text-[11px]">Active Case:</span>
            {cases.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                  selectedCaseId === c.id 
                    ? 'bg-teal-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>

          {/* Golden Demo Runner Button */}
          <button
            onClick={runGoldenScenario}
            disabled={isSimulatingScenario}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-md border ${
              isSimulatingScenario 
                ? 'bg-amber-600/50 border-amber-500/50 text-amber-200 cursor-wait animate-pulse' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400/80 hover:brightness-110 active:scale-95'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trigger Golden Scenario</span>
            <span className="sm:hidden">Golden Demo</span>
          </button>

          {/* Notifications Toggle */}
          <button
            onClick={() => setShowNotificationModal(!showNotificationModal)}
            className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* ROLE SELECTOR CAROUSEL BAR (MOBILE & DESKTOP) */}
      <div className="bg-[#0b121f] border-b border-slate-800 px-3 py-2 overflow-x-auto no-scrollbar flex items-center space-x-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1 shrink-0">Demo Role:</span>
        {[
          { id: 'command', label: 'Command Centre', icon: Radio, count: cases.length },
          { id: 'reporter', label: 'Citizen Reporter', icon: User, count: null },
          { id: 'ambulance', label: 'Ambulance Operator', icon: Truck, count: ambulances.filter(a => a.status === 'Available').length },
          { id: 'hospital', label: 'Hospital Ops', icon: Building2, count: hospitals.filter(h => h.icuBeds > 0).length },
          { id: 'doctor', label: 'Clinical Doctor', icon: Stethoscope, count: null },
          { id: 'bloodbank', label: 'Blood Resources', icon: Droplet, count: 3 }
        ].map(r => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setCurrentRole(r.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                isActive 
                  ? 'bg-teal-500/20 border-teal-500/60 text-teal-300 shadow-sm' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{r.label}</span>
              {r.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-800 text-slate-400'}`}>
                  {r.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* RE-PLANNING ALERT OVERLAY (PROMINENT COMPARISON MODAL) */}
      {replanningEvent && (
        <div className="fixed inset-x-0 top-[110px] z-50 px-4 max-w-4xl mx-auto animate-bounce-short">
          <div className="bg-gradient-to-b from-[#19243a] to-[#0f172a] border-2 border-amber-500/70 rounded-2xl shadow-2xl p-5 text-slate-100 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <RotateCw className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="font-extrabold text-amber-400 text-sm sm:text-base flex items-center space-x-2">
                    <span>DYNAMIC RE-PLANNING TRIGGERED</span>
                    <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">CASE {replanningEvent.caseId}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{replanningEvent.cause}</p>
                </div>
              </div>
              <button 
                onClick={() => setReplanningEvent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Side-by-Side Old Plan vs New Plan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* Previous Plan */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-red-400 font-semibold mb-1">
                  <span>PREVIOUS PLAN (INVALIDATED)</span>
                  <XCircle className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-slate-200">
                  {replanningEvent.oldHospital?.name || 'Previous Facility'}
                </div>
                <p className="text-xs text-red-300/80 mt-1">
                  Trigger: ICU capacity dropped to 0 beds. Fails critical care requirement.
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-400">
                  Status: Diverted
                </div>
              </div>

              {/* Proposed New Plan */}
              <div className="bg-teal-950/20 border border-teal-500/50 rounded-xl p-3 shadow-inner">
                <div className="flex items-center justify-between text-xs text-teal-400 font-semibold mb-1">
                  <span>RECOMMENDED RE-PLAN (AI SCORED)</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span>{replanningEvent.newHospital?.name || 'Alternative Center'}</span>
                  <span className="text-xs font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                    Score: {replanningEvent.newScore || 88}/100
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Verified: {replanningEvent.newHospital?.icuBeds || 2} ICU beds free • Level {replanningEvent.newHospital?.traumaLevel || 2} Trauma • +{replanningEvent.etaDelta || 4} min transit
                </p>
                <div className="mt-2 text-[11px] font-mono text-teal-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>ETA: {replanningEvent.newHospital?.baseTravelMin || 12} mins</span>
                </div>
              </div>
            </div>

            {/* Explanation Factors */}
            <div className="mt-3 bg-slate-900/80 rounded-lg p-2.5 text-xs text-slate-300 border border-slate-800">
              <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider block mb-1">Algorithmic Justification:</span>
              <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-300">
                {replanningEvent.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setReplanningEvent(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Dismiss / Keep Manual
              </button>
              <button
                onClick={confirmReplanningAction}
                className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center space-x-1.5 shadow-lg shadow-teal-500/20 transition active:scale-95"
              >
                <Check className="w-4 h-4 font-bold" />
                <span>Confirm Re-routing & Divert Ambulance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION DRAWER / MODAL */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-[#0e1726] border-l border-slate-800 h-full p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-100">Live Coordination Feed</h3>
              </div>
              <button 
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {notifications.map(n => (
                <div 
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs ${
                    n.type === 'alert' 
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-mono">
                    <span>{n.time}</span>
                    <span className="uppercase">{n.type}</span>
                  </div>
                  <div>{n.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN DYNAMIC CONTENT AREA BASED ON CURRENT ROLE */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 max-w-7xl w-full mx-auto pb-24 md:pb-8">
        {currentRole === 'command' && (
          <CommandCenterView
            activeCase={activeCase}
            cases={cases}
            setSelectedCaseId={setSelectedCaseId}
            hospitals={hospitals}
            ambulances={ambulances}
            bloodBanks={bloodBanks}
            evaluateHospitalMatches={evaluateHospitalMatches}
            triggerDynamicReplanning={triggerDynamicReplanning}
            logEvent={logEvent}
            setMapZoomTarget={setMapZoomTarget}
          />
        )}

        {currentRole === 'reporter' && (
          <ReporterView 
            cases={cases}
            setCases={setCases}
            setSelectedCaseId={setSelectedCaseId}
            selectedCaseId={selectedCaseId}
            activeCase={activeCase}
            hospitals={hospitals}
            evaluateHospitalMatches={evaluateHospitalMatches}
            rankAmbulances={rankAmbulances}
            logEvent={logEvent}
          />
        )}

        {currentRole === 'ambulance' && (
          <AmbulanceView 
            ambulances={ambulances}
            setAmbulances={setAmbulances}
            activeCase={activeCase}
            cases={cases}
            hospitals={hospitals}
            logEvent={logEvent}
            triggerDynamicReplanning={triggerDynamicReplanning}
          />
        )}

        {currentRole === 'hospital' && (
          <HospitalOpsView 
            hospitals={hospitals}
            setHospitals={setHospitals}
            activeCase={activeCase}
            cases={cases}
            triggerDynamicReplanning={triggerDynamicReplanning}
            logEvent={logEvent}
          />
        )}

        {currentRole === 'doctor' && (
          <DoctorClinicalView 
            activeCase={activeCase}
            hospitals={hospitals}
            cases={cases}
            setCases={setCases}
            logEvent={logEvent}
          />
        )}

        {currentRole === 'bloodbank' && (
          <BloodBankView 
            bloodBanks={bloodBanks}
            setBloodBanks={setBloodBanks}
            activeCase={activeCase}
            cases={cases}
            setCases={setCases}
            logEvent={logEvent}
          />
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#0e1726]/95 border-t border-slate-800 backdrop-blur-lg z-40 py-1.5 px-2 flex justify-around items-center">
        {[
          { id: 'command', label: 'Command', icon: Radio },
          { id: 'reporter', label: 'Report', icon: AlertCircle },
          { id: 'ambulance', label: 'Ambulance', icon: Truck },
          { id: 'hospital', label: 'Hospital', icon: Building2 },
          { id: 'doctor', label: 'Clinical', icon: Stethoscope },
          { id: 'bloodbank', label: 'Blood', icon: Droplet }
        ].map(item => {
          const Icon = item.icon;
          const isSelected = currentRole === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentRole(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isSelected 
                  ? 'text-teal-400 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ==========================================
// 1. COMMAND CENTRE VIEW (UNIFIED MAP & AI METRICS)
// ==========================================
function CommandCenterView({
  activeCase,
  cases,
  setSelectedCaseId,
  hospitals,
  ambulances,
  bloodBanks,
  evaluateHospitalMatches,
  triggerDynamicReplanning,
  logEvent,
  setMapZoomTarget
}) {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const hospitalRankings = useMemo(() => evaluateHospitalMatches(activeCase, hospitals), [activeCase, hospitals]);
  const assignedHospital = hospitals.find(h => h.id === activeCase.assignedHospitalId);
  const assignedAmbulance = ambulances.find(a => a.id === activeCase.assignedAmbulanceId);

  return (
    <div className="space-y-5">
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121c2e] border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Cases</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{cases.length}</div>
          <span className="text-[10px] text-teal-400 font-medium">100% telemetry synced</span>
        </div>

        <div className="bg-[#121c2e] border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Ambulance Fleet</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {ambulances.filter(a => a.status === 'Available').length}
            <span className="text-xs text-slate-400 font-normal"> / {ambulances.length} Free</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-medium">ALS & BLS Units ready</span>
        </div>

        <div className="bg-[#121c2e] border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Critical ICU Beds</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {hospitals.reduce((acc, h) => acc + h.icuBeds, 0)}
            <span className="text-xs text-slate-400 font-normal"> beds</span>
          </div>
          <span className="text-[10px] text-amber-400 font-medium">Across 5 regional hubs</span>
        </div>

        <div className="bg-[#121c2e] border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Re-planning Status</span>
            <RotateCw className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-300 mt-1">Autonomous</div>
          <span className="text-[10px] text-slate-400 font-medium">Constraint listener on</span>
        </div>
      </div>

      {/* CORE 2-COLUMN LAYOUT: MAP ON LEFT, INCIDENT INTELLIGENCE ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: MAP CANVAS & VISUAL COORDINATION RADAR (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-white">Regional Emergency Network Radar</h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">SIMULATED SPATIAL</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-ping" />Incident</span>
                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-1" />Ambulance</span>
                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-teal-400 mr-1" />Hospital</span>
              </div>
            </div>

            {/* VECTOR MAP SVG SIMULATOR */}
            <div className="relative w-full aspect-[16/10] bg-[#090e18] rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#172439" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Simulated Transit Corridor Lines */}
                {assignedAmbulance && activeCase && (
                  <line 
                    x1={assignedAmbulance.coords.x} 
                    y1={assignedAmbulance.coords.y} 
                    x2={activeCase.coords.x} 
                    y2={activeCase.coords.y} 
                    stroke="#00f0ff" 
                    strokeWidth="0.8" 
                    strokeDasharray="2,2" 
                    className="animate-pulse"
                  />
                )}
                {assignedHospital && activeCase && (
                  <line 
                    x1={activeCase.coords.x} 
                    y1={activeCase.coords.y} 
                    x2={assignedHospital.coords.x} 
                    y2={assignedHospital.coords.y} 
                    stroke="#00e5cc" 
                    strokeWidth="1" 
                    strokeDasharray="1.5,1.5"
                  />
                )}

                {/* Hospital Markers */}
                {hospitals.map(h => {
                  const isAssigned = h.id === activeCase.assignedHospitalId;
                  return (
                    <g key={h.id} className="cursor-pointer" onClick={() => logEvent(activeCase.id, 'Coordinator', `Inspected ${h.name} on radar map`)}>
                      <circle 
                        cx={h.coords.x} 
                        cy={h.coords.y} 
                        r={isAssigned ? "4" : "2.5"} 
                        fill={isAssigned ? "#00e5cc" : "#1e293b"} 
                        stroke="#00e5cc" 
                        strokeWidth="0.8" 
                      />
                      <text x={h.coords.x + 3} y={h.coords.y + 1} fill="#94a3b8" fontSize="2.8" fontFamily="sans-serif">
                        {h.name.split(' ')[0]} ({h.icuBeds} ICU)
                      </text>
                    </g>
                  );
                })}

                {/* Ambulances */}
                {ambulances.map(a => {
                  const isCaseAmb = a.id === activeCase.assignedAmbulanceId;
                  return (
                    <g key={a.id}>
                      <circle 
                        cx={a.coords.x} 
                        cy={a.coords.y} 
                        r={isCaseAmb ? "3.2" : "2"} 
                        fill={isCaseAmb ? "#00f0ff" : "#334155"} 
                        stroke="#38bdf8" 
                        strokeWidth="0.6" 
                      />
                      <text x={a.coords.x + 2} y={a.coords.y - 2} fill="#38bdf8" fontSize="2.4" fontFamily="mono">
                        {a.id}
                      </text>
                    </g>
                  );
                })}

                {/* Active Incident Beacon */}
                {activeCase && (
                  <g>
                    <circle cx={activeCase.coords.x} cy={activeCase.coords.y} r="6" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                    <circle cx={activeCase.coords.x} cy={activeCase.coords.y} r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.7" />
                    <text x={activeCase.coords.x - 6} y={activeCase.coords.y - 4} fill="#fca5a5" fontSize="3" fontWeight="bold">
                      {activeCase.id}
                    </text>
                  </g>
                )}
              </svg>

              {/* Map Footer Info Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md rounded-lg p-2 border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
                <div className="truncate">
                  <span className="text-teal-400 font-semibold">Active Vector: </span>
                  {activeCase.locationText} → {assignedHospital ? assignedHospital.name : 'Unassigned'}
                </div>
                <div className="font-mono text-cyan-300 font-bold shrink-0 ml-2">
                  ETA: {activeCase.etaMinutes} min
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button 
                onClick={() => triggerDynamicReplanning(activeCase.id, 'Manual coordinator re-plan request')}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <RotateCw className="w-3.5 h-3.5 text-teal-400" />
                <span>Trigger Manual Re-plan</span>
              </button>

              <button 
                onClick={() => {
                  setHospitals(prev => prev.map(h => h.id === 'HOSP-01' ? { ...h, icuBeds: 0 } : h));
                  triggerDynamicReplanning(activeCase.id, 'Metro Trauma ICU filled to max capacity');
                }}
                className="flex items-center space-x-1.5 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Metro ICU Full (0 beds)</span>
              </button>
            </div>
          </div>

          {/* ACTIVE CASES DIRECTORY */}
          <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="font-bold text-sm text-white mb-2 flex items-center justify-between">
              <span>Emergency Intake Queue ({cases.length})</span>
              <span className="text-xs text-slate-400 font-normal">Click to switch focused coordination</span>
            </h3>
            <div className="space-y-2">
              {cases.map(item => {
                const isSelected = item.id === activeCase.id;
                return (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-teal-950/20 border-teal-500/50 shadow-md' 
                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-white">{item.id}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          item.severity.includes('Immediate') ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {item.severity}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-200 mt-1 font-medium">{item.incidentType}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm">{item.locationText}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-teal-300">{item.status}</div>
                      <div className="text-[10px] text-slate-400">ETA {item.etaMinutes}m</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: AI EXPLAINABLE MATCHING & CASE TIMELINE (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* AI MATCHING EXPLAINABILITY CARD */}
          <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-white">AI Resource Matching Engine</h3>
              </div>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-mono">
                DETERMINISTIC + EXPLAINABLE
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 mb-3">
              <div className="text-xs text-slate-400">Assessed Clinical Requirements:</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {activeCase.requirements.map((req, i) => (
                  <span key={i} className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded font-mono">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Hospital Ranking Breakdown */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Hospital Suitability Scores</div>
              {hospitalRankings.map((evalItem, idx) => {
                const hosp = evalItem.hospital;
                const isSelectedHosp = hosp.id === activeCase.assignedHospitalId;
                return (
                  <div 
                    key={hosp.id}
                    className={`p-3 rounded-xl border text-xs transition ${
                      evalItem.isExcluded
                        ? 'bg-red-950/10 border-red-500/20 opacity-60'
                        : isSelectedHosp
                          ? 'bg-teal-950/30 border-teal-500/60 shadow-md ring-1 ring-teal-500/30'
                          : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-200">{idx + 1}. {hosp.name}</span>
                          {isSelectedHosp && (
                            <span className="text-[9px] bg-teal-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded">ASSIGNED</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {hosp.type} • {hosp.baseTravelMin}m transit
                        </div>
                      </div>
                      <div className="text-right">
                        {evalItem.isExcluded ? (
                          <span className="text-[10px] font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/30">
                            EXCLUDED
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-teal-300 text-sm">
                            {evalItem.score} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Explanations */}
                    <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                      {evalItem.isExcluded ? (
                        <p className="text-red-400 font-mono text-[10px] flex items-center">
                          <XCircle className="w-3 h-3 mr-1 shrink-0" />
                          {evalItem.exclusionReason}
                        </p>
                      ) : (
                        <div className="space-y-0.5 text-slate-400 text-[10px]">
                          {evalItem.reasons.map((r, ri) => (
                            <div key={ri} className="flex items-center">
                              <span className="w-1 h-1 rounded-full bg-teal-400 mr-1.5" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AUDIT TIMELINE OF EVENTS */}
          <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="font-bold text-sm text-white mb-3 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Case {activeCase.id} Event Ledger</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">APPEND ONLY</span>
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {activeCase.timeline.map((item, index) => (
                <div key={item.id || index} className="flex items-start space-x-2 text-xs">
                  <div className="w-14 text-[10px] font-mono text-slate-500 shrink-0 pt-0.5">{item.time}</div>
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-1 shrink-0" />
                  <div className="flex-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-300 text-[11px] block">{item.actor}</span>
                    <span className="text-slate-400 text-[11px]">{item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CITIZEN REPORTER INTAKE VIEW
// ==========================================
function ReporterView({
  cases,
  setCases,
  setSelectedCaseId,
  selectedCaseId,
  activeCase,
  hospitals,
  evaluateHospitalMatches,
  rankAmbulances,
  logEvent
}) {
  const [incidentType, setIncidentType] = useState('Road Traffic Accident');
  const [locationText, setLocationText] = useState('Highway 101 Northbound, Exit 42');
  const [affectedCount, setAffectedCount] = useState(2);
  const [description, setDescription] = useState('High-speed collision with rollover. Trapped victim with breathing distress.');
  const [submittedId, setSubmittedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newId = `LG-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCase = {
        id: newId,
        timestamp: 'Just now',
        incidentType,
        severity: incidentType.includes('Breathing') || incidentType.includes('Road') ? 'Immediate Review' : 'Urgent Review',
        locationText,
        coords: { x: 40 + Math.random() * 20, y: 35 + Math.random() * 20 },
        affectedCount: Number(affectedCount),
        description,
        requirements: ['Level 1/2 Trauma', 'ICU Bed', 'ALS Transport'],
        status: 'Reported & Offered',
        assignedAmbulanceId: 'AMB-01',
        assignedHospitalId: 'HOSP-01',
        initialHospitalId: 'HOSP-01',
        hospitalStatus: 'Pre-Alert Transmitted',
        etaMinutes: 8,
        bloodRequested: null,
        clinicalNotes: ['Submitted via Citizen Web Intake portal.'],
        timeline: [
          { id: 'ev1', time: 'Just now', actor: 'Citizen Reporter', action: 'Incident reported via mobile intake form.' },
          { id: 'ev2', time: 'Just now', actor: 'LIFEGRID AI', action: 'Matched Unit 101 (ALS) and Metro Trauma Center as primary recommendations.' }
        ]
      };

      setCases([newCase, ...cases]);
      setSelectedCaseId(newId);
      setSubmittedId(newId);
      setIsSubmitting(false);
      logEvent(newId, 'Citizen Reporter', 'Created emergency case record', `New Case Registered: ${newId}`);
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Emergency Coordination Intake</h2>
            <p className="text-xs text-slate-400">Citizen reporting portal • Rapid triage assistance</p>
          </div>
        </div>

        {submittedId ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Emergency Case Created</h3>
              <p className="text-xs text-slate-400 mt-1">Unique Case ID:</p>
              <div className="text-2xl font-mono font-black text-teal-300 mt-0.5">{submittedId}</div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 max-w-md mx-auto">
              Emergency responders and local trauma coordination hubs have been notified. Live status tracking is active below.
            </p>

            <button
              onClick={() => setSubmittedId(null)}
              className="text-xs text-teal-400 hover:text-teal-300 underline font-medium"
            >
              Report Another Emergency
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Type</label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option>Road Traffic Accident</option>
                <option>Breathing Distress / Choking</option>
                <option>Chest Discomfort / Suspected Cardiac</option>
                <option>Severe Fall / High Trauma Injury</option>
                <option>Industrial / Burn Incident</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Location / Landmark</label>
              <input
                type="text"
                required
                value={locationText}
                onChange={e => setLocationText(e.target.value)}
                placeholder="e.g. Highway 101 Northbound, Exit 42"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Persons Affected</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={affectedCount}
                  onChange={e => setAffectedCount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Callback Number (Demo)</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2831"
                  defaultValue="+1 (555) 019-2831"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Description of Situation</label>
              <textarea
                rows="3"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Observed injuries, trapped victims, hazard concerns..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 hover:brightness-110 active:scale-95 transition flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to LIFEGRID Engine...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Emergency Intake</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* CASE TRACKER CARD */}
      {activeCase && (
        <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-mono">TRACKING CASE</span>
              <h3 className="font-bold text-sm text-white font-mono">{activeCase.id}</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {activeCase.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Assigned Ambulance</span>
              <div className="font-bold text-slate-200 mt-0.5">{activeCase.assignedAmbulanceId || 'Awaiting Dispatch'}</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Designated Hospital</span>
              <div className="font-bold text-teal-300 mt-0.5">
                {hospitals.find(h => h.id === activeCase.assignedHospitalId)?.name || 'Matching...'}
              </div>
            </div>
          </div>

          {/* Visual Step Timeline */}
          <div className="space-y-2 mt-4 pt-3 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Live Journey Milestone</span>
            <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
              {['Reported', 'Ambulance En Route', 'Transporting', 'Hospital Arrived'].map((step, idx) => {
                const isCurrent = (idx === 0 && activeCase.status.includes('Reported')) ||
                                  (idx === 1 && activeCase.status.includes('En Route')) ||
                                  (idx === 2 && activeCase.status.includes('Transporting')) ||
                                  (idx === 3 && activeCase.status.includes('Arrived'));
                return (
                  <div key={step} className={`p-1.5 rounded-lg border ${
                    isCurrent ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    {step}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. AMBULANCE OPERATOR VIEW
// ==========================================
function AmbulanceView({
  ambulances,
  setAmbulances,
  activeCase,
  cases,
  hospitals,
  logEvent,
  triggerDynamicReplanning
}) {
  const currentUnit = ambulances[0]; // Unit 101 (ALS)
  const isOnline = currentUnit.status !== 'Offline';
  const assignedHosp = hospitals.find(h => h.id === activeCase.assignedHospitalId);

  const toggleOnline = () => {
    const nextStatus = currentUnit.status === 'Offline' ? 'Available' : 'Offline';
    setAmbulances(prev => prev.map(a => a.id === currentUnit.id ? { ...a, status: nextStatus } : a));
    logEvent(activeCase.id, currentUnit.callSign, `Unit marked status as ${nextStatus}`);
  };

  const updateJourneyState = (newState) => {
    logEvent(activeCase.id, currentUnit.callSign, `Progressed journey state to: ${newState}`);
    // If completed or arrived, update status
  };

  const handleRejectOffer = () => {
    logEvent(activeCase.id, currentUnit.callSign, `Rejected assignment due to sudden mechanical alert`, `Unit 101 rejected dispatch offer`, true);
    triggerDynamicReplanning(activeCase.id, 'Assigned primary ambulance Unit 101 rejected assignment');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Unit Status Card */}
      <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-bold text-sm text-white">{currentUnit.callSign}</h2>
              <p className="text-xs text-slate-400">{currentUnit.type} • {currentUnit.crew}</p>
            </div>
          </div>
          <button
            onClick={toggleOnline}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
              isOnline 
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' 
                : 'bg-red-500/20 text-red-300 border-red-500/40'
            }`}
          >
            {isOnline ? '● Online (Telemetry Active)' : '○ Offline'}
          </button>
        </div>

        {/* Current Active Mission */}
        <div className="mt-4 bg-slate-900/90 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>ACTIVE DISPATCH ASSIGNMENT</span>
            <span className="font-mono text-teal-400 font-bold">{activeCase.id}</span>
          </div>

          <div className="text-sm font-bold text-white">{activeCase.incidentType}</div>
          <p className="text-xs text-slate-300 mt-1">{activeCase.locationText}</p>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Target Hospital Destination</span>
              <div className="font-bold text-teal-300 mt-0.5">{assignedHosp?.name || 'Assigned Facility'}</div>
              <div className="text-[10px] text-slate-400">{assignedHosp?.baseTravelMin} min transit window</div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Hospital Pre-Alert Status</span>
              <div className="font-bold text-amber-300 mt-0.5">{activeCase.hospitalStatus}</div>
              <div className="text-[10px] text-slate-400">{assignedHosp?.icuBeds} ICU beds confirmed</div>
            </div>
          </div>

          {/* Journey Progression Controls */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Advance Transport Stage:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['En Route to Incident', 'At Incident Scene', 'Transporting', 'Arrived at Hospital'].map((stage) => (
                <button
                  key={stage}
                  onClick={() => updateJourneyState(stage)}
                  className="px-2 py-2 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-teal-600 hover:text-slate-950 text-slate-200 border border-slate-700 transition"
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Reject / Contingency Button */}
          <div className="mt-4 pt-2 flex justify-end">
            <button
              onClick={handleRejectOffer}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition flex items-center space-x-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Decline / Flag Mechanical Breakdown</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. HOSPITAL OPERATIONS VIEW
// ==========================================
function HospitalOpsView({
  hospitals,
  setHospitals,
  activeCase,
  cases,
  triggerDynamicReplanning,
  logEvent
}) {
  const [selectedHospId, setSelectedHospId] = useState('HOSP-01');
  const targetHosp = hospitals.find(h => h.id === selectedHospId) || hospitals[0];

  const updateIcuCount = (delta) => {
    const newCount = Math.max(0, targetHosp.icuBeds + delta);
    setHospitals(prev => prev.map(h => {
      if (h.id === targetHosp.id) {
        return {
          ...h,
          icuBeds: newCount,
          lastUpdated: 'Just now'
        };
      }
      return h;
    }));

    logEvent(activeCase.id, targetHosp.name, `ICU bed count adjusted to ${newCount}`);

    // If ICU drops to 0 and this hospital is assigned to an active case requiring ICU
    if (newCount === 0 && activeCase.assignedHospitalId === targetHosp.id) {
      triggerDynamicReplanning(activeCase.id, `${targetHosp.name} ICU capacity saturated to 0`);
    }
  };

  const handleDeclineIncoming = () => {
    logEvent(activeCase.id, targetHosp.name, `Declined incoming case due to emergency surge`, `Hospital declined pre-alert`, true);
    triggerDynamicReplanning(activeCase.id, `${targetHosp.name} declined incoming pre-alert`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Hospital Switcher */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {hospitals.map(h => (
          <button
            key={h.id}
            onClick={() => setSelectedHospId(h.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedHospId === h.id 
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {h.name}
          </button>
        ))}
      </div>

      <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <h2 className="font-bold text-base text-white">{targetHosp.name}</h2>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Trauma Level {targetHosp.traumaLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{targetHosp.type} • Updated {targetHosp.lastUpdated}</p>
          </div>
          <div className="text-right">
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {targetHosp.status}
            </span>
          </div>
        </div>

        {/* RESOURCE ADJUSTMENT CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          
          {/* ICU Bed Counter Toggle */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block">Available ICU Beds</span>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-2xl font-black font-mono ${targetHosp.icuBeds === 0 ? 'text-red-400' : 'text-teal-300'}`}>
                {targetHosp.icuBeds} <span className="text-xs text-slate-500 font-normal">/ {targetHosp.icuTotal}</span>
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => updateIcuCount(-1)}
                  className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-sm border border-slate-700"
                >
                  -
                </button>
                <button
                  onClick={() => updateIcuCount(1)}
                  className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-sm border border-slate-700"
                >
                  +
                </button>
              </div>
            </div>
            {targetHosp.icuBeds === 0 && (
              <p className="text-[10px] text-red-400 mt-1 font-mono">CRITICAL: Saturated bed capacity</p>
            )}
          </div>

          {/* Ventilators */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block">Ventilators Available</span>
            <div className="text-2xl font-black font-mono text-white mt-2">
              {targetHosp.ventilators} <span className="text-xs text-slate-500 font-normal">ready</span>
            </div>
            <span className="text-[10px] text-slate-400">Resp Therapy staffed</span>
          </div>

          {/* Specialties */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block">Clinical Readiness</span>
            <div className="text-xs text-slate-300 space-y-1 mt-2">
              <div className="flex justify-between">
                <span>Cath Lab:</span>
                <span className={targetHosp.cardiacAvailable ? 'text-teal-400' : 'text-slate-500'}>
                  {targetHosp.cardiacAvailable ? 'Active' : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Neuro Surgery:</span>
                <span className={targetHosp.neuroAvailable ? 'text-teal-400' : 'text-slate-500'}>
                  {targetHosp.neuroAvailable ? 'On Call' : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* INCOMING PRE-ALERT DISPATCH REVIEW */}
        {activeCase.assignedHospitalId === targetHosp.id && (
          <div className="bg-teal-950/20 border border-teal-500/40 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between text-xs text-teal-400 font-semibold mb-2">
              <span className="flex items-center">
                <Radio className="w-3.5 h-3.5 mr-1 animate-pulse" />
                INCOMING EMERGENCY PRE-ALERT
              </span>
              <span className="font-mono">ETA {activeCase.etaMinutes} MINS</span>
            </div>

            <div className="text-sm font-bold text-white">{activeCase.incidentType}</div>
            <p className="text-xs text-slate-300 mt-1">{activeCase.description}</p>
            
            <div className="mt-3 flex items-center justify-end space-x-2">
              <button
                onClick={handleDeclineIncoming}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40"
              >
                Decline / Divert
              </button>
              <button
                onClick={() => logEvent(activeCase.id, targetHosp.name, 'Confirmed ED Resus Bay 1 ready for patient arrival')}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950"
              >
                Confirm Readiness
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. DOCTOR / CLINICAL TEAM VIEW
// ==========================================
function DoctorClinicalView({
  activeCase,
  hospitals,
  cases,
  setCases,
  logEvent
}) {
  const [newNote, setNewNote] = useState('');
  const assignedHospital = hospitals.find(h => h.id === activeCase.assignedHospitalId);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          clinicalNotes: [...(c.clinicalNotes || []), newNote.trim()]
        };
      }
      return c;
    }));

    logEvent(activeCase.id, 'Dr. Sarah Lin (Attending ER)', `Added clinical intake assessment note: "${newNote.trim()}"`);
    setNewNote('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Stethoscope className="w-5 h-5 text-teal-400" />
          <div>
            <h2 className="font-bold text-sm text-white">Clinical Emergency Intake & Telemetry</h2>
            <p className="text-xs text-slate-400">Human-in-the-loop clinical supervision • Physician triage notes</p>
          </div>
        </div>

        {/* Case Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-xs">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Patient Case ID</span>
            <div className="font-mono font-bold text-white mt-0.5">{activeCase.id}</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Urgency Flag</span>
            <div className="font-bold text-red-400 mt-0.5">{activeCase.severity}</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">ETA to Bay</span>
            <div className="font-mono font-bold text-teal-300 mt-0.5">{activeCase.etaMinutes} mins</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Destination</span>
            <div className="font-bold text-slate-200 mt-0.5 truncate">{assignedHospital?.name}</div>
          </div>
        </div>

        {/* Clinical Summary & Field Notes */}
        <div className="space-y-3">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Field Paramedic Telemetry Brief</span>
            <p className="text-xs text-slate-200 mt-1">{activeCase.description}</p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Clinical Progress Log</span>
            <div className="mt-2 space-y-1.5">
              {(activeCase.clinicalNotes || []).map((note, idx) => (
                <div key={idx} className="text-xs text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80 flex items-start space-x-2">
                  <FileText className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="mt-3 flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Record clinical orders or trauma bay prep..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. BLOOD BANK RESOURCE VIEW
// ==========================================
function BloodBankView({
  bloodBanks,
  setBloodBanks,
  activeCase,
  cases,
  setCases,
  logEvent
}) {
  const currentDepot = bloodBanks[0];

  const handleReserveUnits = (group) => {
    if (currentDepot.inventory[group] <= 0) return;

    setBloodBanks(prev => prev.map(bb => {
      if (bb.id === currentDepot.id) {
        return {
          ...bb,
          inventory: {
            ...bb.inventory,
            [group]: bb.inventory[group] - 2
          }
        };
      }
      return bb;
    }));

    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          bloodRequested: { bloodGroup: group, units: 2, status: 'Dispatched via Courier' }
        };
      }
      return c;
    }));

    logEvent(activeCase.id, currentDepot.name, `Reserved and dispatched 2 units of ${group} PRBC for trauma resus.`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-[#10192a] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Droplet className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="font-bold text-sm text-white">{currentDepot.name}</h2>
              <p className="text-xs text-slate-400">Emergency transfusion inventory registry</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
            {currentDepot.status}
          </span>
        </div>

        {/* Current Active Case Blood Demand */}
        <div className="my-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Emergency Transfusion Allocation</span>
          <div className="flex items-center justify-between mt-1 text-xs">
            <div>
              <span className="font-bold text-white">Case {activeCase.id}: </span>
              <span className="text-slate-300">{activeCase.incidentType}</span>
            </div>
            <div className="font-mono text-teal-400 font-bold">
              {activeCase.bloodRequested ? `${activeCase.bloodRequested.units}x ${activeCase.bloodRequested.bloodGroup} (${activeCase.bloodRequested.status})` : 'No Active Request'}
            </div>
          </div>
        </div>

        {/* Inventory Matrix */}
        <div className="space-y-2 mt-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Simulated Available PRBC Units</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(currentDepot.inventory).map(([group, count]) => (
              <div key={group} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-xs font-mono font-bold text-slate-300">{group}</div>
                <div className={`text-xl font-black mt-1 font-mono ${count <= 2 ? 'text-red-400' : 'text-teal-300'}`}>
                  {count} <span className="text-[10px] text-slate-500 font-normal">units</span>
                </div>
                <button
                  onClick={() => handleReserveUnits(group)}
                  disabled={count <= 0}
                  className="mt-2 w-full py-1 text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 disabled:opacity-40"
                >
                  Reserve 2 Units
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}