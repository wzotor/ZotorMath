import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "../utils/sound";


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
      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="rounded-2xl bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm hover:bg-white"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm">
              Coins: {coins}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm">
              Level: {level}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm">
              Streak: {streak}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white/75 p-8 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-slate-700">
                Addition Town • Tap the Answer
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                What is {question.a} + {question.b}?
              </h2>
            </div>

            <motion.div
              animate={
                feedback === "correct"
                  ? { scale: [1, 1.15, 1] }
                  : feedback === "wrong"
                  ? { x: [0, -10, 10, -6, 6, 0] }
                  : { scale: 1, x: 0 }
              }
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-slate-900/10 px-5 py-4 text-4xl font-extrabold text-slate-900"
            >
              {feedback === "correct" ? "✅" : feedback === "wrong" ? "❌" : "🎯"}
            </motion.div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {question.choices.map((c) => (
              <button
                key={c}
                onClick={() => handlePick(c)}
                className="rounded-3xl bg-white px-6 py-5 text-left text-xl font-extrabold text-slate-900 shadow-sm hover:shadow-md"
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm font-medium text-slate-700">
            Tip: Build a streak to level up and earn more coins.
          </div>
        </div>
        <div className="mt-10 text-center text-xs font-semibold text-slate-700">
  ZotorMath © 2026 • Created by{" "}
  <span className="font-extrabold">Wisdom Zotor (Capochino)</span>
</div>
      </div>
    </div>
  );
}
