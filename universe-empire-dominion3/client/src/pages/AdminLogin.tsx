import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff, ChevronRight, Lock, User, KeyRound, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ── Types ──────────────────────────────────────────────────────── */
type Step = 1 | 2 | 3;
type Status = "idle" | "checking" | "success" | "error";

const ROLE_LABELS: Record<string, { label: string; color: string; rank: number }> = {
  founder:       { label: "FOUNDER",           color: "text-purple-600",  rank: 5 },
  devadmin:      { label: "DEV ADMIN",          color: "text-amber-600",   rank: 5 },
  administrator: { label: "HEAD ADMINISTRATOR", color: "text-cyan-600",    rank: 4 },
  suadmin:       { label: "SUB-ADMINISTRATOR",  color: "text-blue-600",    rank: 3 },
  moderator:     { label: "MODERATOR",          color: "text-green-600",   rank: 2 },
  viewer:        { label: "VIEWER",             color: "text-slate-500",   rank: 1 },
};

function getRoleInfo(role: string | null | undefined) {
  const k = String(role || "viewer").toLowerCase();
  return ROLE_LABELS[k] || ROLE_LABELS.viewer;
}

/* ── Animations ─────────────────────────────────────────────────── */
const ANIMATION_STYLE = `
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes glow-pulse {
  0%,100% { text-shadow: 0 0 6px rgba(34,197,94,.6); }
  50%      { text-shadow: 0 0 18px rgba(34,197,94,1), 0 0 30px rgba(34,197,94,.4); }
}
.admin-login-slide    { animation: slideUp .35s ease forwards; }
.admin-login-glow     { animation: glow-pulse 2s ease-in-out infinite; }
`;

/* ── Step label map ─────────────────────────────────────────────── */
const STEP_META = [
  { num: 1, icon: User,     label: "Identity",    desc: "Enter your operator identifier" },
  { num: 2, icon: Lock,     label: "Password",    desc: "Enter your security password" },
  { num: 3, icon: KeyRound, label: "Access Code", desc: "Enter your admin access code" },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function AdminLogin() {
  const [, navigate] = useLocation();
  const isDev = import.meta.env.DEV;

  /* form state */
  const [step, setStep] = useState<Step>(1);
  const [identifier, setIdentifier]     = useState("");
  const [password, setPassword]         = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [showCode, setShowCode]         = useState(false);

  /* ui state */
  const [status, setStatus]         = useState<Status>("idle");
  const [error, setError]           = useState("");
  const [authedUser, setAuthedUser] = useState<{ username: string; adminRole: string | null } | null>(null);
  const [attempts, setAttempts]     = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [step]);

  /* ── Dev quick-fill ─────────────────────────────────────────── */
  const devFill = (user: string, pass: string, code: string) => {
    setIdentifier(user);
    setPassword(pass);
    setSecurityCode(code);
    setStep(1);
    setError("");
    setStatus("idle");
  };

  /* ── Step validation ────────────────────────────────────────── */
  const canProceed = () => {
    if (step === 1) return identifier.trim().length >= 2;
    if (step === 2) return password.length >= 4;
    if (step === 3) return securityCode.trim().length >= 4;
    return false;
  };

  /* ── Advance / submit ───────────────────────────────────────── */
  const handleNext = async () => {
    if (!canProceed() || status === "checking") return;
    setError("");

    if (step < 3) {
      setStep((s) => (s + 1) as Step);
      return;
    }

    /* Step 3 → submit */
    setStatus("checking");
    setAttempts((a) => a + 1);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password, securityCode: securityCode.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || "Authentication failed";
        const field = data?.field;
        setStatus("error");
        setError(msg);
        if (field === "securityCode") {
          setStep(3);
        } else if (res.status === 401 && !field) {
          setStep(1);
          setPassword("");
          setSecurityCode("");
        }
        return;
      }

      localStorage.setItem("stellar_username", data?.user?.username || identifier);
      setAuthedUser({ username: data?.user?.username || identifier, adminRole: data?.user?.adminRole });
      setStatus("success");
      setTimeout(() => { navigate("/admin"); }, 2200);
    } catch {
      setStatus("error");
      setError("Connection failed — server unreachable");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNext();
  };

  const resetForm = () => {
    setStep(1);
    setIdentifier("");
    setPassword("");
    setSecurityCode("");
    setError("");
    setStatus("idle");
  };

  /* ── Current step value ─────────────────────────────────────── */
  const currentValue = step === 1 ? identifier : step === 2 ? password : securityCode;
  const setCurrentValue = (v: string) => {
    if (step === 1) setIdentifier(v);
    else if (step === 2) setPassword(v);
    else setSecurityCode(v);
  };

  /* ── Render ─────────────────────────────────────────────────── */
  const role = getRoleInfo(authedUser?.adminRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <style>{ANIMATION_STYLE}</style>

      {/* ── Back link ────────────────────────────────────────── */}
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors z-20">
        <ArrowLeft className="w-3 h-3" />
        Back to game
      </Link>

      {/* ── Main card ────────────────────────────────────────── */}
      <Card className="relative w-full max-w-md z-10 bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <div className="w-2 h-2 rounded-full bg-green-500/70" />
              <span className="ml-2 text-slate-500 text-[10px] tracking-widest uppercase">admin-clearance-v2.0</span>
            </div>
            <span className="text-slate-400 text-[10px]">{new Date().toISOString().slice(0, 10)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">

          {/* ── Header ───────────────────────────────────────── */}
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
            </div>
            <h1 className="text-slate-900 text-sm tracking-[0.25em] uppercase font-bold font-orbitron admin-login-glow">
              Stellar Dominion
            </h1>
            <p className="text-slate-500 text-[10px] tracking-widest uppercase">
              Admin Clearance System · Level {step}/3
            </p>
          </div>

          {/* ── Step indicator ───────────────────────────────── */}
          <div className="flex items-center justify-center gap-0">
            {STEP_META.map((s, i) => {
              const done    = step > s.num;
              const current = step === s.num;
              const Icon    = s.icon;
              return (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300"
                      style={{
                        border: done ? "1px solid rgba(34,197,94,.6)" : current ? "1px solid rgba(0,255,80,.8)" : "1px solid rgba(0,200,80,.2)",
                        background: done ? "rgba(34,197,94,.15)" : current ? "rgba(0,255,80,.1)" : "transparent",
                        boxShadow: current ? "0 0 12px rgba(0,255,80,.3)" : "none",
                      }}
                    >
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                        : <Icon className={`w-3.5 h-3.5 ${current ? "text-green-300" : "text-green-900"}`} />
                      }
                    </div>
                    <span className={`text-[9px] tracking-widest uppercase ${current ? "text-green-400" : done ? "text-green-600" : "text-green-900"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEP_META.length - 1 && (
                    <div
                      className="w-14 h-px mx-1 mb-4 transition-all duration-500"
                      style={{ background: step > s.num + 1 ? "rgba(34,197,94,.5)" : step > s.num ? "rgba(0,255,80,.4)" : "rgba(0,200,80,.15)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Success screen ───────────────────────────────── */}
          {status === "success" && authedUser ? (
            <div className="admin-login-slide text-center space-y-4 py-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <p className="text-slate-900 text-sm font-bold tracking-widest uppercase font-orbitron">ACCESS GRANTED</p>
                <p className="text-slate-500 text-xs mt-1">Clearance verified — establishing session</p>
              </div>
              <div className="rounded p-3 space-y-1 text-xs bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">OPERATOR</span>
                  <span className="text-slate-900 font-bold">{authedUser.username.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">CLEARANCE</span>
                  <span className={`font-bold ${role.color}`}>LEVEL {role.rank} — {role.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">STATUS</span>
                  <span className="text-green-600">● SESSION ACTIVE</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Redirecting to Admin Control Panel…
              </div>
            </div>
          ) : (
            <>
              {/* ── Auth form ──────────────────────────────────── */}
              <div className="admin-login-slide space-y-4">

                {/* Prompt label */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                    <span>STEP {step}/3</span>
                    <span className="text-slate-300">·</span>
                    <span>{STEP_META[step - 1].desc}</span>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-slate-200 to-transparent" />
                </div>

                {/* Identifier summary (shown on step 2+) */}
                {step >= 2 && (
                  <div className="flex items-center justify-between px-3 py-1.5 text-xs bg-slate-50 border border-slate-200">
                    <span className="text-slate-600">OPERATOR</span>
                    <span className="text-slate-900">{identifier}</span>
                  </div>
                )}

                {/* Input field */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest block">
                    {STEP_META[step - 1].label}
                  </label>
                  <div className="flex items-center gap-2 px-3 bg-white border border-slate-200">
                    {step === 1 && <User     className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    {step === 2 && <Lock     className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    {step === 3 && <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />}

                    <input
                      ref={inputRef}
                      type={
                        step === 2 ? (showPass ? "text" : "password")
                        : step === 3 ? (showCode ? "text" : "password")
                        : "text"
                      }
                      value={currentValue}
                      onChange={(e) => { setCurrentValue(e.target.value); setError(""); setStatus("idle"); }}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent text-slate-900 text-sm py-2.5 outline-none placeholder:text-slate-400 tracking-wider"
                      placeholder={step === 1 ? "username or email" : step === 2 ? "••••••••••••" : step === 3 ? "ACCESS-CODE" : ""}
                      autoComplete={step === 1 ? "username" : step === 2 ? "current-password" : "off"}
                      spellCheck={false}
                    />

                    {(step === 2 || step === 3) && (
                      <button
                        type="button"
                        onClick={() => step === 2 ? setShowPass((v) => !v) : setShowCode((v) => !v)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {(step === 2 ? showPass : showCode)
                          ? <EyeOff className="w-3.5 h-3.5" />
                          : <Eye    className="w-3.5 h-3.5" />
                        }
                      </button>
                    )}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-start gap-2 px-3 py-2 text-xs admin-login-slide bg-red-50 border border-red-200">
                    <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-red-600">{error}</span>
                  </div>
                )}

                {/* Lockout warning */}
                {attempts >= 3 && status !== "success" && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs bg-amber-50 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-amber-600">⚠ Multiple failed attempts — this session is logged</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setStep((s) => (s - 1) as Step); setError(""); setStatus("idle"); }}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" /> Back
                    </Button>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || status === "checking"}
                    className="flex-1 text-xs font-bold uppercase tracking-widest"
                    variant={canProceed() && status !== "checking" ? "default" : "outline"}
                  >
                    {status === "checking" ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Authenticating…</>
                    ) : step < 3 ? (
                      <>Continue <ChevronRight className="w-3.5 h-3.5 ml-1" /></>
                    ) : (
                      <>Authenticate <ShieldCheck className="w-3.5 h-3.5 ml-1" /></>
                    )}
                  </Button>
                </div>

                {/* Dev helpers */}
                {isDev && step === 1 && (
                  <div className="space-y-2 px-3 py-2 text-[10px] bg-amber-50 border border-amber-200">
                    <div className="text-amber-700 uppercase tracking-widest font-semibold">⚡ Dev Quick-Fill</div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => devFill("admin", "Admin@12345", "STELLAR-ADMIN")}
                        className="text-[10px] h-7 text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        admin / Admin@12345
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => devFill("devadmin", "dev-password", "STELLAR-ADMIN")}
                        className="text-[10px] h-7 text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        devadmin / dev-password
                      </Button>
                    </div>
                    <div className="text-amber-800 text-[10px]">
                      Access code: <span className="font-bold text-amber-700">STELLAR-ADMIN</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Footer ───────────────────────────────────────── */}
          <div className="pt-2 space-y-2 border-t border-slate-200">
            {status !== "success" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="w-full text-[10px] text-slate-500 hover:text-slate-700"
              >
                Reset all fields
              </Button>
            )}
            <p className="text-center text-[10px] text-slate-400">
              All admin sessions are fully audited and logged
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Bottom status bar ────────────────────────────────── */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 text-[10px] text-slate-500 tracking-widest">
          <span>STELLAR-DOMINION</span>
          <span className="text-slate-300">·</span>
          <span>ADMIN-AUTH-PROTOCOL</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">SECURE CHANNEL</span>
          <span className="text-slate-300">·</span>
          <span className="text-green-600">●</span>
        </div>
      </div>
    </div>
  );
}
