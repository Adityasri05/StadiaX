import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthPage from "../app/auth/page";

// Mock useRouter/useSearchParams from next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue("/dashboard"),
  }),
}));

// Mock useStadiaStore state
vi.mock("../store/useStadiaStore", () => ({
  useStadiaStore: () => ({
    user: null,
    setUser: vi.fn(),
    authLoading: false,
    setAuthLoading: vi.fn(),
  }),
}));

describe("AuthPage Component", () => {
  it("renders email and password form input elements", () => {
    render(<AuthPage />);
    
    expect(screen.getByPlaceholderText("operator@stadiax.io")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("contains form submission submit button", () => {
    render(<AuthPage />);
    
    const submitBtn = screen.getByRole("button", { name: /ACCESS COCKPIT/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it("toggles signup fields when toggle button is clicked", () => {
    render(<AuthPage />);
    
    // Find the SIGN UP tab button
    const signUpTab = screen.getByRole("button", { name: "SIGN UP" });
    expect(signUpTab).toBeInTheDocument();
    
    // Trigger form state shift
    fireEvent.click(signUpTab);
    
    expect(screen.getByPlaceholderText("Operator Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /REGISTER OPERATOR/i })).toBeInTheDocument();
  });
});
