import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import { MENU_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

export default function Terms() {
  const policyHighlights = [
    { section: "Account Integrity", detail: "One commander account per player; credential sharing is prohibited." },
    { section: "Fair Play", detail: "Bots, automation scripts, exploits, and data tampering are not allowed." },
    { section: "Community Standards", detail: "Harassment, hate speech, and doxxing lead to enforcement action." },
    { section: "Economy Integrity", detail: "Fraudulent market behavior and multi-account boosting are bannable." },
  ];

  const enforcementSteps = [
    "Detection and evidence review by moderation systems.",
    "Warning or temporary sanctions for first-time low-risk violations.",
    "Escalation to suspension for repeated or severe abuse.",
    "Permanent account closure for exploit abuse or malicious activity.",
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur border-slate-200 text-slate-900 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            <img
              src={MENU_ASSETS.NAVIGATION.HOME.path}
              alt="terms"
              className="w-7 h-7 object-contain"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
            />
          </div>
          <CardTitle className="text-2xl font-orbitron font-bold tracking-wider text-slate-900">Terms of Service</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-sm text-slate-600 max-h-[60vh] overflow-y-auto">
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h3>
            <p>By accessing and playing Universe-Empires-Dominions, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the game.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">2. Game Account</h3>
            <p>You are responsible for maintaining the security of your account. You must not share your account credentials with others. One account per player is allowed.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">3. User Conduct</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use cheats, exploits, or automation software</li>
              <li>Harass, threaten, or abuse other players</li>
              <li>Engage in any activity that disrupts the game experience</li>
              <li>Create multiple accounts to gain unfair advantages</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">4. Virtual Items</h3>
            <p>All in-game items, resources, and currencies are virtual and have no real-world value. They remain the property of Universe-Empires-Dominions.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">5. Modifications</h3>
            <p>We reserve the right to modify these terms at any time. Continued use of the game after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">6. Termination</h3>
            <p>We may terminate or suspend your account for violations of these terms without prior notice.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">7. Disclaimer</h3>
            <p>Universe-Empires-Dominions is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the game.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">8. Policy Highlights</h3>
            <div className="space-y-2">
              {policyHighlights.map((item) => (
                <div key={item.section} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">{item.section}</p>
                  <p className="text-slate-600 text-xs mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">9. Enforcement Workflow</h3>
            <div className="space-y-1">
              {enforcementSteps.map((step) => (
                <p key={step}>• {step}</p>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">10. Player Rights & Support</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Request account support through the help and support channels.</li>
              <li>Appeal moderation actions with a clear evidence trail.</li>
              <li>Review policy updates published in patch and governance notes.</li>
            </ul>
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
