"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Channel = "Dine-in" | "DoorDash" | "UberEats" | "Mobile";
type StationKey = "prep" | "grill" | "fry" | "plate";

type Order = {
  id: string;
  item: string;
  channel: Channel;
  riderEta: number; // minutes
  createdAt: number;
  stage: StationKey;
  claimedBy: string | null;
  done: boolean;
};

const MENU = ["Chicken Bowl", "Steak Burrito", "Veggie Wrap", "Crispy Tofu", "Korean BBQ", "Greek Salad"];
const CHANNELS: Channel[] = ["Dine-in", "DoorDash", "UberEats", "Mobile"];
const STATION_ORDER: StationKey[] = ["prep", "grill", "fry", "plate"];

const STATIONS: Record<StationKey, { label: string; color: string; pos: [number, number, number]; chef: string }> = {
  prep:  { label: "PREP",  color: "#10b981", pos: [-4.5, 0,  1.2], chef: "Maya" },
  grill: { label: "GRILL", color: "#f59e0b", pos: [-1.5, 0,  1.2], chef: "Jay"  },
  fry:   { label: "FRY",   color: "#ef4444", pos: [ 1.5, 0,  1.2], chef: "Rio"  },
  plate: { label: "PLATE", color: "#3b82f6", pos: [ 4.5, 0,  1.2], chef: "Sam"  },
};

function priority(o: Order) {
  const ageBoost = (Date.now() - o.createdAt) / 1000; // older = higher
  const channelBoost = o.channel === "Dine-in" ? 0 : (10 - o.riderEta) * 6; // closer rider = higher
  return ageBoost + channelBoost;
}

function uid() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

function seedOrder(): Order {
  const channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
  return {
    id: "T" + uid(),
    item: MENU[Math.floor(Math.random() * MENU.length)],
    channel,
    riderEta: channel === "Dine-in" ? 0 : Math.round(3 + Math.random() * 10),
    createdAt: Date.now() - Math.random() * 20000,
    stage: "prep",
    claimedBy: null,
    done: false,
  };
}

/* ---------- 3D SCENE ---------- */

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[22, 14]} />
      <meshStandardMaterial color="#0b0f14" />
    </mesh>
  );
}

function Counter() {
  return (
    <group position={[0, 0, -2.2]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[18, 1, 1.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[18, 0.05, 1.3]} />
        <meshStandardMaterial color="#374151" metalness={0.4} roughness={0.4} />
      </mesh>
      <Text position={[0, 1.6, -0.2]} fontSize={0.35} color="#10b981" anchorX="center" anchorY="middle">
        WASTEZERO · KITCHEN LINE
      </Text>
    </group>
  );
}

function StationBlock({
  stationKey, active, busy,
}: {
  stationKey: StationKey; active: boolean; busy: boolean;
}) {
  const s = STATIONS[stationKey];
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    const t = active ? 1 : 0;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, t * 0.05, 0.1);
  });
  return (
    <group position={s.pos} ref={ref}>
      {/* base counter */}
      <RoundedBox args={[2.2, 1, 1.6]} radius={0.08} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color={busy ? s.color : "#111827"} emissive={busy ? s.color : "#000"} emissiveIntensity={busy ? 0.45 : 0} />
      </RoundedBox>
      {/* equipment */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[1.6, 0.3, 1.1]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* ID reader */}
      <mesh position={[0.9, 1.1, 0.75]}>
        <boxGeometry args={[0.25, 0.25, 0.05]} />
        <meshStandardMaterial color={active ? "#10b981" : "#6b7280"} emissive={active ? "#10b981" : "#000"} emissiveIntensity={active ? 1 : 0} />
      </mesh>
      {/* label */}
      <Text position={[0, 1.75, 0.5]} fontSize={0.28} color={s.color} anchorX="center" anchorY="middle">
        {s.label}
      </Text>
      <Text position={[0, 1.5, 0.5]} fontSize={0.16} color="#d1d5db" anchorX="center" anchorY="middle">
        Chef: {s.chef}
      </Text>
      {/* check-in status */}
      <Html position={[0, 0.2, 0.9]} transform distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div style={{
          padding: "4px 8px",
          borderRadius: 6,
          background: active ? "rgba(16,185,129,0.9)" : "rgba(31,41,55,0.9)",
          color: active ? "#000" : "#d1d5db",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "ui-sans-serif",
          letterSpacing: 1,
          whiteSpace: "nowrap",
        }}>
          {active ? "✓ CHECKED IN" : "TAP TO CHECK IN"}
        </div>
      </Html>
    </group>
  );
}

function Ticket({ position, label, channel }: { position: [number, number, number]; label: string; channel: Channel }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.6;
  });
  const color = channel === "DoorDash" ? "#ef4444" : channel === "UberEats" ? "#10b981" : channel === "Mobile" ? "#3b82f6" : "#f59e0b";
  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.02]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <Text position={[0, 0.4, 0]} fontSize={0.12} color={color} anchorX="center">{label}</Text>
    </group>
  );
}

function OrderChip({
  startPos, endPos, color,
}: {
  startPos: [number, number, number]; endPos: [number, number, number]; color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  useFrame((_, d) => {
    if (!ref.current) return;
    t.current = Math.min(1, t.current + d * 0.5);
    ref.current.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], t.current);
    ref.current.position.y = startPos[1] + Math.sin(t.current * Math.PI) * 0.8;
    ref.current.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], t.current);
  });
  return (
    <mesh ref={ref} position={startPos}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  );
}

function Scene({
  checkedIn, activeStation, movingOrders,
}: {
  checkedIn: Record<StationKey, boolean>;
  activeStation: StationKey | null;
  movingOrders: { from: StationKey; to: StationKey; color: string; key: string }[];
}) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 5]} intensity={1.1} castShadow />
      <pointLight position={[0, 4, 2]} intensity={0.6} color="#10b981" />
      <Floor />
      <Counter />
      {STATION_ORDER.map((k) => (
        <StationBlock key={k} stationKey={k} active={checkedIn[k]} busy={activeStation === k} />
      ))}
      {/* Waiting tickets floating above counter */}
      <Ticket position={[-7, 1.8, -2.2]} label="T-9021" channel="DoorDash" />
      <Ticket position={[-7.6, 2.1, -2.2]} label="T-9022" channel="Mobile" />
      <Ticket position={[-6.4, 2.0, -2.2]} label="T-9023" channel="Dine-in" />
      {/* In-flight order chips */}
      {movingOrders.map((m) => (
        <OrderChip
          key={m.key}
          startPos={[STATIONS[m.from].pos[0], 1.3, STATIONS[m.from].pos[2]]}
          endPos={[STATIONS[m.to].pos[0], 1.3, STATIONS[m.to].pos[2]]}
          color={m.color}
        />
      ))}
      <OrbitControls enablePan={false} minDistance={8} maxDistance={20} maxPolarAngle={Math.PI / 2.2} />
    </>
  );
}

/* ---------- UI PANELS ---------- */

function channelColor(c: Channel) {
  return c === "DoorDash" ? "bg-red-500" : c === "UberEats" ? "bg-emerald-500" : c === "Mobile" ? "bg-blue-500" : "bg-amber-500";
}

export default function Demo() {
  const [orders, setOrders] = useState<Order[]>(() => Array.from({ length: 5 }, seedOrder));
  const [checkedIn, setCheckedIn] = useState<Record<StationKey, boolean>>({
    prep: true, grill: true, fry: false, plate: true,
  });
  const [log, setLog] = useState<string[]>([
    "🟢 Maya checked into PREP",
    "🟢 Jay checked into GRILL",
    "🟢 Sam checked into PLATE",
  ]);
  const [duplicateAttempt, setDuplicateAttempt] = useState<string | null>(null);
  const [activeStation, setActiveStation] = useState<StationKey | null>(null);
  const [chips, setChips] = useState<{ from: StationKey; to: StationKey; color: string; key: string }[]>([]);
  const [tick, setTick] = useState(0);

  // auto re-sort clock
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  // priority-sorted queue
  const queue = useMemo(() => {
    return [...orders]
      .filter((o) => !o.done && !o.claimedBy)
      .sort((a, b) => priority(b) - priority(a));
  }, [orders, tick]);

  const inProgress = orders.filter((o) => o.claimedBy && !o.done);
  const completed = orders.filter((o) => o.done).slice(-5);

  function addLog(line: string) {
    setLog((l) => [line, ...l].slice(0, 12));
  }

  function addOrder() {
    const o = seedOrder();
    o.createdAt = Date.now();
    setOrders((prev) => [...prev, o]);
    addLog(`🧾 New ${o.channel} order ${o.id} — ${o.item}${o.riderEta ? ` (rider ETA ${o.riderEta}m)` : ""}`);
  }

  function claim(orderId: string, station: StationKey) {
    if (!checkedIn[station]) {
      addLog(`⛔ ${STATIONS[station].chef} not checked in at ${STATIONS[station].label}`);
      return;
    }
    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (!target) return prev;
      if (target.claimedBy) {
        setDuplicateAttempt(orderId);
        addLog(`🚨 DUPLICATE BLOCKED · ${orderId} already claimed by ${target.claimedBy}`);
        setTimeout(() => setDuplicateAttempt(null), 1800);
        return prev;
      }
      addLog(`🔒 ${STATIONS[station].chef} claimed ${orderId} at ${STATIONS[station].label}`);
      setActiveStation(station);
      setTimeout(() => setActiveStation(null), 1500);
      return prev.map((o) => (o.id === orderId ? { ...o, claimedBy: STATIONS[station].chef, stage: station } : o));
    });
  }

  function advance(orderId: string) {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const idx = STATION_ORDER.indexOf(o.stage);
      if (idx === STATION_ORDER.length - 1) {
        addLog(`✅ ${orderId} — ${o.item} OUT THE DOOR`);
        return { ...o, done: true, claimedBy: null };
      }
      const next = STATION_ORDER[idx + 1];
      addLog(`➡️  ${orderId} handed off ${STATIONS[o.stage].label} → ${STATIONS[next].label}`);
      const key = orderId + "-" + Date.now();
      setChips((c) => [...c, { from: o.stage, to: next, color: STATIONS[next].color, key }]);
      setTimeout(() => setChips((c) => c.filter((x) => x.key !== key)), 2200);
      return { ...o, stage: next, claimedBy: null };
    }));
  }

  function toggleCheckIn(s: StationKey) {
    setCheckedIn((c) => {
      const now = !c[s];
      addLog(now
        ? `🟢 ${STATIONS[s].chef} checked into ${STATIONS[s].label}`
        : `🔴 ${STATIONS[s].chef} checked out of ${STATIONS[s].label}`);
      return { ...c, [s]: now };
    });
  }

  function attemptDuplicate() {
    const anyClaimed = orders.find((o) => o.claimedBy && !o.done);
    if (!anyClaimed) {
      addLog("ℹ️ No claimed order to try duplicating yet.");
      return;
    }
    claim(anyClaimed.id, "grill");
  }

  return (
    <main className="min-h-screen grid-bg text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/60 hover:text-white text-sm">← Back</Link>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-300 flex items-center justify-center font-black text-black">W</div>
          <span className="font-bold tracking-tight">WasteZero · 3D Kitchen Demo</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={addOrder} className="bg-brand-500 hover:bg-brand-600 text-black font-semibold text-sm px-4 py-2 rounded-lg">
            + New Order
          </button>
          <button onClick={attemptDuplicate} className="glass hover:bg-white/10 text-sm px-4 py-2 rounded-lg">
            Try Duplicate Claim
          </button>
        </div>
      </nav>

      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-60px)]">
        {/* LEFT: Queue */}
        <aside className="col-span-3 glass rounded-2xl p-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-bold tracking-wide">PRIORITY QUEUE</h3>
            <span className="text-xs text-brand-500">{queue.length} waiting</span>
          </div>
          <p className="text-xs text-white/50 mt-1">Sorted by channel + rider ETA + age</p>
          <div className="mt-4 space-y-2">
            {queue.map((o, i) => (
              <div key={o.id} className={`rounded-xl p-3 border ${i === 0 ? "border-brand-500 bg-brand-500/10" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/60">{o.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-black ${channelColor(o.channel)}`}>{o.channel}</span>
                </div>
                <div className="font-semibold mt-1">{o.item}</div>
                <div className="text-xs text-white/60 mt-1">
                  {o.riderEta ? `Rider ETA ${o.riderEta}m · ` : ""}
                  age {Math.max(0, Math.round((Date.now() - o.createdAt) / 1000))}s
                </div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {STATION_ORDER.map((s) => (
                    <button
                      key={s}
                      onClick={() => claim(o.id, s)}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-white/10 hover:bg-white/20 uppercase tracking-wide"
                    >
                      {STATIONS[s].label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {queue.length === 0 && <div className="text-white/40 text-sm italic mt-4">Line is clear. 🎉</div>}
          </div>
        </aside>

        {/* CENTER: 3D Scene */}
        <section className="col-span-6 glass rounded-2xl relative overflow-hidden">
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            <div className="text-[10px] uppercase tracking-widest text-white/60">Live Kitchen · Top-down</div>
            <div className="text-xs text-white/50">Drag to rotate · scroll to zoom</div>
          </div>
          {duplicateAttempt && (
            <div className="absolute top-3 right-3 z-10 bg-red-500 text-black font-bold px-4 py-2 rounded-lg shadow-2xl">
              🚨 CV CAMERA: Duplicate claim blocked on {duplicateAttempt}
            </div>
          )}
          <Canvas shadows camera={{ position: [0, 8, 11], fov: 42 }}>
            <color attach="background" args={["#050505"]} />
            <Scene checkedIn={checkedIn} activeStation={activeStation} movingOrders={chips} />
          </Canvas>

          {/* Station check-in bar */}
          <div className="absolute bottom-3 left-3 right-3 glass rounded-xl p-3 flex items-center justify-between">
            {STATION_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => toggleCheckIn(s)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition ${
                  checkedIn[s] ? "bg-brand-500 text-black" : "bg-white/10 text-white/60"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${checkedIn[s] ? "bg-black" : "bg-white/40"}`}></span>
                {STATIONS[s].chef} · {STATIONS[s].label}
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT: Active + Log */}
        <aside className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="glass rounded-2xl p-4 flex-1 overflow-y-auto">
            <h3 className="font-bold tracking-wide">IN PROGRESS</h3>
            <p className="text-xs text-white/50 mt-1">Claimed tickets, locked to one chef</p>
            <div className="mt-3 space-y-2">
              {inProgress.map((o) => (
                <div key={o.id} className="rounded-xl p-3 border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white/60">{o.id}</span>
                    <span className="text-[10px] text-brand-500 font-bold">🔒 {o.claimedBy}</span>
                  </div>
                  <div className="font-semibold mt-1">{o.item}</div>
                  <div className="flex items-center gap-1 mt-2">
                    {STATION_ORDER.map((s, i) => {
                      const idx = STATION_ORDER.indexOf(o.stage);
                      return (
                        <div
                          key={s}
                          className={`flex-1 h-1.5 rounded-full ${i <= idx ? "bg-brand-500" : "bg-white/10"}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] uppercase tracking-wide text-white/50">
                    {STATION_ORDER.map((s) => <span key={s}>{STATIONS[s].label}</span>)}
                  </div>
                  <button
                    onClick={() => advance(o.id)}
                    className="w-full mt-3 bg-white/10 hover:bg-white/20 text-xs font-bold py-2 rounded-lg uppercase tracking-wide"
                  >
                    Check out → {o.stage === "plate" ? "Serve" : "Next station"}
                  </button>
                </div>
              ))}
              {inProgress.length === 0 && <div className="text-white/40 text-sm italic mt-3">Nothing on the line.</div>}
            </div>

            <h3 className="font-bold tracking-wide mt-6">SERVED</h3>
            <div className="mt-2 space-y-1">
              {completed.map((o) => (
                <div key={o.id} className="text-xs text-white/50 flex justify-between">
                  <span className="font-mono">{o.id}</span>
                  <span>{o.item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 h-60 overflow-y-auto">
            <h3 className="font-bold tracking-wide">EVENT LOG</h3>
            <div className="mt-2 text-xs font-mono text-white/70 space-y-1">
              {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
