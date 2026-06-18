import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { PlanetDossier } from "@/lib/planetDossier";
import {
  Activity,
  Atom,
  Biohazard,
  CircleGauge,
  Cloud,
  Compass,
  Database,
  Diamond,
  Droplets,
  Factory,
  Gauge,
  Globe2,
  Leaf,
  Magnet,
  Mountain,
  Orbit,
  Radio,
  Shield,
  Sparkles,
  ThermometerSun,
  Timer,
  Users,
  Waves,
  Wind,
} from "lucide-react";

interface PlanetDossierPanelProps {
  dossier: PlanetDossier;
  planetName: string;
}

function Metric({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Globe2;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--sd-panel-border)] bg-[linear-gradient(180deg,var(--sd-panel-top),var(--sd-panel-bottom))] p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--sd-text-secondary)]">
        <Icon className="h-4 w-4 text-[var(--sd-text-highlight)]" />
        {label}
      </div>
      <div className="mt-2 font-orbitron text-xl font-bold text-[var(--sd-text-primary)]">{value}</div>
      {helper ? <p className="mt-1 text-xs text-[var(--sd-text-secondary)]">{helper}</p> : null}
    </div>
  );
}

function RatedMetric({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="space-y-2 rounded-xl border border-[var(--sd-panel-border)] p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-[var(--sd-text-primary)]">{label}</span>
        <span className="font-orbitron font-bold text-[var(--sd-text-highlight)]">{value}</span>
      </div>
      <Progress value={value} className="h-2" />
      <p className="text-xs text-[var(--sd-text-secondary)]">{helper}</p>
    </div>
  );
}

export default function PlanetDossierPanel({ dossier, planetName }: PlanetDossierPanelProps) {
  const { archetype, status, physical, atmosphere, biosphere, geology, colony } = dossier;

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-[var(--sd-panel-border)] bg-[linear-gradient(135deg,var(--sd-panel-top),var(--sd-panel-bottom))]">
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--sd-text-highlight)]">Planetary Intelligence Dossier</div>
            <h2 className="mt-2 font-orbitron text-2xl font-bold text-[var(--sd-text-primary)]">{planetName} · {archetype.name}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--sd-text-secondary)]">{archetype.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{archetype.family}</Badge>
              <Badge variant="outline">{archetype.subType}</Badge>
              <Badge variant="outline">{archetype.class} / {archetype.subClass}</Badge>
              <Badge variant="secondary">{archetype.rarity}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border border-[var(--sd-panel-border)] p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--sd-text-secondary)]">Condition</div>
              <div className="mt-1 font-orbitron text-xl font-bold text-[var(--sd-text-highlight)]">{status.condition}</div>
            </div>
            <div className="rounded-xl border border-[var(--sd-panel-border)] p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--sd-text-secondary)]">Threat</div>
              <div className="mt-1 font-orbitron text-xl font-bold text-[var(--sd-text-primary)]">{status.threatLevel}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={CircleGauge} label="Colony Readiness" value={`${status.colonyReadiness}%`} helper="Settlement and long-term support viability." />
        <Metric icon={Compass} label="Strategic Value" value={`${status.strategicValue}/100`} helper="Command priority and expansion value." />
        <Metric icon={Radio} label="Survey Confidence" value={`${status.surveyConfidence}%`} helper="Reliability of current orbital survey data." />
        <Metric icon={Factory} label="Development" value={`${status.developmentLevel}%`} helper="Infrastructure and defensive maturity." />
      </div>

      <Card className="border-[var(--sd-panel-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-[var(--sd-text-highlight)]" /> Core Attributes and Sub-Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dossier.attributes.map((attribute) => <RatedMetric key={attribute.label} {...attribute} helper={attribute.description} />)}
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={["physical", "atmosphere", "biosphere"]} className="rounded-2xl border border-[var(--sd-panel-border)] px-5">
        <AccordionItem value="physical">
          <AccordionTrigger><span className="flex items-center gap-2 font-orbitron"><Orbit className="h-4 w-4" /> Physical and Orbital Profile</span></AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Metric icon={Globe2} label="Diameter" value={`${physical.diameter.toLocaleString()} km`} />
              <Metric icon={Atom} label="Mass" value={`${physical.mass} Earths`} />
              <Metric icon={Gauge} label="Surface Gravity" value={`${physical.gravity} G`} />
              <Metric icon={Compass} label="Axial Tilt" value={`${physical.axialTilt}°`} />
              <Metric icon={Timer} label="Day Length" value={`${physical.dayLength} hours`} />
              <Metric icon={Orbit} label="Orbital Year" value={`${physical.yearLength.toLocaleString()} days`} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="atmosphere">
          <AccordionTrigger><span className="flex items-center gap-2 font-orbitron"><Wind className="h-4 w-4" /> Atmosphere and Climate</span></AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric icon={Cloud} label="Pressure" value={`${atmosphere.pressure} atm`} />
                <Metric icon={Shield} label="Breathability" value={atmosphere.breathability} />
                <Metric icon={ThermometerSun} label="Average Climate" value={`${archetype.stats.avgTemp}°C`} />
                <Metric icon={Waves} label="Storm Intensity" value={`${geology.stormIntensity}/100`} />
              </div>
              <div className="rounded-xl border border-[var(--sd-panel-border)] p-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--sd-text-secondary)]">Atmospheric Composition</div>
                <div className="mt-4 space-y-3">
                  {atmosphere.composition.length ? atmosphere.composition.map((gas) => (
                    <div key={gas.gas}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="capitalize">{gas.gas}</span>
                        <span className="font-mono">{gas.percentage}%</span>
                      </div>
                      <Progress value={gas.percentage} className="h-1.5" />
                    </div>
                  )) : <p className="text-sm text-[var(--sd-text-secondary)]">No measurable atmosphere.</p>}
                </div>
                <p className="mt-4 text-xs leading-5 text-[var(--sd-text-secondary)]">{atmosphere.climate}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="biosphere">
          <AccordionTrigger><span className="flex items-center gap-2 font-orbitron"><Leaf className="h-4 w-4" /> Biosphere and Habitability</span></AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={Sparkles} label="Habitability" value={`${biosphere.habitability}%`} />
              <Metric icon={Droplets} label="Water Coverage" value={`${biosphere.waterCoverage}%`} />
              <Metric icon={Leaf} label="Biodiversity" value={`${biosphere.biodiversity}/100`} />
              <Metric icon={Database} label="Biological Resources" value={`${biosphere.biologicalResources}/100`} />
            </div>
            <div className="mt-4 rounded-xl border border-[var(--sd-panel-border)] p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--sd-text-secondary)]">Native Life Intelligence</div>
              <p className="mt-2 text-sm text-[var(--sd-text-primary)]">{biosphere.lifeforms}</p>
              <p className="mt-2 text-xs text-[var(--sd-text-secondary)]">{archetype.geography}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="geology">
          <AccordionTrigger><span className="flex items-center gap-2 font-orbitron"><Mountain className="h-4 w-4" /> Geology, Resources, and Hazards</span></AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={Mountain} label="Metal Richness" value={`${geology.metalRichness}/100`} />
              <Metric icon={Diamond} label="Crystal Richness" value={`${geology.crystalRichness}/100`} />
              <Metric icon={Droplets} label="Deuterium Richness" value={`${geology.deuteriumRichness}/100`} />
              <Metric icon={Activity} label="Seismic Activity" value={`${geology.seismicActivity}/100`} />
              <Metric icon={Biohazard} label="Radioactivity" value={`${geology.radioactivity}/100`} />
              <Metric icon={Magnet} label="Magnetic Field" value={`${geology.magneticField}/100`} />
              <Metric icon={Wind} label="Storm Intensity" value={`${geology.stormIntensity}/100`} />
              <Metric icon={Database} label="Discovery Value" value={archetype.discoveryValue.toLocaleString()} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colony">
          <AccordionTrigger><span className="flex items-center gap-2 font-orbitron"><Users className="h-4 w-4" /> Colony Capacity and Operations</span></AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Metric icon={Users} label="Population Capacity" value={colony.populationCapacity.toLocaleString()} />
              <Metric icon={CircleGauge} label="Population Utilization" value={`${colony.populationUtilization}%`} />
              <Metric icon={Factory} label="Infrastructure" value={`${colony.infrastructure}/100`} />
              <Metric icon={Shield} label="Defense Coverage" value={`${colony.defenseCoverage}/100`} />
              <Metric icon={Sparkles} label="Production Multiplier" value={`${colony.productionMultiplier}×`} />
              <Metric icon={Globe2} label="Colony Regions" value={String(colony.possibleColonies)} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="intel">
          <AccordionTrigger><span className="flex items-center gap-2 font-orbitron"><Biohazard className="h-4 w-4" /> Hazards, Opportunities, and Special Features</span></AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { title: "Known Hazards", items: archetype.dangers || [], tone: "text-red-600" },
                { title: "Strategic Opportunities", items: archetype.opportunities || [], tone: "text-emerald-600" },
                { title: "Special Features", items: archetype.specialFeatures || archetype.characteristics, tone: "text-violet-600" },
              ].map((group) => (
                <div key={group.title} className="rounded-xl border border-[var(--sd-panel-border)] p-4">
                  <div className={`text-xs font-bold uppercase tracking-[0.18em] ${group.tone}`}>{group.title}</div>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--sd-text-secondary)]">
                    {group.items.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
