import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Topbar from "../components/topbar";

// Mock useRouter from next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Topbar Component", () => {
  it("renders Logo area correctly with brand name", () => {
    render(<Topbar />);

    const brandName = screen.getByText("STADIA");
    expect(brandName).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Stadium OS")).toBeInTheDocument();
  });

  it("renders live match status with live widget styling", () => {
    render(<Topbar />);
    
    expect(screen.getByText("FIFA WORLD CUP 2026")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("contains emergency trigger button with accessibility label", () => {
    render(<Topbar />);
    
    const emergencyBtn = screen.getByRole("button", { name: "Activate Emergency Simulation Mode" });
    expect(emergencyBtn).toBeInTheDocument();
  });

  it("contains notification bell button with accessibility description", () => {
    render(<Topbar />);
    
    const bellBtn = screen.getByRole("button", { name: /System Notifications/ });
    expect(bellBtn).toBeInTheDocument();
  });
});
