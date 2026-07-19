import { describe, it, expect, beforeEach } from "vitest";
import { useStadiaStore } from "../store/useStadiaStore";
import { Incident } from "../store/useStadiaStore";

describe("StadiaX Zustand Store", () => {
  beforeEach(() => {
    // Reset Zustand store to a predictable, clean state for each test
    useStadiaStore.setState({
      simulationMode: "Normal",
      matchMinute: 74,
      attendance: 88450,
      activeAlertsCount: 2,
      selectedSector: null,
      selectedGate: null,
      activeRouteType: null,
      incidents: [
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
      }
    });
  });

  it("should initialize with default states", () => {
    const state = useStadiaStore.getState();
    expect(state.matchMinute).toBe(74);
    expect(state.attendance).toBe(88450);
    expect(state.simulationMode).toBe("Normal");
  });

  it("should handle setSimulationMode action", () => {
    const { setSimulationMode } = useStadiaStore.getState();
    setSimulationMode("Evacuation");
    
    const state = useStadiaStore.getState();
    expect(state.simulationMode).toBe("Evacuation");
    expect(state.incidents[0].title).toContain("EVACUATION");
  });

  it("should handle toggleMapLayer action", () => {
    const { toggleMapLayer } = useStadiaStore.getState();
    
    toggleMapLayer("seats");
    let state = useStadiaStore.getState();
    expect(state.mapLayers.seats).toBe(false);

    toggleMapLayer("seats");
    state = useStadiaStore.getState();
    expect(state.mapLayers.seats).toBe(true);
  });

  it("should increment match minute and fluctuate attendance on tickMatchTime", () => {
    const { tickMatchTime } = useStadiaStore.getState();
    
    tickMatchTime();
    
    const state = useStadiaStore.getState();
    expect(state.matchMinute).toBe(75);
    expect(state.attendance).toBeGreaterThanOrEqual(88400);
    expect(state.attendance).toBeLessThanOrEqual(88500);
  });

  it("should wrap match minute back to 1 at minute 90", () => {
    useStadiaStore.setState({ matchMinute: 90 });
    const { tickMatchTime } = useStadiaStore.getState();
    
    tickMatchTime();
    
    const state = useStadiaStore.getState();
    expect(state.matchMinute).toBe(1);
  });

  it("should resolve an incident correctly and decrement active alerts count", () => {
    const stateBefore = useStadiaStore.getState();
    const incidentToResolve = stateBefore.incidents[0];
    const initialActiveCount = stateBefore.activeAlertsCount;

    expect(initialActiveCount).toBe(2);

    const { resolveIncident } = useStadiaStore.getState();
    resolveIncident(incidentToResolve.id);

    const stateAfter = useStadiaStore.getState();
    const resolvedIncident = stateAfter.incidents.find(i => i.id === incidentToResolve.id);
    
    expect(resolvedIncident?.status).toBe("Resolved");
    expect(stateAfter.activeAlertsCount).toBe(1);
    expect(stateAfter.activeAlertsCount).toBeLessThan(initialActiveCount);
  });

  it("should successfully add a new incident via addIncident action", () => {
    const newInc: Incident = {
      id: "inc-3",
      title: "Broken seating row 12",
      priority: "low",
      location: "Sector 102",
      time: "14:50",
      status: "Active",
      category: "Operations",
      actionRecommended: "Inform cleaning & repair team."
    };

    const { addIncident } = useStadiaStore.getState();
    addIncident(newInc);

    const state = useStadiaStore.getState();
    expect(state.incidents.length).toBe(3);
    expect(state.activeAlertsCount).toBe(3);
  });

  it("should successfully dismiss/delete an incident via dismissIncident", () => {
    const { dismissIncident } = useStadiaStore.getState();
    dismissIncident("inc-1");

    const state = useStadiaStore.getState();
    expect(state.incidents.length).toBe(1);
    expect(state.activeAlertsCount).toBe(1);
  });

  it("should select map elements and active routing paths", () => {
    const { setSelectedSector, setSelectedGate, setMapActiveRoute } = useStadiaStore.getState();

    setSelectedSector("Sector 104");
    setSelectedGate("Gate 2");
    setMapActiveRoute("fastest");

    const state = useStadiaStore.getState();
    expect(state.selectedSector).toBe("Sector 104");
    expect(state.selectedGate).toBe("Gate 2");
    expect(state.activeRouteType).toBe("fastest");
  });
});
