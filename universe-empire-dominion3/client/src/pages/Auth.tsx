import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import GameLogo from "@/components/GameLogo";
import {
  Rocket, Info, Eye, EyeOff, Copy, Check, Github, Globe2,
  Activity, Server, Gauge, ShieldCheck, ShieldAlert, AlertTriangle,
  Sparkles, Swords, Target, Trophy,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BUILD_INFO, getDisplayVersion } from "@shared/config/buildConfig";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type PublicHealthCheck = { status: "ok" | "warning" | "critical"; value: number; threshold: number; message: string; lastChecked: number };
type PublicHealthResponse = { success: boolean; status: "healthy" | "degraded" | "unhealthy"; score: number; timestamp: number; checks?: Record<string, PublicHealthCheck>; message?: string };

function getHealthBadgeClass(s: PublicHealthResponse["status"]) {
  if (s === "healthy") return "border-emerald-300 bg-emerald-50 text-emerald-700";
  if (s === "degraded") return "border-amber-300 bg-amber-50 text-amber-700";
  return "border-red-300 bg-red-50 text-red-700";
}
function getHealthIcon(s: PublicHealthResponse["status"]) {
  if (s === "healthy") return ShieldCheck;
  if (s === "degraded") return AlertTriangle;
  return ShieldAlert;
}
function formatHealthStatus(s: PublicHealthResponse["status"]) {
  if (s === "healthy") return "Healthy";
  if (s === "degraded") return "Degraded";
  return "Unhealthy";
}
function formatTimeAgo(ts?: number) {
  if (!ts) return "Awaiting telemetry";
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function StarfieldBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="starfield-layer" />
      <div className="nebula-layer" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
    </div>
  );
}

function ParticleEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 animate-particle-float"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${6 + Math.random() * 6}s` }} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={`s-${i}`} className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-0 animate-star-twinkle"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }} />
      ))}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-nebula-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-nebula-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/3 rounded-full blur-[100px] animate-nebula-pulse-slow" />
    </div>
  );
}

function OrbitSpinner() {
  return (
    <div className="relative w-5 h-5">
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
      <div className="absolute inset-0.5 rounded-full border border-transparent border-t-blue-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
    </div>
  );
}

const FEATURES = [
  { icon: Swords, title: "4X Strategy" },
  { icon: Target, title: "Real-time Combat" },
  { icon: Globe2, title: "Alliance Wars" },
  { icon: Trophy, title: "Season Pass" },
];

export default function Auth() {
  const { isLoading, login } = useGame();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const buildChannel = BUILD_INFO.buildChannel;

  const { data: healthData } = useQuery<PublicHealthResponse>({
    queryKey: ["/api/status/health", "landing"],
    queryFn: async () => {
      const response = await fetch("/api/status/health");
      const payload = (await response.json().catch(() => null)) as PublicHealthResponse | null;
      return payload && typeof payload === "object" ? payload : { success: false, status: "unhealthy" as const, score: 0, timestamp: Date.now(), checks: {}, message: "Health telemetry unavailable" };
    },
    refetchInterval: 30000, staleTime: 15000, retry: false,
  });

  const healthChecks = Object.entries(healthData?.checks || {}).slice(0, 4);
  const HealthIcon = getHealthIcon(healthData?.status || "unhealthy");

  useEffect(() => {
    const su = localStorage.getItem("stellar_username");
    const sp = localStorage.getItem("stellar_password");
    if (su) setUsername(su);
    if (sp) setPassword(sp);
  }, []);

  const clearCredentials = () => { localStorage.removeItem("stellar_username"); localStorage.removeItem("stellar_password"); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body: Record<string, string> = { username: username.trim(), password };
      if (!isLogin) {
        body.email = email.trim();
        body.firstName = firstName.trim() || username.trim();
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Authentication failed");
        setSubmitting(false);
        return;
      }
      localStorage.setItem("stellar_username", username.trim());
      localStorage.setItem("stellar_password", password);
      login();
    } catch {
      setError("Connection error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!username.trim()) { setError("Username is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username.trim(), email: email.trim() }), credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Password reset failed"); setSubmitting(false); return; }
      setTempPassword(data.temporaryPassword); setSubmitting(false);
    } catch (err) { setError("Failed to reset password. Please try again."); setSubmitting(false); }
  };

  const copyPassword = () => { navigator.clipboard.writeText(tempPassword); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      <StarfieldBackground />
      <ParticleEffect />

      <div className="relative z-10 flex flex-col items-center pt-20 pb-8 px-6">
        <div className="text-center space-y-5 mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
            <GameLogo size="xl" animated showText className="relative drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
          </div>
          <p className="text-lg text-slate-300 font-rajdhani font-medium">Command Your Empire. Shape the Galaxy.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {healthData?.status && (
              <Badge className={cn("border text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1", getHealthBadgeClass(healthData.status))} data-testid="badge-health-status">
                <HealthIcon className="w-3 h-3 mr-1.5" />{formatHealthStatus(healthData.status)}
              </Badge>
            )}
            <Badge variant="outline" className="border-slate-600 text-slate-400 bg-slate-800/50 text-[11px] font-bold tracking-widest uppercase px-3 py-1">
              {getDisplayVersion()}
            </Badge>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/50 p-8">
            <div className="text-center mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider">{isForgot ? "Account Recovery" : isLogin ? "Welcome Back, Commander" : "Join the Dominion"}</h2>
              <p className="text-sm text-slate-400 mt-2">{isForgot ? "Reset your access credentials" : isLogin ? "Enter your credentials to command your fleet" : "Create an account to begin your conquest"}</p>
            </div>

            {tempPassword ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-3">
                <div className="flex gap-2 items-start">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div><p className="font-semibold text-emerald-300">Password Reset Successful!</p><p className="text-sm text-emerald-400/80 mt-1">Your temporary password is:</p></div>
                </div>
                <div className="bg-slate-900/50 border border-emerald-500/20 p-3 rounded flex items-center justify-between font-mono text-sm">
                  <span className="text-white break-all">{tempPassword}</span>
                  <button type="button" onClick={copyPassword} className="ml-2 shrink-0 p-1 hover:bg-slate-800 rounded transition-colors" data-testid="button-copy-password">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
                <p className="text-xs text-emerald-400/70">Use this password to login, then change it in your account settings.</p>
                <button type="button" onClick={() => { setIsForgot(false); setTempPassword(""); setUsername(""); setEmail(""); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/25" data-testid="button-back-to-login">
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={isForgot ? handleForgotPassword : handleSubmit} className="space-y-5">
                  {isLogin && !isForgot && (
                    <div className="space-y-3">
                      <Button type="button" onClick={() => login()} variant="outline" className="w-full border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 font-semibold tracking-wide" data-testid="button-demo-login" disabled={submitting}>
                        <Sparkles className="w-4 h-4 mr-2" /> Try Demo Account
                      </Button>
                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                        <div className="flex items-start gap-2 text-amber-300">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Administrator Access</p>
                            <p className="text-xs text-amber-300/70">Founder, owner, and dev-admin accounts use the dedicated control login.</p>
                            <Link href="/admin-login"><Button type="button" variant="outline" size="sm" className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20" data-testid="button-admin-login-link">Open Admin Login</Button></Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-slate-300 text-sm font-medium">Username</Label>
                    <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username (min 3 characters)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/25 h-11"
                      data-testid="input-username" disabled={submitting} required minLength={3} autoComplete="username" />
                  </div>

                  {isForgot && (
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/25 h-11"
                        data-testid="input-email" disabled={submitting} required />
                    </div>
                  )}

                  {!isLogin && !isForgot && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/25 h-11"
                          data-testid="input-email" disabled={submitting} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-slate-300 text-sm font-medium">First Name (Optional)</Label>
                        <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/25 h-11"
                          data-testid="input-firstName" disabled={submitting} />
                      </div>
                    </>
                  )}

                  {!isForgot && (
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password (min 6 characters)"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-10 focus:border-cyan-500/50 focus:ring-cyan-500/25 h-11"
                          data-testid="input-password" disabled={submitting} required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={submitting}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors disabled:opacity-50"
                          data-testid="button-toggle-password" title={showPassword ? "Hide password" : "Show password"}>
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isLogin && !isForgot && (
                    <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="terms-agree" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/25" disabled={submitting} />
                        <label htmlFor="terms-agree" className="text-xs text-slate-400 leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank">Terms of Service</Link>
                          {" "}and understand the rules governing gameplay, account usage, and conduct.
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="privacy-agree" checked={agreedToPrivacy} onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/25" disabled={submitting} />
                        <label htmlFor="privacy-agree" className="text-xs text-slate-400 leading-relaxed">
                          I have read and agree to the{" "}
                          <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank">Privacy Policy</Link>
                          {" "}and consent to the collection and use of my data as described.
                        </label>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-red-300 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-orbitron tracking-widest h-12 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]"
                    disabled={submitting || isLoading || (!isLogin && !isForgot && (!agreedToTerms || !agreedToPrivacy))} data-testid="button-submit-auth">
                    {submitting || isLoading ? (<div className="flex items-center gap-2"><OrbitSpinner /><span>PROCESSING</span></div>) : isForgot ? "RESET PASSWORD" : isLogin ? "ENTER GAME" : "CREATE ACCOUNT"}
                  </Button>
                </form>

                <div className="mt-6 space-y-3 text-center">
                  {isForgot ? (
                    <button type="button" onClick={() => { setIsForgot(false); setEmail(""); setError(""); }}
                      className="w-full text-sm text-slate-400 hover:text-white underline transition-colors" disabled={submitting} data-testid="button-back-forgot">Back to login</button>
                  ) : (
                    <>
                      <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }}
                        className="w-full text-sm text-slate-400 hover:text-white underline transition-colors" disabled={submitting} data-testid="button-toggle-auth">
                        {isLogin ? "Create new account" : "Already have an account? Sign in"}
                      </button>
                      <button type="button" onClick={() => { clearCredentials(); setUsername(""); setPassword(""); setError(""); }}
                        className="w-full text-xs text-slate-500 hover:text-slate-300 underline transition-colors" disabled={submitting} data-testid="button-clear-credentials">Clear saved credentials</button>
                      {isLogin && (
                        <button type="button" onClick={() => { setIsForgot(true); setError(""); setTempPassword(""); }}
                          className="w-full text-xs text-slate-500 hover:text-slate-300 underline transition-colors" disabled={submitting} data-testid="button-forgot-password">Forgot password?</button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2">
                <Info className="w-4 h-4" /> About Stellar Dominion
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-10 text-xs text-slate-400">
          {FEATURES.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-2"><Icon className="w-4 h-4 text-cyan-400" /><span>{title}</span></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 bg-slate-950/80 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider mb-3">SELECT YOUR REALM</h2>
          <p className="text-sm text-slate-400 mb-6">Explore the nine realms and choose your path</p>
          <Link href="/realms">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron tracking-widest px-8 py-6 text-lg shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02]">
              Browse Realms
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative z-10 bg-slate-900/50 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider mb-3">Server Status</h2>
            <p className="text-sm text-slate-400">Live public health telemetry for the command cluster</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Cluster Status</div>
                  <div className={cn("rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]", getHealthBadgeClass(healthData?.status || "unhealthy"))}>Score {healthData?.score ?? 0}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <HealthIcon className="h-5 w-5 text-white" />
                  <div className="font-orbitron text-lg font-bold text-white">{formatHealthStatus(healthData?.status || "unhealthy")}</div>
                </div>
                <p className="text-xs text-slate-400 leading-5">{healthData?.message || "Telemetry synced from public endpoints."}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">Status Poll</div>
                <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-400" /><div className="font-semibold text-white">{formatTimeAgo(healthData?.timestamp)}</div></div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">Universe Node</div>
                <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-400" /><div className="font-semibold text-white">{BUILD_INFO.universeId}</div></div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">Build Channel</div>
                <div className="flex items-center gap-2"><Server className="h-4 w-4 text-indigo-400" /><div className="font-semibold text-white">{buildChannel}</div></div>
              </CardContent>
            </Card>
          </div>

          {healthChecks.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {healthChecks.map(([key, check]) => (
                <Card key={key} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                      <Badge variant={check.status === "ok" ? "default" : check.status === "warning" ? "secondary" : "destructive"} className="text-[10px]">{check.status}</Badge>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{check.message}</div>
                    <div className="text-xs text-slate-400">Value {Math.round(check.value)} / Threshold {Math.round(check.threshold)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 bg-slate-950 border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <span className="font-orbitron font-bold text-sm text-white tracking-wide">{BUILD_INFO.appName}</span>
              <span className="text-xs text-slate-500">{getDisplayVersion()}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">{BUILD_INFO.buildName}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">{BUILD_INFO.buildChannel}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">Universe {BUILD_INFO.universeId}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/forums" className="hover:text-white transition-colors">Forums</Link>
              <a href={BUILD_INFO.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors">
                <Github className="w-3.5 h-3.5" /> {BUILD_INFO.devAlias}
              </a>
              <span className="text-slate-600">•</span>
              <span>Developer: {BUILD_INFO.devName}</span>
              <span className="text-slate-600">•</span>
              <a href={BUILD_INFO.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold" data-testid="link-auth-footer-publisher">{BUILD_INFO.devAlias}</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
