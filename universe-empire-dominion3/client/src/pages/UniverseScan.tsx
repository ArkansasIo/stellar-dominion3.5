import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

async function apiRequest(method: string, url: string, data?: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const storedUser = localStorage.getItem('stellar_username');
  const storedPass = localStorage.getItem('stellar_password');
  if (storedUser && storedPass) {
    headers['Authorization'] = `Basic ${btoa(`${storedUser}:${storedPass}`)}`;
  }
  const res = await fetch(url, { method, headers, body: data ? JSON.stringify(data) : undefined, credentials: 'include' });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  return res.json();
}

function cooldownRemaining(cooldownUntil: string | null): string {
  if (!cooldownUntil) return "Ready";
  const diff = new Date(cooldownUntil).getTime() - Date.now();
  if (diff <= 0) return "Ready";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

const SCAN_ICONS: Record<string, string> = {
  galaxy_scan: "🌌",
  planet_search: "🪐",
  moon_search: "🌙",
  deep_probe: "🔬",
  resource_scan: "💎",
};

interface ScanType {
  scanType: string;
  label: string;
  maxScans: number;
  scansRemaining: number;
  cooldownUntil: string | null;
  onCooldown: boolean;
  baseCost: number;
}

interface ScanResult {
  scanId: string;
  timestamp: string;
  scanType: string;
  [key: string]: any;
}

export default function UniverseScan() {
  const { toast } = useToast();
  const [scans, setScans] = useState<ScanType[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [scanning, setScanning] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState("scans");

  const fetchStatus = async () => {
    try {
      const d = await apiRequest("GET", "/api/universe/scan/status");
      if (d?.scans) setScans(d.scans);
    } catch {}
  };

  const fetchHistory = async () => {
    try {
      const d = await apiRequest("GET", "/api/universe/scan/history");
      if (d?.history) setHistory(d.history);
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, []);

  const executeScan = async (scanType: string) => {
    setScanning(scanType);
    try {
      const result = await apiRequest("POST", "/api/universe/scan/execute", { scanType });
      if (result?.success) {
        setLastResult(result.result);
        toast({ title: `${SCAN_ICONS[scanType] || "📡"} Scan Complete`, description: `${scanType.replace(/_/g, " ")} finished.` });
        fetchStatus();
        fetchHistory();
      }
    } catch (e: any) {
      toast({ title: "Scan Failed", description: e.message, variant: "destructive" });
    } finally {
      setScanning(null);
    }
  };

  const renderResult = (result: ScanResult) => {
    if (!result) return null;
    switch (result.scanType) {
      case "galaxy_scan":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <ResultBadge label="Planets" value={result.planetsDetected} color="blue" />
            <ResultBadge label="Moons" value={result.moonsDetected} color="purple" />
            <ResultBadge label="Anomalies" value={result.anomalies} color="amber" />
            <ResultBadge label="Resource Rich" value={result.resourceRichSystems} color="green" />
            <ResultBadge label="Habitable" value={result.habitablePlanets} color="emerald" />
          </div>
        );
      case "planet_search":
        return (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">Radius: {result.searchRadius}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(result.planets || []).map((p: any, i: number) => (
                <Card key={i} className="bg-slate-800/30 border-slate-700 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold capitalize text-white">{p.type}</span>
                    <Badge variant={p.殖民able ? "default" : "secondary"} className="text-xs">
                      {p.殖民able ? "Colonizable" : "Hostile"}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{p.size} km • {p.temperature}°C • {p.atmosphere}</div>
                  <div className="text-xs text-slate-500 mt-1">M: {p.resources.metal} C: {p.resources.crystal} D: {p.resources.deuterium}</div>
                </Card>
              ))}
            </div>
          </div>
        );
      case "moon_search":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(result.moons || []).map((m: any, i: number) => (
              <Card key={i} className="bg-slate-800/30 border-slate-700 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize text-white">{m.type} Moon</span>
                  <Badge variant={m.殖民able ? "default" : "secondary"} className="text-xs">
                    {m.殖民able ? "Settleable" : "Barren"}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400">{m.size} km • {m.atmosphere}</div>
                <div className="text-xs text-slate-500 mt-1">M: {m.resources.metal} C: {m.resources.crystal}</div>
              </Card>
            ))}
          </div>
        );
      case "deep_probe":
        return (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <ResultBadge label="Metal" value={result.composition?.metal} color="amber" />
              <ResultBadge label="Crystal" value={result.composition?.crystal} color="blue" />
              <ResultBadge label="Deuterium" value={result.composition?.deuterium} color="cyan" />
              <ResultBadge label="Rare Minerals" value={result.composition?.rareMinerals} color="purple" />
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="text-xs">{result.habitationChance} habitable</Badge>
              <Badge variant="outline" className="text-xs">Threat: {result.threatLevel}</Badge>
            </div>
            {result.composition?.artifacts > 0 && (
              <Badge className="bg-amber-600/20 text-amber-300 border-amber-600/30">
                {result.composition.artifacts} artifact(s) detected
              </Badge>
            )}
          </div>
        );
      case "resource_scan":
        return (
          <div className="space-y-3 text-sm">
            {Object.entries(result.deposits || {}).map(([key, val]: any) => (
              <div key={key} className="flex items-center justify-between bg-slate-800/30 rounded-lg p-2">
                <span className="capitalize text-slate-300">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white">{val.estimated?.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">{val.confidence}</span>
                </div>
              </div>
            ))}
            {result.specialDeposits?.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-amber-400 mb-1">Special Deposits:</div>
                {result.specialDeposits.map((d: string, i: number) => (
                  <Badge key={i} className="mr-1 bg-amber-600/20 text-amber-300">{d}</Badge>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return <pre className="text-xs text-slate-400">{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-orbitron font-bold text-white">Universe Scanning</h1>
          <p className="text-sm text-slate-400">24-hour search and probe systems for planets, moons, and resources</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="scans" className="text-slate-300 data-[state=active]:bg-slate-700">Scan Operations</TabsTrigger>
            <TabsTrigger value="results" className="text-slate-300 data-[state=active]:bg-slate-700">
              Results {lastResult && <span className="ml-1 w-2 h-2 rounded-full bg-green-400 inline-block" />}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-slate-300 data-[state=active]:bg-slate-700">History ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="scans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scans.map(scan => (
                <Card key={scan.scanType} className={`bg-slate-800/30 border-slate-700 ${scan.onCooldown ? "opacity-60" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{SCAN_ICONS[scan.scanType] || "📡"}</span>
                      <Badge variant={scan.onCooldown ? "secondary" : "default"} className="text-xs">
                        {scan.onCooldown ? cooldownRemaining(scan.cooldownUntil) : "Ready"}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm text-white">{scan.label}</CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      {scan.maxScans} scan{scan.maxScans > 1 ? "s" : ""} per 24h • {scan.baseCost} credits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Remaining: {scan.scansRemaining}/{scan.maxScans}</span>
                      {scan.maxScans > 1 && (
                        <Progress value={(scan.scansRemaining / scan.maxScans) * 100} className="w-20 h-1" />
                      )}
                    </div>
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={scan.onCooldown || scanning !== null}
                      onClick={() => executeScan(scan.scanType)}
                    >
                      {scanning === scan.scanType ? "Scanning..." : `Execute ${scan.label}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results">
            {lastResult ? (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">
                      {SCAN_ICONS[lastResult.scanType] || "📡"} {lastResult.scanType.replace(/_/g, " ")}
                    </CardTitle>
                    <span className="text-xs text-slate-400">{new Date(lastResult.timestamp).toLocaleString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderResult(lastResult)}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="py-12 text-center text-slate-400">
                  No scan results yet. Run a scan to see results here.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-96">
              {history.length === 0 ? (
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="py-12 text-center text-slate-400">No scan history.</CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {history.map((h: any, i: number) => (
                    <Card key={h.id || i} className="bg-slate-800/30 border-slate-700">
                      <CardContent className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{SCAN_ICONS[h.scanType] || "📡"}</span>
                          <div>
                            <div className="text-sm text-white capitalize">{h.scanType.replace(/_/g, " ")}</div>
                            <div className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <Badge variant={h.scansRemaining > 0 ? "default" : "secondary"} className="text-xs">
                          Scans left: {h.scansRemaining}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ResultBadge({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-600/20 text-blue-300 border-blue-600/30",
    purple: "bg-purple-600/20 text-purple-300 border-purple-600/30",
    amber: "bg-amber-600/20 text-amber-300 border-amber-600/30",
    green: "bg-green-600/20 text-green-300 border-green-600/30",
    emerald: "bg-emerald-600/20 text-emerald-300 border-emerald-600/30",
    cyan: "bg-cyan-600/20 text-cyan-300 border-cyan-600/30",
  };
  return (
    <div className={`rounded-lg border p-3 text-center ${colorMap[color] || colorMap.blue}`}>
      <div className="text-lg font-bold">{value ?? "?"}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}
