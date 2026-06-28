import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Rocket, Shield, Globe, Users, Swords, FlaskConical, ArrowRight, Star, Menu, X, ChevronRight, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/galaxy", label: "Galaxy Map" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

const features = [
  {
    icon: Globe,
    title: "Colony Management",
    description: "Construct mines, shipyards, research labs, and defense grids. Upgrade facilities to unlock new capabilities across multiple worlds.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Swords,
    title: "Combat Mechanics",
    description: "Command 6 distinct ship classes. Design fleet formations, launch expeditions, and coordinate joint attacks with allies.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Alliance System",
    description: "Form alliances, negotiate treaties, and coordinate diplomacy. Rise through the ranks together and dominate the galaxy.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FlaskConical,
    title: "Research & Technology",
    description: "Unlock an extensive tech tree spanning energy, propulsion, weapons, and exotic technologies. Each discovery opens new possibilities.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Dynamic Combat",
    description: "Real-time battle simulations with formations, special abilities, and tactical decisions. Every engagement matters.",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Star,
    title: "Cross-Server Wars",
    description: "Battle thousands of players across 30 universes and 300 realm systems. Seasonal events and world bosses keep the universe dynamic.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const stats = [
  { label: "Active Players", value: "50,000+" },
  { label: "Universes", value: "30" },
  { label: "Realm Systems", value: "300" },
  { label: "Ship Classes", value: "6" },
];

export default function Index() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-orbitron font-bold text-lg text-slate-900 hidden sm:block">
                UNIVERSE CIVILIZATION
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setLocation("/auth")}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => setLocation("/auth")}>
                Register
              </Button>
            </div>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-slate-600 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <Button variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); setLocation("/auth"); }}>
                Sign In
              </Button>
              <Button className="w-full" onClick={() => { setMobileMenuOpen(false); setLocation("/auth"); }}>
                Register
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/hero-bg.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-50" />
          </div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-blue-400/50 text-blue-300 bg-blue-900/30 backdrop-blur-sm">
                <Star className="w-4 h-4 mr-1" /> Real-Time MMORPG Space Strategy
              </Badge>

              <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6 leading-tight drop-shadow-lg">
                UNIVERSE
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  CIVILIZATION
                </span>
                <br />
                EMPIRES AT WAR
              </h1>

              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-rajdhani drop-shadow-md">
                Forge your dynasty across the stars. Build empires, command armadas, research ancient
                technologies, and wage epic wars across 30 universes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="px-10 py-6 text-lg font-bold rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={() => setLocation("/auth")}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  ENTER THE UNIVERSE
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-6 text-lg font-bold rounded-full border-slate-400 text-slate-300 hover:bg-slate-700/50"
                  onClick={() => setLocation("/about")}
                >
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 shadow-sm">
                  <div className="text-2xl md:text-3xl font-orbitron font-bold text-blue-400">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-slate-900 mb-4">
                Game Features
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-rajdhani">
                Everything you need to build, conquer, and dominate the galaxy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-white border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group">
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm",
                      feature.gradient,
                    )}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-orbitron font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-center shadow-xl">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">Get Started</Badge>
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
                Ready to Conquer the Galaxy?
              </h2>
              <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8 font-rajdhani">
                Join thousands of commanders building their empires across 30 universes. Your civilization awaits.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 h-12"
                />
                <Button className="h-12 px-8 whitespace-nowrap" onClick={() => setLocation("/auth")}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50/50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-orbitron font-bold text-sm text-slate-900">UNIVERSE CIVILIZATION</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A 4X space strategy MMORPG where you build your empire, command fleets, and conquer the galaxy.
                </p>
              </div>
              <div>
                <h4 className="font-orbitron font-bold text-xs text-slate-900 uppercase tracking-widest mb-4">Game</h4>
                <ul className="space-y-2">
                  {["Features", "Galaxy Map", "Races", "Units", "Research"].map((item) => (
                    <li key={item}>
                      <Link href="/about" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-orbitron font-bold text-xs text-slate-900 uppercase tracking-widest mb-4">Community</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                      <Users className="w-3 h-3" /> Forums
                    </a>
                  </li>
                  <li>
                    <Link href="/about" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-orbitron font-bold text-xs text-slate-900 uppercase tracking-widest mb-4">Support</h4>
                <ul className="space-y-2">
                  {["Help Center", "Documentation", "API", "Status"].map((item) => (
                    <li key={item}>
                      <Link href="/about" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              &copy; 2026 Universe Civilization: Empires at War. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacy</Link>
              <Link href="/about" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
