import { useState, useEffect } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Puzzle, Download, Trash2, ChevronUp, ChevronDown, Info } from "lucide-react";

type ModListResponse = {
  mods: { available: string[]; installed: string[] };
};

type ModInfoResponse = {
  mod: { name: string; version: string; author: string; description: string; website?: string; folder: string };
};

export default function AdminMods() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modList, isLoading } = useQuery<ModListResponse>({
    queryKey: ["/api/admin/mods"],
  });

  const installMod = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/admin/mods/${name}/install`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/mods"] }); toast({ title: "Mod installed" }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const uninstallMod = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/admin/mods/${name}/uninstall`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/mods"] }); toast({ title: "Mod uninstalled" }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const moveMod = useMutation({
    mutationFn: async ({ name, dir }: { name: string; dir: string }) => {
      const res = await fetch(`/api/admin/mods/${name}/move-${dir}`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/mods"] }),
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const [selectedMod, setSelectedMod] = useState<string | null>(null);
  const { data: modInfo } = useQuery<ModInfoResponse>({
    queryKey: ["/api/admin/mods", selectedMod, "info"],
    enabled: !!selectedMod,
    queryFn: async () => {
      const res = await fetch(`/api/admin/mods/${selectedMod}/info`);
      return res.json();
    },
  });

  if (isLoading) return <GameLayout><div className="p-4">Loading...</div></GameLayout>;

  return (
    <GameLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Puzzle className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Mod System Administration</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Installed Mods ({modList?.mods.installed.length ?? 0})</CardTitle><CardDescription>Currently active mods in load order</CardDescription></CardHeader>
            <CardContent>
              {(!modList?.mods.installed || modList.mods.installed.length === 0) ? (
                <p className="text-muted-foreground">No mods installed.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {modList.mods.installed.map((name, i) => (
                      <TableRow key={name}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => moveMod.mutate({ name, dir: "up" })} disabled={i === 0}><ChevronUp className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => moveMod.mutate({ name, dir: "down" })} disabled={i === modList.mods.installed.length - 1}><ChevronDown className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => uninstallMod.mutate(name)}><Trash2 className="w-4 h-4" /></Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedMod(name)}><Info className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Available Mods ({modList?.mods.available.length ?? 0})</CardTitle><CardDescription>Mods in the mods directory ready to install</CardDescription></CardHeader>
            <CardContent>
              {(!modList?.mods.available || modList.mods.available.length === 0) ? (
                <p className="text-muted-foreground">No mods available.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {modList.mods.available
                      .filter((n) => !modList.mods.installed.includes(n))
                      .map((name) => (
                        <TableRow key={name}>
                          <TableCell className="font-medium">{name}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" onClick={() => installMod.mutate(name)}><Download className="w-4 h-4 mr-1" />Install</Button>
                              <Button size="sm" variant="outline" onClick={() => setSelectedMod(name)}><Info className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {modInfo && (
          <Card>
            <CardHeader><CardTitle>{modInfo.mod.name} v{modInfo.mod.version}</CardTitle><CardDescription>by {modInfo.mod.author}</CardDescription></CardHeader>
            <CardContent>
              <p>{modInfo.mod.description}</p>
              {modInfo.mod.website && <p className="mt-2"><a href={modInfo.mod.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{modInfo.mod.website}</a></p>}
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
