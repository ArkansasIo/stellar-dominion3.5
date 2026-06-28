import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldAlert, RefreshCw, Save, FileCheck } from "lucide-react";

type IntegrityReport = {
  passed: number;
  failed: number;
  total: number;
  issues: Array<{ path: string; status: string; checksum: string }>;
};

export default function AdminIntegrity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: report, isLoading } = useQuery<IntegrityReport>({
    queryKey: ["/api/admin/integrity"],
    queryFn: async () => {
      const res = await fetch("/api/admin/integrity/verify");
      return res.json();
    },
  });

  const saveSnapshot = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/integrity/save", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => { toast({ title: "Snapshot saved" }); queryClient.invalidateQueries({ queryKey: ["/api/admin/integrity"] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  return (
    <GameLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-2xl font-bold">File Integrity Checker</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/integrity"] })}><RefreshCw className="w-4 h-4 mr-1" />Re-Verify</Button>
          <Button variant="outline" onClick={() => saveSnapshot.mutate()}><Save className="w-4 h-4 mr-1" />Save Snapshot</Button>
        </div>

        {report && (
          <div className="grid grid-cols-3 gap-4">
            <Card><CardHeader className="py-3"><CardTitle className="text-lg text-green-500">{report.passed}</CardTitle><CardDescription>Passed</CardDescription></CardHeader></Card>
            <Card><CardHeader className="py-3"><CardTitle className="text-lg text-red-500">{report.failed}</CardTitle><CardDescription>Failed</CardDescription></CardHeader></Card>
            <Card><CardHeader className="py-3"><CardTitle className="text-lg">{report.total}</CardTitle><CardDescription>Total Files</CardDescription></CardHeader></Card>
          </div>
        )}

        <Card>
          <CardHeader><CardTitle>Issues</CardTitle></CardHeader>
          <CardContent>
            {(!report?.issues || report.issues.length === 0) ? (
              <p className="text-muted-foreground">No issues found. All files are intact.</p>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>File</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {report.issues.map((issue, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{issue.path}</TableCell>
                      <TableCell><Badge variant={issue.status === "modified" ? "destructive" : "secondary"}>{issue.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
