"use client";

import { useState } from "react";
import { Cinzel, Lato } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });

// ── Types ────────────────────────────────────────────────────────────────────
interface Challenge {
  id: number;
  label: string;
  effort: number;
  icon: string;
  duration: string;
}

interface ActivityType {
  id: string;
  label: string;
  icon: string;
  baseEffort: number;
}

interface RankThreshold {
  rank: string;
  min: number;
  color: string;
  glow: string;
}

interface Activity {
  id: number;
  label: string;
  icon: string;
  buff: number;
  isPr: boolean;
  ts: Date;
}

interface Reward {
  buff: number;
  label: string;
  icon: string;
  isPr: boolean;
  newDays: number;
}

// ── Constants ────────────────────────────────────────────────────────────────
const CHALLENGES: Challenge[] = [
  { id: 1, label: "2 min jog",     effort: 0.3,  icon: "🏃", duration: "2 min"   },
  { id: 2, label: "10 min walk",   effort: 0.4,  icon: "🚶", duration: "10 min"  },
  { id: 3, label: "500m run",      effort: 0.55, icon: "⚡", duration: "~5 min"  },
  { id: 4, label: "Light workout", effort: 0.6,  icon: "💪", duration: "15 min"  },
  { id: 5, label: "1km run",       effort: 0.75, icon: "🔥", duration: "~8 min"  },
  { id: 6, label: "30 min walk",   effort: 0.65, icon: "🌿", duration: "30 min"  },
  { id: 7, label: "Full workout",  effort: 0.9,  icon: "⚔️", duration: "30 min"  },
  { id: 8, label: "5km run",       effort: 1.0,  icon: "🏆", duration: "~30 min" },
];

const ACTIVITY_TYPES: ActivityType[] = [
  { id: "walk",    label: "Walk",    icon: "🚶", baseEffort: 0.4 },
  { id: "jog",     label: "Jog",     icon: "🏃", baseEffort: 0.6 },
  { id: "run",     label: "Run",     icon: "⚡", baseEffort: 0.8 },
  { id: "workout", label: "Workout", icon: "💪", baseEffort: 0.7 },
];

const RANK_THRESHOLDS: RankThreshold[] = [
  { rank: "Sedentary",   min: 0,    color: "#6b7280", glow: "#374151" },
  { rank: "Lightly active",  min: 200,   color: "#86efac", glow: "#166534" },
  { rank: "Active",  min: 400,  color: "#4ade80", glow: "#15803d" },
  { rank: "Consistent",     min: 600,  color: "#22c55e", glow: "#16a34a" },
  { rank: "Driven",  min: 800,  color: "#84cc16", glow: "#3f6212" },
  { rank: "Elite", min: 1000, color: "#facc15", glow: "#713f12" },
];

// ── Pure functions ────────────────────────────────────────────────────────────
function getRank(vitality: number): RankThreshold {
  let r = RANK_THRESHOLDS[0];
  for (const t of RANK_THRESHOLDS) if (vitality >= t.min) r = t;
  return r;
}

function getNextRank(vitality: number): RankThreshold | null {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (RANK_THRESHOLDS[i].min > vitality) continue;
    return RANK_THRESHOLDS[i + 1] ?? null;
  }
  return null;
}

// Consecutive active days (0–8) → multiplier 1.0–2.0
function momentumMultiplier(days: number): number {
  return 1.0 + Math.min(days, 8 * 0.125);
}

function calcBuff(effortScore: number, days: number): number {
  const base = Math.round(effortScore * 30);
  return Math.round(base * momentumMultiplier(days));
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function updatedStreakDays(lastActiveDate: string | null, consecutiveDays: number): number {
  const t = todayStr();
  if (!lastActiveDate) return 1;
  if (lastActiveDate === t) return consecutiveDays;
  const diff = (new Date(t).getTime() - new Date(lastActiveDate).getTime()) / 86400000;
  if (diff === 1) return Math.min(8, consecutiveDays + 1);
  return 1; // gap — reset to 1, not 0 (returning is rewarded)
}

// ── Component ────────────────────────────────────────────────────────────────
export default function VitalityApp() {
  const [tab, setTab] = useState<"log" | "feed" | "stats">("log");
  const [vitality, setVitality] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const [customType, setCustomType] = useState("walk");
  const [customDuration, setCustomDuration] = useState(15);
  const [customDistance, setCustomDistance] = useState(0);
  const [prDistance, setPrDistance] = useState(0);
  const [prDuration, setPrDuration] = useState(0);

  const rank = getRank(vitality);
  const nextRank = getNextRank(vitality);
  const xpIntoRank = vitality - rank.min;
  const xpNeeded = nextRank ? nextRank.min - rank.min : 1;
  const xpPct = nextRank ? Math.min(100, (xpIntoRank / xpNeeded) * 100) : 100;
  const multiplier = momentumMultiplier(streakDays);

  function applyStreak(): number {
    const newDays = updatedStreakDays(lastActiveDate, streakDays);
    setStreakDays(newDays);
    setLastActiveDate(todayStr());
    return newDays;
  }

  function logChallenge() {
    if (!selectedChallenge) return;
    const c = CHALLENGES.find((x) => x.id === selectedChallenge)!;
    const newDays = applyStreak();
    const buff = calcBuff(c.effort, newDays);
    setVitality((v) => v + buff);
    setActivities((a) => [
      { id: Date.now(), label: c.label, icon: c.icon, buff, isPr: false, ts: new Date() },
      ...a,
    ]);
    setReward({ buff, label: c.label, icon: c.icon, isPr: false, newDays });
    setSelectedChallenge(null);
  }

  function logCustom() {
    const type = ACTIVITY_TYPES.find((t) => t.id === customType)!;
    let effort = type.baseEffort;
    if (customDuration > 10) effort += 0.05 * Math.log(customDuration / 10);
    if (customDistance > 1) effort += 0.08 * Math.log(customDistance);
    effort = Math.min(1, effort);

    const newDays = applyStreak();
    const buff = calcBuff(effort, newDays);

    let isPr = false;
    if (customDistance > 0 && customDistance > prDistance) { setPrDistance(customDistance); isPr = true; }
    if (customDuration > 0 && customDuration > prDuration) { setPrDuration(customDuration); isPr = true; }

    setVitality((v) => v + buff);
    setActivities((a) => [
      {
        id: Date.now(),
        label: `${type.label} ${customDuration}min${customDistance ? ` · ${customDistance}km` : ""}`,
        icon: type.icon, buff, isPr, ts: new Date(),
      },
      ...a,
    ]);
    setReward({ buff, label: type.label, icon: type.icon, isPr, newDays });
  }

  function formatTs(ts: Date): string {
    return ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <main
      className={lato.className}
      style={{
        minHeight: "100vh",
        background: "#0a0f0a",
        color: "#d1fae5",
      }}
    >
      <style>{`
        :root {
          --bg: #0a0f0a; --surface: #111711; --surface2: #162016;
          --border: #1e2e1e; --green: #22c55e; --green-dim: #166534;
          --gold: #facc15; --text: #d1fae5; --muted: #4b6b52;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); }

        .vs-app { max-width: 420px; margin: 0 auto; padding: 0 0 80px; position: relative; }

        .vs-header { padding: 24px 20px 16px; }
        .vs-header-sub { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
        .vs-header-title { font-size: 22px; font-weight: 700; color: var(--green); letter-spacing: 1px; }

        .vs-card { margin: 0 16px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; position: relative; overflow: hidden; }
        .vs-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 100%, #22c55e08 0%, transparent 70%); pointer-events: none; }

        .vs-rank-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .vs-rank-badge { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; border: 1px solid currentColor; transition: all 0.4s; }
        .vs-vp-number { font-size: 44px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
        .vs-vp-label { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }

        .vs-bar-wrap { margin-bottom: 6px; }
        .vs-bar-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 5px; }
        .vs-bar-track { height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
        .vs-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--green-dim), var(--green)); transition: width 0.8s cubic-bezier(.22,1,.36,1); box-shadow: 0 0 8px var(--green); }

        .vs-momentum-row { margin-top: 14px; display: flex; align-items: center; gap: 10px; }
        .vs-momentum-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); min-width: 90px; }
        .vs-pips { display: flex; gap: 4px; }
        .vs-pip { width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface2); transition: all 0.3s; }
        .vs-pip.on { background: var(--green); border-color: var(--green); box-shadow: 0 0 6px var(--green); }

        .vs-tabs { display: flex; gap: 2px; margin: 0 16px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 4px; }
        .vs-tab { flex: 1; padding: 9px 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; text-align: center; border-radius: 9px; border: none; cursor: pointer; background: transparent; color: var(--muted); transition: all 0.2s; }
        .vs-tab.on { background: var(--surface2); color: var(--green); box-shadow: 0 0 10px #22c55e18; }

        .vs-section { margin: 0 16px; }
        .vs-section-title { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }

        .vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
        .vs-challenge { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 12px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .vs-challenge:hover { border-color: var(--green-dim); background: var(--surface2); transform: translateY(-1px); }
        .vs-challenge.on { border-color: var(--green); background: var(--surface2); box-shadow: 0 0 16px #22c55e22; }
        .vs-c-icon { font-size: 22px; margin-bottom: 6px; }
        .vs-c-label { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
        .vs-c-dur { font-size: 11px; color: var(--muted); }
        .vs-c-buff { margin-top: 6px; font-size: 11px; color: var(--green); letter-spacing: 1px; }

        .vs-btn { width: 100%; padding: 16px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid var(--green); border-radius: 12px; background: linear-gradient(135deg, #0f2d0f, #162e16); color: var(--green); cursor: pointer; transition: all 0.2s; margin-bottom: 24px; box-shadow: 0 0 20px #22c55e18; }
        .vs-btn:hover:not(:disabled) { background: linear-gradient(135deg, #14381a, #1a3d1a); box-shadow: 0 0 28px #22c55e33; transform: translateY(-1px); }
        .vs-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .vs-custom { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 24px; }
        .vs-custom-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
        .vs-type-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
        .vs-type-btn { padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; font-size: 12px; transition: all 0.2s; }
        .vs-type-btn.on { border-color: var(--green); color: var(--green); background: #22c55e12; }
        .vs-slider-row { margin-bottom: 14px; }
        .vs-slider-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
        input[type=range] { width: 100%; accent-color: var(--green); cursor: pointer; }

        .vs-feed { display: flex; flex-direction: column; gap: 10px; }
        .vs-feed-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .vs-feed-icon { font-size: 24px; }
        .vs-feed-content { flex: 1; }
        .vs-feed-label { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
        .vs-feed-meta { font-size: 11px; color: var(--muted); }
        .vs-feed-buff { font-size: 16px; color: var(--green); font-weight: 700; }
        .vs-pr-badge { background: #71320011; border: 1px solid var(--gold); border-radius: 6px; padding: 2px 7px; font-size: 10px; color: var(--gold); letter-spacing: 1px; margin-top: 3px; display: inline-block; }

        .vs-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .vs-stat-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
        .vs-stat-val { font-size: 26px; font-weight: 700; color: var(--green); margin-bottom: 2px; }
        .vs-stat-lbl { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }

        .vs-pr-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
        .vs-pr-item { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; }
        .vs-pr-name { font-size: 13px; font-weight: 700; }
        .vs-pr-val { font-size: 14px; color: var(--gold); }

        .vs-phil { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; font-size: 13px; line-height: 1.6; color: var(--muted); }
        .vs-phil strong { color: var(--text); }

        .vs-empty { text-align: center; padding: 32px 20px; color: var(--muted); font-size: 13px; line-height: 1.7; }
        .vs-empty-icon { font-size: 36px; margin-bottom: 10px; }

        .vs-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 420px; background: var(--surface); border-top: 1px solid var(--border); display: flex; z-index: 10; }
        .vs-nav-btn { flex: 1; padding: 14px 8px 12px; display: flex; flex-direction: column; align-items: center; gap: 3px; border: none; background: transparent; cursor: pointer; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); transition: all 0.2s; }
        .vs-nav-btn.on { color: var(--green); }
        .vs-nav-icon { font-size: 20px; }

        .vs-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: #00000088; backdrop-filter: blur(4px); }
        .vs-reward-card { background: var(--surface); border: 1px solid var(--green); border-radius: 20px; padding: 32px 28px; text-align: center; max-width: 300px; width: 90%; box-shadow: 0 0 60px #22c55e33; animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1); }
        @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .vs-reward-icon { font-size: 48px; margin-bottom: 12px; }
        .vs-reward-title { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
        .vs-reward-buff { font-size: 52px; font-weight: 700; color: var(--green); line-height: 1; margin-bottom: 4px; text-shadow: 0 0 30px var(--green); }
        .vs-reward-sub { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
        .vs-reward-pr { display: inline-block; background: #71320022; border: 1px solid var(--gold); border-radius: 8px; padding: 6px 14px; font-size: 12px; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
        .vs-reward-close { width: 100%; padding: 13px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid var(--green); border-radius: 10px; background: #22c55e18; color: var(--green); cursor: pointer; }
      `}</style>

      <div className="vs-app">
        {/* Header */}
        <div className="vs-header">
          <div className={`vs-header-sub ${cinzel.className}`}>Vitality System</div>
          <div className={`vs-header-title ${cinzel.className}`}>Your Journey</div>
        </div>

        {/* Vitality card */}
        <div className="vs-card">
          <div className="vs-rank-row">
            <span className={`vs-rank-badge ${cinzel.className}`} style={{ color: rank.color, borderColor: rank.color }}>
              {rank.rank}
            </span>
            {nextRank && (
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                → {nextRank.rank} in {nextRank.min - vitality} VP
              </span>
            )}
          </div>
          <div className={`vs-vp-number ${cinzel.className}`} style={{ color: rank.color, textShadow: `0 0 30px ${rank.glow}` }}>
            {vitality}
          </div>
          <div className="vs-vp-label">Vitality Points</div>
          <div className="vs-bar-wrap">
            <div className="vs-bar-labels">
              <span>{rank.rank}</span>
              {nextRank && <span>{nextRank.rank}</span>}
            </div>
            <div className="vs-bar-track">
              <div className="vs-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
          <div className="vs-momentum-row">
            <span className="vs-momentum-label">Momentum</span>
            <div className="vs-pips">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`vs-pip ${i < streakDays ? "on" : ""}`} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>
            +{((multiplier - 1) * 100).toFixed(0)}% bonus vitality {streakDays >= 8 ? "🔥" :  `consectutive days: ${streakDays}`}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="vs-tabs">
          {(["log", "feed", "stats"] as const).map((id) => (
            <button key={id} className={`vs-tab ${cinzel.className} ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>
              {id === "log" ? "⚔️ Log" : id === "feed" ? "📜 Feed" : "📊 Stats"}
            </button>
          ))}
        </div>

            {/* Custom activity */}
            <div className="vs-custom">
              <div className={`vs-custom-title ${cinzel.className}`}>Custom Activity</div>
              <div className="vs-type-row">
                {ACTIVITY_TYPES.map((t) => (
                  <button key={t.id} className={`vs-type-btn ${customType === t.id ? "on" : ""}`} onClick={() => setCustomType(t.id)}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <div className="vs-slider-row">
                <div className="vs-slider-label">
                  <span>Duration</span>
                  <span style={{ color: "var(--green)" }}>{customDuration} min</span>
                </div>
                <input type="range" min={1} max={120} value={customDuration} onChange={(e) => setCustomDuration(Number(e.target.value))} />
              </div>
              <div className="vs-slider-row">
                <div className="vs-slider-label">
                  <span>Distance (optional)</span>
                  <span style={{ color: "var(--green)" }}>{customDistance} km</span>
                </div>
                <input type="range" min={0} max={20} step={0.5} value={customDistance} onChange={(e) => setCustomDistance(Number(e.target.value))} />
              </div>
              <button className={`vs-btn ${cinzel.className}`} onClick={logCustom} style={{ marginBottom: 0 }}>
                Log Custom Activity
              </button>
            </div>

            {/* Log tab */}
        {tab === "log" && (
          <div className="vs-section">
            <div className={`vs-section-title ${cinzel.className}`}>Guided Challenges</div>
            <div className="vs-grid">
              {CHALLENGES.map((c) => (
                <div
                  key={c.id}
                  className={`vs-challenge ${selectedChallenge === c.id ? "on" : ""}`}
                  onClick={() => setSelectedChallenge(selectedChallenge === c.id ? null : c.id)}
                >
                  <div className="vs-c-icon">{c.icon}</div>
                  <div className="vs-c-label">{c.label}</div>
                  <div className="vs-c-dur">{c.duration}</div>
                  <div className={`vs-c-buff ${cinzel.className}`}>+{calcBuff(c.effort, streakDays)} Vitality</div>
                </div>
              ))}
            </div>
            <button className={`vs-btn ${cinzel.className}`} disabled={!selectedChallenge} onClick={logChallenge}>
              {selectedChallenge
                ? `Log — +${calcBuff(CHALLENGES.find((x) => x.id === selectedChallenge)?.effort ?? 0, streakDays)} Vitality`
                : "Select a Challenge"}
            </button>
          </div>
        )}

        {/* Feed tab */}
        {tab === "feed" && (
          <div className="vs-section">
            {activities.length === 0 ? (
              <div className="vs-empty">
                <div className="vs-empty-icon">🌱</div>
                <div>No activities yet.<br />Your journey starts with the first step.</div>
              </div>
            ) : (
              <div className="vs-feed">
                {activities.map((a) => (
                  <div key={a.id} className="vs-feed-item">
                    <div className="vs-feed-icon">{a.icon}</div>
                    <div className="vs-feed-content">
                      <div className="vs-feed-label">{a.label}</div>
                      <div className="vs-feed-meta">{formatTs(a.ts)}</div>
                      {a.isPr && <div className="vs-pr-badge">✨ Personal Best</div>}
                    </div>
                    <div className={`vs-feed-buff ${cinzel.className}`}>+{a.buff}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats tab */}
        {tab === "stats" && (
          <div className="vs-section">
            <div className={`vs-section-title ${cinzel.className}`}>Overview</div>
            <div className="vs-stats-grid">
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`}>{vitality}</div>
                <div className="vs-stat-lbl">Total Vitality</div>
              </div>
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`}>{activities.length}</div>
                <div className="vs-stat-lbl">Activities</div>
              </div>
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`}>{streakDays}/8</div>
                <div className="vs-stat-lbl">Day Streak</div>
              </div>
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`} style={{ color: "var(--gold)" }}>
                  {activities.filter((a) => a.isPr).length}
                </div>
                <div className="vs-stat-lbl">Personal Bests</div>
              </div>
            </div>

            <div className={`vs-section-title ${cinzel.className}`}>Personal Records</div>
            <div className="vs-pr-list">
              <div className="vs-pr-item">
                <div>
                  <div className="vs-pr-name">Best Distance</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Furthest recorded</div>
                </div>
                <div className={`vs-pr-val ${cinzel.className}`}>{prDistance > 0 ? `${prDistance} km `: "—"}</div>
              </div>
              <div className="vs-pr-item">
                <div>
                  <div className="vs-pr-name">Longest Session</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Most time in one activity</div>
                </div>
                <div className={`vs-pr-val ${cinzel.className}`}>{prDuration > 0 ? `${prDuration} min `: "—"}</div>
              </div>
            </div>

            <div className={`vs-section-title ${cinzel.className}`}>Philosophy</div>
            <div className="vs-phil"><strong>Every intentional movement matters.</strong> Nothing counts unless chosen deliberately — so everything you log is a real choice.</div>
            <div className="vs-phil"><strong>Progress is never lost.</strong> Breaks slow your momentum, but your Vitality stays with you forever.</div>
            <div className="vs-phil"><strong>Small is always valid. Big is always exciting.</strong> A 2-minute jog and a 5km run both belong here.</div>
          </div>
        )}

        {/* Bottom nav */}
        <nav className="vs-nav">
          {(["log", "feed", "stats"] as const).map((id) => (
            <button key={id} className={`vs-nav-btn ${cinzel.className} ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>
              <span className="vs-nav-icon">{id === "log" ? "⚔️" : id === "feed" ? "📜" : "📊"}</span>
              {id}
            </button>
          ))}
        </nav>

        {/* Reward popup */}
        {reward && (
          <div className="vs-overlay" onClick={() => setReward(null)}>
            <div className="vs-reward-card" onClick={(e) => e.stopPropagation()}>
              <div className="vs-reward-icon">{reward.icon}</div>
              <div className={`vs-reward-title ${cinzel.className}`}>Vitality Gained</div>
              <div className={`vs-reward-buff ${cinzel.className}`}>+{reward.buff}</div>
              <div className="vs-reward-sub">
                Momentum x{momentumMultiplier(reward.newDays).toFixed(2)} · Day {reward.newDays}
              </div>
              {reward.isPr && <div className={`vs-reward-pr ${cinzel.className}`}>✨ New Personal Best!</div>}
              <button className={`vs-reward-close ${cinzel.className}`} onClick={() => setReward(null)}>
                Keep Moving
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}