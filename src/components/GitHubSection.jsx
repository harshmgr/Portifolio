import { useEffect, useMemo, useState } from 'react'
import Reveal, { SectionHeading } from './Reveal'
import { profile } from '../config'

// Deterministic pseudo-random — used as a graceful fallback when the
// contributions API is unreachable (e.g. rate-limited on GitHub Pages).
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const WEEKS = 52
const LEVEL_COLORS = ['#101720', '#0e3a5f', '#1565a8', '#1f8fd6', '#22d3ee']

function Heatmap({ counts }) {
  return (
    <div className="overflow-x-auto pb-2 touch-pan-x">
      <p className="sm:hidden mb-2 font-mono text-[10px] text-gray-600">← scroll to view full year →</p>
      <div className="flex gap-[3px] min-w-[720px]" role="img" aria-label="Contribution activity heatmap for the last year">
        {Array.from({ length: WEEKS }, (_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, d) => {
              const v = counts[w * 7 + d] ?? 0
              return (
                <div
                  key={d}
                  className="h-[11px] w-[11px] rounded-[2px] transition-transform hover:scale-125"
                  style={{ background: LEVEL_COLORS[v] }}
                  title={`${v === 0 ? 'No' : v} contribution level`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GitHubSection() {
  const [repos, setRepos] = useState(null)
  const [liveCounts, setLiveCounts] = useState(null)
  const [visible, setVisible] = useState(false)

  // fallback heatmap, generated deterministically so it never flickers
  const fallbackCounts = useMemo(() => {
    const rnd = seeded(42)
    return Array.from({ length: WEEKS * 7 }, () => {
      const r = rnd()
      return r < 0.32 ? 0 : r < 0.55 ? 1 : r < 0.75 ? 2 : r < 0.92 ? 3 : 4
    })
  }, [])

  // lazy-load API data only when the section scrolls into view
  useEffect(() => {
    const el = document.getElementById('github')
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()),
      { rootMargin: '200px' }
    )
    if (el) obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    fetch(`https://api.github.com/users/${profile.github}/repos?sort=updated&per_page=6`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => Array.isArray(data) && setRepos(data))
      .catch(() => setRepos([]))
    fetch(`https://github-contributions-api.jogruber.de/v4/${profile.github}?y=last`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => {
        const days = data?.contributions?.slice(-WEEKS * 7)
        if (days?.length) {
          const max = Math.max(1, ...days.map(d => d.count))
          setLiveCounts(days.map(d => Math.min(4, Math.ceil((d.count / max) * 4))))
        }
      })
      .catch(() => {})
  }, [visible])

  const techSummary = useMemo(() => {
    if (!repos?.length) return ['C#', '.NET', 'TypeScript', 'SQL']
    const langs = [...new Set(repos.map(r => r.language).filter(Boolean))]
    return langs.length ? langs : ['C#', '.NET']
  }, [repos])

  return (
    <section id="github" className="relative mx-auto max-w-6xl px-5 py-28">
      <SectionHeading kicker="git remote -v" title="GitHub Activity" />

      <Reveal>
        <div className="glass p-6 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h3 className="font-mono text-sm text-gray-300">
              <span className="text-cyan-400">@{profile.github}</span> — contribution graph
            </h3>
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-electric hover:text-cyan-300 transition-colors"
            >
              view profile →
            </a>
          </div>
          <Heatmap counts={liveCounts ?? fallbackCounts} />
          {!liveCounts && (
            <p className="mt-2 font-mono text-[10px] text-gray-600">
              * representative activity — live data loads from the GitHub API
            </p>
          )}
        </div>
      </Reveal>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <Reveal className="lg:col-span-2">
          <div className="glass p-6 h-full">
            <h3 className="font-mono text-sm text-gray-300 mb-4">repository highlights</h3>
            {repos === null && <p className="text-sm text-gray-600 font-mono">loading…</p>}
            {repos?.length === 0 && (
              <p className="text-sm text-gray-500">
                Repositories load live from the GitHub API once the profile handle is set in{' '}
                <code className="text-cyan-400">src/config.js</code>.
              </p>
            )}
            <ul className="grid sm:grid-cols-2 gap-3">
              {repos?.slice(0, 6).map(r => (
                <li key={r.id}>
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass glass-hover p-4 h-full"
                  >
                    <p className="font-mono text-sm text-cyan-300 truncate">{r.name}</p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{r.description || '—'}</p>
                    <p className="mt-2 font-mono text-[10px] text-gray-600">
                      {r.language || ''} {r.stargazers_count ? `· ★ ${r.stargazers_count}` : ''}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass p-6 h-full">
            <h3 className="font-mono text-sm text-gray-300 mb-4">technology summary</h3>
            <div className="flex flex-wrap gap-2">
              {techSummary.map(t => (
                <span key={t} className="font-mono text-xs text-cyan-300/90 bg-cyan-400/8 border border-cyan-400/20 rounded-md px-2.5 py-1.5">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-3 font-mono text-xs text-gray-500">
              <p><span className="text-emerald-400">●</span> active daily committer</p>
              <p><span className="text-electric">●</span> production .NET systems</p>
              <p><span className="text-violet">●</span> open-source tooling</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
