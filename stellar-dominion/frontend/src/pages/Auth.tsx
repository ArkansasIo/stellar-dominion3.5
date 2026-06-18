import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Shield, Info, Loader2, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

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

  // Load saved credentials from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("stellar_username");
    const savedPassword = localStorage.getItem("stellar_password");
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  // Save credentials to localStorage
  const saveCredentials = (user: string, pass: string) => {
    localStorage.setItem("stellar_username", user);
    localStorage.setItem("stellar_password", pass);
  };

  const clearCredentials = () => {
    localStorage.removeItem("stellar_username");
    localStorage.removeItem("stellar_password");
  };

  const useDemoAccount = () => {
    login();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {error?.includes("Database is temporarily") && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-yellow-900 border-2 border-yellow-500 text-yellow-100 px-4 py-3 rounded-lg shadow-xl">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">⚡ Server Maintenance</p>
                <p className="text-xs mt-1">Game servers being refreshed. Try again in a moment.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Card className="w-full max-w-md bg-white border border-slate-300 text-slate-900 relative z-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
             <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-4xl font-orbitron font-bold tracking-wider text-slate-900">STELLAR DOMINION</CardTitle>
          <CardDescription className="text-slate-700 font-rajdhani text-lg font-medium mt-2">⚡ Command your fleet. Conquer the stars.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
                <button
                  type="button"
                  onClick={copyPassword}
                  className="ml-2 shrink-0 p-1 hover:bg-slate-100 rounded transition-colors"
                  data-testid="button-copy-password"
                >
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {isLogin && !isForgot && (
                  <Button
                    type="button"
                    onClick={useDemoAccount}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                    data-testid="button-demo-login"
                    disabled={submitting}
                  >
                    Use Demo Account (player1)
                  </Button>
                )}

                <div>
                  <Label htmlFor="username" className="text-slate-900 text-sm font-semibold">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (min 3 characters)"
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600"
                    data-testid="input-username"
                    disabled={submitting}
                    required
                    minLength={3}
                    autoComplete="username"
                  />
                </div>

                {isForgot && (
                  <div>
                    <Label htmlFor="email" className="text-slate-900 text-sm font-semibold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600"
                      data-testid="input-email"
                      disabled={submitting}
                      required
                    />
                  </div>
                )}

                {!isLogin && !isForgot && (
                  <>
                    <div>
                      <Label htmlFor="email" className="text-slate-900 text-sm font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600"
                        data-testid="input-email"
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName" className="text-slate-900 text-sm font-semibold">First Name (Optional)</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600"
                        data-testid="input-firstName"
                        disabled={submitting}
                      />
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
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {error && <div className="text-red-700 text-sm bg-red-50 border border-red-300 p-2 rounded">{error}</div>}

                <Button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-12 shadow-lg transition-all hover:shadow-xl"
                  disabled={submitting}
                  data-testid="button-submit-auth"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      PROCESSING...
                    </>
                  ) : isForgot ? (
                    "RESET PASSWORD"
                  ) : (
                    isLogin ? "ENTER GAME" : "CREATE ACCOUNT"
                  )}
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
        
        <CardFooter className="flex flex-col items-center gap-4 pb-6 border-t border-slate-300 pt-6">
           <Link href="/about">
             <Button variant="ghost" className="text-slate-700 hover:text-slate-900 transition-colors" data-testid="button-about">
               <Info className="w-4 h-4 mr-2" /> About Stellar Dominion
             </Button>
           </Link>
           <div className="flex items-center gap-4 text-xs text-slate-600">
             <Link href="/terms" className="hover:text-slate-900 hover:underline transition-colors" data-testid="link-terms">
               Terms of Service
             </Link>
             <span>•</span>
             <Link href="/privacy" className="hover:text-slate-900 hover:underline transition-colors" data-testid="link-privacy">
               Privacy Policy
             </Link>
           </div>
           <div className="text-xs text-slate-500 space-y-1 text-center">
             <span className="block">Version 0.1.0 // Universe: Nexus-Alpha</span>
             <span className="block text-slate-600">Developed by Stephen</span>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
