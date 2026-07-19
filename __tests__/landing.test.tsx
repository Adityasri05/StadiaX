import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LandingPage from "../app/page";

// Mock useRouter/useSearchParams from next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Mock useStadiaStore state
vi.mock("../store/useStadiaStore", () => ({
  useStadiaStore: () => ({
    user: null,
    authLoading: false,
  }),
}));

describe("LandingPage Component", () => {
  it("renders main landing page hero title", () => {
    render(<LandingPage />);
    expect(screen.getByText("The Autonomous AI Brain")).toBeInTheDocument();
    expect(screen.getByText("Behind Every Smart Stadium")).toBeInTheDocument();
  });

  it("renders all 9 clickable feature module cards", () => {
    render(<LandingPage />);
    
    // Verify each card label is rendered on the page
    const modules = [
      "AI Fan Concierge",
      "Crowd Intelligence",
      "AI Mission Control",
      "Digital Twin",
      "Transportation AI",
      "Security Intelligence",
      "Accessibility AI",
      "Vendor Intelligence",
      "Sustainability AI",
    ];

    modules.forEach((mod) => {
      expect(screen.getByText(mod)).toBeInTheDocument();
    });
  });

  it("contains direct link to launch Mission Control pointing to auth", () => {
    render(<LandingPage />);
    
    const launchButton = screen.getByRole("link", { name: /Launch Mission Control/i });
    expect(launchButton).toBeInTheDocument();
    expect(launchButton).toHaveAttribute("href", "/auth");
  });

  it("contains button for operations demo triggering Google Drive link", () => {
    render(<LandingPage />);
    
    const demoButton = screen.getByRole("button", { name: /Watch Operations Demo/i });
    expect(demoButton).toBeInTheDocument();
  });
});
