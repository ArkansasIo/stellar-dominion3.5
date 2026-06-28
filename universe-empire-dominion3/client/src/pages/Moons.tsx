/**
 * Moons Page
 * ============================================================================
 * Moon base management interface
 * API: /api/moons/*
 */

import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      credentials: 'include',
    });
    return res.json();
  } catch { return null; }
}

interface Moon {
  id: string;
  name: string;
  size: number;
  buildings: MoonBuilding[];
  defenses: MoonDefense[];
  ships: MoonShip[];
}

interface MoonBuilding {
  id: string;
  name: string;
  level: number;
}

interface MoonDefense {
  id: string;
  name: string;
  count: number;
}

interface MoonShip {
  id: string;
  name: string;
  count: number;
}

export default function Moons() {
  const [moons, setMoons] = useState<Moon[]>([]);
  const [selectedMoon, setSelectedMoon] = useState<Moon | null>(null);
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState<any[]>([]);

  useEffect(() => {
    loadMoons();
    loadBuildings();
  }, []);

  async function loadMoons() {
    setLoading(true);
    const result = await fetchApi<any>('/api/moons/list');
    if (result?.success) {
      setMoons(result.moons);
      if (result.moons.length > 0 && !selectedMoon) {
        setSelectedMoon(result.moons[0]);
      }
    }
    setLoading(false);
  }

  async function loadBuildings() {
    const result = await fetchApi<any>('/api/moons/buildings');
    if (result?.success) {
      setBuildings(result.buildings);
    }
  }

  async function buildMoon(buildingId: string) {
    if (!selectedMoon) return;
    const result = await fetchApi<any>('/api/moons/build', {
      method: 'POST',
      body: JSON.stringify({
        moonId: selectedMoon.id,
        buildingId,
      }),
    });
    if (result?.success) {
      loadMoons();
    }
  }

  async function tearDown(buildingId: string) {
    if (!selectedMoon) return;
    const result = await fetchApi<any>('/api/moons/teardown', {
      method: 'POST',
      body: JSON.stringify({
        moonId: selectedMoon.id,
        buildingId,
      }),
    });
    if (result?.success) {
      loadMoons();
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--sd-panel-bottom)] rounded w-1/4"></div>
          <div className="h-64 bg-[var(--sd-panel-bottom)] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-400">Moon Bases</h1>
        <p className="text-[var(--sd-text-secondary)]">Manage your moon installations</p>
      </div>

      {/* Moon List */}
      <div className="grid grid-cols-4 gap-4">
        {moons.map((moon) => (
          <Card
            key={moon.id}
            className={`cursor-pointer ${
              selectedMoon?.id === moon.id
                ? 'border-purple-500 bg-purple-900/20'
                : ''
            }`}
            onClick={() => setSelectedMoon(moon)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{moon.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-[var(--sd-text-secondary)]">Size: {moon.size} km</div>
              <div className="text-sm">
                Buildings: {moon.buildings?.length || 0}
              </div>
            </CardContent>
          </Card>
        ))}
        {moons.length === 0 && (
          <div className="col-span-4 text-center text-[var(--sd-text-secondary)] py-8">
            No moons discovered
          </div>
        )}
      </div>

      {/* Selected Moon Details */}
      {selectedMoon && (
        <>
          {/* Buildings */}
          <Card>
            <CardHeader>
              <CardTitle>Moon Buildings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {buildings.map((building) => {
                  const existing = selectedMoon.buildings?.find(
                    (b) => b.id === building.id
                  );
                  return (
                    <div
                      key={building.id}
                      className="border-[var(--sd-panel-border)] rounded-lg p-4"
                    >
                      <div className="font-medium">{building.name}</div>
                      {existing ? (
                        <div className="text-green-400">
                          Level {existing.level}
                        </div>
                      ) : (
                        <div className="text-[var(--sd-text-secondary)]">Not built</div>
                      )}
                      {existing ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => tearDown(building.id)}
                        >
                          Tear Down
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => buildMoon(building.id)}
                        >
                          Build
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Defenses */}
          <Card>
            <CardHeader>
              <CardTitle>Orbital Defense</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMoon.defenses?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {selectedMoon.defenses.map((defense) => (
                    <div
                      key={defense.id}
                      className="border-[var(--sd-panel-border)] rounded-lg p-3"
                    >
                      <div className="font-medium">{defense.name}</div>
                      <div className="text-xl font-bold">
                        {defense.count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[var(--sd-text-secondary)] py-4">
                  No defenses deployed
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ships */}
          <Card>
            <CardHeader>
              <CardTitle>Moon Fleet</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMoon.ships?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {selectedMoon.ships.map((ship) => (
                    <div
                      key={ship.id}
                      className="border-[var(--sd-panel-border)] rounded-lg p-3"
                    >
                      <div className="font-medium">{ship.name}</div>
                      <div className="text-xl font-bold">
                        {ship.count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[var(--sd-text-secondary)] py-4">
                  No ships stationed
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
