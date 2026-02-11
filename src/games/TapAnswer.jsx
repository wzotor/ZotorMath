import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "../utils/sound";

async function fireConfetti() {
  try {
    const mod = await import("canvas-confetti");
    const fn = mod?.default ?? mod;
    if (typeof fn === "function") {
      fn({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
    }
  } catch (e) {
    console.log("Confetti failed:", e);
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeAdditionQuestion(level) {
  const max = Math.min(10 + level * 2, 50);
  const a = randInt(1, Math.max(5, Math.floor(max / 2)));
  const b = randInt(1, Math.max(5, Math.floor(max / 2)));
  const correct = a + b;

  const wrongs = new Set();
  while (wrongs.size < 3) {
    const wiggle = randInt(-6, 6);
    const candidate = Math.max(0, correct + wiggle);
    if (candidate !== correct) wrongs.add(candidate);
  }

  const choices = shuffle([correct, ...Array.from(wrongs)]);
  return { a, b, correct, choices };
}

export default function TapAnswer({
  coins,
  setCoins,
  streak,
  setStreak,
  level,
  setLevel,
  onBack,
}) {
  const [qKey, setQKey] = useState(0);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null

  const question = useMemo(() => makeAdditionQuestion(level), [qKey, level]);

  function nextQuestion() {
    setFeedback(null);
    setQKey((k) => k + 1);
  }

  function handlePick(value) {
    playSound("click", 0.4);

    const isCorrect = value === question.correct;

    if (isCorrect) {
      playSound("correct", 0.6);
      setFeedback("correct");
      fireConfetti();

      setCoins((c) => c + 5);
      setStreak((s) => s + 1);

      if ((streak + 1) % 8 === 0) {
        playSound("levelup", 0.7);
        setLevel((lv) => lv + 1);
      }

      setTimeout(nextQuestion, 550);
    } else {
      playSound("wrong", 0.6);
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => setFeedback(null), 700);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200">
      {/* 2.5D floating blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/35 blur-2xl" />
        <div className="absolute right-[-110px] top-44 h-96 w-96 rounded-full bg-white/25 blur-2xl" />
        <div className="absolute left-1/3 bottom-[-140px] h-[520px] w-[520px] rounded-full bg-white/20 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="rounded-2xl bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm backdrop-blur hover:bg-white"
          >
            ← Back
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm backdrop-blur">
              💰 Coins: {coins}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm backdrop-blur">
              ⭐ Level: {level}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm backdrop-blur">
              🔥 Streak: {streak}
            </div>
          </div>
        </div>

        {/* Game card */}
        <div className="mt-8 overflow-hidden rounded-[28px] bg-white/70 shadow-lg backdrop-blur">
          {/* Card header strip */}
          <div className="bg-gradient-to-r from-slate-900/90 to-slate-900/70 px-6 py-4 text-white">
            <div className="text-xs font-extrabold uppercase tracking-wider text-white/80">
              Addition Town
            </div>
            <div className="mt-1 text-xl font-extrabold">
              Tap the correct answer
            </div>

            {/* Progress to level-up */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-white/80">
                <span>Next level</span>
                <span>{streak % 8}/8</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-white/80"
                  style={{ width: `${((streak % 8) / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {question.a} + {question.b} = ?
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  Pick the answer to earn coins. Build streaks to level up.
                </p>
              </div>

              <motion.div
                animate={
                  feedback === "correct"
                    ? { scale: [1, 1.15, 1], rotate: [0, -2, 2, 0] }
                    : feedback === "wrong"
                    ? { x: [0, -10, 10, -6, 6, 0] }
                    : { scale: 1, x: 0, rotate: 0 }
                }
                transition={{ duration: 0.55 }}
                className="rounded-[26px] bg-gradient-to-br from-white to-white/70 px-6 py-5 text-4xl font-extrabold text-slate-900 shadow-sm"
              >
                {feedback === "correct" ? "🎉" : feedback === "wrong" ? "😅" : "🎯"}
              </motion.div>
            </div>

            {/* Answers */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {question.choices.map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePick(c)}
                  className="group rounded-[26px] bg-white px-6 py-5 text-left shadow-sm ring-1 ring-slate-900/5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-extrabold text-slate-900">
                      {c}
                    </div>
                    <div className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-extrabold text-slate-700 group-hover:bg-slate-900/10">
                      Tap
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-600">
                    Choose carefully and keep your streak 🔥
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-8 text-center text-xs font-semibold text-slate-700">
              ZotorMath © 2026 • Created by{" "}
              <span className="font-extrabold">Wisdom Zotor (Capochino)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
