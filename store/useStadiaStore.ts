import { create } from "zustand";
import {
  SimulationMode,
  RouteType,
  IncidentPriority,
  IncidentStatus,
  IncidentCategory,
  AgentStatus,
  AgentPriority,
  TransitStatus,
  MessageSender
} from "@/types";

/** Represents an active or resolved security/operational incident in the stadium. */
export interface Incident {
  /** Unique incident identifier */
  id: string;
  /** Summary of the incident */
  title: string;
  /** Urgency level for operational resolution */
  priority: IncidentPriority;
  /** Specific sector, gate, or concourse */
  location: string;
  /** Time of trigger in HH:MM format */
  time: string;
  /** Current state of operational response */
  status: IncidentStatus;
  /** Category of the alert for routing to correct sub-teams */
  category: IncidentCategory;
  /** Recommended procedure to mitigate the incident */
  actionRecommended: string;
}

/** Represents one of the 9 specialized StadiaX autonomous AI modules. */
export interface AIAgent {
  /** Unique module identifier */
  id: string;
  /** Code name of the AI agent */
  name: string;
  /** Human-readable module title */
  title: string;
  /** Active status of the agent's processes */
  status: AgentStatus;
  /** Live reasoning telemetry displayed in the cockpit */
  currentReasoning: string;
  /** Model confidence score in decimals/percentage */
  confidenceScore: number;
  /** Agent alert priority */
  priority: AgentPriority;
  /** Action recommended or executed by the agent */
  action: string;
  /** Project metric improvement */
  estimatedImpact: string;
}

/** Represents a single message in the Fan Concierge conversation. */
export interface ChatMessage {
  /** Unique message identifier */
  id: string;
  /** Message sender */
  sender: MessageSender;
  /** Text content of the message */
  text: string;
  /** Timestamp in HH:MM format */
  timestamp: string;
  /** Optional routing overlay telemetry metadata */
  routeData?: {
    estimatedTime: string;
    accessibilityInfo: string;
    routeType: string;
    hasEmergencyShortcut: boolean;
  };
}

/** Holds the visibility toggles for the 3D map canvas. */
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

/** Central state structure for the StadiaX operations grid. */
interface StadiaState {
  // Live Telemetry
  /** Current minute of the active FIFA match */
  matchMinute: number;
  /** Real-time scoreboard score */
  matchScore: string;
  /** Live attendance inside the stadium gates */
  attendance: number;
  /** Stadium capacity occupancy rate */
  occupancyRate: number;
  /** Count of open perimeter gates */
  openGates: number;
  /** Count of outstanding active incidents */
  activeAlertsCount: number;
  /** Percentage of remaining vacant parking spots */
  parkingAvailability: number;
  /** Local weather temperature */
  weatherTemp: string;
  /** Operational state of local metro/shuttle connections */
  transitStatus: TransitStatus;
  /** Selected simulation profile mode */
  simulationMode: SimulationMode;
  
  // Lists
  /** Active and resolved incidents list */
  incidents: Incident[];
  /** Special AI agent cockpits state */
  agents: AIAgent[];
  /** Conversation history for the Fan Concierge chat */
  chatHistory: ChatMessage[];
  
  // Interactive Map Settings
  /** Visibility map layers map */
  mapLayers: MapLayers;
  /** Selected gate context */
  selectedGate: string | null;
  /** Selected sector context */
  selectedSector: string | null;
  /** Active pathfinding overlays projected on the map */
  activeRouteType: RouteType | null;

  // Actions
  /** Resolve an incident and decrease alerts counter */
  resolveIncident: (id: string) => void;
  /** Dismiss/Delete an incident from the timeline */
  dismissIncident: (id: string) => void;
  /** Trigger or approve an AI-recommended mitigation action */
  triggerAction: (agentId: string) => void;
  /** File a new custom operational incident */
  addIncident: (incident: Incident) => void;
  /** Set the simulation mode and trigger preset events */
  setSimulationMode: (mode: SimulationMode) => void;
  /** Toggle visibility of a specific layer on the 3D map */
  toggleMapLayer: (layer: keyof MapLayers) => void;
  /** Project an active pathfinding path onto the map */
  setMapActiveRoute: (routeType: RouteType | null) => void;
  /** Send message to Gemini Fan Concierge API and handle response */
  sendConciergeMessage: (text: string) => Promise<void>;
  /** Update match clock and fluctuate telemetry realistically */
  tickMatchTime: () => void;

  /** Set currently focused sector */
  setSelectedSector: (sector: string | null) => void;
  /** Set currently focused gate */
  setSelectedGate: (gate: string | null) => void;

  // Authentication State
  /** Current firebase auth user object */
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  /** Flag while firebase verifies credentials */
  authLoading: boolean;
  /** Action to update user credentials context */
  setUser: (user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null) => void;
  /** Action to toggle auth verification loading spinner */
  setAuthLoading: (loading: boolean) => void;
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
  user: null,
  authLoading: true,

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

  sendConciergeMessage: async (text) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text,
      timestamp: timeStr
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, userMsg]
    }));

    const placeholderId = `chat-placeholder-${Date.now()}`;
    const placeholderMsg: ChatMessage = {
      id: placeholderId,
      sender: "ai",
      text: "StadiaX AI is thinking...",
      timestamp: timeStr
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, placeholderMsg]
    }));

    let responseText = "";
    let routeData: ChatMessage["routeData"] = undefined;

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
      }

      const activeIncidents = useStadiaStore.getState().incidents.filter(i => i.status !== "Resolved");
      const simulationMode = useStadiaStore.getState().simulationMode;
      const matchScore = useStadiaStore.getState().matchScore;
      const matchMinute = useStadiaStore.getState().matchMinute;

      const prompt = `
You are the StadiaX AI Fan Concierge, an autonomous stadium assistant for the FIFA World Cup 2026.
Your tone is helpful, professional, and futuristic.

Stadium Context:
- Current Match: Argentina vs France (${matchScore}, ${matchMinute}')
- Operational Mode: ${simulationMode}
- Active Incidents: ${activeIncidents.map(i => `${i.title} at ${i.location}`).join(", ") || "None"}

User Query: "${text}"

Answer the user query. Keep your response relatively concise (2-4 sentences max). If they ask for directions, food recommendations, or assistance, tailor it to their request. If relevant, output a JSON block at the very end of your response with route telemetry in this exact format:
\`\`\`json
{
  "estimatedTime": "X mins walk",
  "accessibilityInfo": "X accessibility status",
  "routeType": "X route type",
  "hasEmergencyShortcut": true/false
}
\`\`\`
Do not include any extra fields in the JSON.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = rawText.match(jsonRegex);
      responseText = rawText.replace(jsonRegex, "").trim();

      if (match && match[1]) {
        try {
          routeData = JSON.parse(match[1].trim());
        } catch (e) {
          console.error("Failed to parse route data JSON", e);
        }
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      responseText = "I'm experiencing connectivity issues with the StadiaX operations grid. Please standby.";
    }

    set((state) => {
      const updatedHistory = state.chatHistory.map((msg) => {
        if (msg.id === placeholderId) {
          const updated: ChatMessage = {
            ...msg,
            text: responseText,
          };
          if (routeData) updated.routeData = routeData;
          return updated;
        }
        return msg;
      });
      return { chatHistory: updatedHistory };
    });
  },

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
  setSelectedGate: (gate) => set({ selectedGate: gate }),
  setUser: (user) => set({ user }),
  setAuthLoading: (authLoading) => set({ authLoading })
}));

