import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard, Pickaxe, Factory, FlaskConical, Rocket, Send, Globe,
  Zap, Database, Box, Gem, User, Landmark, Mail, Shield, Hexagon, ShoppingBag, Orbit, Sword, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Overview" },
  { href: "/resources", icon: Pickaxe, label: "Resources" },
  { href: "/facilities", icon: Factory, label: "Facilities" },
  { href: "/research", icon: FlaskConical, label: "Research" },
  { href: "/colonies", icon: Hexagon, label: "Colonies" },
  { href: "/blueprints", icon: Factory, label: "Blueprints" },
  { href: "/shipyard", icon: Rocket, label: "Shipyard" },
  { href: "/fleet", icon: Send, label: "Fleet" },
  { href: "/combat", icon: Sword, label: "Combat" },
  { href: "/battle-logs", icon: Eye, label: "Battle Logs" },
  { href: "/exploration", icon: Orbit, label: "Exploration" },
  { href: "/galaxy", icon: Hexagon, label: "Galaxy" },
  { href: "/interstellar", icon: Orbit, label: "Interstellar" },
  { href: "/commander", icon: User, label: "Commander" },
  { href: "/government", icon: Landmark, label: "Government" },
  { href: "/alliance", icon: Shield, label: "Alliance" },
  { href: "/market", icon: ShoppingBag, label: "Market" },
  { href: "/messages", icon: Mail, label: "Messages" },
  { href: "/artifacts", icon: Gem, label: "Artifacts" },
];

export default function Navigation() {
  const [location] = useLocation();

  const groupedLinks = [
    {
      title: "Empire Core",
      items: navItems.filter((item) => ["/", "/resources", "/facilities", "/research", "/colonies", "/blueprints"].includes(item.href)),
    },
    {
      title: "Military",
      items: navItems.filter((item) => ["/shipyard", "/fleet", "/combat", "/battle-logs"].includes(item.href)),
    },
    {
      title: "Galaxy & Social",
      items: navItems.filter((item) => ["/exploration", "/galaxy", "/interstellar", "/commander", "/government", "/alliance", "/market", "/messages", "/artifacts"].includes(item.href)),
    },
  ];

  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-4">
        <div className="text-xs uppercase font-bold text-slate-600 mb-3 tracking-widest">Quick Links</div>

        <div className="space-y-4">
          {groupedLinks.map((section) => (
            <div key={section.title}>
              <div className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">{section.title}</div>
              <div className="grid grid-cols-4 gap-2">
                {section.items.map(item => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={location === item.href ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      title={item.label}
                      data-testid={`nav-button-${item.label.toLowerCase()}`}
                    >
                      <item.icon className="w-4 h-4" />
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <div className="font-semibold text-slate-700 mb-1">Navigation Tips</div>
          <div>• Highlighted icon indicates the current active route.</div>
          <div>• Use Military links for fleet, combat, and battle log subpages.</div>
          <div>• Use Galaxy & Social for diplomacy, market, and communication pages.</div>
        </div>
      </CardContent>
    </Card>
  );
}
