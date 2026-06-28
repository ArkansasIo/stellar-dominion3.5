import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Rocket,
  Shield,
  Info,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Github,
  FileText,
  Crown,
  Activity,
  Server,
  Gauge,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MENU_ASSETS } from "@shared/config";

const GAME_VERSION = "Alpha 1.5.0";
const UNIVERSE_ID = "Nexus-Alpha";
const TEMP_THEME_IMAGE = "/theme-temp.png";

type PublicHealthCheck = {
  status: "ok" | "warning" | "critical";
  value: number;
  threshold: number;
  message: string;
  lastChecked: number;
};

type PublicHealthResponse = {
  success: boolean;
  status: "healthy" | "degraded" | "unhealthy";
  score: number;
  timestamp: number;
  checks?: Record<string, PublicHealthCheck>;
  message?: string;
};

function getBuildChannel() {
  return import.meta.env.MODE === "production" ? "Production" : "Development";
}

function getHealthBadgeClass(status: PublicHealthResponse["status"]) {
  switch (status) {
    case "healthy":
      return "border-emerald-300 bg-emerald-50 text-emerald-700";
    case "degraded":
      return "border-amber-300 bg-amber-50 text-amber-700";
    default:
      return "border-red-300 bg-red-50 text-red-700";
  }
}

function getHealthIcon(status: PublicHealthResponse["status"]) {
  switch (status) {
    case "healthy":
      return ShieldCheck;
    case "degraded":
      return AlertTriangle;
    default:
      return ShieldAlert;
  }
}

function formatHealthStatus(status: PublicHealthResponse["status"]) {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "degraded":
      return "Degraded";
    default:
      return "Unhealthy";
  }
}

function formatTimeAgo(timestamp?: number) {
  if (!timestamp) return "Awaiting telemetry";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function Auth() {
  const { isLoading, login } = useGame();
  const queryClient = useQueryClient();
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
  const buildChannel = getBuildChannel();

  const { data: healthData } = useQuery<PublicHealthResponse>({
    queryKey: ["/api/status/health", "landing"],
    queryFn: async () => {
      const response = await fetch("/api/status/health");
      const payload = (await response.json().catch(() => null)) as PublicHealthResponse | null;

      if (payload && typeof payload === "object") {
        return payload;
      }

      return {
        success: false,
        status: "unhealthy",
        score: 0,
        timestamp: Date.now(),
        checks: {},
        message: "Health telemetry unavailable",
      } satisfies PublicHealthResponse;
    },
    refetchInterval: 30000,
    staleTime: 15000,
    retry: false,
  });

  const healthChecks = Object.entries(healthData?.checks || {}).slice(0, 4);
  const HealthIcon = getHealthIcon(healthData?.status || "unhealthy");

  useEffect(() => {
    const savedUsername = localStorage.getItem("stellar_username");
    const savedPassword = localStorage.getItem("stellar_password");
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const saveCredentials = (user: string, pass: string) => {
    localStorage.setItem("stellar_username", user);
    localStorage.setItem("stellar_password", pass);
  };

  const clearCredentials = () => {
    localStorage.removeItem("stellar_username");
    localStorage.removeItem("stellar_password");
  };

  const useDemoAccount = () => {
    saveCredentials("demo", "demo");
    setUsername("demo");
    setPassword("demo");
    login();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!isLogin) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email, firstName }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({ message: "Registration failed" }));
          setError(data.message);
          setSubmitting(false);
          return;
        }
      } catch (err) {
        setError("Registration failed: network error");
        setSubmitting(false);
        return;
      }
    }

    saveCredentials(username, password);
    setSubmitting(false);
    login();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setSubmitting(true);
    console.log("[AUTH] Attempting password reset for user:", username.trim());

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim() }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Password reset failed");
        setSubmitting(false);
        return;
      }

      console.log("[AUTH] Password reset successful:", data);
      setTempPassword(data.temporaryPassword);
      setSubmitting(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[AUTH] Password reset error:", errorMsg);
      setError("Failed to reset password. Please try again.");
      setSubmitting(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 pt-20 pb-14 relative overflow-hidden">
      <header className="fixed top-0 inset-x-0 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-sm z-30">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100">
              <a href="https://github.com/ArkansasIo/universe-empire-domions" target="_blank" rel="noopener noreferrer" data-testid="button-github-top-left">
                <Github className="w-4 h-4 mr-1" /> GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs text-cyan-700 border-cyan-300 hover:bg-cyan-50">
              <a href="https://github.com/ArkansasIo/stellar-dominion3" target="_blank" rel="noopener noreferrer" data-testid="button-stellar-dominion3-github">
                <Github className="w-4 h-4 mr-1" /> Stellar Dominion 3
              </a>
            </Button>
            <Rocket className="w-5 h-5 text-primary" />
            <span className="font-orbitron font-bold text-sm text-slate-900 tracking-wide">universe-empire-domions</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/forums"><Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900">Forums</Button></Link>
            <Link href="/about"><Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900">About</Button></Link>
            <Link href="/terms"><Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900">Terms</Button></Link>
            <Link href="/privacy"><Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900">Privacy</Button></Link>
          </div>
        </div>
      </header>
      {error?.includes("Database is temporarily") && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-yellow-900 border-2 border-yellow-500 text-yellow-100 px-4 py-3 rounded-lg shadow-xl">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Server Maintenance</p>
                <p className="text-xs mt-1">Game servers being refreshed. Try again in a moment.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid gap-4 xl:grid-cols-2 items-stretch">
          <Card className="flex min-h-0 w-full flex-col border border-slate-300 bg-white text-slate-900 shadow-lg transition-shadow duration-300 hover:shadow-xl xl:max-h-[calc(100vh-8rem)]">
            <CardHeader className="pb-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                <img
                  src={MENU_ASSETS.NAVIGATION.EXPLORATION.path}
                  alt="universe-empire-domions"
                  className="w-10 h-10 object-contain"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
                />
              </div>
              <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-slate-900 xl:text-[2rem]">universe-empire-domions</CardTitle>
              <CardDescription className="mt-2 font-rajdhani text-base font-medium text-slate-700">Command your fleet. Conquer the stars.</CardDescription>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto">
              {tempPassword ? (
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg space-y-3">
                  <div className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Password Reset Successful!</p>
                      <p className="text-sm text-green-700 mt-1">Your temporary password is:</p>
                    </div>
                  </div>
                  <div className="bg-white border border-green-200 p-3 rounded flex items-center justify-between font-mono text-sm">
                    <span className="text-slate-900 break-all">{tempPassword}</span>
                    <button type="button" onClick={copyPassword} className="ml-2 shrink-0 p-1 hover:bg-slate-100 rounded transition-colors" data-testid="button-copy-password">
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                    </button>
                  </div>
                  <p className="text-xs text-green-700">Use this password to login, then change it in your account settings.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setTempPassword("");
                      setUsername("");
                      setEmail("");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition-colors"
                    data-testid="button-back-to-login"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg text-xs text-slate-700 flex gap-2 items-start">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5 text-slate-600" />
                    <p>{isForgot ? "Enter your account details to reset your password." : (isLogin ? "Enter your credentials to command your fleet." : "Create an account to start your conquest.")}</p>
                  </div>

                  <form onSubmit={isForgot ? handleForgotPassword : handleSubmit} className="space-y-4">
                    {isLogin && !isForgot && (
                      <div className="space-y-3">
                        <Button type="button" onClick={useDemoAccount} variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-100" data-testid="button-demo-login" disabled={submitting}>
                          Use Demo Account (player1)
                        </Button>
                        <div className="rounded-lg border border-red-200 bg-red-50/80 p-3">
                          <div className="flex items-start gap-2 text-red-900">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                            <div className="space-y-2">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Administrator Access</p>
                              <p className="text-xs text-red-800">
                                Founder, owner, and dev-admin accounts use the dedicated control login.
                              </p>
                              <Link href="/admin-login">
                                <Button type="button" variant="outline" size="sm" className="border-red-300 bg-white text-red-900 hover:bg-red-100" data-testid="button-admin-login-link">
                                  Open Admin Login
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="username" className="text-slate-900 text-sm font-semibold">Username</Label>
                      <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username (min 3 characters)" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600" data-testid="input-username" disabled={submitting} required minLength={3} autoComplete="username" />
                    </div>

                    {isForgot && (
                      <div>
                        <Label htmlFor="email" className="text-slate-900 text-sm font-semibold">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600" data-testid="input-email" disabled={submitting} required />
                      </div>
                    )}

                    {!isLogin && !isForgot && (
                      <>
                        <div>
                          <Label htmlFor="email" className="text-slate-900 text-sm font-semibold">Email Address</Label>
                          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600" data-testid="input-email" disabled={submitting} required />
                        </div>
                        <div>
                          <Label htmlFor="firstName" className="text-slate-900 text-sm font-semibold">First Name (Optional)</Label>
                          <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600" data-testid="input-firstName" disabled={submitting} />
                        </div>
                      </>
                    )}

                    {!isForgot && (
                      <div>
                        <Label htmlFor="password" className="text-slate-900 text-sm font-semibold">Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password (min 6 characters)"
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 pr-10 focus:border-slate-600 focus:ring-slate-600"
                            data-testid="input-password"
                            disabled={submitting}
                            required
                            minLength={6}
                            autoComplete={isLogin ? "current-password" : "new-password"}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={submitting}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                            data-testid="button-toggle-password"
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {error && <div className="text-red-700 text-sm bg-red-50 border border-red-300 p-2 rounded">{error}</div>}

                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-12 shadow-lg transition-all hover:shadow-xl" disabled={submitting || isLoading} data-testid="button-submit-auth">
                      {submitting || isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          PROCESSING...
                        </>
                      ) : isForgot ? "RESET PASSWORD" : (isLogin ? "ENTER GAME" : "CREATE ACCOUNT")}
                    </Button>
                  </form>

                  <div className="space-y-3 pt-2">
                    {isForgot ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgot(false);
                          setEmail("");
                          setError("");
                        }}
                        className="w-full text-sm text-slate-700 hover:text-slate-900 underline transition-colors"
                        disabled={submitting}
                        data-testid="button-back-forgot"
                      >
                        Back to login
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                          }}
                          className="w-full text-sm text-slate-700 hover:text-slate-900 underline transition-colors"
                          disabled={submitting}
                          data-testid="button-toggle-auth"
                        >
                          {isLogin ? "Create new account" : "Already have an account? Sign in"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            clearCredentials();
                            setUsername("");
                            setPassword("");
                            setError("");
                          }}
                          className="w-full text-xs text-slate-500 hover:text-slate-700 underline transition-colors"
                          disabled={submitting}
                          data-testid="button-clear-credentials"
                        >
                          Clear saved credentials
                        </button>
                        {isLogin && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsForgot(true);
                              setError("");
                              setTempPassword("");
                            }}
                            className="w-full text-xs text-slate-500 hover:text-slate-700 underline transition-colors"
                            disabled={submitting}
                            data-testid="button-forgot-password"
                          >
                            Forgot password?
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-3 border-t border-slate-300 pb-5 pt-5">
              <Link href="/about">
                <Button variant="ghost" className="text-slate-700 hover:text-slate-900 transition-colors" data-testid="button-about">
                  <Info className="w-4 h-4 mr-2" /> About universe-empire-domions
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <Link href="/terms" className="hover:text-slate-900 hover:underline transition-colors" data-testid="link-terms">
                  Terms of Service
                </Link>
                <span>&bull;</span>
                <Link href="/privacy" className="hover:text-slate-900 hover:underline transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </Card>

          <aside className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden xl:max-h-[calc(100vh-8rem)]">
            <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-4 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-200/20">
                  <Server className="h-5 w-5 text-emerald-200" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-200/80">Operations Feed</div>
                  <h2 className="font-orbitron text-xl font-bold">Server Health</h2>
                </div>
              </div>
              <p className="text-xs leading-5 text-slate-300">
                Live public health telemetry for the command cluster shown beside the login menu before players enter the game.
              </p>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Cluster Status</div>
                    <div className="mt-1 flex items-center gap-2">
                      <HealthIcon className="h-5 w-5 text-slate-700" />
                      <div className="font-orbitron text-lg font-bold text-slate-900">{formatHealthStatus(healthData?.status || "unhealthy")}</div>
                    </div>
                  </div>
                  <div className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${getHealthBadgeClass(healthData?.status || "unhealthy")}`}>
                    Score {healthData?.score ?? 0}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500 uppercase text-[10px] tracking-[0.2em]">
                      <Activity className="h-3.5 w-3.5" /> Status Poll
                    </div>
                    <div className="font-semibold text-slate-900">{formatTimeAgo(healthData?.timestamp)}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500 uppercase text-[10px] tracking-[0.2em]">
                      <Gauge className="h-3.5 w-3.5" /> Universe Node
                    </div>
                    <div className="font-semibold text-slate-900">{UNIVERSE_ID}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600">
                  {healthData?.message || "Telemetry synced from the public /api/status/health endpoint and summarized for title-screen visibility."}
                </p>
              </div>

              <div className="space-y-2">
                {healthChecks.map(([key, check]) => (
                  <div key={key} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                        <div className="font-semibold text-slate-900">{check.message}</div>
                      </div>
                      <div className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${check.status === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : check.status === "warning" ? "border-amber-300 bg-amber-50 text-amber-700" : "border-red-300 bg-red-50 text-red-700"}`}>
                        {check.status}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Value {Math.round(check.value)} / Threshold {Math.round(check.threshold)}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  <Crown className="h-4 w-4" /> Title-Screen Overview
                </div>
                <ul className="space-y-2 text-xs leading-5 text-slate-600">
                  <li>Login access sits between universe realm intelligence and live operations telemetry.</li>
                  <li>Healthy clusters report 200 status, while degraded or unhealthy states surface immediately here.</li>
                  <li>Both side panels stay attached to the home title page instead of the in-game menu layout.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 border-t border-slate-300 bg-white/95 backdrop-blur-sm z-20">
        <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">universe-empire-domions</span>
          <span>&bull;</span>
          <span>Version {GAME_VERSION}</span>
          <span>&bull;</span>
          <span>{buildChannel}</span>
          <span>&bull;</span>
          <span>Universe {UNIVERSE_ID}</span>
          <span>&bull;</span>
          <a href="https://github.com/ArkansasIo/stellar-dominion3" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-700 hover:text-cyan-900 hover:underline">
            stellar-dominion3
          </a>
          <span>&bull;</span>
          <span>Developer: Stephen</span>
          <span>&bull;</span>
          <span>
            Publisher:{" "}
            <a
              href="https://github.com/ArkansasIo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
              data-testid="link-auth-footer-publisher"
            >
              ArkansasIo
            </a>
          </span>
        </div>
      </div>

      <Button asChild variant="outline" size="sm" className="fixed bottom-20 right-4 z-30 border-slate-300 text-slate-700 hover:bg-slate-100">
        <a href="https://github.com/ArkansasIo/universe-empire-domions/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" data-testid="button-license-bottom-right">
          <FileText className="w-4 h-4 mr-1" /> License
        </a>
      </Button>
    </div>
  );
}
