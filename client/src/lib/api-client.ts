/**
 * API Client for Universe Empire Dominion
 * Centralized API communication layer with type safety and error handling
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  timestamp?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP Client
class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Request failed',
          data.code,
          response.status,
          data.errors
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR'
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create HTTP client instance
const httpClient = new HttpClient(API_BASE_URL);

// ============================================================================
// API SERVICES
// ============================================================================

// Authentication API
export const authApi = {
  register: (username: string, password: string, email?: string) =>
    httpClient.post('/auth/register', { username, password, email }),

  login: (username: string, password: string) =>
    httpClient.post('/auth/login', { username, password }),

  logout: () =>
    httpClient.post('/auth/logout'),

  getSession: () =>
    httpClient.get('/auth/session'),
};

// User API
export const userApi = {
  getMe: () =>
    httpClient.get('/user/me'),

  updateProfile: (data: any) =>
    httpClient.patch('/user/profile', data),
};

// Player State API
export const playerApi = {
  getState: () =>
    httpClient.get('/player/state'),

  updateState: (updates: any) =>
    httpClient.patch('/game/state', updates),

  setup: (setupData: any) =>
    httpClient.post('/player/setup', setupData),
};

// Resources API
export const resourcesApi = {
  get: () =>
    httpClient.get('/resources'),

  update: (resources: Record<string, number>) =>
    httpClient.patch('/resources', resources),

  collect: () =>
    httpClient.post('/resources/collect'),
};

// Buildings API
export const buildingsApi = {
  getAll: () =>
    httpClient.get('/buildings'),

  build: (buildingId: string, level?: number) =>
    httpClient.post('/buildings/build', { buildingId, level }),

  upgrade: (buildingId: string) =>
    httpClient.post(`/buildings/${buildingId}/upgrade`),

  cancel: (buildingId: string) =>
    httpClient.post(`/buildings/${buildingId}/cancel`),

  getQueue: () =>
    httpClient.get('/buildings/queue'),
};

// Research API
export const researchApi = {
  getTree: () =>
    httpClient.get('/research/tree'),

  getProgress: () =>
    httpClient.get('/research/progress'),

  start: (techId: string, priority?: string) =>
    httpClient.post('/research/start', { techId, priority }),

  cancel: (techId: string) =>
    httpClient.post(`/research/${techId}/cancel`),

  getQueue: () =>
    httpClient.get('/research/queue'),

  getHistory: () =>
    httpClient.get('/research/history'),
};

// Fleet API
export const fleetApi = {
  getAll: () =>
    httpClient.get('/fleet'),

  create: (name: string, ships: Record<string, number>) =>
    httpClient.post('/fleet', { name, ships }),

  update: (fleetId: string, updates: any) =>
    httpClient.patch(`/fleet/${fleetId}`, updates),

  delete: (fleetId: string) =>
    httpClient.delete(`/fleet/${fleetId}`),

  send: (fleetId: string, destination: string, mission: string) =>
    httpClient.post(`/fleet/${fleetId}/send`, { destination, mission }),
};

// Missions API
export const missionsApi = {
  getAll: () =>
    httpClient.get('/missions'),

  create: (missionData: any) =>
    httpClient.post('/missions', missionData),

  get: (missionId: string) =>
    httpClient.get(`/missions/${missionId}`),

  cancel: (missionId: string) =>
    httpClient.post(`/missions/${missionId}/cancel`),

  complete: (missionId: string) =>
    httpClient.post(`/missions/${missionId}/complete`),
};

// Combat API
export const combatApi = {
  getFormations: () =>
    httpClient.get('/combat/formations'),

  simulate: (attackerData: any, defenderData: any) =>
    httpClient.post('/combat/simulate', { attacker: attackerData, defender: defenderData }),

  getBattleHistory: () =>
    httpClient.get('/combat/history'),

  getBattle: (battleId: string) =>
    httpClient.get(`/combat/battles/${battleId}`),
};

// Alliance API
export const allianceApi = {
  getAll: () =>
    httpClient.get('/alliances'),

  create: (name: string, description?: string) =>
    httpClient.post('/alliances/create', { name, description }),

  join: (allianceId: string) =>
    httpClient.post(`/alliances/${allianceId}/join`),

  leave: () =>
    httpClient.post('/alliances/leave'),

  getMy: () =>
    httpClient.get('/alliances/my'),

  getMembers: (allianceId: string) =>
    httpClient.get(`/alliances/${allianceId}/members`),
};

// Market API
export const marketApi = {
  getOrders: (filters?: any) =>
    httpClient.get('/market/orders', filters),

  createOrder: (orderData: any) =>
    httpClient.post('/market/order/create', orderData),

  cancelOrder: (orderId: string) =>
    httpClient.delete(`/market/orders/${orderId}`),

  executeOrder: (orderId: string, quantity: number) =>
    httpClient.post(`/market/orders/${orderId}/execute`, { quantity }),
};

// Currency API
export const currencyApi = {
  getBalance: () =>
    httpClient.get('/currency/balance'),

  add: (silver?: number, gold?: number, platinum?: number, reason?: string) =>
    httpClient.post('/currency/add', { silver, gold, platinum, reason }),

  getTransactions: () =>
    httpClient.get('/currency/transactions'),
};

// Bank API
export const bankApi = {
  getAccount: () =>
    httpClient.get('/bank/account'),

  deposit: (amount: number) =>
    httpClient.post('/bank/deposit', { amount }),

  withdraw: (amount: number) =>
    httpClient.post('/bank/withdraw', { amount }),

  getTransactions: () =>
    httpClient.get('/bank/transactions'),
};

// Empire API
export const empireApi = {
  getValue: () =>
    httpClient.get('/empire/value'),

  getRankings: () =>
    httpClient.get('/empire/rankings'),
};

// Progression API
export const progressionApi = {
  getTier: () =>
    httpClient.get('/progression/tier'),

  addTierXP: (amount: number) =>
    httpClient.post('/progression/tier/add-xp', { amount }),

  getEmpire: () =>
    httpClient.get('/progression/empire'),

  addEmpireXP: (amount: number) =>
    httpClient.post('/progression/empire/add-xp', { amount }),
};

// Expeditions API
export const expeditionsApi = {
  getAll: () =>
    httpClient.get('/expeditions'),

  create: (expeditionData: any) =>
    httpClient.post('/expeditions', expeditionData),

  get: (expeditionId: string) =>
    httpClient.get(`/expeditions/${expeditionId}`),

  addTeamMember: (expeditionId: string, memberData: any) =>
    httpClient.post(`/expeditions/${expeditionId}/team`, memberData),

  launch: (expeditionId: string) =>
    httpClient.post(`/expeditions/${expeditionId}/launch`),
};

// Galaxy API
export const galaxyApi = {
  getSystems: (galaxyId?: string) =>
    httpClient.get('/galaxy/systems', galaxyId ? { galaxyId } : undefined),

  getSystem: (systemId: string) =>
    httpClient.get(`/galaxy/systems/${systemId}`),

  scan: (coordinates: string) =>
    httpClient.post('/galaxy/scan', { coordinates }),
};

// Inventory API
export const inventoryApi = {
  getAll: () =>
    httpClient.get('/inventory'),

  use: (itemId: string, quantity?: number) =>
    httpClient.post(`/inventory/${itemId}/use`, { quantity }),

  transfer: (itemId: string, targetUserId: string, quantity: number) =>
    httpClient.post(`/inventory/${itemId}/transfer`, { targetUserId, quantity }),
};

// Auction API
export const auctionApi = {
  getListings: (filters?: any) =>
    httpClient.get('/auctions', filters),

  create: (auctionData: any) =>
    httpClient.post('/auctions', auctionData),

  bid: (auctionId: string, bidAmount: number) =>
    httpClient.post(`/auctions/${auctionId}/bid`, { bidAmount }),

  buyout: (auctionId: string) =>
    httpClient.post(`/auctions/${auctionId}/buyout`),

  getMyListings: () =>
    httpClient.get('/auctions/user/listings'),

  getMyBids: () =>
    httpClient.get('/auctions/user/bids'),
};

// Status API
export const statusApi = {
  getHealth: () =>
    httpClient.get('/health'),

  getVersion: () =>
    httpClient.get('/version'),

  getMetrics: () =>
    httpClient.get('/status/metrics'),
};

// Export all APIs as a single object
export const api = {
  auth: authApi,
  user: userApi,
  player: playerApi,
  resources: resourcesApi,
  buildings: buildingsApi,
  research: researchApi,
  fleet: fleetApi,
  missions: missionsApi,
  combat: combatApi,
  alliance: allianceApi,
  market: marketApi,
  currency: currencyApi,
  bank: bankApi,
  empire: empireApi,
  progression: progressionApi,
  expeditions: expeditionsApi,
  galaxy: galaxyApi,
  inventory: inventoryApi,
  auction: auctionApi,
  status: statusApi,
};

export default api;

// Made with Bob
