/**
 * Army Management Page
 * Complete UI for training, deploying, and managing military forces
 * @tag #ui #military #management #page
 */

import React, { useMemo, useState } from 'react';
import GameLayout from '@/components/layout/GameLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Shield,
  Zap,
  Users,
  Sword,
  Target,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useMilitaryForce,
  useArmySubsystems,
  useTrainUnit,
  useDismissUnit,
  useDeployCampaign,
  useActiveCampaigns,
  useCompleteCampaign,
} from '@/hooks/useCivilizationArmy';
import type { ArmyUnit, ArmySubsystem } from '@shared/types/civilization';

type SortBy = 'tier' | 'type' | 'cost' | 'power';

const roleColors: Record<
  'commander' | 'captain' | 'sergeant' | 'specialist' | 'operator' | 'support',
  string
> = {
  commander: 'bg-red-500 text-white',
  captain: 'bg-orange-500 text-white',
  sergeant: 'bg-yellow-500 text-white',
  specialist: 'bg-blue-500 text-white',
  operator: 'bg-purple-500 text-white',
  support: 'bg-green-500 text-white',
};

const roleIcons: Record<
  'commander' | 'captain' | 'sergeant' | 'specialist' | 'operator' | 'support',
  React.ReactNode
> = {
  commander: <Sword className="w-4 h-4" />,
  captain: <Shield className="w-4 h-4" />,
  sergeant: <Users className="w-4 h-4" />,
  specialist: <Target className="w-4 h-4" />,
  operator: <Gauge className="w-4 h-4" />,
  support: <Zap className="w-4 h-4" />,
};

export default function ArmyManagement() {
  const { data: militaryForce, isLoading: forceLoading } = useMilitaryForce();
  const { data: subsystems, isLoading: subsystemsLoading } = useArmySubsystems();
  const { data: campaigns } = useActiveCampaigns();
  const trainUnitMutation = useTrainUnit();
  const dismissUnitMutation = useDismissUnit();
  const deployCampaignMutation = useDeployCampaign();
  const completeCampaignMutation = useCompleteCampaign();

  const [trainModalOpen, setTrainModalOpen] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<string | null>(null);
  const [trainQuantity, setTrainQuantity] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>('tier');
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState<'conquest' | 'defense' | 'exploration' | 'raid'>('conquest');
  const [targetGalaxy, setTargetGalaxy] = useState(1);
  const [targetSystem, setTargetSystem] = useState(1);
  const [selectedCampaignUnits, setSelectedCampaignUnits] = useState<string[]>([]);

  const subsystemById = useMemo(() => {
    return new Map<string, ArmySubsystem>((subsystems || []).map((subsystem) => [subsystem.id, subsystem]));
  }, [subsystems]);

  if (forceLoading || subsystemsLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading military data...</div>
        </div>
      </GameLayout>
    );
  }

  const force = militaryForce?.force || {
    playerId: '',
    squadrons: [],
    totalStrength: 0,
    totalMorale: 50,
    averageExperience: 0,
    commanderBonus: 0,
  };

  const sortedSubsystems: ArmySubsystem[] = subsystems
    ? [...subsystems]
      .filter((subsystem: ArmySubsystem) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          subsystem.name.toLowerCase().includes(term) ||
          subsystem.type.toLowerCase().includes(term) ||
          subsystem.role.toLowerCase().includes(term)
        );
      })
      .sort((a: ArmySubsystem, b: ArmySubsystem) => {
        switch (sortBy) {
          case 'tier':
            return b.tier - a.tier;
          case 'type':
            return a.type.localeCompare(b.type);
          case 'cost':
            return b.cost.credits - a.cost.credits;
          case 'power':
            return (b.combat.attack + b.combat.defense) -
              (a.combat.attack + a.combat.defense);
          default:
            return 0;
        }
      })
    : [];

  const activeCampaigns = campaigns || [];

  const totalUnitCount = force.squadrons.reduce((sum: number, unit: ArmyUnit) => sum + unit.quantity, 0);
  const deployableBlueprints = sortedSubsystems.length;

  const selectedBlueprint = selectedUnitType
    ? subsystemById.get(selectedUnitType)
    : undefined;

  const selectedTrainingCost = selectedBlueprint
    ? selectedBlueprint.cost.credits * trainQuantity
    : 0;

  const getUnitHealthPercent = (unit: ArmyUnit) => {
    const maxHealth = Math.max(1, unit.quantity * 100);
    const rawPercent = (unit.health / maxHealth) * 100;
    return Math.max(0, Math.min(100, Math.round(rawPercent)));
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900">Military Command</h1>
            <p className="text-sm text-slate-600">
              Manage your military forces and operations
            </p>
          </div>
          <Button
            onClick={() => setTrainModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            <Sword className="w-4 h-4 mr-2" />
            Train Unit
          </Button>
        </div>

        {/* Military Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">{force.totalStrength}</div>
                <div className="text-sm text-slate-600">Total Strength</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <Gauge className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">
                  {force.totalMorale}%
                </div>
                <div className="text-sm text-slate-600">Morale</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">
                  {force.averageExperience}
                </div>
                <div className="text-sm text-slate-600">Avg Experience</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">
                  +{force.commanderBonus}%
                </div>
                <div className="text-sm text-slate-600">Commander Bonus</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Total Deployed Units</div>
              <div className="text-2xl font-bold text-slate-900">{totalUnitCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Deployable Blueprints</div>
              <div className="text-2xl font-bold text-slate-900">{deployableBlueprints}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Active Campaign Operations</div>
              <div className="text-2xl font-bold text-slate-900">{activeCampaigns.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="units" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="units">Active Units</TabsTrigger>
            <TabsTrigger value="training">
              Training ({sortedSubsystems?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              Campaigns ({activeCampaigns.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Units Tab */}
          <TabsContent value="units" className="space-y-4">
            {force.squadrons.length === 0 ? (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-slate-600">
                    No active units. Start by training units below.
                  </p>
                </CardContent>
              </Card>
            ) : (
              force.squadrons.map((unit: ArmyUnit) => (
                <Card
                  key={unit.id}
                  className="bg-white border-slate-200 hover:border-slate-300 transition shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-slate-900">
                            {unit.quantity}x {subsystemById.get(unit.subsystemId)?.name || 'Unit'}
                          </h3>
                          <Badge className={roleColors.commander}>
                            Level {unit.level}
                          </Badge>
                          <Badge variant="outline">
                            {getUnitHealthPercent(unit)}% Health
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
                          <div>
                            <span className="text-slate-500">Morale:</span>{' '}
                            <span className="text-slate-900 font-semibold">
                              {unit.morale}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Experience:</span>{' '}
                            <span className="text-slate-900 font-semibold">
                              {unit.experience}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Location:</span>{' '}
                            <span className="text-slate-900 font-semibold">
                              {unit.location
                                ? `Sector ${unit.location.galaxy}`
                                : 'Home Base'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Role:</span>{' '}
                            <span className="text-slate-900 font-semibold capitalize">
                              {subsystemById.get(unit.subsystemId)?.role || 'unknown'}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mb-2">
                          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-slate-600">
                            Attack: {subsystemById.get(unit.subsystemId)?.combat.attack ?? 0}
                          </div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-slate-600">
                            Defense: {subsystemById.get(unit.subsystemId)?.combat.defense ?? 0}
                          </div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-slate-600">
                            Speed: {subsystemById.get(unit.subsystemId)?.combat.speed ?? 0}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissUnitMutation.mutate(unit.id)}
                          className="text-red-400 border-red-400 hover:bg-red-900"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="search"
                placeholder="Search units..."
                className="max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-800"
              >
                <option value="tier">Sort by Tier</option>
                <option value="type">Sort by Type</option>
                <option value="cost">Sort by Cost</option>
                <option value="power">Sort by Power</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedSubsystems.map((subsystem) => (
                <Card
                  key={subsystem.id}
                  className="bg-white border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-sm"
                  onClick={() => setSelectedUnitType(subsystem.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{subsystem.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge>{subsystem.tier}-Star</Badge>
                          <Badge variant="outline">{subsystem.type}</Badge>
                          <div className={cn('px-2 py-0.5 rounded text-xs', roleColors[subsystem.role])}>
                            {roleIcons[subsystem.role]}
                            <span className="ml-1">{subsystem.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600">{subsystem.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">ATK</div>
                        <div className="font-bold text-rose-600">{subsystem.combat.attack}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">DEF</div>
                        <div className="font-bold text-blue-600">{subsystem.combat.defense}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">HP</div>
                        <div className="font-bold text-emerald-600">{subsystem.combat.health}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">SPD</div>
                        <div className="font-bold text-amber-600">{subsystem.combat.speed}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded text-sm border border-slate-200">
                      <div className="text-slate-600">Cost: {subsystem.cost.credits} Credits</div>
                      <div className="text-slate-600">Crew: {subsystem.minCrewRequired} min</div>
                      <div className="text-slate-600">Accuracy: {subsystem.combat.accuracy}%</div>
                      <div className="text-slate-600">Dodge: {subsystem.combat.dodge}%</div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={() => {
                        setSelectedUnitType(subsystem.id);
                        setTrainModalOpen(true);
                      }}
                    >
                      Train Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedBlueprint && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Selected Blueprint Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{selectedBlueprint.tier}-Star</Badge>
                    <Badge variant="outline" className="capitalize">{selectedBlueprint.type}</Badge>
                    <div className={cn('px-2 py-0.5 rounded text-xs', roleColors[selectedBlueprint.role])}>
                      <span className="inline-flex items-center gap-1">{roleIcons[selectedBlueprint.role]}<span>{selectedBlueprint.role}</span></span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">{selectedBlueprint.description}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="rounded border border-slate-200 bg-slate-50 p-2">ATK: <span className="font-semibold text-slate-900">{selectedBlueprint.combat.attack}</span></div>
                    <div className="rounded border border-slate-200 bg-slate-50 p-2">DEF: <span className="font-semibold text-slate-900">{selectedBlueprint.combat.defense}</span></div>
                    <div className="rounded border border-slate-200 bg-slate-50 p-2">HP: <span className="font-semibold text-slate-900">{selectedBlueprint.combat.health}</span></div>
                    <div className="rounded border border-slate-200 bg-slate-50 p-2">SPD: <span className="font-semibold text-slate-900">{selectedBlueprint.combat.speed}</span></div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Required Level: {selectedBlueprint.minimumLevel ?? 1} · Min Crew: {selectedBlueprint.minCrewRequired} · Morale Multiplier: {selectedBlueprint.moraleMultiplier}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Campaign Planner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={campaignName}
                    onChange={(event) => setCampaignName(event.target.value)}
                    placeholder="Campaign name"
                    className="bg-white border-slate-300"
                  />
                  <select
                    value={campaignType}
                    onChange={(event) => setCampaignType(event.target.value as 'conquest' | 'defense' | 'exploration' | 'raid')}
                    className="px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-800"
                  >
                    <option value="conquest">Conquest</option>
                    <option value="defense">Defense</option>
                    <option value="exploration">Exploration</option>
                    <option value="raid">Raid</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min={1}
                    value={targetGalaxy}
                    onChange={(event) => setTargetGalaxy(Math.max(1, Number(event.target.value) || 1))}
                    placeholder="Target galaxy"
                    className="bg-white border-slate-300"
                  />
                  <Input
                    type="number"
                    min={1}
                    value={targetSystem}
                    onChange={(event) => setTargetSystem(Math.max(1, Number(event.target.value) || 1))}
                    placeholder="Target system"
                    className="bg-white border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-800">Assign Units</div>
                  {force.squadrons.length === 0 ? (
                    <div className="text-sm text-slate-500">No available units to assign.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {force.squadrons.map((unit: ArmyUnit) => {
                        const checked = selectedCampaignUnits.includes(unit.id);
                        const label = subsystemById.get(unit.subsystemId)?.name || 'Unit';
                        return (
                          <label key={unit.id} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                            <span className="text-slate-700">{unit.quantity}x {label}</span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setSelectedCampaignUnits((previous) =>
                                  checked
                                    ? previous.filter((id) => id !== unit.id)
                                    : [...previous, unit.id]
                                )
                              }
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!campaignName.trim() || selectedCampaignUnits.length === 0 || deployCampaignMutation.isPending}
                  onClick={() => {
                    deployCampaignMutation.mutate(
                      {
                        campaignName: campaignName.trim(),
                        unitIds: selectedCampaignUnits,
                        targetGalaxy,
                        targetSystem,
                        campaignType,
                      },
                      {
                        onSuccess: () => {
                          setCampaignName('');
                          setSelectedCampaignUnits([]);
                        },
                      }
                    );
                  }}
                >
                  Deploy Campaign
                </Button>
              </CardContent>
            </Card>

            {activeCampaigns.length === 0 ? (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-slate-600">
                    No active campaigns. Deploy a campaign to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeCampaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="bg-white border-blue-200 shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{campaign.name}</h3>
                          <Badge className="bg-blue-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                          <Badge variant="outline">{campaign.type}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          Galaxy {campaign.targetGalaxy} - System{' '}
                          {campaign.targetSystem}
                        </p>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-slate-500">Forces:</span>{' '}
                            <span className="font-semibold">
                              {campaign.allocatedForces.length} units
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Duration:</span>{' '}
                            <span className="font-semibold">
                              {campaign.estimatedDuration} turns
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Success Rate:</span>{' '}
                            <span className="font-semibold text-emerald-600">
                              {Math.round((campaign.successRate || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            completeCampaignMutation.mutate({
                              campaignId: campaign.id,
                              successful: true,
                            })
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Succeed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400"
                          onClick={() =>
                            completeCampaignMutation.mutate({
                              campaignId: campaign.id,
                              successful: false,
                            })
                          }
                        >
                          Fail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Train Unit Modal */}
      {trainModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Train Military Unit</CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                Select unit type and quantity to train
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Unit Type
                </label>
                <select
                  value={selectedUnitType || ''}
                  onChange={(e) => setSelectedUnitType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                >
                  <option value="">Select a unit type...</option>
                  {sortedSubsystems.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.cost.credits} credits)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={trainQuantity}
                  onChange={(e) => setTrainQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="bg-white border-slate-300"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded text-sm border border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Total Cost:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedTrainingCost}{' '}
                    Credits
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (selectedUnitType) {
                      trainUnitMutation.mutate({
                        subsystemId: selectedUnitType,
                        quantity: trainQuantity,
                      });
                      setTrainModalOpen(false);
                    }
                  }}
                  disabled={!selectedUnitType}
                >
                  Train
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTrainModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </GameLayout>
  );
}
