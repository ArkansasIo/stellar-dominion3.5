export type AllianceRank = "leader" | "officer" | "member" | "recruit";

export interface AllianceMember {
  id: string;
  name: string;
  rank: AllianceRank;
  points: number;
  status: "online" | "offline" | "vacation";
  lastActive: number;
}

export interface Alliance {
  id: string;
  name: string;
  tag: string;
  description: string;
  announcement: string;
  members: AllianceMember[];
  applications: any[]; // Mock
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

export const MOCK_ALLIANCES: Partial<Alliance>[] = [
  { id: "1", name: "Terran Federation", tag: "TERRA", description: "United for the defense of Earth.", members: [] },
  { id: "2", name: "Red Skull Pirates", tag: "SKULL", description: "We take what we want.", members: [] },
  { id: "3", name: "Trade Coalition", tag: "TRADE", description: "Profit above all.", members: [] },
];
