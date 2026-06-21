import { useMemo, useState } from "react";
import { Link } from "wouter";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGame } from "@/lib/gameContext";
import { TECHS } from "@/lib/techData";
import {
  ALL_KNOWLEDGE_JOBS,
  KNOWLEDGE_OPERATIONS_META,
  KNOWLEDGE_SUPPORT_UNITS,
  RESEARCH_JOB_SYSTEMS,
  RESEARCH_PROGRAM_LIBRARY_240,
  RESEARCH_TECH_CATEGORIES,
  TECHNOLOGY_JOB_SYSTEMS,
  TECHNOLOGY_SYSTEM_LIBRARY_240,
  calculateKnowledgeOutput,
  getJobCoverageForCategory,
  getKnowledgeEffectSummary,
  getUnitCoverageForCategory,
  type KnowledgeCatalogEntry,
  type KnowledgeDomain,
  type KnowledgeJobRole,
  type KnowledgeSupportUnit,
  type ResearchTechCategory,
} from "@shared/config";
import {
  Atom,
  Beaker,
  BookOpen,
  BriefcaseBusiness,
  Cpu,
  Filter,
  FlaskConical,
  GraduationCap,
  Microscope,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  Workflow,
  ArrowRight,
} from "lucide-react";

const MAX_VISIBLE_ENTRIES = 24;

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

function matchesEntry(entry: KnowledgeCatalogEntry, query: string, category: string) {
  const categoryMatch = category === "all" || entry.category === category;
  if (!categoryMatch) {
    return false;
  }

  if (!query.trim()) {
    return true;
  }

  const haystack = [
    entry.name,
    entry.summary,
    entry.detail,
    entry.category,
    entry.subCategory,
    entry.type,
    entry.subType,
    entry.class,
    entry.subClass,
    ...entry.functions,
    ...entry.features,
    ...entry.effects,
    ...entry.tags,
  ].join(" ");

  return matchesQuery(haystack, query);
}

function matchesJob(job: KnowledgeJobRole, query: string, domain: string) {
  const domainMatch = domain === "all" || job.domain === domain;
  if (!domainMatch) {
    return false;
  }

  if (!query.trim()) {
    return true;
  }

  const haystack = [
    job.name,
    job.summary,
    job.detail,
    job.category,
    job.subCategory,
    job.jobType,
    job.subJobType,
    job.class,
    job.subClass,
    ...job.functions,
    ...job.features,
    ...job.effects,
  ].join(" ");

  return matchesQuery(haystack, query);
}

function matchesUnit(unit: KnowledgeSupportUnit, query: string, domain: string) {
  const domainMatch = domain === "all" || unit.domain === domain;
  if (!domainMatch) {
    return false;
  }

  if (!query.trim()) {
    return true;
  }

  const haystack = [
    unit.name,
    unit.summary,
    unit.detail,
    unit.category,
    unit.class,
    unit.subClass,
    unit.unitType,
    unit.subUnitType,
    ...unit.functions,
    ...unit.features,
    ...unit.effects,
  ].join(" ");

  return matchesQuery(haystack, query);
}

function EntryCard({ entry }: { entry: KnowledgeCatalogEntry }) {
  const projected = calculateKnowledgeOutput(
    entry,
    Math.max(3, Math.round(entry.jobCapacity * 0.75)),
    Math.max(1, Math.round(entry.unitCapacity * 0.75)),
    Math.max(8, Math.round(entry.tier / 5)),
  );

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="font-orbitron text-lg text-slate-900">{entry.name}</CardTitle>
            <CardDescription className="mt-1">
              {entry.libraryCode} • {entry.class} / {entry.subClass}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{entry.domain}</Badge>
            <Badge className="bg-primary/10 text-primary">Tier {entry.tier}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">{entry.category}</Badge>
          <Badge variant="secondary">{entry.subCategory}</Badge>
          <Badge variant="secondary">{entry.type}</Badge>
          <Badge variant="secondary">{entry.subType}</Badge>
        </div>

        <p className="text-sm text-slate-600">{entry.summary}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Capacity</div>
            <div className="mt-2 text-slate-900">Jobs {entry.jobCapacity} • Units {entry.unitCapacity}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Level Band</div>
            <div className="mt-2 text-slate-900">
              {entry.minLevel}-{entry.maxLevel}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Focus</span>
            <span>{entry.focusScore}%</span>
          </div>
          <Progress value={entry.focusScore} className="h-2" />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Readiness</span>
            <span>{entry.readinessScore}%</span>
          </div>
          <Progress value={entry.readinessScore} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
            <div className="text-xs uppercase tracking-[0.2em]">Projected Output</div>
            <div className="mt-2">Throughput {projected.throughputPerCycle}</div>
            <div>Discovery {projected.discoveryPerCycle}</div>
            <div>Readiness {projected.readinessPerCycle}</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <div className="text-xs uppercase tracking-[0.2em]">Operational Pressure</div>
            <div className="mt-2">Risk {projected.riskPressure}%</div>
            <div>Upkeep {projected.upkeepPerCycle}</div>
            <div>Security {entry.yieldProfile.securityDemand}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Functions</div>
          <div className="flex flex-wrap gap-2">
            {entry.functions.slice(0, 3).map((item) => (
              <Badge key={item} variant="secondary" className="whitespace-normal text-left">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Effects</div>
          <div className="text-sm text-slate-600">{getKnowledgeEffectSummary(entry)}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function JobCard({ job }: { job: KnowledgeJobRole }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="font-orbitron text-lg text-slate-900">{job.name}</CardTitle>
            <CardDescription className="mt-1">
              {job.category} • {job.subCategory} • {job.class}
            </CardDescription>
          </div>
          <Badge variant="outline">{job.domain}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">{job.summary}</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Minimum</div>
            <div className="mt-2 text-slate-900">{job.staffing.minimum}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Optimal</div>
            <div className="mt-2 text-slate-900">{job.staffing.optimal}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Maximum</div>
            <div className="mt-2 text-slate-900">{job.staffing.maximum}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary/10 text-primary">Throughput +{job.bonuses.throughput}%</Badge>
          <Badge className="bg-emerald-100 text-emerald-900">Efficiency +{job.bonuses.efficiency}%</Badge>
          <Badge className="bg-amber-100 text-amber-900">Security +{job.bonuses.security}%</Badge>
          <Badge className="bg-indigo-100 text-indigo-900">Quality +{job.bonuses.discovery}%</Badge>
        </div>
        <div className="text-xs text-slate-500">
          Supports {job.supportedCategories.length} category bands and {job.supportedSubCategories.length} sub-discipline bands.
        </div>
      </CardContent>
    </Card>
  );
}

function UnitCard({ unit }: { unit: KnowledgeSupportUnit }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="font-orbitron text-lg text-slate-900">{unit.name}</CardTitle>
            <CardDescription className="mt-1">
              {unit.category} • {unit.class} • Tier {unit.tier}
            </CardDescription>
          </div>
          <Badge variant="outline">{unit.domain}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">{unit.summary}</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Crew</div>
            <div className="mt-2 text-slate-900">{unit.crew}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Command</div>
            <div className="mt-2 text-slate-900">{unit.commandSlots}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Capacity</div>
            <div className="mt-2 text-slate-900">{unit.assignmentCapacity}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div>Analysis {unit.stats.analysis}</div>
            <div>Engineering {unit.stats.engineering}</div>
            <div>Coordination {unit.stats.coordination}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div>Logistics {unit.stats.logistics}</div>
            <div>Security {unit.stats.security}</div>
            <div>{unit.subUnitType}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function KnowledgeLibrary() {
  const { research, queue } = useGame();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [jobDomainFilter, setJobDomainFilter] = useState<string>("all");
  const [unitDomainFilter, setUnitDomainFilter] = useState<string>("all");

  const filteredResearch = useMemo(
    () => RESEARCH_PROGRAM_LIBRARY_240.filter((entry) => matchesEntry(entry, query, categoryFilter)),
    [categoryFilter, query],
  );

  const filteredTechnology = useMemo(
    () => TECHNOLOGY_SYSTEM_LIBRARY_240.filter((entry) => matchesEntry(entry, query, categoryFilter)),
    [categoryFilter, query],
  );

  const filteredJobs = useMemo(
    () => ALL_KNOWLEDGE_JOBS.filter((job) => matchesJob(job, query, jobDomainFilter)),
    [jobDomainFilter, query],
  );

  const filteredUnits = useMemo(
    () => KNOWLEDGE_SUPPORT_UNITS.filter((unit) => matchesUnit(unit, query, unitDomainFilter)),
    [query, unitDomainFilter],
  );

  const categoryCoverage = useMemo(
    () =>
      RESEARCH_TECH_CATEGORIES.map((category) => {
        const researchCount = RESEARCH_PROGRAM_LIBRARY_240.filter((entry) => entry.category === category.id).length;
        const technologyCount = TECHNOLOGY_SYSTEM_LIBRARY_240.filter((entry) => entry.category === category.id).length;
        const researchJobs = getJobCoverageForCategory("research", category.id);
        const technologyJobs = getJobCoverageForCategory("technology", category.id);
        const researchUnits = getUnitCoverageForCategory("research", category.id);
        const technologyUnits = getUnitCoverageForCategory("technology", category.id);

        return {
          ...category,
          researchCount,
          technologyCount,
          totalCoverage: researchCount + technologyCount,
          jobCoverage: researchJobs.length + technologyJobs.length,
          unitCoverage: researchUnits.length + technologyUnits.length,
        };
      }),
    [],
  );

  const highlightResearch = filteredResearch[0] ?? RESEARCH_PROGRAM_LIBRARY_240[0];
  const highlightTechnology = filteredTechnology[0] ?? TECHNOLOGY_SYSTEM_LIBRARY_240[0];
  const highlightJob = filteredJobs[0] ?? RESEARCH_JOB_SYSTEMS[0] ?? TECHNOLOGY_JOB_SYSTEMS[0];
  const highlightUnit = filteredUnits[0] ?? KNOWLEDGE_SUPPORT_UNITS[0];
  const activeResearchCount = queue.filter((item) => item.type === "research").length;
  const completedTechCount = TECHS.filter((tech) => (research[tech.id] || 0) > 0).length;
  const availableTechCount = TECHS.filter((tech) =>
    (tech.requirements || []).every((requirement) => (research[requirement] || 0) > 0),
  ).length;
  const masteryTracksCovered = categoryCoverage.filter((category) => category.jobCoverage > 0 && category.unitCoverage > 0).length;
  const topSynergyCategories = [...categoryCoverage]
    .sort((a, b) => (b.jobCoverage + b.unitCoverage + b.totalCoverage) - (a.jobCoverage + a.unitCoverage + a.totalCoverage))
    .slice(0, 3);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/nebula.png" alt="Knowledge" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-indigo-950/65 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/research/computing.png" alt="Knowledge" className="w-20 h-20 rounded-xl object-cover ring-2 ring-indigo-400/60 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Knowledge Library</h2>
              <p className="text-indigo-300 font-rajdhani text-lg">240 research programs, 240 technology systems, staffing jobs, and specialist units.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Research</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">
                  {KNOWLEDGE_OPERATIONS_META.researchPrograms}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Technology</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">
                  {KNOWLEDGE_OPERATIONS_META.technologySystems}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Jobs</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">
                  {KNOWLEDGE_OPERATIONS_META.researchJobs + KNOWLEDGE_OPERATIONS_META.technologyJobs}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Units</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">
                  {KNOWLEDGE_OPERATIONS_META.supportUnits}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-orbitron text-slate-900">
              <Workflow className="h-5 w-5 text-primary" />
              Knowledge Bridge
            </CardTitle>
            <CardDescription>
              Use the library as the planning layer between doctrine, active research execution, and prerequisite routing through the full technology tree.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Active Research</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{activeResearchCount}</div>
                <div className="text-sm text-slate-500">Queue items feeding the hub right now</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Completed Tech</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{completedTechCount}</div>
                <div className="text-sm text-slate-500">Unlocked technologies tracked from the library</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Available Now</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{availableTechCount}</div>
                <div className="text-sm text-slate-500">Research options with prerequisites satisfied</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Mastery Tracks</div>
                <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{masteryTracksCovered}</div>
                <div className="text-sm text-slate-500">Category bands with full staffing and unit support</div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_1.2fr_1fr]">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <FlaskConical className="h-4 w-4" />
                  Research Hub Tie-In
                </div>
                <div className="mt-3 text-xl font-orbitron text-slate-900">Move from doctrine to active projects</div>
                <p className="mt-2 text-sm text-slate-600">
                  Use the Knowledge Library to identify category fit, then jump into the Research Hub to start or queue the most relevant program paths.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Badge className="bg-emerald-100 text-emerald-900">Programs {filteredResearch.length}</Badge>
                  <Badge className="bg-emerald-100 text-emerald-900">Queue {activeResearchCount}</Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/research">
                    <Button className="gap-2">
                      Open Research Hub
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/research-lab">
                    <Button variant="outline" className="gap-2">
                      Research Management
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  <GraduationCap className="h-4 w-4" />
                  Technology Tree Tie-In
                </div>
                <div className="mt-3 text-xl font-orbitron text-slate-900">Turn category study into prerequisite routing</div>
                <p className="mt-2 text-sm text-slate-600">
                  After using the library to compare class tiers and synergies, route into the Technology Tree to see live unlock states, missing requirements, and next research branches.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Badge className="bg-blue-100 text-blue-900">Completed {completedTechCount}</Badge>
                  <Badge className="bg-blue-100 text-blue-900">Available {availableTechCount}</Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/technology-tree">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                      Open Technology Tree
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  <Sparkles className="h-4 w-4" />
                  Cross-Discipline Synergy
                </div>
                <div className="mt-4 space-y-3">
                  {topSynergyCategories.map((category) => (
                    <div key={category.id} className="rounded-xl border border-white bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-slate-900">{category.name}</div>
                        <Badge variant="outline">{category.totalCoverage}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Jobs {category.jobCoverage} • Units {category.unitCoverage} • Research {category.researchCount} • Technology {category.technologyCount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="grid gap-4 p-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Search className="h-4 w-4" />
                Search
              </label>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search names, categories, functions, effects, or tags..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Filter className="h-4 w-4" />
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="all">All categories</option>
                {RESEARCH_TECH_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Job Domain</label>
                <select
                  value={jobDomainFilter}
                  onChange={(event) => setJobDomainFilter(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="all">All jobs</option>
                  <option value="research">Research jobs</option>
                  <option value="technology">Technology jobs</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Unit Domain</label>
                <select
                  value={unitDomainFilter}
                  onChange={(event) => setUnitDomainFilter(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="all">All units</option>
                  <option value="research">Research units</option>
                  <option value="technology">Technology units</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 border border-slate-200 bg-white p-2 shadow-sm md:grid-cols-5">
            <TabsTrigger value="overview" className="font-orbitron">
              <Sparkles className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="research" className="font-orbitron">
              <Microscope className="mr-2 h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger value="technology" className="font-orbitron">
              <Cpu className="mr-2 h-4 w-4" />
              Technology
            </TabsTrigger>
            <TabsTrigger value="jobs" className="font-orbitron">
              <BriefcaseBusiness className="mr-2 h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="units" className="font-orbitron">
              <Users className="mr-2 h-4 w-4" />
              Units
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-orbitron text-slate-900">Research to Technology Workflow</CardTitle>
                  <CardDescription>
                    Study mastery tracks here, launch active work from the Research Hub, and validate dependencies through the Technology Tree.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Library
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Compare mastery tracks, class tiers, staffing layers, and cross-discipline coverage.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Beaker className="h-4 w-4 text-emerald-600" />
                      Research Hub
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Convert those insights into queued projects, live research priorities, and lab execution.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      Technology Tree
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Check prerequisites, unlocked branches, and the next best chain for long-term progression.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-orbitron text-slate-900">Quick Routes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/research">
                    <Button variant="outline" className="w-full justify-between">
                      Research Hub
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/technology-tree">
                    <Button variant="outline" className="w-full justify-between">
                      Technology Tree
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/research-analytics">
                    <Button variant="outline" className="w-full justify-between">
                      Research Analytics
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="border-slate-200 bg-white shadow-sm xl:col-span-2">
                <CardHeader>
                  <CardTitle className="font-orbitron text-slate-900">Category Coverage</CardTitle>
                  <CardDescription>
                    Every research and technology branch now has generated programs, staffing coverage, and specialist support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {categoryCoverage.map((category) => (
                    <div key={category.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-slate-900">{category.name}</div>
                          <div className="mt-1 text-xs text-slate-500">{category.description}</div>
                        </div>
                        <Badge variant="outline">{category.totalCoverage}</Badge>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Research</span>
                          <span>{category.researchCount}</span>
                        </div>
                        <Progress value={(category.researchCount / 20) * 100} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Technology</span>
                          <span>{category.technologyCount}</span>
                        </div>
                        <Progress value={(category.technologyCount / 20) * 100} className="h-2" />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <Badge className="bg-primary/10 text-primary">Jobs {category.jobCoverage}</Badge>
                        <Badge className="bg-emerald-100 text-emerald-900">Units {category.unitCoverage}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron text-slate-900">
                      <Atom className="h-5 w-5 text-primary" />
                      Research Logic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <p>{highlightResearch?.mechanics.primaryLoop}</p>
                    <p>{highlightResearch?.mechanics.activeFunction}</p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      {highlightResearch?.mechanics.gameplayEffect}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron text-slate-900">
                      <Wrench className="h-5 w-5 text-primary" />
                      Technology Logic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <p>{highlightTechnology?.mechanics.primaryLoop}</p>
                    <p>{highlightTechnology?.mechanics.activeFunction}</p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      {highlightTechnology?.mechanics.gameplayEffect}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron text-slate-900">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Workforce Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <p>{highlightJob?.summary}</p>
                    <p>{highlightUnit?.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        Research jobs {RESEARCH_JOB_SYSTEMS.length}
                      </Badge>
                      <Badge variant="secondary">
                        Technology jobs {TECHNOLOGY_JOB_SYSTEMS.length}
                      </Badge>
                      <Badge variant="secondary">
                        Support units {KNOWLEDGE_SUPPORT_UNITS.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Showing {Math.min(filteredResearch.length, MAX_VISIBLE_ENTRIES)} of {filteredResearch.length} filtered research programs.</span>
              <span>Total catalog: {RESEARCH_PROGRAM_LIBRARY_240.length}</span>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredResearch.slice(0, MAX_VISIBLE_ENTRIES).map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technology" className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Showing {Math.min(filteredTechnology.length, MAX_VISIBLE_ENTRIES)} of {filteredTechnology.length} filtered technology systems.</span>
              <span>Total catalog: {TECHNOLOGY_SYSTEM_LIBRARY_240.length}</span>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredTechnology.slice(0, MAX_VISIBLE_ENTRIES).map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Showing {filteredJobs.length} staffing roles.</span>
              <span>Total job systems: {ALL_KNOWLEDGE_JOBS.length}</span>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="units" className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Showing {filteredUnits.length} specialist support units.</span>
              <span>Total support units: {KNOWLEDGE_SUPPORT_UNITS.length}</span>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredUnits.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
