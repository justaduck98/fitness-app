"use client";

import { useState } from "react";
import { Cinzel, Lato } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });

// ── i18n ─────────────────────────────────────────────────────────────────────
type Lang = "en" | "sv";

const translations = {
  en: {
    appSubtitle: "Vitality System",
    appTitle: "Your Journey",
    nextRankIn: (name: string, pts: number) => `→ ${name} in ${pts} VP`,
    vpLabel: "Vitality Points",
    momentum: "Momentum",
    momentumBonus: (pct: string, days: number) => `+${pct}% bonus — day ${days}`,
    tabLog: "Log",
    tabChallenges: "Challenges",
    tabFeed: "Feed",
    tabStats: "Stats",
    tabLogIcon: "⚔️",
    tabChallengesIcon: "🏅",
    tabFeedIcon: "📜",
    tabStatsIcon: "📊",
    guidedChallenges: "Guided Challenges",
    logChallengeCta: (pts: number) => `Log — +${pts} Vitality`,
    selectChallenge: "Select a Challenge",
    customActivity: "Custom Activity",
    logCustomCta: "Log Custom Activity",
    duration: "Duration",
    distance: "Distance (optional)",
    emptyFeed: "No activities yet.\nYour journey starts with the first step.",
    personalBest: "✨ Personal Best",
    statsOverview: "Overview",
    statTotalVitality: "Total Vitality",
    statActivities: "Activities",
    statDayStreak: "Day Streak",
    statPersonalBests: "Personal Bests",
    personalRecords: "Personal Records",
    bestDistance: "Best Distance",
    bestDistanceSub: "Furthest recorded",
    longestSession: "Longest Session",
    longestSessionSub: "Most time in one activity",
    philosophy: "Philosophy",
    phil1Title: "Every intentional movement matters.",
    phil1Body: "Nothing counts unless chosen deliberately — so everything you log is a real choice.",
    phil2Title: "Progress is never lost.",
    phil2Body: "Breaks slow your momentum, but your Vitality stays with you forever.",
    phil3Title: "Small is always valid. Big is always exciting.",
    phil3Body: "A 2-minute jog and a 5km run both belong here.",
    rewardTitle: "Vitality Gained",
    rewardSub: (mult: string, day: number) => `Momentum x${mult} · Day ${day}`,
    newPersonalBest: "✨ New Personal Best!",
    keepMoving: "Keep Moving",
    challengeVitality: (pts: number) => `+${pts} Vitality`,
    // Onboarding
    onboardingTitle: "Welcome",
    onboardingSubtitle: "Let's set you up",
    genderLabel: "I am",
    genderMale: "Male",
    genderFemale: "Female",
    weightLabel: "Weight (optional)",
    weightUnit: "kg",
    ctaGo: "Let's go! 🚀",
    ctaHow: "How does this work? 🤔",
    // Explainer slides
    slides: [
      { emoji: "⚔️", title: "Log your workouts", body: "Every activity you log earns you Vitality points. The harder the effort, the more you earn." },
      { emoji: "🔥", title: "Build your streak", body: "Log every day to build momentum. Consecutive days multiply your Vitality gains — up to 100% more points!" },
      { emoji: "📜", title: "Track your progress", body: "The Feed shows every activity you've logged. Stats shows your total Vitality, streaks, and personal records." },
      { emoji: "🏆", title: "Climb the ranks", body: "Rise from Sedentary all the way to Elite. Every point you earn is yours forever — progress never resets." },
    ],
    slideNext: "Next →",
    slideBack: "← Back",
    slideDone: "Got it, let's go! 🚀",
    ranks: {
      Sedentary: "Sedentary",
      "Lightly active": "Lightly Active",
      Active: "Active",
      Consistent: "Consistent",
      Driven: "Driven",
      Elite: "Elite",
    },
    activityTypes: {
      walk: "Walk",
      jog: "Jog",
      run: "Run",
      workout: "Workout",
      
    },

    workoutFocus: "Training Focus",
    focusStrength: "Strength",
    focusEndurance: "Endurance",

    challenges: {
      "2 min jog": "2 min jog",
      "10 min walk": "10 min walk",
      "500m run": "500m run",
      "Light workout": "Light workout",
      "1km run": "1km run",
      "30 min walk": "30 min walk",
      "Full workout": "Full workout",
      "5km run": "5km run",
    },
  },
  sv: {
    appSubtitle: "Konditionssystemet",
    appTitle: "Din Resa",
    nextRankIn: (name: string, pts: number) => `→ ${name} om ${pts} KP`,
    vpLabel: "Konditionspoäng",
    momentum: "Momentum",
    momentumBonus: (pct: string, days: number) => `+${pct}% bonus — dag ${days}`,
    tabLog: "Logga",
    tabChallenges: "Utmaningar",
    tabFeed: "Flöde",
    tabStats: "Statistik",
    tabLogIcon: "⚔️",
    tabChallengesIcon: "🏅",
    tabFeedIcon: "📜",
    tabStatsIcon: "📊",
    guidedChallenges: "Guidade Utmaningar",
    logChallengeCta: (pts: number) => `Logga — +${pts} Kondition`,
    selectChallenge: "Välj en Utmaning",
    customActivity: "Egen Aktivitet",
    logCustomCta: "Logga Egen Aktivitet",
    duration: "Varaktighet",
    distance: "Sträcka (valfritt)",
    emptyFeed: "Inga aktiviteter ännu.\nDin resa börjar med det första steget.",
    personalBest: "✨ Personligt Rekord",
    statsOverview: "Översikt",
    statTotalVitality: "Total Kondition",
    statActivities: "Aktiviteter",
    statDayStreak: "Dagssvit",
    statPersonalBests: "Personliga Rekord",
    personalRecords: "Personliga Rekord",
    bestDistance: "Bästa Sträcka",
    bestDistanceSub: "Längst någonsin",
    longestSession: "Längsta Passet",
    longestSessionSub: "Mest tid i ett pass",
    philosophy: "Filosofi",
    phil1Title: "Varje medveten rörelse räknas.",
    phil1Body: "Inget räknas om det inte är ett val — allt du loggar är ett riktigt beslut.",
    phil2Title: "Framsteg försvinner aldrig.",
    phil2Body: "Pauser bromsar ditt momentum, men din kondition är din för alltid.",
    phil3Title: "Litet är alltid giltigt. Stort är alltid spännande.",
    phil3Body: "En 2-minuters jogg och ett 5km-lopp hör båda hemma här.",
    rewardTitle: "Kondition Uppnådd",
    rewardSub: (mult: string, day: number) => `Momentum x${mult} · Dag ${day}`,
    newPersonalBest: "✨ Nytt Personligt Rekord!",
    keepMoving: "Fortsätt Röra Dig",
    challengeVitality: (pts: number) => `+${pts} Kondition`,
    // Onboarding
    onboardingTitle: "Välkommen",
    onboardingSubtitle: "Vem är du?",
    genderLabel: "Jag är",
    genderMale: "Man",
    genderFemale: "Kvinna",
    weightLabel: "Vikt (valfritt)",
    weightUnit: "kg",
    ctaGo: "Sätt igång! 🚀",
    ctaHow: "Hur fungerar det? 🤔",
    // Explainer slides
    slides: [
      { emoji: "⚔️", title: "Logga dina träningspass", body: "Varje aktivitet du loggar ger dig konditionspoäng. Ju hårdare ansträngning, desto mer tjänar du." },
      { emoji: "🔥", title: "Bygg dina vanor", body: "Logga varje dag för att bygga momentum. Varje dag du loggar i rad ökar konditionspoängen du tjänar in — upp till 100% mer poäng!" },
      { emoji: "📜", title: "Följ dina framsteg", body: "Flödet visar varje aktivitet du loggat. Statistik visar din totala kondition, streaks och personliga rekord." },
      { emoji: "🏆", title: "Klättra i rankingen", body: "Ranka upp! Börja från Stillasittande - hela vägen till Elit! Varje poäng du tjänar är dina för alltid — framsteg återställs aldrig." },
    ],
    slideNext: "Nästa →",
    slideBack: "← Tillbaka",
    slideDone: "Fattat, kör igång! 🚀",
    ranks: {
      Sedentary: "Stillasittande",
      "Lightly active": "Lätt Aktiv",
      Active: "Aktiv",
      Consistent: "Konsekvent",
      Driven: "Driven",
      Elite: "Elit",
    },
    activityTypes: {
      walk: "Promenad",
      jog: "Jogg",
      run: "Löpning",
      workout: "Träning",
    },

    workoutFocus: "Träningsfokus",
    focusStrength: "Styrka",
    focusEndurance: "Uthållighet",

    challenges: {
      "2 min jog": "2 min jogg",
      "10 min walk": "10 min promenad",
      "500m run": "500m löpning",
      "Light workout": "Lätt träning",
      "1km run": "1km löpning",
      "30 min walk": "30 min promenad",
      "Full workout": "Fullt träningspass",
      "5km run": "5km löpning",
    },
  },
} as const;

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
  { rank: "Sedentary",      min: 0,    color: "#6b7280", glow: "#374151" },
  { rank: "Lightly active", min: 200,  color: "#86efac", glow: "#166534" },
  { rank: "Active",         min: 400,  color: "#4ade80", glow: "#15803d" },
  { rank: "Consistent",     min: 600,  color: "#22c55e", glow: "#16a34a" },
  { rank: "Driven",         min: 800,  color: "#84cc16", glow: "#3f6212" },
  { rank: "Elite",          min: 1000, color: "#facc15", glow: "#713f12" },
];

// ── Pure functions ────────────────────────────────────────────────────────────
function getRank(v: number): RankThreshold {
  let r = RANK_THRESHOLDS[0];
  for (const t of RANK_THRESHOLDS) if (v >= t.min) r = t;
  return r;
}
function getNextRank(v: number): RankThreshold | null {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (RANK_THRESHOLDS[i].min > v) continue;
    return RANK_THRESHOLDS[i + 1] ?? null;
  }
  return null;
}
function momentumMultiplier(days: number): number {
  return 1.0 + Math.min(days, 8) * 0.125;
}
function calcBuff(effortScore: number, days: number): number {
  return Math.round(Math.round(effortScore * 30) * momentumMultiplier(days));
}
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
function updatedStreakDays(lastActiveDate: string | null, consecutiveDays: number): number {
  const today = todayStr();
  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return consecutiveDays;
  const diff = (new Date(today).getTime() - new Date(lastActiveDate).getTime()) / 86400000;
  if (diff === 1) return Math.min(8, consecutiveDays + 1);
  return 1;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function VitalityApp() {
  const [lang, setLang] = useState<Lang>("en");
  const tr = translations[lang];

  // Onboarding state
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [showExplainer, setShowExplainer] = useState(false);
  const [explainerSlide, setExplainerSlide] = useState(0);

  // App state
  const [tab, setTab] = useState<"log" | "challenges" | "feed" | "stats">("log");
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
  const [workoutFocus, setWorkoutFocus] = useState<"strength" | "endurance">("strength");

  const rank = getRank(vitality);
  const nextRank = getNextRank(vitality);
  const xpPct = nextRank ? Math.min(100, ((vitality - rank.min) / (nextRank.min - rank.min)) * 100) : 100;
  const multiplier = momentumMultiplier(streakDays);
  const rankLabel = tr.ranks[rank.rank as keyof typeof tr.ranks] ?? rank.rank;
  const nextRankLabel = nextRank ? (tr.ranks[nextRank.rank as keyof typeof tr.ranks] ?? nextRank.rank) : null;

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
    setActivities((a) => [{ id: Date.now(), label: tr.challenges[c.label as keyof typeof tr.challenges] ?? c.label, icon: c.icon, buff, isPr: false, ts: new Date() }, ...a]);
    setReward({ buff, label: c.label, icon: c.icon, isPr: false, newDays });
    setSelectedChallenge(null);
  }
  function logCustom() {
    const type = ACTIVITY_TYPES.find((x) => x.id === customType)!;
    let effort = type.baseEffort;
    if (customDuration > 10) effort += 0.05 * Math.log(customDuration / 10);
    if (customDistance > 1) effort += 0.08 * Math.log(customDistance);
    effort = Math.min(1, effort);
    const newDays = applyStreak();
    const buff = calcBuff(effort, newDays);
    let isPr = false;
    if (customDistance > 0 && customDistance > prDistance) { setPrDistance(customDistance); isPr = true; }
    if (customDuration > 0 && customDuration > prDuration) { setPrDuration(customDuration); isPr = true; }
    const typeLabel = tr.activityTypes[type.id as keyof typeof tr.activityTypes] ?? type.label;
    setVitality((v) => v + buff);
    setActivities((a) => [{ id: Date.now(), label: `${typeLabel} ${customDuration}min${customDistance ? ` · ${customDistance}km` : ""}`, icon: type.icon, buff, isPr, ts: new Date() }, ...a]);
    setReward({ buff, label: typeLabel, icon: type.icon, isPr, newDays });
  }
  function formatTs(ts: Date): string {
    return ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const STYLES = `
    :root {
      --bg: #0a0f0a; --surface: #111711; --surface2: #162016;
      --border: #1e2e1e; --green: #22c55e; --green-dim: #166534;
      --gold: #facc15; --text: #d1fae5; --muted: #4b6b52;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); }
    .vs-app { max-width: 420px; margin: 0 auto; padding: 0 0 80px; position: relative; }

    /* Onboarding */
    .vs-ob { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; gap: 0; }
    .vs-ob-lang { display: flex; gap: 6px; margin-bottom: 32px; }
    .vs-ob-emoji { font-size: 48px; margin-bottom: 16px; }
    .vs-ob-title { font-size: 28px; font-weight: 700; color: var(--green); letter-spacing: 1px; margin-bottom: 6px; text-align: center; }
    .vs-ob-sub { font-size: 13px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 36px; text-align: center; }
    .vs-ob-section { width: 100%; margin-bottom: 24px; }
    .vs-ob-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
    .vs-gender-row { display: flex; gap: 10px; }
    .vs-gender-btn { flex: 1; padding: 14px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-size: 15px; cursor: pointer; transition: all 0.2s; text-align: center; }
    .vs-gender-btn.on { border-color: var(--green); color: var(--green); background: #22c55e12; box-shadow: 0 0 16px #22c55e22; }
    .vs-weight-input { width: 100%; padding: 14px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; color: var(--text); font-size: 16px; outline: none; transition: border-color 0.2s; }
    .vs-weight-input:focus { border-color: var(--green-dim); }
    .vs-weight-input::placeholder { color: var(--muted); }
    .vs-ob-actions { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
    .vs-ob-btn-primary { width: 100%; padding: 16px; font-size: 15px; letter-spacing: 1px; border: 1px solid var(--green); border-radius: 12px; background: linear-gradient(135deg, #0f2d0f, #162e16); color: var(--green); cursor: pointer; transition: all 0.2s; box-shadow: 0 0 20px #22c55e18; }
    .vs-ob-btn-primary:hover { background: linear-gradient(135deg, #14381a, #1a3d1a); box-shadow: 0 0 28px #22c55e33; }
    .vs-ob-btn-secondary { width: 100%; padding: 14px; font-size: 14px; letter-spacing: 1px; border: 1px solid var(--border); border-radius: 12px; background: transparent; color: var(--muted); cursor: pointer; transition: all 0.2s; }
    .vs-ob-btn-secondary:hover { border-color: var(--muted); color: var(--text); }

    /* Explainer */
    .vs-ex { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; }
    .vs-ex-dots { display: flex; gap: 8px; margin-bottom: 40px; }
    .vs-ex-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.3s; }
    .vs-ex-dot.on { background: var(--green); box-shadow: 0 0 8px var(--green); width: 24px; border-radius: 4px; }
    .vs-ex-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px 28px; text-align: center; width: 100%; margin-bottom: 32px; position: relative; overflow: hidden; }
    .vs-ex-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 100%, #22c55e08 0%, transparent 70%); pointer-events: none; }
    .vs-ex-emoji { font-size: 52px; margin-bottom: 20px; }
    .vs-ex-title { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 12px; letter-spacing: 0.5px; }
    .vs-ex-body { font-size: 14px; color: var(--muted); line-height: 1.7; }
    .vs-ex-actions { display: flex; gap: 10px; width: 100%; }
    .vs-ex-back { flex: 1; padding: 14px; font-size: 13px; border: 1px solid var(--border); border-radius: 12px; background: transparent; color: var(--muted); cursor: pointer; transition: all 0.2s; }
    .vs-ex-back:hover { border-color: var(--muted); color: var(--text); }
    .vs-ex-next { flex: 2; padding: 14px; font-size: 13px; letter-spacing: 1px; border: 1px solid var(--green); border-radius: 12px; background: linear-gradient(135deg, #0f2d0f, #162e16); color: var(--green); cursor: pointer; transition: all 0.2s; box-shadow: 0 0 16px #22c55e18; }
    .vs-ex-next:hover { background: linear-gradient(135deg, #14381a, #1a3d1a); }

    /* Header */
    .vs-header { padding: 24px 20px 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .vs-header-sub { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
    .vs-header-title { font-size: 22px; font-weight: 700; color: var(--green); letter-spacing: 1px; }
    .vs-lang-toggle { display: flex; gap: 4px; margin-top: 4px; }
    .vs-lang-btn { padding: 4px 10px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted); cursor: pointer; transition: all 0.2s; }
    .vs-lang-btn.on { border-color: var(--green); color: var(--green); background: #22c55e12; }

    /* Vitality card */
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

    /* Tabs */
    .vs-tabs { display: flex; gap: 2px; margin: 0 16px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 4px; }
    .vs-tab { flex: 1; padding: 9px 4px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; text-align: center; border-radius: 9px; border: none; cursor: pointer; background: transparent; color: var(--muted); transition: all 0.2s; }
    .vs-tab.on { background: var(--surface2); color: var(--green); box-shadow: 0 0 10px #22c55e18; }

    /* Sections */
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
    .vs-custom { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin: 0 16px 24px; }
    .vs-custom-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
    .vs-type-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
    .vs-type-btn { padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; font-size: 12px; transition: all 0.2s; }
    .vs-type-btn.on { border-color: var(--green); color: var(--green); background: #22c55e12; }
    .vs-slider-row { margin-bottom: 14px; }
    .vs-slider-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
    input[type=range] { width: 100%; accent-color: var(--green); cursor: pointer; }

    /* Feed */
    .vs-feed { display: flex; flex-direction: column; gap: 10px; }
    .vs-feed-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; animation: slideIn 0.3s ease; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    .vs-feed-icon { font-size: 24px; }
    .vs-feed-content { flex: 1; }
    .vs-feed-label { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
    .vs-feed-meta { font-size: 11px; color: var(--muted); }
    .vs-feed-buff { font-size: 16px; color: var(--green); font-weight: 700; }
    .vs-pr-badge { background: #71320011; border: 1px solid var(--gold); border-radius: 6px; padding: 2px 7px; font-size: 10px; color: var(--gold); letter-spacing: 1px; margin-top: 3px; display: inline-block; }

    /* Stats */
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

    /* Empty */
    .vs-empty { text-align: center; padding: 32px 20px; color: var(--muted); font-size: 13px; line-height: 1.7; }
    .vs-empty-icon { font-size: 36px; margin-bottom: 10px; }

    /* Nav */
    .vs-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 420px; background: var(--surface); border-top: 1px solid var(--border); display: flex; z-index: 10; }
    .vs-nav-btn { flex: 1; padding: 12px 4px 10px; display: flex; flex-direction: column; align-items: center; gap: 3px; border: none; background: transparent; cursor: pointer; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); transition: all 0.2s; }
    .vs-nav-btn.on { color: var(--green); }
    .vs-nav-icon { font-size: 18px; }

    /* Reward overlay */
    .vs-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: #00000088; backdrop-filter: blur(4px); }
    .vs-reward-card { background: var(--surface); border: 1px solid var(--green); border-radius: 20px; padding: 32px 28px; text-align: center; max-width: 300px; width: 90%; box-shadow: 0 0 60px #22c55e33; animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1); }
    @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
    .vs-reward-icon { font-size: 48px; margin-bottom: 12px; }
    .vs-reward-title { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
    .vs-reward-buff { font-size: 52px; font-weight: 700; color: var(--green); line-height: 1; margin-bottom: 4px; text-shadow: 0 0 30px var(--green); }
    .vs-reward-sub { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
    .vs-reward-pr { display: inline-block; background: #71320022; border: 1px solid var(--gold); border-radius: 8px; padding: 6px 14px; font-size: 12px; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
    .vs-reward-close { width: 100%; padding: 13px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid var(--green); border-radius: 10px; background: #22c55e18; color: var(--green); cursor: pointer; }
  `;

  const slides = tr.slides as readonly { emoji: string; title: string; body: string }[];

  // ── Onboarding screen ──────────────────────────────────────────────────────
  if (!onboardingDone && !showExplainer) {
    return (
      <main className={lato.className} style={{ minHeight: "100vh", background: "#0a0f0a", color: "#d1fae5" }}>
        <style>{STYLES}</style>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div className="vs-ob">
            <div className="vs-ob-lang">
              {(["en", "sv"] as Lang[]).map((l) => (
                <button key={l} className={`vs-lang-btn ${cinzel.className} ${lang === l ? "on" : ""}`} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="vs-ob-emoji">🌱</div>
            <div className={`vs-ob-title ${cinzel.className}`}>{tr.onboardingTitle}</div>
            <div className="vs-ob-sub">{tr.onboardingSubtitle}</div>

            <div className="vs-ob-section">
              <div className={`vs-ob-label ${cinzel.className}`}>{tr.genderLabel}</div>
              <div className="vs-gender-row">
                {(["male", "female"] as const).map((g) => (
                  <button key={g} className={`vs-gender-btn ${cinzel.className} ${gender === g ? "on" : ""}`} onClick={() => setGender(g)}>
                    {g === "male" ? `♂ ${tr.genderMale}` : `♀ ${tr.genderFemale}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="vs-ob-section">
              <div className={`vs-ob-label ${cinzel.className}`}>{tr.weightLabel}</div>
              <input
                className="vs-weight-input"
                type="number"
                inputMode="decimal"
                placeholder={`— ${tr.weightUnit}`}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="vs-ob-actions">
              <button
                className={`vs-ob-btn-primary ${cinzel.className}`}
                onClick={() => setOnboardingDone(true)}
              >
                {tr.ctaGo}
              </button>
              <button
                className={`vs-ob-btn-secondary ${cinzel.className}`}
                onClick={() => setShowExplainer(true)}
              >
                {tr.ctaHow}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Explainer slides ───────────────────────────────────────────────────────
  if (showExplainer && !onboardingDone) {
    const slide = slides[explainerSlide];
    const isLast = explainerSlide === slides.length - 1;
    return (
      <main className={lato.className} style={{ minHeight: "100vh", background: "#0a0f0a", color: "#d1fae5" }}>
        <style>{STYLES}</style>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div className="vs-ex">
            <div className="vs-ex-dots">
              {slides.map((_, i) => (
                <div key={i} className={`vs-ex-dot ${i === explainerSlide ? "on" : ""}`} />
              ))}
            </div>
            <div className="vs-ex-card">
              <div className="vs-ex-emoji">{slide.emoji}</div>
              <div className={`vs-ex-title ${cinzel.className}`}>{slide.title}</div>
              <div className="vs-ex-body">{slide.body}</div>
            </div>
            <div className="vs-ex-actions">
              <button
                className={`vs-ex-back ${cinzel.className}`}
                onClick={() => explainerSlide === 0 ? setShowExplainer(false) : setExplainerSlide((s) => s - 1)}
              >
                {tr.slideBack}
              </button>
              <button
                className={`vs-ex-next ${cinzel.className}`}
                onClick={() => isLast ? setOnboardingDone(true) : setExplainerSlide((s) => s + 1)}
              >
                {isLast ? tr.slideDone : tr.slideNext}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Main app ───────────────────────────────────────────────────────────────
  return (
    <main className={lato.className} style={{ minHeight: "100vh", background: "#0a0f0a", color: "#d1fae5" }}>
      <style>{STYLES}</style>
      <div className="vs-app">

        {/* Header */}
        <div className="vs-header">
          <div>
            <div className={`vs-header-sub ${cinzel.className}`}>{tr.appSubtitle}</div>
            <div className={`vs-header-title ${cinzel.className}`}>{tr.appTitle}</div>
          </div>
          <div className="vs-lang-toggle">
            {(["en", "sv"] as Lang[]).map((l) => (
              <button key={l} className={`vs-lang-btn ${cinzel.className} ${lang === l ? "on" : ""}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Vitality card */}
        <div className="vs-card">
          <div className="vs-rank-row">
            <span className={`vs-rank-badge ${cinzel.className}`} style={{ color: rank.color, borderColor: rank.color }}>
              {rankLabel}
            </span>
            {nextRank && nextRankLabel && (
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                {tr.nextRankIn(nextRankLabel, nextRank.min - vitality)}
              </span>
            )}
          </div>
          <div className={`vs-vp-number ${cinzel.className}`} style={{ color: rank.color, textShadow: `0 0 30px ${rank.glow}` }}>
            {vitality}
          </div>
          <div className="vs-vp-label">{tr.vpLabel}</div>
          <div className="vs-bar-wrap">
            <div className="vs-bar-labels">
              <span>{rankLabel}</span>
              {nextRankLabel && <span>{nextRankLabel}</span>}
            </div>
            <div className="vs-bar-track">
              <div className="vs-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
          <div className="vs-momentum-row">
            <span className="vs-momentum-label">{tr.momentum}</span>
            <div className="vs-pips">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`vs-pip ${i < streakDays ? "on" : ""}`} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>
              {tr.momentumBonus(((multiplier - 1) * 100).toFixed(0), streakDays)}
            </span>
          </div>
        </div>

        {/* Custom activity — always visible on log tab */}
        {tab === "log" && (
          <>
          <div className="vs-custom">
            <div className={`vs-custom-title ${cinzel.className}`}>{tr.customActivity}</div>
            <div className="vs-type-row">
              {ACTIVITY_TYPES.map((type) => (
                <button key={type.id} className={`vs-type-btn ${customType === type.id ? "on" : ""}`} onClick={() => setCustomType(type.id)}>
                  {type.icon} {tr.activityTypes[type.id as keyof typeof tr.activityTypes]}
                </button>
              ))}
            </div>
            <div className="vs-slider-row">
              <div className="vs-slider-label">
                <span>{tr.duration}</span>
                <span style={{ color: "var(--green)" }}>{customDuration} min</span>
              </div>
              <input type="range" min={1} max={120} value={customDuration} onChange={(e) => setCustomDuration(Number(e.target.value))} />
            </div>
            <div className="vs-slider-row">
              {customType === "workout" ? (
  <div className="vs-slider-row">
    <div className="vs-slider-label">
      <span>{tr.workoutFocus}</span>
    </div>
    <div className="vs-type-row">
      <button className={`vs-type-btn ${workoutFocus === "strength" ? "on" : ""}`} onClick={() => setWorkoutFocus("strength")}>
        💪 {tr.focusStrength}
      </button>
      <button className={`vs-type-btn ${workoutFocus === "endurance" ? "on" : ""}`} onClick={() => setWorkoutFocus("endurance")}>
        🚴 {tr.focusEndurance}
      </button>
    </div>
  </div>
) : (
  <div className="vs-slider-row">
    <div className="vs-slider-label">
      <span>{tr.distance}</span>
      <span style={{ color: "var(--green)" }}>{customDistance} km</span>
    </div>
    <input type="range" min={0} max={20} step={0.5} value={customDistance} onChange={(e) => setCustomDistance(Number(e.target.value))} />
  </div>
)}
              <div className="vs-slider-label">
              </div>
            </div>
            <button className={`vs-btn ${cinzel.className}`} onClick={logCustom} style={{ marginBottom: 0 }}>
              {tr.logCustomCta}
            </button>
          </div>
          <div className="vs-section" style={{ marginBottom: 24 }}>
            <div className={`vs-section-title ${cinzel.className}`}>{tr.philosophy}</div>
            <div className="vs-phil"><strong>{tr.phil1Title}</strong> {tr.phil1Body}</div>
            <div className="vs-phil"><strong>{tr.phil2Title}</strong> {tr.phil2Body}</div>
            <div className="vs-phil"><strong>{tr.phil3Title}</strong> {tr.phil3Body}</div>
          </div>
          </>
        )}

        {/* Challenges tab */}
        {tab === "challenges" && (
          <div className="vs-section">
            <div className={`vs-section-title ${cinzel.className}`}>{tr.guidedChallenges}</div>
            <div className="vs-grid">
              {CHALLENGES.map((c) => (
                <div
                  key={c.id}
                  className={`vs-challenge ${selectedChallenge === c.id ? "on" : ""}`}
                  onClick={() => setSelectedChallenge(selectedChallenge === c.id ? null : c.id)}
                >
                  <div className="vs-c-icon">{c.icon}</div>
                  <div className="vs-c-label">{tr.challenges[c.label as keyof typeof tr.challenges]}</div>
                  <div className="vs-c-dur">{c.duration}</div>
                  <div className={`vs-c-buff ${cinzel.className}`}>{tr.challengeVitality(calcBuff(c.effort, streakDays))}</div>
                </div>
              ))}
            </div>
            <button className={`vs-btn ${cinzel.className}`} disabled={!selectedChallenge} onClick={logChallenge}>
              {selectedChallenge
                ? tr.logChallengeCta(calcBuff(CHALLENGES.find((x) => x.id === selectedChallenge)?.effort ?? 0, streakDays))
                : tr.selectChallenge}
            </button>
          </div>
        )}

        {/* Feed tab */}
        {tab === "feed" && (
          <div className="vs-section">
            {activities.length === 0 ? (
              <div className="vs-empty">
                <div className="vs-empty-icon">🌱</div>
                <div>{tr.emptyFeed.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</div>
              </div>
            ) : (
              <div className="vs-feed">
                {activities.map((a) => (
                  <div key={a.id} className="vs-feed-item">
                    <div className="vs-feed-icon">{a.icon}</div>
                    <div className="vs-feed-content">
                      <div className="vs-feed-label">{a.label}</div>
                      <div className="vs-feed-meta">{formatTs(a.ts)}</div>
                      {a.isPr && <div className="vs-pr-badge">{tr.personalBest}</div>}
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
            <div className={`vs-section-title ${cinzel.className}`}>{tr.statsOverview}</div>
            <div className="vs-stats-grid">
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`}>{vitality}</div>
                <div className="vs-stat-lbl">{tr.statTotalVitality}</div>
              </div>
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`}>{activities.length}</div>
                <div className="vs-stat-lbl">{tr.statActivities}</div>
              </div>
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`}>{streakDays}</div>
                <div className="vs-stat-lbl">{tr.statDayStreak}</div>
              </div>
              <div className="vs-stat-box">
                <div className={`vs-stat-val ${cinzel.className}`} style={{ color: "var(--gold)" }}>
                  {activities.filter((a) => a.isPr).length}
                </div>
                <div className="vs-stat-lbl">{tr.statPersonalBests}</div>
              </div>
            </div>
            <div className={`vs-section-title ${cinzel.className}`}>{tr.personalRecords}</div>
            <div className="vs-pr-list">
              <div className="vs-pr-item">
                <div>
                  <div className="vs-pr-name">{tr.bestDistance}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{tr.bestDistanceSub}</div>
                </div>
                <div className={`vs-pr-val ${cinzel.className}`}>{prDistance > 0 ? `${prDistance} km` : "—"}</div>
              </div>
              <div className="vs-pr-item">
                <div>
                  <div className="vs-pr-name">{tr.longestSession}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{tr.longestSessionSub}</div>
                </div>
                <div className={`vs-pr-val ${cinzel.className}`}>{prDuration > 0 ? `${prDuration} min` : "—"}</div>
              </div>
            </div>
            
          </div>
        )}

        {/* Bottom nav */}
        <nav className="vs-nav">
          {(["log", "challenges", "feed", "stats"] as const).map((id) => (
            <button key={id} className={`vs-nav-btn ${cinzel.className} ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>
              <span className="vs-nav-icon">
                {id === "log" ? tr.tabLogIcon : id === "challenges" ? tr.tabChallengesIcon : id === "feed" ? tr.tabFeedIcon : tr.tabStatsIcon}
              </span>
              {id === "log" ? tr.tabLog : id === "challenges" ? tr.tabChallenges : id === "feed" ? tr.tabFeed : tr.tabStats}
            </button>
          ))}
        </nav>

        {/* Reward popup */}
        {reward && (
          <div className="vs-overlay" onClick={() => setReward(null)}>
            <div className="vs-reward-card" onClick={(e) => e.stopPropagation()}>
              <div className="vs-reward-icon">{reward.icon}</div>
              <div className={`vs-reward-title ${cinzel.className}`}>{tr.rewardTitle}</div>
              <div className={`vs-reward-buff ${cinzel.className}`}>+{reward.buff}</div>
              <div className="vs-reward-sub">
                {tr.rewardSub(momentumMultiplier(reward.newDays).toFixed(2), reward.newDays)}
              </div>
              {reward.isPr && <div className={`vs-reward-pr ${cinzel.className}`}>{tr.newPersonalBest}</div>}
              <button className={`vs-reward-close ${cinzel.className}`} onClick={() => setReward(null)}>
                {tr.keepMoving}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
