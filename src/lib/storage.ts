const STORAGE_KEY = "piqd_agent_data";

export interface Override {
  timestamp: number;
  photoTraits: string[];
  roomType: string;
  action: "kept_rejected" | "removed_selected";
}

export interface Listing {
  timestamp: number;
  photoCount: number;
  avgScore: number;
  description: string;
}

export interface AgentData {
  overrides: Override[];
  listings: Listing[];
}

function load(): AgentData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AgentData) : { overrides: [], listings: [] };
  } catch {
    return { overrides: [], listings: [] };
  }
}

function save(data: AgentData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.error("Failed to save to storage");
  }
}

export function saveOverride(
  photoTraits: string[],
  roomType: string,
  action: Override["action"]
): void {
  const data = load();
  data.overrides.push({ timestamp: Date.now(), photoTraits, roomType, action });
  save(data);
}

export function saveListing(
  photoCount: number,
  scores: { score: number }[],
  description: string
): void {
  const data = load();
  data.listings.push({
    timestamp: Date.now(),
    photoCount,
    avgScore: scores.reduce((a, b) => a + b.score, 0) / scores.length,
    description,
  });
  save(data);
}

export function getOverrides(): Override[] {
  return load().overrides;
}

export function getListings(): Listing[] {
  return load().listings;
}

export function clearAll(): void {
  localStorage.removeItem(STORAGE_KEY);
}
