import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-400 uppercase tracking-widest">
          Powered by ALICE-Edge
        </div>

        <h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          ALICE Edge IoT SaaS
        </h1>

        <p className="mt-6 max-w-2xl text-xl font-semibold text-cyan-300 sm:text-2xl">
          Don&apos;t send raw data. Send the law of edges.
        </p>

        <p className="mt-4 max-w-xl text-base text-gray-400">
          Edge computing for IoT powered by ALICE-Edge. Compress, route, and
          manage thousands of devices at the boundary — before data ever reaches
          the cloud.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard/console"
            className="rounded-lg bg-cyan-500 px-7 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
          >
            Open Edge Console
          </Link>
          <Link
            href="#features"
            className="rounded-lg border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">
          Core Capabilities
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard
            icon="⚡"
            title="Edge Compression"
            description="Compress IoT payloads with LZ4, Zstandard, Brotli, or Snappy before transmission. Reduce bandwidth by up to 90% at the edge."
          />
          <FeatureCard
            icon="🔀"
            title="Protocol Gateway"
            description="Translate between MQTT, CoAP, AMQP, HTTP/2, gRPC, and WebSocket. One unified gateway for every device dialect."
          />
          <FeatureCard
            icon="📡"
            title="Device Management"
            description="Register, monitor, and control every IoT endpoint from a single pane of glass. Real-time status, last-seen timestamps, and protocol tracking."
          />
        </div>
      </section>

      {/* Architecture */}
      <section className="border-t border-white/10 bg-white/5 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-2xl font-bold text-white">Architecture</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-sm text-gray-300">
            <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-cyan-300">
              Frontend :3000
            </span>
            <span className="text-gray-500">&#8594;</span>
            <span className="rounded border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-purple-300">
              API Gateway :8080
            </span>
            <span className="text-gray-500">&#8594;</span>
            <span className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-300">
              Edge Engine :8081
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-gray-600">
        ALICE Edge IoT SaaS &mdash; AGPL-3.0
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-500/40 hover:bg-white/8">
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{description}</p>
    </div>
  );
}
