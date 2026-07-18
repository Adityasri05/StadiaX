import { create } from "zustand";

export interface Incident {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  location: string;
  time: string;
  status: "Active" | "Resolving" | "Resolved";
  category: "Crowd" | "Accessibility" | "Security" | "Vendor" | "Transit" | "Medical" | "Sustainability" | "Operations";
  actionRecommended: string;
}

export interface AIAgent {
  id: string;
  name: string;
  title: string;
  status: "Analyzing" | "Resolving" | "Alerting" | "Idle";
  currentReasoning: string;
  confidenceScore: number;
  priority: "High" | "Normal" | "Low";
  action: string;
  estimatedImpact: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  routeData?: {
    estimatedTime: string;
    accessibilityInfo: string;
    routeType: string;
    hasEmergencyShortcut: boolean;
  };
}

export interface MapLayers {
  seats: boolean;
  entrances: boolean;
  exits: boolean;
  food: boolean;
  parking: boolean;
  medical: boolean;
  emergency: boolean;
  transport: boolean;
  security: boolean;
  restrooms: boolean;
  accessibility: boolean;
  crowdHeatmap: boolean;
}

interface StadiaState {
  // Live Telemetry
  matchMinute: number;
  matchScore: string;
  attendance: number;
  occupancyRate: number;
  openGates: number;
  activeAlertsCount: number;
  parkingAvailability: number; // percentage
  weatherTemp: string;
  transitStatus: "Normal" | "Delayed" | "Critical";
  simulationMode: "Normal" | "Prediction" | "Emergency" | "Evacuation" | "Traffic" | "Energy";
  
  // Lists
  incidents: Incident[];
  agents: AIAgent[];
  chatHistory: ChatMessage[];
  
  // Interactive Map Settings
  mapLayers: MapLayers;
  selectedGate: string | null;
  selectedSector: string | null;
  activeRouteType: "shortest" | "fastest" | "safest" | "wheelchair" | "family" | "least_crowded" | null;

  // Actions
  resolveIncident: (id: string) => void;
  dismissIncident: (id: string) => void;
  triggerAction: (agentId: string) => void;
  addIncident: (incident: Incident) => void;
  setSimulationMode: (mode: "Normal" | "Prediction" | "Emergency" | "Evacuation" | "Traffic" | "Energy") => void;
  toggleMapLayer: (layer: keyof MapLayers) => void;
  setMapActiveRoute: (routeType: "shortest" | "fastest" | "safest" | "wheelchair" | "family" | "least_crowded" | null) => void;
  sendConciergeMessage: (text: string) => void;
  tickMatchTime: () => void;
  setSelectedSector: (sector: string | null) => void;
  setSelectedGate: (gate: string | null) => void;
}

const initialIncidents: Incident[] = [
  {
    id: "inc-1",
    title: "Gate 4 congestion predicted within 11 minutes",
    priority: "high",
    location: "Gate 4 Entrance",
    time: "14:40",
    status: "Active",
    category: "Crowd",
    actionRecommended: "Redirect incoming fans to Gate 6, re-assign Volunteer Team C."
  },
  {
    id: "inc-2",
    title: "Elevator B-3 blockage report (Main Stand)",
    priority: "medium",
    location: "Sector 204 Lift Corridor",
    time: "14:42",
    status: "Active",
    category: "Accessibility",
    actionRecommended: "Dispatch technician and redirect wheelchair fans to Elevator B-4."
  },
  {
    id: "inc-3",
    title: "Unattended bag near Gate 8 Security checkpoint",
    priority: "high",
    location: "Gate 8",
    time: "14:38",
    status: "Active",
    category: "Security",
    actionRecommended: "Deploy K9 Unit S-2, pause lane 3 screening, activate local PA alert."
  },
  {
    id: "inc-4",
    title: "Food Court C inventory deficit: Halal Hotdogs",
    priority: "low",
    location: "Concourse 3 North",
    time: "14:41",
    status: "Active",
    category: "Vendor",
    actionRecommended: "Dispatch restock cart from central supply bay D."
  },
  {
    id: "inc-5",
    title: "Metro Station East entrance congestion spike",
    priority: "high",
    location: "Metro East Hub",
    time: "14:43",
    status: "Active",
    category: "Transit",
    actionRecommended: "Activate crowd release gates, suggest Shuttle Bus Route 12."
  },
  {
    id: "inc-6",
    title: "Heat exhaustion report - Sector 112, Row F",
    priority: "medium",
    location: "Sector 112",
    time: "14:44",
    status: "Active",
    category: "Medical",
    actionRecommended: "Dispatch Medical Responder M-4 with cooling hydration pack."
  }
];

const initialAgents: AIAgent[] = [
  {
    id: "x-fan",
    name: "X-Fan",
    title: "Fan Concierge",
    status: "Analyzing",
    currentReasoning: "Processing 120 live queries. Generating optimal accessible routes around Elevator B-3 blockage.",
    confidenceScore: 98,
    priority: "Normal",
    action: "Dispatched accessible reroute to 43 impacted app users.",
    estimatedImpact: "0 accessible navigation complaints"
  },
  {
    id: "x-crowd",
    name: "X-Crowd",
    title: "Crowd Intelligence",
    status: "Resolving",
    currentReasoning: "Gate 4 bottleneck detected. Analyzing buffer queue densities at security points.",
    confidenceScore: 95,
    priority: "High",
    action: "Proposing Gate 6 redirection pathway on main concourse signage.",
    estimatedImpact: "Reduce Gate 4 wait times by 9 minutes"
  },
  {
    id: "x-secure",
    name: "X-Secure",
    title: "Security Intelligence",
    status: "Alerting",
    currentReasoning: "Analyzing unattended bag CCTV feed. AI object history tracker confirms owner walked away 12m ago.",
    confidenceScore: 99,
    priority: "High",
    action: "Coordinate K9 unit dispatch and isolate 15-meter radius.",
    estimatedImpact: "Contain potential threat area in <3 minutes"
  },
  {
    id: "x-transit",
    name: "X-Transit",
    title: "Transportation AI",
    status: "Analyzing",
    currentReasoning: "Metro East transit flow at 94% capacity. Evaluating shuttle bus redeployment loops.",
    confidenceScore: 92,
    priority: "High",
    action: "Recommend dispatching 4 standby shuttle buses to parking lot B.",
    estimatedImpact: "Prevent station overflow delay of 18 minutes"
  },
  {
    id: "x-volunteer",
    name: "X-Volunteer",
    title: "Volunteer Intelligence",
    status: "Idle",
    currentReasoning: "All volunteer teams positioned. Standby teams mapped for high-risk zones.",
    confidenceScore: 89,
    priority: "Normal",
    action: "Standby team D flagged to relocate to Sector 112.",
    estimatedImpact: "100% volunteer deployment efficiency"
  },
  {
    id: "x-assist",
    name: "X-Assist",
    title: "Accessibility AI",
    status: "Resolving",
    currentReasoning: "Correlating Elevator B-3 error status with active wheelchair itineraries.",
    confidenceScore: 97,
    priority: "High",
    action: "Directing wheelchair routing via south ramps and Elevator B-4.",
    estimatedImpact: "0 missed accessibility transfers"
  },
  {
    id: "x-ops",
    name: "X-Ops",
    title: "Operations AI",
    status: "Analyzing",
    currentReasoning: "Monitoring smart cooling nodes. Sector 108 air flow is currently 2% below nominal range.",
    confidenceScore: 94,
    priority: "Normal",
    action: "Increasing fan speed in Sector 108 cooling grid.",
    estimatedImpact: "Restore thermal comfort in 4 minutes"
  },
  {
    id: "x-vendor",
    name: "X-Vendor",
    title: "Vendor Intelligence",
    status: "Analyzing",
    currentReasoning: "Predicting demand surge in Concourse 3 North. Next-half supply runs mapped.",
    confidenceScore: 91,
    priority: "Low",
    action: "Queue supply run alert sent to vendor operations hub.",
    estimatedImpact: "Prevent concession outage during half-time"
  },
  {
    id: "x-green",
    name: "X-Green",
    title: "Sustainability AI",
    status: "Idle",
    currentReasoning: "Optimizing solar grid feed-in. Current waste sorting efficiency is 82.5% vs goal of 85%.",
    confidenceScore: 96,
    priority: "Normal",
    action: "Recycle routing reminders pushed to digital screen overlays.",
    estimatedImpact: "Increase recycling separation by 3.2%"
  }
];

export const useStadiaStore = create<StadiaState>((set) => ({
  // Initial states
  matchMinute: 74,
  matchScore: "2 - 1",
  attendance: 88450,
  occupancyRate: 98.2,
  openGates: 24,
  activeAlertsCount: 6,
  parkingAvailability: 28,
  weatherTemp: "22°C",
  transitStatus: "Normal",
  simulationMode: "Normal",
  incidents: initialIncidents,
  agents: initialAgents,
  chatHistory: [
    {
      id: "init-chat",
      sender: "ai",
      text: "StadiaX AI Fan Concierge online. State your seat or ticket number, or ask for maps, accessibility routing, catering, or emergency assistance.",
      timestamp: "14:44"
    }
  ],
  mapLayers: {
    seats: true,
    entrances: true,
    exits: true,
    food: true,
    parking: true,
    medical: true,
    emergency: true,
    transport: true,
    security: true,
    restrooms: true,
    accessibility: true,
    crowdHeatmap: true
  },
  selectedGate: null,
  selectedSector: null,
  activeRouteType: null,

  // Actions
  resolveIncident: (id) => set((state) => {
    const updated = state.incidents.map((inc) => 
      inc.id === id ? { ...inc, status: "Resolved" as const } : inc
    );
    const activeCount = updated.filter(i => i.status !== "Resolved").length;
    return { incidents: updated, activeAlertsCount: activeCount };
  }),

  dismissIncident: (id) => set((state) => {
    const updated = state.incidents.filter((inc) => inc.id !== id);
    const activeCount = updated.filter(i => i.status !== "Resolved").length;
    return { incidents: updated, activeAlertsCount: activeCount };
  }),

  triggerAction: (agentId) => set((state) => {
    const updated = state.agents.map((ag) => 
      ag.id === agentId ? { ...ag, status: "Resolving" as const, currentReasoning: "Executing approved operational protocol. Tracking telemetry..." } : ag
    );
    return { agents: updated };
  }),

  addIncident: (incident) => set((state) => {
    const updated = [incident, ...state.incidents];
    const activeCount = updated.filter(i => i.status !== "Resolved").length;
    return { incidents: updated, activeAlertsCount: activeCount };
  }),

  setSimulationMode: (mode) => set((state) => {
    // If Evacuation mode, trigger serious state edits
    if (mode === "Evacuation") {
      const evacuationIncidents = [
        {
          id: "evac-alert",
          title: "FULL STADIUM EVACUATION SIMULATION MODE",
          priority: "high" as const,
          location: "All Sectors",
          time: "14:45",
          status: "Active" as const,
          category: "Security" as const,
          actionRecommended: "Opening all 24 gates, enabling emergency strobe routes, broadcasting alarm feeds."
        },
        ...state.incidents
      ];
      
      const evacAgents = state.agents.map(ag => ({
        ...ag,
        status: "Alerting" as const,
        currentReasoning: `[EVACUATION PROTOCOL ACTIVE] Directing all computational power to exit strategies. Routing target: 88,450 people.`,
        confidenceScore: 99,
        priority: "High" as const,
        action: `Executing system-wide egress routing. Signage overrides pushed.`,
        estimatedImpact: `Clear stadium under 8.5 minutes`
      }));

      return {
        simulationMode: mode,
        openGates: 24,
        transitStatus: "Critical",
        incidents: evacuationIncidents,
        agents: evacAgents,
        activeAlertsCount: evacuationIncidents.filter(i => i.status !== "Resolved").length
      };
    }

    return { simulationMode: mode };
  }),

  toggleMapLayer: (layer) => set((state) => ({
    mapLayers: {
      ...state.mapLayers,
      [layer]: !state.mapLayers[layer]
    }
  })),

  setMapActiveRoute: (routeType) => set({ activeRouteType: routeType }),

  sendConciergeMessage: (text) => set((state) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text,
      timestamp: timeStr
    };

    // AI logic simulation based on keyword
    let responseText = "Analyzing query in command center...";
    let routeData;

    const lower = text.toLowerCase();
    if (lower.includes("seat") || lower.includes("guide")) {
      responseText = "Your ticket is for Sector 108, Row H, Seat 14. Gate 4 entrance is the closest standard gate, but due to current queue times, I recommend entering through Gate 6 and walking along the lower concourse corridor.";
      routeData = {
        estimatedTime: "6 mins walk",
        accessibilityInfo: "Step-free routing available. Direct escalator nearby is operating.",
        routeType: "Fastest Path (Recommended)",
        hasEmergencyShortcut: false
      };
    } else if (lower.includes("halal") || lower.includes("food") || lower.includes("vegetarian")) {
      responseText = "Found: 'Medina Grill' (Halal Mediterranean, Concourse 1 East, 3 min walk) and 'Green Field Concessions' (Vegetarian & Vegan wraps, Concourse 2 North, 5 min walk). The queue at Medina Grill is currently under 4 minutes.";
      routeData = {
        estimatedTime: "3 mins walk",
        accessibilityInfo: "Fully accessible elevator access through elevator E-1.",
        routeType: "Least Crowded Route",
        hasEmergencyShortcut: false
      };
    } else if (lower.includes("wheelchair") || lower.includes("lift") || lower.includes("elevator")) {
      responseText = "Access Alert: Elevator B-3 is experiencing a temporary blockage. I have generated a custom step-free route using South Ramp 3 to the lower concourse, leading directly to the accessible seating area in Sector 204.";
      routeData = {
        estimatedTime: "8 mins walk",
        accessibilityInfo: "100% ADA compliant route. Ramps do not exceed 1:12 slope ratio.",
        routeType: "Wheelchair Friendly Path",
        hasEmergencyShortcut: false
      };
    } else if (lower.includes("restroom") || lower.includes("toilet") || lower.includes("washroom")) {
      responseText = "Restroom status updated: The nearest restrooms in Sector 109 are currently at 85% occupancy. I recommend restrooms in Sector 107 (40m west), which are currently at 15% occupancy (0 wait time).";
      routeData = {
        estimatedTime: "1.5 mins walk",
        accessibilityInfo: "Companion restrooms and changing tables available.",
        routeType: "Least Crowded Route",
        hasEmergencyShortcut: false
      };
    } else if (lower.includes("child") || lower.includes("missing") || lower.includes("lost")) {
      responseText = "[EMERGENCY ADVISE] A child missing report has been flagged to Security Command. Please stand by your current location near Sector 108. A designated volunteer is heading to your exact seat coordinates. Broadcast is active.";
      routeData = {
        estimatedTime: "1 min response",
        accessibilityInfo: "Security personnel dispatched.",
        routeType: "Emergency Direct Connect",
        hasEmergencyShortcut: true
      };
    } else if (lower.includes("exit") || lower.includes("leave")) {
      responseText = "Personalized Exit Recommendation: Due to congestion at Metro Station East, the safest and fastest exit strategy is through the West Gates towards Car Park B or Shuttle Bus Terminal 1.";
      routeData = {
        estimatedTime: "9 mins walk",
        accessibilityInfo: "Emergency pathway lighting activated on west ramp.",
        routeType: "Safest Exit Path",
        hasEmergencyShortcut: true
      };
    } else if (lower.includes("medical") || lower.includes("doctor") || lower.includes("hurt")) {
      responseText = "Emergency Route: Medical Station North is located in the Main Concourse behind Sector 112. First aid staff M-4 has also been alerted and can navigate to you.";
      routeData = {
        estimatedTime: "2 mins walk",
        accessibilityInfo: "Defibrillator (AED) and emergency kit stationed at Sector 112 column.",
        routeType: "Safest Route",
        hasEmergencyShortcut: true
      };
    } else {
      responseText = "StadiaX AI has logged your request. Checking live stadium metrics. Sector 108 is operating normally, all facilities nearby are open. You can ask for directions, food suggestions, accessibility routes, or emergency help.";
    }

    const aiMsg: ChatMessage = {
      id: `chat-${Date.now() + 1}`,
      sender: "ai",
      text: responseText,
      timestamp: timeStr,
      routeData
    };

    return {
      chatHistory: [...state.chatHistory, userMsg, aiMsg]
    };
  }),

  tickMatchTime: () => set((state) => {
    const nextMin = state.matchMinute >= 90 ? 1 : state.matchMinute + 1;
    // Simulate minor fluctuations in data to make it look alive!
    const variance = Math.random() > 0.5 ? 1 : -1;
    const nextAttendance = Math.min(88500, Math.max(88400, state.attendance + (Math.random() > 0.7 ? variance * 5 : 0)));
    const nextParking = Math.min(100, Math.max(5, state.parkingAvailability + (Math.random() > 0.9 ? variance : 0)));
    return { 
      matchMinute: nextMin,
      attendance: nextAttendance,
      parkingAvailability: nextParking
    };
  }),

  setSelectedSector: (sector) => set({ selectedSector: sector }),
  setSelectedGate: (gate) => set({ selectedGate: gate })
}));

