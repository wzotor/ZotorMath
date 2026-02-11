import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TapAnswer from "./games/TapAnswer";

const worlds = [
  {
    id: "addition",
    title: "Addition Town",
    ages: "Ages 5–7",
    emoji: "🏘️",
    blurb: "Build quick confidence with fun sums.",
    gradient: "from-pink-200 via-rose-200 to-orange-200",
  },
  {
    id: "multiplication",
    title: "Multiplication Galaxy",
    ages: "Ages 8–10",
    emoji: "🌌",
    blurb: "Blast the right answers and level up fast.",
    gradient: "from-sky-200 via-cyan-200 to-indigo-200",
  },
  {
    id: "fractions",
    title: "Fractions Harbor",
    ages: "Ages 9–12",
    emoji: "⛵",
    blurb: "Slice, match, and master fractions visually.",
    gradient: "from-emerald-200 via-lime-200 to-yellow-200",
  },
  {
    id: "algebra",
    title: "Algebra Space",
    ages: "Ages 13–15",
    emoji: "🪐",
    blurb: "Solve for x and power your space station.",
    gradient: "from-violet-200 via-fuchsia-200 to-pink-200",
  },
];

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
        {label}
      </div>
      <div className="text-sm font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home"); // home | tapAnswer
const [coins, setCoins] = useState(() => Number(localStorage.getItem("zm_coins") || 0));
const [level, setLevel] = useState(() => Number(localStorage.getItem("zm_level") || 1));
const [streak, setStreak] = useState(() => Number(localStorage.getItem("zm_streak") || 0));
useEffect(() => {
  localStorage.setItem("zm_coins", String(coins));
}, [coins]);

useEffect(() => {
  localStorage.setItem("zm_level", String(level));
}, [level]);

useEffect(() => {
  localStorage.setItem("zm_streak", String(streak));
}, [streak]);
  if (screen === "tapAnswer") {
    return (
      <TapAnswer
        coins={coins}
        setCoins={setCoins}
        level={level}
        setLevel={setLevel}
        streak={streak}
        setStreak={setStreak}
        onBack={() => setScreen("home")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-pink-200 to-lime-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute right-[-80px] top-40 h-80 w-80 rounded-full bg-white/25 blur-2xl" />
        <div className="absolute left-1/3 bottom-[-120px] h-96 w-96 rounded-full bg-white/20 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
              <span className="text-xl">🎮</span>
              <span className="text-sm font-extrabold text-slate-900">
                ZotorMath
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Make math feel like play.
            </h1>
            <p className="mt-3 max-w-xl text-base font-medium text-slate-700">
              Short, colorful games that build confidence fast. Earn coins, keep
              streaks, and unlock new worlds.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StatPill label="Coins" value={coins} />
              <StatPill label="Level" value={level} />
              <StatPill label="Streak" value={`${streak} days`} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-extrabold text-slate-900 shadow-sm backdrop-blur hover:bg-white">
              Parent/Teacher
            </button>
            <button
              onClick={() => setScreen("tapAnswer")}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-90"
            >
              Start Playing
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {worlds.map((w, i) => (
            <motion.button
              key={w.id}
              whileHover={{ y: -6, rotate: -0.2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => {
                if (w.id === "addition") setScreen("tapAnswer");
              }}
              className="group relative overflow-hidden rounded-3xl bg-white/75 p-5 text-left shadow-sm backdrop-blur hover:bg-white"
            >
              <div
                className={`absolute inset-0 opacity-70 bg-gradient-to-br ${w.gradient}`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{w.emoji}</div>
                  <div className="rounded-full bg-slate-900/10 px-3 py-1 text-[11px] font-extrabold text-slate-800">
                    {w.ages}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-lg font-extrabold text-slate-900">
                    {w.title}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-700">
                    {w.blurb}
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-sm font-extrabold text-slate-900 shadow-sm">
                  Play
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                Daily challenge
              </div>
              <div className="text-sm font-medium text-slate-700">
                Complete 5 quick questions to keep your streak and earn bonus
                coins.
              </div>
            </div>
            <button
              onClick={() => setScreen("tapAnswer")}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white hover:opacity-90"
            >
              Start Daily Challenge
            </button>
          </div>
        </div>
                <div className="mt-12 text-center text-xs font-semibold text-slate-700">
                  ZotorMath © 2026 • Created by{" "}
  <span className="font-extrabold">Wisdom Zotor (Capochino)</span>
        </div>
      </div>
    </div>
  );
}
