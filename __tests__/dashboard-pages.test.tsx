import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AccessibilityPage from "../app/(dashboard)/accessibility/page";
import OperationsPage from "../app/(dashboard)/operations/page";
import SustainabilityPage from "../app/(dashboard)/sustainability/page";
import TransportationPage from "../app/(dashboard)/transit/page";

// Mock useStadiaStore state
vi.mock("../store/useStadiaStore", () => ({
  useStadiaStore: () => ({
    parkingAvailability: 45,
    simulationMode: "Normal",
    incidents: []
  }),
}));

describe("Dashboard Module Pages", () => {
  it("renders Accessibility module page components", () => {
    render(<AccessibilityPage />);
    expect(screen.getByText("ACCESSIBILITY SERVICE CENTER")).toBeInTheDocument();
    expect(screen.getByText("Lift & Ramp Status")).toBeInTheDocument();
  });

  it("renders Operations center page tasks grid", () => {
    render(<OperationsPage />);
    expect(screen.getByText("EXECUTIVE OPERATIONS COMMAND")).toBeInTheDocument();
    expect(screen.getByText("Facility Operations Checklist")).toBeInTheDocument();
  });

  it("renders Sustainability telemetry stats", () => {
    render(<SustainabilityPage />);
    expect(screen.getByText("SUSTAINABILITY CONTROL ROOM")).toBeInTheDocument();
    expect(screen.getByText("Solar Battery Offset")).toBeInTheDocument();
  });

  it("renders Transportation AI routes and forecasts", () => {
    render(<TransportationPage />);
    expect(screen.getByText("TRANSPORTATION INTELLIGENCE")).toBeInTheDocument();
    expect(screen.getByText("Metro East Hub")).toBeInTheDocument();
  });
});
