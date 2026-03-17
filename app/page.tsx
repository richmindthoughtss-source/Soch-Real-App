'use client'

import { useState } from "react"

type SochResult = {
  core: string
  noise: string
  truth: string
  step: string
  anchor: string
}

function parseSochOutput(text: string): SochResult {
  const labels = [
    "Core Issue",
    "Mental Noise",
    "Dharma Truth",
    "Best Next Step",
    "Anchor Line",
  ]

  const getPart = (label: string) => {
    const nextLabels = labels.filter((l) => l !== label).join("|")
    const regex = new RegExp(`${label}:([\\s\\S]*?)(?=${nextLabels}:|$)`, "i")
    const match = text.match(regex)
    return match ? match[1].trim() : ""
  }

  return {
    core: getPart("Core Issue"),
    noise: getPart("Mental Noise"),
    truth: getPart("Dharma Truth"),
    step: getPart("Best Next Step"),
    anchor: getPart("Anchor Line"),
  }
}

export default function Home() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<SochResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleClick = async () => {
    if (!input.trim()) {
      setError("Write something first.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/soch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        setLoading(false)
        return
      }

      const parsed = parseSochOutput(data.result || "")
      setResult(parsed)
    } catch {
      setError("Could not connect to SOCH brain.")
    }

    setLoading(false)
  }

  const clearAll = () => {
    setInput("")
    setResult(null)
    setError("")
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_20%),radial-gradient(circle_at_bottom,rgba(6,182,212,0.12),transparent_22%)]" />
      <div className="absolute top-0 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <div className="mb-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-2xl shadow-lg shadow-blue-500/30">
              🧠
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
                SOCH — Wise Clarity Mentor
              </p>
              <p className="text-sm text-white/45">
                Separate noise from truth. Return to yourself.
              </p>
            </div>
          </div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl">
            SOCH
          </h1>

          <p className="max-w-3xl text-base leading-8 text-white/65 md:text-lg">
            A calm, sharp space for clearer thinking, deeper self-understanding,
            and wiser next steps.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
          <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Speak honestly
            </p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight">
              What’s really going on?
            </h2>
            <p className="mb-5 text-white/55">
              Write what happened, what you feel, and what you are struggling to understand or decide.
            </p>

            <textarea
              className="mb-5 min-h-[220px] w-full rounded-[28px] border border-white/10 bg-black/20 p-5 text-white outline-none placeholder:text-white/25 shadow-inner"
              placeholder="mujhe zindagi samajhni hai"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleClick}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] hover:opacity-95 disabled:opacity-50"
              >
                {loading ? "Finding Clarity..." : "Find Clarity"}
              </button>

              <button
                onClick={clearAll}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-white/70 transition hover:bg-white/[0.08]"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl">
              <p className="mb-2 text-xs uppercase tracking-[0.35em] text-violet-200/70">
                How SOCH guides
              </p>
              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>• Finds the real issue under the surface</p>
                <p>• Detects fear, urgency, ego, and distortion</p>
                <p>• Gives grounded truth, not empty comfort</p>
                <p>• Suggests one clean next step</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="mb-2 text-xs uppercase tracking-[0.35em] text-blue-200/70">
                Better input
              </p>
              <div className="space-y-2 text-sm leading-7 text-white/70">
                <p>1. What happened</p>
                <p>2. What you feel or fear</p>
                <p>3. What decision or confusion you are facing</p>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-blue-200/70">
                <span>🫀</span>
                <span>Core Issue</span>
              </div>
              <div className="text-lg leading-8 text-white/90">{result.core}</div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-violet-200/70">
                <span>🧠</span>
                <span>Mental Noise</span>
              </div>
              <div className="text-lg leading-8 text-white/90">{result.noise}</div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl md:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                <span>☸️</span>
                <span>Dharma Truth</span>
              </div>
              <div className="text-lg leading-8 text-white/90">{result.truth}</div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl md:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-emerald-200/70">
                <span>🎯</span>
                <span>Best Next Step</span>
              </div>
              <div className="text-lg leading-8 text-white/90">{result.step}</div>
            </div>

            <div className="rounded-[32px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-2xl font-bold text-white shadow-2xl shadow-indigo-500/25 md:col-span-2">
              <div className="mb-2 text-xs uppercase tracking-[0.35em] text-white/70">
                Anchor line
              </div>
              {result.anchor}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}