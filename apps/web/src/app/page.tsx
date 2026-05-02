"use client"
import { useState } from 'react'

const API = 'http://localhost:8004'

const samplePosts = [
  { text: "This product is absolutely amazing! Love it so much 🎉", expected: 'Positive' },
  { text: "Worst experience ever. Complete waste of money, terrible service!", expected: 'Negative' },
  { text: "Just received my package today. It was okay.", expected: 'Neutral' },
  { text: "Best purchase I've made all year! Highly recommend to everyone!", expected: 'Positive' },
  { text: "The quality was poor and customer support was awful. Very disappointed.", expected: 'Negative' },
  { text: "It arrived on time. The product seems fine.", expected: 'Neutral' },
]

type AnalysisResult = { sentiment: string; confidence: number; probabilities: Record<string, number>; text: string; ts: string }

function SentimentBadge({ s }: { s: string }) {
  const cfg: any = { Positive: { c: '#10b981', icon: '😊' }, Negative: { c: '#ef4444', icon: '😠' }, Neutral: { c: '#64748b', icon: '😐' } }
  const { c, icon } = cfg[s] || { c: '#6366f1', icon: '❓' }
  return (
    <span style={{ background: c + '22', color: c, border: `1px solid ${c}66`, borderRadius: 8, padding: '4px 14px', fontWeight: 700, fontSize: 14 }}>
      {icon} {s}
    </span>
  )
}

function ProbBar({ label, prob, color }: any) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{(prob * 100).toFixed(1)}%</span>
      </div>
      <div style={{ background: '#22263a', borderRadius: 999, height: 10, overflow: 'hidden' }}>
        <div style={{ width: `${prob * 100}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, height: '100%', borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export default function SentimentApp() {
  const [text, setText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function analyze(inputText?: string) {
    const t = inputText ?? text
    if (!t.trim()) return
    setLoading(true); setError('')
    try {
      const r = await fetch(`${API}/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t }) })
      const d = await r.json()
      const entry = { ...d, text: t, ts: new Date().toLocaleTimeString() }
      setResult(entry)
      setHistory(h => [entry, ...h.slice(0, 19)])
    } catch { setError('Cannot reach backend. Start FastAPI on port 8000.') }
    setLoading(false)
  }

  async function runBatch() {
    setError('')
    for (const post of samplePosts) {
      await analyze(post.text)
      await new Promise(r => setTimeout(r, 400))
    }
  }

  function handleText(v: string) { setText(v); setCharCount(v.length) }
  function clearAll() { setHistory([]); setResult(null); setText(''); setCharCount(0) }

  const sc: any = { Positive: '#10b981', Negative: '#ef4444', Neutral: '#64748b' }
  const sentCounts = { Positive: history.filter(h => h.sentiment === 'Positive').length, Negative: history.filter(h => h.sentiment === 'Negative').length, Neutral: history.filter(h => h.sentiment === 'Neutral').length }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1d27, #22263a)', borderBottom: '1px solid #2e3247', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SentimentIQ</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Social Media Sentiment Analysis Dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[{ l: 'Analyzed', v: history.length, c: '#6366f1' }, { l: '🟢 Positive', v: sentCounts.Positive, c: '#10b981' }, { l: '🔴 Negative', v: sentCounts.Negative, c: '#ef4444' }, { l: '⚪ Neutral', v: sentCounts.Neutral, c: '#64748b' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Input */}
          <div style={{ background: '#1a1d27', border: '1px solid #2e3247', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#6366f1', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>✍️ Analyze Text</div>
            <textarea value={text} onChange={e => handleText(e.target.value)} placeholder="Enter a social media post, review, comment, or any text to analyze..."
              style={{ width: '100%', minHeight: 120, background: '#22263a', border: '1px solid #2e3247', borderRadius: 8, padding: '12px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 12, color: charCount > 500 ? '#ef4444' : '#64748b' }}>{charCount} characters</span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setText(''); setCharCount(0) }} style={{ background: '#22263a', color: '#64748b', border: '1px solid #2e3247', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}>Clear</button>
                <button onClick={() => analyze()} disabled={loading || !text.trim()} style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: !text.trim() ? 0.5 : 1 }}>
                  {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
                </button>
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div style={{ background: '#1a1d27', border: `1px solid ${sc[result.sentiment]}66`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Analysis Result</div>
                  <SentimentBadge s={result.sentiment} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: sc[result.sentiment] }}>{(result.confidence * 100).toFixed(1)}%</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Confidence</div>
                </div>
              </div>
              <div style={{ background: '#0f1117', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 14, color: '#94a3b8', fontStyle: 'italic', borderLeft: `3px solid ${sc[result.sentiment]}` }}>
                "{result.text.length > 120 ? result.text.slice(0, 120) + '...' : result.text}"
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12, fontWeight: 600 }}>Probability Breakdown</div>
                <ProbBar label="🟢 Positive" prob={result.probabilities.Positive} color="#10b981" />
                <ProbBar label="⚪ Neutral" prob={result.probabilities.Neutral} color="#64748b" />
                <ProbBar label="🔴 Negative" prob={result.probabilities.Negative} color="#ef4444" />
              </div>
            </div>
          )}

          {/* Sample Posts */}
          <div style={{ background: '#1a1d27', border: '1px solid #2e3247', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: 1 }}>📋 Sample Posts</div>
              <button onClick={runBatch} style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Run All Samples →
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {samplePosts.map((p, i) => (
                <div key={i} onClick={() => { setText(p.text); setCharCount(p.text.length) }}
                  style={{ background: '#22263a', border: '1px solid #2e3247', borderRadius: 8, padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366f1')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#2e3247')}>
                  <div style={{ fontSize: 12, color: sc[p.expected], marginBottom: 6, fontWeight: 600 }}>{p.expected === 'Positive' ? '🟢' : p.expected === 'Negative' ? '🔴' : '⚪'} {p.expected}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.4 }}>{p.text.length > 60 ? p.text.slice(0, 60) + '...' : p.text}</div>
                </div>
              ))}
            </div>
          </div>

          {error && <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: 8, padding: 12, color: '#ef4444', fontSize: 14 }}>⚠️ {error}</div>}
        </div>

        {/* RIGHT: History */}
        <div>
          <div style={{ background: '#1a1d27', border: '1px solid #2e3247', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Analysis History</div>
              {history.length > 0 && <button onClick={clearAll} style={{ background: 'none', color: '#ef4444', border: 'none', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Clear All</button>}
            </div>

            {/* Sentiment Distribution Bar */}
            {history.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 12 }}>
                  {[['Positive', '#10b981'], ['Neutral', '#64748b'], ['Negative', '#ef4444']].map(([s, c]) => (
                    <div key={s} style={{ flex: sentCounts[s as keyof typeof sentCounts], background: c, transition: 'flex 0.4s ease' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: '#64748b' }}>
                  <span style={{ color: '#10b981' }}>Pos {sentCounts.Positive}</span>
                  <span>Neu {sentCounts.Neutral}</span>
                  <span style={{ color: '#ef4444' }}>Neg {sentCounts.Negative}</span>
                </div>
              </div>
            )}

            {history.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>Analyze posts to build history</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 580, overflowY: 'auto' }}>
                {history.map((h, i) => (
                  <div key={i} onClick={() => { setText(h.text); setCharCount(h.text.length); setResult(h) }}
                    style={{ background: '#22263a', borderRadius: 8, padding: '12px 14px', cursor: 'pointer', borderLeft: `3px solid ${sc[h.sentiment]}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <SentimentBadge s={h.sentiment} />
                      <span style={{ fontSize: 11, color: '#64748b' }}>{h.ts}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{h.text.length > 70 ? h.text.slice(0, 70) + '...' : h.text}</div>
                    <div style={{ fontSize: 12, color: sc[h.sentiment], fontWeight: 600, marginTop: 4 }}>{(h.confidence * 100).toFixed(1)}% confidence</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
