import { ExternalLink, Orbit, Server } from "lucide-react";

export default function ThreeDViewerPortal() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.92),_rgba(2,6,23,1)_60%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col gap-4 px-4 py-4 lg:px-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-cyan-500/20 bg-slate-950/70 p-5 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            <span className="inline-flex items-center gap-2">
              <Orbit className="h-4 w-4" />
              3D Universe Viewer
            </span>
            <span className="inline-flex items-center gap-2 text-slate-400">
              <Server className="h-4 w-4" />
              Served by localhost:5001
            </span>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-orbitron text-3xl font-bold tracking-[0.18em] text-white">
                Command Space
              </h1>
              <p className="max-w-3xl text-sm text-slate-300">
                The standalone Three.js galaxy viewer is now mounted through the main frontend and backend stack.
                Use this page for the in-app portal, or open the raw viewer directly if you want the full-screen canvas.
              </p>
            </div>
            <a
              href="/viewer-3d/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20"
            >
              Open Full Viewer
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur">
            <h2 className="font-orbitron text-sm uppercase tracking-[0.3em] text-cyan-200">
              Live Access
            </h2>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-slate-500">App route</p>
                <p className="font-mono text-cyan-100">/threejs-viewer</p>
              </div>
              <div>
                <p className="text-slate-500">Raw viewer</p>
                <p className="font-mono text-cyan-100">/viewer-3d/</p>
              </div>
              <div>
                <p className="text-slate-500">Backend status</p>
                <p className="font-mono text-cyan-100">/api/viewer/status</p>
              </div>
            </div>
          </aside>

          <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950/80 shadow-[0_0_50px_rgba(14,165,233,0.12)]">
            <iframe
              title="Three.js Universe Viewer"
              src="/viewer-3d/"
              className="h-[78vh] min-h-[720px] w-full bg-black"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
