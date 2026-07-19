import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import DashboardPage from "../app/(dashboard)/dashboard/page";
import AnalyticsPage from "../app/(dashboard)/analytics/page";
import ConciergePage from "../app/(dashboard)/concierge/page";
import ReportsPage from "../app/(dashboard)/reports/page";

// Mock scrollIntoView which is missing in JSDOM
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

// Mock twin-visualizer and map-visualizer to avoid canvas/WebGL JSDOM errors
vi.mock("../components/twin-visualizer", () => ({
  default: () => <div data-testid="twin-visualizer">Twin Visualizer Mock</div>
}));
vi.mock("../components/map-visualizer", () => ({
  default: () => <div data-testid="map-visualizer">Map Visualizer Mock</div>
}));

// Mock state representing Zustand store
const mockState = {
  incidents: [
    { id: "inc-1", title: "Gate 4 Crowd Congestion", category: "Crowd", status: "Active", location: "Gate 4", priority: "High" }
  ],
  agents: [],
  simulationMode: "Normal",
  matchScore: "ARG 2 - 2 FRA",
  matchMinute: 88,
  chatHistory: [],
  resolveIncident: vi.fn(),
  dismissIncident: vi.fn(),
  triggerAction: vi.fn(),
  attendance: 78500,
  occupancyRate: 87.2,
  openGates: 14,
  activeAlertsCount: 1,
  parkingAvailability: 80,
  weatherTemp: "24°C",
  transitStatus: "Nominal"
};

// Mock useStadiaStore hook using selector pattern
vi.mock("../store/useStadiaStore", () => ({
  useStadiaStore: (selector?: (state: Record<string, unknown>) => unknown) => {
    return selector ? selector(mockState) : mockState;
  },

}));

describe("More Dashboard Module Pages", () => {
  it("renders main Dashboard page and its KPI counts", () => {
    render(<DashboardPage />);
    expect(screen.getByText("MISSION CONTROL CENTER")).toBeInTheDocument();
    expect(screen.getByText("FIFA 2026 OPERATIONAL TELEMETRY HUB // INTEGRATION LEVEL 9")).toBeInTheDocument();
  });

  it("renders Analytics dashboard page", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("ENTERPRISE ANALYTICS INDEX")).toBeInTheDocument();
  });

  it("renders Concierge page and helper prompts", () => {
    render(<ConciergePage />);
    expect(screen.getByText("AI FAN CONCIERGE")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ask anything... (e.g. 'Guide me to Sector 108' or 'Find halal food')")).toBeInTheDocument();
  });

  it("renders Reports builder options", () => {
    render(<ReportsPage />);
    expect(screen.getByText("EXECUTIVE REPORT EXPORTER")).toBeInTheDocument();
    expect(screen.getByText("Operational Report")).toBeInTheDocument();
  });
});
