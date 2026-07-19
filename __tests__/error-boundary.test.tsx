import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import ErrorBoundary from "../components/error-boundary";

// Exploding Component for testing ErrorBoundary catch behavior
const ExplodingComponent = () => {
  throw new Error("Triggered rendering collision");
};

describe("ErrorBoundary Component", () => {
  let originalError: typeof console.error;

  beforeAll(() => {
    // Suppress React error logs in console during explosion testing
    originalError = console.error;
    console.error = vi.fn();
  });

  afterAll(() => {
    // Restore original console error function
    console.error = originalError;
  });

  it("renders children normally when no error is present", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-element">Nominal System</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child-element")).toHaveTextContent("Nominal System");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders fallback UI when a child component throws an error", () => {
    render(
      <ErrorBoundary>
        <ExplodingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("System Anomaly Detected")).toBeInTheDocument();
    expect(screen.getByText("Triggered rendering collision")).toBeInTheDocument();
  });

  it("resets state and attempts to render children again when Reinitialize is clicked", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ExplodingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Rerender with a safe component
    rerender(
      <ErrorBoundary>
        <div>Recovered System</div>
      </ErrorBoundary>
    );

    const button = screen.getByRole("button", { name: "Reload the application" });
    fireEvent.click(button);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Recovered System")).toBeInTheDocument();
  });
});
