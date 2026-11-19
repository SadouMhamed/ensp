// Plain module (no "use client") so both the server page and the client tabs can read it.
export const SETTINGS_TABS = ["name", "password", "sessions"] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];

export function toSettingsTab(value: unknown): SettingsTab {
  return SETTINGS_TABS.find((t) => t === value) ?? "name";
}
