import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid-bg">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-300 flex items-center justify-center font-black text-black">W</div>
          <span className="font-bold tracking-tight text-lg">WasteZero</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#problem" className="hover:text-white">Problem</a>
          <a href="#solution" className="hover:text-white">Solution</a>
          <a href="#market" className="hover:text-white">Market</a>
          <a href="#roi" className="hover:text-white">ROI</a>
        </div>
        <Link href="/demo" className="bg-brand-500 hover:bg-brand-600 text-black font-semibold text-sm px-4 py-2 rounded-lg">
          Launch 3D Demo →
        </Link>
      </nav>

      {/* HERO */}
      <section className="px-8 pt-20 pb-28 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-500/90 mb-6">
          <span className="h-2 w-2 bg-brand-500 rounded-full pulse-dot"></span>
          Industrial Engineering · Pitch 2026
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          Kill duplicate orders.<br />
          <span className="bg-gradient-to-r from-brand-500 via-emerald-300 to-teal-200 bg-clip-text text-transparent">Kill food waste.</span>
        </h1>
        <p className="mt-7 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          WasteZero is the kitchen operations OS that turns chaotic ticket queues into an ID-tapped, role-aware, priority-sorted line — so nothing gets cooked twice.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/demo" className="bg-brand-500 hover:bg-brand-600 text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20">
            See the 3D Restaurant Demo →
          </Link>
          <a href="#problem" className="glass hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl">
            Read the Pitch
          </a>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { k: "4-6%", v: "of tickets cooked twice" },
            { k: "$22K", v: "remakes lost / restaurant / yr" },
            { k: "6-9mo", v: "payback period" },
            { k: "$3.6B", v: "US fast-casual TAM" },
          ].map((s) => (
            <div key={s.k} className="glass rounded-2xl p-5">
              <div className="text-3xl font-black text-brand-500">{s.k}</div>
              <div className="text-xs text-white/60 mt-1 uppercase tracking-wide">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="px-8 py-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-brand-500 mb-3">The Problem</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Your POS queues tickets.<br />Your kitchen runs on guesses.
          </h2>
          <p className="mt-5 text-white/70 text-lg">
            In a typical fast-casual line, a ticket is claimed by the first chef to glance at the screen — but nothing prevents a second chef from claiming it too. The result: two burgers, one order, doubled labor, doubled waste.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-4 gap-4">
          {[
            { t: "Duplicate orders", d: "Multiple chefs claim the same ticket. No lock. No status ping." },
            { t: "No role delegation", d: "Grill chef plates. Prep chef fries. Stations bleed into chaos." },
            { t: "Comm gaps", d: "Verbal hand-offs break across language barriers and shift noise." },
            { t: "Bad prioritization", d: "A 10-min DoorDash rider waits behind a 5-min dine-in." },
          ].map((p) => (
            <div key={p.t} className="glass rounded-2xl p-5">
              <div className="text-brand-500 font-bold text-sm uppercase tracking-wide">{p.t}</div>
              <div className="text-white/70 mt-2 text-sm">{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="px-8 py-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-brand-500 mb-3">The Solution</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            One tap. One station. One dish.
          </h2>
          <p className="mt-5 text-white/70 text-lg">
            WasteZero breaks every dish into a chain of single-step stations — wash, heat, plate. A chef taps their ID to check in; the ticket locks to them; the next station is only notified after check-out. No duplication possible.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            { n: "01", t: "ID Check-in", d: "Tap an RFID badge at your station. Kitchen roster updates in real time." },
            { n: "02", t: "Smart Queue", d: "Priority engine sorts by channel, rider ETA, dwell time. Most urgent surfaces first." },
            { n: "03", t: "Atomic Claim", d: "First tap wins. The ticket instantly disappears from every other station." },
            { n: "04", t: "Chain Hand-off", d: "Check-out fires the next station. No yelling. No re-reading the screen." },
            { n: "05", t: "CV Watchdog", d: "Overhead camera flags when two stations are cooking the same dish." },
            { n: "06", t: "ISE Xtra", d: "Pre-measured ingredients, cycle-time analytics, color/time-based doneness." },
          ].map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6">
              <div className="text-brand-500 font-mono text-sm">{s.n}</div>
              <div className="text-xl font-bold mt-2">{s.t}</div>
              <div className="text-white/70 mt-2 text-sm">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 glass rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black">Want to see it on a line?</h3>
            <p className="text-white/70 mt-2">Walk through an interactive 3D kitchen. Place orders. Watch stations claim them in real time.</p>
          </div>
          <Link href="/demo" className="bg-brand-500 hover:bg-brand-600 text-black font-bold px-6 py-4 rounded-xl text-lg whitespace-nowrap">
            Launch 3D Demo →
          </Link>
        </div>
      </section>

      {/* MARKET */}
      <section id="market" className="px-8 py-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-brand-500 mb-3">Market</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Beachhead: campus & high-footfall fast-casual.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          <div className="glass rounded-2xl p-6">
            <div className="text-sm text-white/60">TAM — US Fast-Casual</div>
            <div className="text-4xl font-black mt-2">$3.6B</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-sm text-white/60">SAM — 80K locations</div>
            <div className="text-4xl font-black mt-2">$1B</div>
          </div>
          <div className="glass rounded-2xl p-6 bg-brand-500/10 border-brand-500/30">
            <div className="text-sm text-brand-500">SOM (4–5 yr)</div>
            <div className="text-4xl font-black mt-2 text-brand-500">$180M</div>
            <div className="text-xs text-white/60 mt-2">ARR beachhead</div>
          </div>
        </div>
        <div className="mt-6 text-white/60 text-sm">
          Early design partners: Cafe West (Rutgers), campus center eateries, shopping-mall food courts. Comparables: Cava, Sweetgreen, Chipotle.
        </div>
      </section>

      {/* ROI */}
      <section id="roi" className="px-8 py-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-brand-500 mb-3">Financials</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">6–9 month payback. Per location.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <div className="text-sm text-white/60 uppercase tracking-wide">Customer cost</div>
            <ul className="mt-4 space-y-2 text-white/80">
              <li className="flex justify-between"><span>Hardware kit (4–6 stations)</span><span className="font-bold">$15–20K</span></li>
              <li className="flex justify-between"><span>SaaS + AI hosting</span><span className="font-bold">$12K / yr</span></li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-6 bg-brand-500/10 border-brand-500/30">
            <div className="text-sm text-brand-500 uppercase tracking-wide">Annual savings</div>
            <ul className="mt-4 space-y-2 text-white/80">
              <li className="flex justify-between"><span>Labor (1 fewer runner / shift)</span><span className="font-bold text-brand-500">$25K</span></li>
              <li className="flex justify-between"><span>Remakes avoided (4–6% slippage)</span><span className="font-bold text-brand-500">$22K</span></li>
              <li className="flex justify-between"><span>Incremental rush revenue (+5%)</span><span className="font-bold text-brand-500">$30–50K</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-8 py-24 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight">Zero duplicates. Zero waste.</h2>
        <p className="text-white/70 mt-4 text-lg">That's WasteZero.</p>
        <Link href="/demo" className="inline-block mt-8 bg-brand-500 hover:bg-brand-600 text-black font-bold px-8 py-4 rounded-xl text-lg">
          Launch 3D Restaurant Demo →
        </Link>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-white/40 text-sm">
        © 2026 WasteZero · Built for the Rutgers ISE Pitch Competition
      </footer>
    </main>
  );
}
