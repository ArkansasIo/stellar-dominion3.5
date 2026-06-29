export interface ShipModule {
  id: string;
  name: string;
  description: string;
  category: string;
  class: string;
  subclass: string;
  type: string;
  size: string;
  meta: number;
  tech: number;
  cpu: number;
  powergrid: number;
  calibration?: number;
  capacitor?: number;
  stats: { [key: string]: number | string | boolean };
  requirements?: {
    skills?: { [key: string]: number };
    shipSize?: string[];
  };
  price: {
    isk: number;
    materials?: { [key: string]: number };
  };
}
