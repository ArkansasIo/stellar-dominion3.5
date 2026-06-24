import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Lock, Ban, Wand2, Trash2, Download } from "lucide-react";
import type { AdminUser, AdminUsersResponse, AdminAccountsResponse, AdminMeResponse, DeveloperShortcutsResponse } from "./types";

type Props = {
  usersData: AdminUsersResponse | undefined;
  accountsData: AdminAccountsResponse | undefined;
  meData: AdminMeResponse | undefined;
  devData: DeveloperShortcutsResponse | undefined;
  canAdministrate: boolean;
  canUseMasquerade: boolean;
  isFounder: boolean;
  privilegedSessionFresh: boolean;
  onStatusChange: (userId: string, status: "active" | "muted" | "banned") => void;
  onImpersonate: (identifier: string) => void;
  onCreateAdmin: (identifier: string, role: string) => void;
  onRemoveAdmin: (userId: string) => void;
  isPending: boolean;
};

export function PlayersTab({ usersData, accountsData, meData, devData, canAdministrate, canUseMasquerade, isFounder, privilegedSessionFresh, onStatusChange, onImpersonate, onCreateAdmin, onRemoveAdmin, isPending }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPlayer, setSelectedPlayer] = useState<AdminUser | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("moderator");

  const allUsers = usersData?.users || [];
  const filtered = allUsers.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader><CardTitle className="text-slate-100 text-lg">Player Management</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-9 bg-slate-800 border-slate-700 text-slate-200" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-700 text-slate-300"><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
          </div>
          <div className="rounded-lg border border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800/50 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">ID</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Last Login</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} className="border-slate-700/50 hover:bg-slate-800/30">
                    <TableCell className="text-slate-400 font-mono text-xs">{user.id.slice(0, 8)}...</TableCell>
                    <TableCell className="text-slate-200 font-medium">{user.name}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${user.status === "active" ? "border-green-700 text-green-400" : user.status === "muted" ? "border-amber-700 text-amber-400" : "border-red-700 text-red-400"}`}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{user.role}</TableCell>
                    <TableCell className="text-slate-500 text-xs">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-slate-400 hover:text-slate-200" onClick={() => { setSelectedPlayer(user); setDetailOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 text-slate-400 hover:text-amber-400" onClick={() => onStatusChange(user.id, user.status === "muted" ? "active" : "muted")}><Lock className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 text-slate-400 hover:text-red-400" onClick={() => onStatusChange(user.id, user.status === "banned" ? "active" : "banned")}><Ban className="w-3.5 h-3.5" /></Button>
                        {canUseMasquerade && privilegedSessionFresh ? (
                          <Button size="sm" variant="ghost" className="h-7 text-slate-400 hover:text-purple-400" onClick={() => onImpersonate(user.id)}><Wand2 className="w-3.5 h-3.5" /></Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-slate-500 py-8">No players found</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader><CardTitle className="text-slate-100 text-lg">Admin Accounts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {canAdministrate ? (
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_auto]">
                <Input value={newAdminId} onChange={(e) => setNewAdminId(e.target.value)} placeholder="username, email, or user id" className="bg-slate-800 border-slate-700 text-slate-200" />
                <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {["viewer", "moderator", "suadmin", "administrator", ...(isFounder ? ["devadmin", "founder"] : [])].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={() => { onCreateAdmin(newAdminId.trim(), newAdminRole); setNewAdminId(""); }} disabled={!newAdminId.trim() || isPending}>Add Admin</Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-800 bg-amber-950/50 px-3 py-2 text-sm text-amber-300">Your role can review admin accounts but cannot create or remove them.</div>
          )}
          <div className="space-y-2">
            {(accountsData?.accounts || []).map((account) => (
              <div key={account.id} className="border border-slate-700/50 rounded-lg p-3 flex items-center justify-between gap-3 bg-slate-800/30">
                <div>
                  <div className="font-semibold text-slate-200">{account.username}</div>
                  <div className="text-xs text-slate-500">{account.email} · {account.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-slate-600 text-slate-400">{account.role}</Badge>
                  {canAdministrate && account.userId !== meData?.actingAdminUserId ? (
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => onRemoveAdmin(account.userId)} disabled={isPending}><Trash2 className="w-3.5 h-3.5" /></Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader><DialogTitle className="text-slate-100">{selectedPlayer?.name || "Player Details"}</DialogTitle></DialogHeader>
          {selectedPlayer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-xs text-slate-500">ID</div><div className="text-sm text-slate-300 font-mono">{selectedPlayer.id}</div></div>
                <div><div className="text-xs text-slate-500">Email</div><div className="text-sm text-slate-300">{selectedPlayer.email}</div></div>
                <div><div className="text-xs text-slate-500">Status</div><Badge variant="outline" className={`${selectedPlayer.status === "active" ? "border-green-700 text-green-400" : selectedPlayer.status === "muted" ? "border-amber-700 text-amber-400" : "border-red-700 text-red-400"}`}>{selectedPlayer.status}</Badge></div>
                <div><div className="text-xs text-slate-500">Role</div><div className="text-sm text-slate-300">{selectedPlayer.role}</div></div>
                <div><div className="text-xs text-slate-500">IP</div><div className="text-sm text-slate-300">{selectedPlayer.ip || "N/A"}</div></div>
                <div><div className="text-xs text-slate-500">Last Login</div><div className="text-sm text-slate-300">{selectedPlayer.lastLogin ? new Date(selectedPlayer.lastLogin).toLocaleString() : "Never"}</div></div>
              </div>
              <Separator className="bg-slate-700/50" />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => { onStatusChange(selectedPlayer.id, selectedPlayer.status === "muted" ? "active" : "muted"); setDetailOpen(false); }}>
                  {selectedPlayer.status === "muted" ? "Unmute" : "Mute"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => { onStatusChange(selectedPlayer.id, selectedPlayer.status === "banned" ? "active" : "banned"); setDetailOpen(false); }}>
                  {selectedPlayer.status === "banned" ? "Unban" : "Ban"}
                </Button>
                {canUseMasquerade && privilegedSessionFresh ? (
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-500" onClick={() => { onImpersonate(selectedPlayer.id); setDetailOpen(false); }}>
                    <Wand2 className="w-3.5 h-3.5 mr-1" /> Impersonate
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
