import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur border-slate-200 text-slate-900 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-orbitron font-bold tracking-wider text-slate-900">Terms of Service</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-sm text-slate-600 max-h-[60vh] overflow-y-auto">
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h3>
            <p>By accessing and playing Stellar Dominion, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the game.</p>
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
            <p>All in-game items, resources, and currencies are virtual and have no real-world value. They remain the property of Stellar Dominion.</p>
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
            <p>Stellar Dominion is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the game.</p>
          </section>

          <section className="text-xs text-slate-400 pt-4 border-t border-slate-200">
            <p>Last updated: December 2024</p>
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
