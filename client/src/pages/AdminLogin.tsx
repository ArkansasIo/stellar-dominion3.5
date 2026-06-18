import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff, ChevronRight, Lock, User, KeyRound, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────── */
type Step = 1 | 2 | 3;
type Status = "idle" | "checking" | "success" | "error";

const ROLE_LABELS: Record<string, { label: string; color: string; rank: number }> = {
  founder:       { label: "FOUNDER",           color: "text-purple-300",  rank: 5 },
  devadmin:      { label: "DEV ADMIN",          color: "text-amber-300",   rank: 5 },
  administrator: { label: "HEAD ADMINISTRATOR", color: "text-cyan-300",    rank: 4 },
  suadmin:       { label: "SUB-ADMINISTRATOR",  color: "text-blue-300",    rank: 3 },
  moderator:     { label: "MODERATOR",          color: "text-green-300",   rank: 2 },
  viewer:        { label: "VIEWER",             color: "text-slate-400",   rank: 1 },
};

function getRoleInfo(role: string | null | undefined) {
  const k = String(role || "viewer").toLowerCase();
  return ROLE_LABELS[k] || ROLE_LABELS.viewer;
}

/* ── Scanline CSS ───────────────────────────────────────────────── */
const SCANLINE_STYLE = `
@keyframes scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes flicker {
  0%, 100% { opacity: 1; }
  92%       { opacity: 0.98; }
  93%       { opacity: 0.82; }
  94%       { opacity: 0.98; }
}
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes glow-pulse {
  0%,100% { text-shadow: 0 0 6px rgba(34,197,94,.6); }
  50%      { text-shadow: 0 0 18px rgba(34,197,94,1), 0 0 30px rgba(34,197,94,.4); }
}
.admin-login-scanline { animation: scanline 8s linear infinite; }
.admin-login-flicker  { animation: flicker 6s infinite; }
.admin-login-blink    { animation: blink 1s step-end infinite; }
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden admin-login-flicker font-mono">
      <style>{SCANLINE_STYLE}</style>

      {/* ── Star background ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.9 ? 2 : 1,
              height: Math.random() > 0.9 ? 2 : 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* ── Scanline overlay ─────────────────────────────────── */}
      <div
        className="admin-login-scanline absolute left-0 right-0 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(transparent 0%, rgba(0,255,100,.015) 50%, transparent 100%)",
          zIndex: 50,
        }}
      />

      {/* ── Grid lines ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,80,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,80,.5) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Back link ────────────────────────────────────────── */}
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-green-900 hover:text-green-500 transition-colors z-20">
        <ArrowLeft className="w-3 h-3" />
        Back to game
      </Link>

      {/* ── Main card ────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-md z-10"
        style={{
          border: "1px solid rgba(0,200,80,.25)",
          boxShadow: "0 0 40px rgba(0,200,80,.08), 0 0 1px rgba(0,200,80,.4), inset 0 0 60px rgba(0,0,0,.6)",
          background: "rgba(0,8,2,.92)",
        }}
      >
        {/* ── Title bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "rgba(0,200,80,.15)" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <div className="w-2 h-2 rounded-full bg-green-500/70" />
            <span className="ml-2 text-green-700 text-[10px] tracking-widest uppercase">admin-clearance-v2.0</span>
          </div>
          <span className="text-green-900 text-[10px]">{new Date().toISOString().slice(0, 10)}</span>
        </div>

        <div className="px-6 pt-5 pb-6 space-y-5">

          {/* ── Header ───────────────────────────────────────── */}
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ border: "1px solid rgba(0,200,80,.3)", background: "rgba(0,200,80,.06)", boxShadow: "0 0 20px rgba(0,200,80,.1)" }}
              >
                <ShieldCheck className="w-7 h-7 text-green-400" style={{ filter: "drop-shadow(0 0 6px rgba(0,255,80,.5))" }} />
              </div>
            </div>
            <h1 className="text-green-300 text-sm tracking-[0.25em] uppercase font-bold admin-login-glow">
              Stellar Dominion
            </h1>
            <p className="text-green-700 text-[10px] tracking-widest uppercase">
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
                <CheckCircle2 className="w-12 h-12 text-green-400" style={{ filter: "drop-shadow(0 0 12px rgba(0,255,80,.8))" }} />
              </div>
              <div>
                <p className="text-green-300 text-sm font-bold tracking-widest uppercase">ACCESS GRANTED</p>
                <p className="text-green-600 text-xs mt-1">Clearance verified — establishing session</p>
              </div>
              <div
                className="rounded p-3 space-y-1 text-xs"
                style={{ border: "1px solid rgba(0,200,80,.2)", background: "rgba(0,200,80,.04)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-green-700">OPERATOR</span>
                  <span className="text-green-300 font-bold">{authedUser.username.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">CLEARANCE</span>
                  <span className={`font-bold ${role.color}`}>LEVEL {role.rank} — {role.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">STATUS</span>
                  <span className="text-green-400">● SESSION ACTIVE</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-green-700">
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
                  <div className="flex items-center gap-2 text-[10px] text-green-600 uppercase tracking-widest">
                    <span>STEP {step}/3</span>
                    <span className="text-green-900">·</span>
                    <span>{STEP_META[step - 1].desc}</span>
                  </div>
                  <div
                    className="h-px w-full"
                    style={{ background: "linear-gradient(to right, rgba(0,200,80,.4), transparent)" }}
                  />
                </div>

                {/* Identifier summary (shown on step 2+) */}
                {step >= 2 && (
                  <div
                    className="flex items-center justify-between px-3 py-1.5 text-xs"
                    style={{ border: "1px solid rgba(0,200,80,.12)", background: "rgba(0,200,80,.03)" }}
                  >
                    <span className="text-green-700">OPERATOR</span>
                    <span className="text-green-400">{identifier}</span>
                  </div>
                )}

                {/* Input field */}
                <div className="space-y-1">
                  <label className="text-[10px] text-green-600 uppercase tracking-widest block">
                    {STEP_META[step - 1].label}
                  </label>
                  <div
                    className="flex items-center gap-2 px-3"
                    style={{
                      border: status === "error" ? "1px solid rgba(239,68,68,.5)" : "1px solid rgba(0,200,80,.3)",
                      background: "rgba(0,0,0,.6)",
                      boxShadow: status === "error" ? "0 0 8px rgba(239,68,68,.1)" : "0 0 0 0 transparent",
                    }}
                  >
                    {step === 1 && <User     className="w-3.5 h-3.5 text-green-700 shrink-0" />}
                    {step === 2 && <Lock     className="w-3.5 h-3.5 text-green-700 shrink-0" />}
                    {step === 3 && <KeyRound className="w-3.5 h-3.5 text-green-700 shrink-0" />}

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
                      className="flex-1 bg-transparent text-green-300 text-sm py-2.5 outline-none placeholder-green-900 tracking-wider"
                      placeholder={step === 1 ? "username or email" : step === 2 ? "••••••••••••" : step === 3 ? "ACCESS-CODE" : ""}
                      autoComplete={step === 1 ? "username" : step === 2 ? "current-password" : "off"}
                      spellCheck={false}
                    />

                    {(step === 2 || step === 3) && (
                      <button
                        type="button"
                        onClick={() => step === 2 ? setShowPass((v) => !v) : setShowCode((v) => !v)}
                        className="text-green-800 hover:text-green-500 transition-colors"
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
                  <div
                    className="flex items-start gap-2 px-3 py-2 text-xs admin-login-slide"
                    style={{ border: "1px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.06)" }}
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-red-400">{error}</span>
                  </div>
                )}

                {/* Lockout warning */}
                {attempts >= 3 && status !== "success" && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 text-xs"
                    style={{ border: "1px solid rgba(251,191,36,.3)", background: "rgba(251,191,36,.06)" }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span className="text-yellow-400">⚠ Multiple failed attempts — this session is logged</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <button
                      onClick={() => { setStep((s) => (s - 1) as Step); setError(""); setStatus("idle"); }}
                      className="px-3 py-2 text-xs text-green-700 hover:text-green-400 transition-colors flex items-center gap-1"
                      style={{ border: "1px solid rgba(0,200,80,.15)" }}
                    >
                      <ArrowLeft className="w-3 h-3" /> Back
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!canProceed() || status === "checking"}
                    className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200"
                    style={{
                      border: canProceed() && status !== "checking"
                        ? "1px solid rgba(0,255,80,.5)"
                        : "1px solid rgba(0,200,80,.15)",
                      background: canProceed() && status !== "checking"
                        ? "rgba(0,255,80,.08)"
                        : "transparent",
                      color: canProceed() && status !== "checking" ? "#4ade80" : "#166534",
                      boxShadow: canProceed() && status !== "checking"
                        ? "0 0 12px rgba(0,255,80,.1)"
                        : "none",
                    }}
                  >
                    {status === "checking" ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Authenticating…</>
                    ) : step < 3 ? (
                      <>Continue <ChevronRight className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Authenticate <ShieldCheck className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>

                {/* Dev helpers */}
                {isDev && step === 1 && (
                  <div
                    className="space-y-2 px-3 py-2 text-[10px]"
                    style={{ border: "1px solid rgba(251,191,36,.2)", background: "rgba(251,191,36,.04)" }}
                  >
                    <div className="text-yellow-600 uppercase tracking-widest">⚡ Dev Quick-Fill</div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => devFill("admin", "Admin@12345", "STELLAR-ADMIN")}
                        className="px-2 py-1 text-[10px] text-yellow-400 hover:text-yellow-200 transition-colors"
                        style={{ border: "1px solid rgba(251,191,36,.25)" }}
                      >
                        admin / Admin@12345
                      </button>
                      <button
                        onClick={() => devFill("devadmin", "dev-password", "STELLAR-ADMIN")}
                        className="px-2 py-1 text-[10px] text-yellow-400 hover:text-yellow-200 transition-colors"
                        style={{ border: "1px solid rgba(251,191,36,.25)" }}
                      >
                        devadmin / dev-password
                      </button>
                    </div>
                    <div className="text-yellow-800">
                      Access code: <span className="text-yellow-600 font-bold">STELLAR-ADMIN</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Footer ───────────────────────────────────────── */}
          <div
            className="pt-2 space-y-2"
            style={{ borderTop: "1px solid rgba(0,200,80,.08)" }}
          >
            {status !== "success" && (
              <button
                onClick={resetForm}
                className="w-full text-center text-[10px] text-green-900 hover:text-green-600 transition-colors"
              >
                Reset all fields
              </button>
            )}
            <p className="text-center text-[10px] text-green-900">
              All admin sessions are fully audited and logged
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom status bar ────────────────────────────────── */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 text-[10px] text-green-900 tracking-widest">
          <span>STELLAR-DOMINION</span>
          <span className="text-green-950">·</span>
          <span>ADMIN-AUTH-PROTOCOL</span>
          <span className="text-green-950">·</span>
          <span className="text-green-700">SECURE CHANNEL</span>
          <span className="text-green-950">·</span>
          <span className="admin-login-blink text-green-600">●</span>
        </div>
      </div>
    </div>
  );
}
