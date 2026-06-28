import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, Search, RefreshCw } from "lucide-react";

type I18nStatsResponse = {
  stats: Array<{ language: string; loaded: number; missing: number; total: number }>;
};

type I18nTranslationsResponse = {
  translations: Record<string, string>;
};

const LANGS = ["en", "ru", "de", "fr", "es", "it", "ja"];
const LANG_NAMES: Record<string, string> = { en: "English", ru: "Русский", de: "Deutsch", fr: "Français", es: "Español", it: "Italiano", ja: "日本語" };

export default function AdminI18n() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeLang, setActiveLang] = useState("en");
  const [search, setSearch] = useState("");

  const { data: stats } = useQuery<I18nStatsResponse>({
    queryKey: ["/api/admin/i18n/stats"],
  });

  const { data: translations } = useQuery<I18nTranslationsResponse>({
    queryKey: ["/api/admin/i18n", activeLang],
    queryFn: async () => {
      const res = await fetch(`/api/admin/i18n/${activeLang}`);
      return res.json();
    },
  });

  const updateTranslation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await fetch(`/api/admin/i18n/${activeLang}/${encodeURIComponent(key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/i18n", activeLang] }); toast({ title: "Translation updated" }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const filteredEntries = translations?.translations
    ? Object.entries(translations.translations).filter(([key]) => !search || key.toLowerCase().includes(search.toLowerCase()) || key.includes(search))
    : [];

  return (
    <GameLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Translation Manager</h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          {LANGS.map((lang) => (
            <Button key={lang} variant={activeLang === lang ? "default" : "outline"} onClick={() => setActiveLang(lang)}>
              {LANG_NAMES[lang] || lang} {stats?.stats.find((s) => s.language === lang) && <Badge variant="secondary" className="ml-2">{stats.stats.find((s) => s.language === lang)!.loaded}</Badge>}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {stats?.stats.map((s) => (
            <Card key={s.language}>
              <CardHeader className="py-3"><CardTitle className="text-sm">{LANG_NAMES[s.language] || s.language}</CardTitle></CardHeader>
              <CardContent className="py-2">
                <div className="text-sm"><span className="text-green-500">{s.loaded} loaded</span> / <span className="text-red-500">{s.missing} missing</span> / <span>{s.total} total</span></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Translations - {LANG_NAMES[activeLang] || activeLang}</CardTitle><CardDescription><div className="flex gap-2"><Input placeholder="Search keys..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" /></div></CardDescription></CardHeader>
          <CardContent>
            {filteredEntries.length === 0 ? (
              <p className="text-muted-foreground">No translations found.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="w-1/3">Key</TableHead><TableHead>Value</TableHead><TableHead className="w-24">Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredEntries.slice(0, 100).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-mono text-xs break-all">{key}</TableCell>
                        <TableCell>
                          <Input
                            defaultValue={value}
                            className="font-mono text-xs"
                            onBlur={(e) => {
                              if (e.target.value !== value) {
                                updateTranslation.mutate({ key, value: e.target.value });
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => updateTranslation.mutate({ key, value })}><RefreshCw className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
