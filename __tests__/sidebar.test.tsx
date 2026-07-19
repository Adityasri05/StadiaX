import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "../components/sidebar";

// Mock usePathname from next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock useStadiaStore state
vi.mock("../store/useStadiaStore", () => ({
  useStadiaStore: (selector: any) => {
    // Provide a mocked list of active incidents with unique counts per category
    const incidents = [
      { id: "1", title: "Crowd congestion", status: "Active", category: "Crowd" },
      
      { id: "2", title: "Security lockdown A", status: "Active", category: "Security" },
      { id: "3", title: "Security lockdown B", status: "Active", category: "Security" },
      { id: "4", title: "Security lockdown C", status: "Active", category: "Security" },

      { id: "5", title: "Resolved ticket", status: "Resolved", category: "Transit" },
    ];
    return selector({ incidents });
  },
}));

describe("Sidebar Component", () => {
  it("renders all 16 navigation options", () => {
    render(<Sidebar />);
    
    const items = [
      "Dashboard",
      "Mission Control",
      "AI Fan Concierge",
      "Live Stadium Map",
      "Digital Twin",
      "Crowd Intelligence",
      "Transportation AI",
      "Security Command",
      "Volunteer Hub",
      "Operations Center",
      "Vendor Intelligence",
      "Accessibility AI",
      "Sustainability",
      "Analytics",
      "Reports",
      "Settings",
    ];

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders unique notification badge counts for categories with active incidents", () => {
    render(<Sidebar />);
    
    // There is 1 active incident for Crowd (so badge count should be 1)
    const crowdBadge = screen.getByText("1");
    expect(crowdBadge).toBeInTheDocument();

    // There are 3 active incidents for Security (so badge count should be 3)
    const securityBadge = screen.getByText("3");
    expect(securityBadge).toBeInTheDocument();
  });
});
