/**
 * Shared type definitions for the StadiaX platform.
 * Centralizes all domain-specific type aliases to prevent
 * inline string-union repetition across the codebase.
 */

/** Available simulation modes for the Digital Twin and Emergency systems */
export type SimulationMode = "Normal" | "Prediction" | "Emergency" | "Evacuation" | "Traffic" | "Energy";

/** Route optimization algorithms available on the interactive map */
export type RouteType = "shortest" | "fastest" | "safest" | "wheelchair" | "family" | "least_crowded";

/** Incident severity tiers used for alert prioritization */
export type IncidentPriority = "high" | "medium" | "low";

/** Incident lifecycle states */
export type IncidentStatus = "Active" | "Resolving" | "Resolved";

/** Operational categories for routing incidents to the correct AI sub-agent */
export type IncidentCategory =
  | "Crowd"
  | "Accessibility"
  | "Security"
  | "Vendor"
  | "Transit"
  | "Medical"
  | "Sustainability"
  | "Operations";

/** AI Agent operational states */
export type AgentStatus = "Analyzing" | "Resolving" | "Alerting" | "Idle";

/** AI Agent priority tiers */
export type AgentPriority = "High" | "Normal" | "Low";

/** Transit network operational states */
export type TransitStatus = "Normal" | "Delayed" | "Critical";

/** Chat message sender identifier */
export type MessageSender = "user" | "ai";
