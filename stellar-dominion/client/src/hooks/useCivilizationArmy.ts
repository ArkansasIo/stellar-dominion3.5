/**
 * Custom Hooks for Civilization & Army Systems
 * React Query hooks for data fetching and mutations
 * @tag #react #hooks #custom #tanstack-query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CivilizationSubsystem,
  CivilizationJob,
  WorkforceProjection,
  ArmySubsystem,
  MilitaryForce,
  MilitaryCampaign,
} from '@shared/types/civilization';

// ============================================================================
// CIVILIZATION HOOKS
// ============================================================================

/**
 * Fetch civilization state
 */
export function useCivilizationState() {
  return useQuery({
    queryKey: ['civilization', 'state'],
    queryFn: async () => {
      const res = await fetch('/api/civilization/state');
      if (!res.ok) throw new Error('Failed to fetch civilization state');
      return res.json();
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Fetch all subsystems
 */
export function useSubsystems() {
  return useQuery({
    queryKey: ['civilization', 'subsystems'],
    queryFn: async () => {
      const res = await fetch('/api/civilization/subsystems');
      if (!res.ok) throw new Error('Failed to fetch subsystems');
      const data = await res.json();
      return data.data as CivilizationSubsystem[];
    },
    staleTime: Infinity, // Static data
  });
}

/**
 * Fetch all jobs
 */
export function useCivilizationJobs() {
  return useQuery({
    queryKey: ['civilization', 'jobs'],
    queryFn: async () => {
      const res = await fetch('/api/civilization/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      return data.data as CivilizationJob[];
    },
    staleTime: Infinity, // Static data
  });
}

/**
 * Fetch workforce assignments
 */
export function useWorkforceAssignments() {
  return useQuery({
    queryKey: ['civilization', 'workforce', 'assignments'],
    queryFn: async () => {
      const res = await fetch('/api/civilization/workforce/assignments');
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      return data.data;
    },
    staleTime: 30000,
  });
}

/**
 * Fetch workforce projection
 */
export function useWorkforceProjection() {
  return useQuery({
    queryKey: ['civilization', 'workforce', 'projection'],
    queryFn: async () => {
      const res = await fetch('/api/civilization/workforce/projection');
      if (!res.ok) throw new Error('Failed to fetch projection');
      const data = await res.json();
      return data.data as WorkforceProjection;
    },
    staleTime: 30000,
  });
}

/**
 * Assign workforce mutation
 */
export function useAssignWorkforce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      employees,
    }: {
      jobId: string;
      employees: number;
    }) => {
      const res = await fetch('/api/civilization/workforce/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, employees }),
      });
      if (!res.ok) throw new Error('Failed to assign workforce');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['civilization', 'workforce'],
      });
    },
  });
}

/**
 * Update assignment mutation
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      employees,
    }: {
      assignmentId: string;
      employees: number;
    }) => {
      const res = await fetch(`/api/civilization/workforce/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employees }),
      });
      if (!res.ok) throw new Error('Failed to update assignment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['civilization', 'workforce'],
      });
    },
  });
}

/**
 * Remove assignment mutation
 */
export function useRemoveAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const res = await fetch(`/api/civilization/workforce/${assignmentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove assignment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['civilization', 'workforce'],
      });
    },
  });
}

/**
 * Upgrade subsystem mutation
 */
export function useUpgradeSubsystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      systemId,
      targetLevel,
    }: {
      systemId: string;
      targetLevel: number;
    }) => {
      const res = await fetch('/api/civilization/subsystems/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemId, targetLevel }),
      });
      if (!res.ok) throw new Error('Failed to upgrade subsystem');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['civilization', 'state'],
      });
    },
  });
}

// ============================================================================
// ARMY HOOKS
// ============================================================================

/**
 * Fetch army subsystems
 */
export function useArmySubsystems() {
  return useQuery({
    queryKey: ['army', 'subsystems'],
    queryFn: async () => {
      const res = await fetch('/api/army/subsystems');
      if (!res.ok) throw new Error('Failed to fetch army subsystems');
      const data = await res.json();
      return data.data as ArmySubsystem[];
    },
    staleTime: Infinity,
  });
}

/**
 * Fetch available army units for player level
 */
export function useAvailableArmyUnits(playerLevel: number) {
  return useQuery({
    queryKey: ['army', 'subsystems', 'available', playerLevel],
    queryFn: async () => {
      const res = await fetch(
        `/api/army/subsystems/available?level=${playerLevel}`
      );
      if (!res.ok) throw new Error('Failed to fetch available units');
      const data = await res.json();
      return data.data as ArmySubsystem[];
    },
    staleTime: Infinity,
  });
}

/**
 * Fetch military force
 */
export function useMilitaryForce() {
  return useQuery({
    queryKey: ['army', 'force'],
    queryFn: async () => {
      const res = await fetch('/api/army/force');
      if (!res.ok) throw new Error('Failed to fetch military force');
      const data = await res.json();
      return data.data;
    },
    staleTime: 30000,
  });
}

/**
 * Train unit mutation
 */
export function useTrainUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subsystemId,
      quantity,
    }: {
      subsystemId: string;
      quantity: number;
    }) => {
      const res = await fetch('/api/army/units/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subsystemId, quantity }),
      });
      if (!res.ok) throw new Error('Failed to train unit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['army', 'force'] });
    },
  });
}

/**
 * Dismiss unit mutation
   */
export function useDismissUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      const res = await fetch(`/api/army/units/${unitId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to dismiss unit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['army', 'force'] });
    },
  });
}

/**
 * Deploy campaign mutation
 */
export function useDeployCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      campaignName: string;
      unitIds: string[];
      targetGalaxy: number;
      targetSystem: number;
      targetPlanet?: number;
      campaignType?:
        | 'conquest'
        | 'defense'
        | 'exploration'
        | 'raid';
    }) => {
      const res = await fetch('/api/army/campaigns/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Failed to deploy campaign');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['army', 'campaigns'] });
    },
  });
}

/**
 * Fetch campaigns
 */
export function useCampaigns() {
  return useQuery({
    queryKey: ['army', 'campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/army/campaigns');
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      const data = await res.json();
      return data.data as MilitaryCampaign[];
    },
    staleTime: 30000,
  });
}

/**
 * Fetch active campaigns
 */
export function useActiveCampaigns() {
  return useQuery({
    queryKey: ['army', 'campaigns', 'active'],
    queryFn: async () => {
      const res = await fetch('/api/army/campaigns/active');
      if (!res.ok) throw new Error('Failed to fetch active campaigns');
      const data = await res.json();
      return data.data as MilitaryCampaign[];
    },
    staleTime: 15000,
  });
}

/**
 * Complete campaign mutation
 */
export function useCompleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      successful,
    }: {
      campaignId: string;
      successful?: boolean;
    }) => {
      const res = await fetch(`/api/army/campaigns/${campaignId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ successful }),
      });
      if (!res.ok) throw new Error('Failed to complete campaign');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['army', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['army', 'force'] });
    },
  });
}
