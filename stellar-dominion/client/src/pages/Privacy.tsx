import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import { MENU_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

export default function Privacy() {
  const dataCategories = [
    { title: "Identity Data", details: "Username, display profile, and account identifiers." },
    { title: "Gameplay Data", details: "Progression state, economy history, combat and alliance activity." },
    { title: "Technical Data", details: "Session metadata, performance logs, and client diagnostics." },
    { title: "Support Data", details: "Messages submitted to support and moderation workflows." },
  ];

  const securityPractices = [
    "Session-based authentication controls and credential handling safeguards.",
    "Server-side access restrictions for administrative and moderation actions.",
    "Operational monitoring and audit logging for sensitive requests.",
    "Periodic retention and data cleanup for stale records.",
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur border-slate-200 text-slate-900 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            <img
              src={MENU_ASSETS.STATUS.HEALTHY.path}
              alt="privacy"
              className="w-7 h-7 object-contain"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
            />
          </div>
          <CardTitle className="text-2xl font-orbitron font-bold tracking-wider text-slate-900">Privacy Policy</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-sm text-slate-600 max-h-[60vh] overflow-y-auto">
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">1. Information We Collect</h3>
            <p>When you sign in with Replit, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your Replit username and profile information</li>
              <li>Email address (if provided by Replit)</li>
              <li>Game progress and statistics</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">2. How We Use Your Information</h3>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide and maintain your game account</li>
              <li>Save your game progress and preferences</li>
              <li>Enable multiplayer features like alliances and messaging</li>
              <li>Improve game experience and fix issues</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">3. Data Storage</h3>
            <p>Your game data is stored securely on our servers. We use industry-standard security measures to protect your information.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">4. Data Sharing</h3>
            <p>We do not sell your personal information. Your game profile (username, alliance membership, rankings) may be visible to other players as part of the game features.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">5. Cookies and Sessions</h3>
            <p>We use session cookies to keep you logged in. These are essential for the game to function properly.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">6. Your Rights</h3>
            <p>You may request deletion of your account and associated data by contacting the developer.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">7. Children's Privacy</h3>
            <p>Universe-Empires-Dominions is not intended for children under 13. We do not knowingly collect information from children under 13.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">8. Changes to This Policy</h3>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">9. Data Categories at a Glance</h3>
            <div className="space-y-2">
              {dataCategories.map((category) => (
                <div key={category.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">{category.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{category.details}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">10. Security Practices</h3>
            <div className="space-y-1">
              {securityPractices.map((practice) => (
                <p key={practice}>• {practice}</p>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">11. Data Requests</h3>
            <p>
              You may request account deletion, correction, or export of personal gameplay data through official support channels.
              We process requests after verifying account ownership.
            </p>
          </section>

          <section className="text-xs text-slate-400 pt-4 border-t border-slate-200">
            <p>Last updated: March 2026</p>
            <p>Developed by Stephen</p>
          </section>
        </CardContent>

        <div className="p-6 pt-0">
          <Link href="/">
            <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
