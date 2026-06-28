import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText, ChevronRight, ChevronLeft, BookOpen, Sparkles, Unlock } from "lucide-react";
import { ACT_PRELUDES, getUnlocksForAct, type ActPrelude, type ChapterPrelude } from "@shared/config/preludesConfig";
import { Link } from "wouter";

export default function Preludes() {
  const [selectedAct, setSelectedAct] = useState<number>(1);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const act = ACT_PRELUDES.find((a) => a.act === selectedAct);

  if (!act) return null;

  const actColors: Record<number, string> = {
    1: "from-amber-900/80 to-orange-950/80",
    2: "from-emerald-900/80 to-teal-950/80",
    3: "from-purple-900/80 to-indigo-950/80",
    4: "from-red-900/80 to-rose-950/80",
    5: "from-sky-900/80 to-blue-950/80",
    6: "from-slate-900/80 to-zinc-950/80",
    7: "from-orange-900/80 to-red-950/80",
    8: "from-cyan-900/80 to-teal-950/80",
    9: "from-stone-900/80 to-neutral-950/80",
    10: "from-violet-900/80 to-purple-950/80",
    11: "from-rose-900/80 to-pink-950/80",
    12: "from-yellow-900/80 to-amber-950/80",
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ScrollText className="w-8 h-8 text-primary" />
            Preludes
          </h1>
          <p className="text-muted-foreground">
            Read the narrative preludes that set the stage for each act and chapter of the Stellar Dominion campaign.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/story-mode">
              <Button variant="outline" size="sm">Open Story Mode</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Act Selector Sidebar */}
          <div className="lg:w-64 shrink-0">
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-500 uppercase tracking-wide">Campaign Acts</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {ACT_PRELUDES.map((a) => (
                  <button
                    key={a.act}
                    onClick={() => {
                      setSelectedAct(a.act);
                      setExpandedChapter(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedAct === a.act
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Act {a.act}: {a.title}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Act Prelude Card */}
            <div className={`rounded-xl bg-gradient-to-br ${actColors[act.act]} p-1`}>
              <Card className="bg-white/95 backdrop-blur border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2" variant="secondary">
                        Act {act.act}
                      </Badge>
                      <CardTitle className="text-2xl text-slate-900">{act.title}</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">{act.subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={selectedAct <= 1}
                        onClick={() => {
                          setSelectedAct(selectedAct - 1);
                          setExpandedChapter(null);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={selectedAct >= 12}
                        onClick={() => {
                          setSelectedAct(selectedAct + 1);
                          setExpandedChapter(null);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Epigraph */}
                  <blockquote className="border-l-4 border-primary/30 pl-4 italic text-slate-600">
                    {act.epigraph}
                  </blockquote>

                  {/* Main Narrative */}
                  <div className="prose prose-slate max-w-none">
                    {act.narrative.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-slate-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chapter Preludes */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Chapter Preludes
              </h2>
              <div className="space-y-3">
                {act.chapters.map((chapter) => (
                  <Card
                    key={chapter.chapter}
                    className="bg-white border-slate-200 cursor-pointer transition-all hover:border-primary/50"
                    onClick={() =>
                      setExpandedChapter(expandedChapter === chapter.chapter ? null : chapter.chapter)
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {chapter.chapter}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-slate-900">{chapter.title}</CardTitle>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            expandedChapter === chapter.chapter ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </CardHeader>
                    {expandedChapter === chapter.chapter && (
                      <CardContent className="pt-0 space-y-4">
                        <div className="prose prose-slate max-w-none">
                          {chapter.narrative.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="text-slate-700 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-primary font-medium">{chapter.hook}</span>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Feature Unlocks */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-green-900">
                  <Unlock className="w-4 h-4 text-green-600" />
                  Features Unlocked by Act {act.act}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getUnlocksForAct(act.act).map((unlock) => (
                    <Link key={unlock.href} href="/story-mode">
                      <div className="rounded-lg border border-green-200 bg-white p-3 text-sm hover:border-green-400 hover:shadow-sm transition-all cursor-pointer">
                        <div className="font-semibold text-slate-900">{unlock.label}</div>
                        <p className="text-xs text-slate-500 mt-0.5">{unlock.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Closing Note */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ScrollText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">Closing Note</p>
                    <p className="text-slate-600 italic leading-relaxed">{act.closingNote}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-4">
              {selectedAct > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAct(selectedAct - 1);
                    setExpandedChapter(null);
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous: Act {selectedAct - 1}
                </Button>
              ) : (
                <div />
              )}
              {selectedAct < 12 ? (
                <Button
                  onClick={() => {
                    setSelectedAct(selectedAct + 1);
                    setExpandedChapter(null);
                  }}
                >
                  Next: Act {selectedAct + 1}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Link href="/story-mode">
                  <Button>
                    Begin Campaign
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
