'use client'
import { useEffect, useState } from 'react'

type HeatmapData = {
  heatmap: Record<string, number>
  stats: {
    activeDays: number
    totalDays: number
    biggestDay: number
    dailyAverage: number
    longestStreak: number
  }
}

type MonthlyData = {
  monthly: { month: string; label: string; amount: number }[]
  categories: { name: string; icon: string; amount: number }[]
}

export default function ReportsPage() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null)
  const [days, setDays] = useState(90)
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/reports/heatmap?days=${days}`).then(r => r.json()),
      fetch('/api/reports/monthly').then(r => r.json())
    ]).then(([hm, mn]) => {
      setHeatmapData(hm)
      setMonthlyData(mn)
      setLoading(false)
    })
  }, [days])

  // Heatmap green intensity scale is a data-viz convention distinct from the UI
  // accent color — intentionally left as-is (see DESIGN-luma.md).
  const getColor = (amount: number, maxAmount: number) => {
    if (!amount) return null
    const ratio = amount / maxAmount
    if (ratio < 0.2) return '#1a3a0e'
    if (ratio < 0.4) return '#2d5a1a'
    if (ratio < 0.6) return '#3d7a22'
    if (ratio < 0.8) return '#5aa032'
    return '#7dc845'
  }

  const renderHeatmap = () => {
    if (!heatmapData) return null
    const { heatmap, stats } = heatmapData
    const maxAmount = Math.max(...Object.values(heatmap), 1)
    const weeks = Math.ceil(days / 7)
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - (weeks * 7 - 1))

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const cols = []
    let lastMonth = -1
    const monthPositions: { label: string; col: number }[] = []

    for (let w = 0; w < weeks; w++) {
      const weekDate = new Date(startDate)
      weekDate.setDate(startDate.getDate() + w * 7)
      if (weekDate.getMonth() !== lastMonth) {
        monthPositions.push({ label: monthNames[weekDate.getMonth()], col: w })
        lastMonth = weekDate.getMonth()
      }

      const cells = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + w * 7 + d)
        const dateKey = date.toISOString().split('T')[0]
        const amount = heatmap[dateKey] || 0
        const color = getColor(amount, maxAmount)
        const isFuture = date > today

        cells.push(
          <div
            key={d}
            className="hm-cell"
            onMouseEnter={(e) => {
              if (isFuture) return
              const rect = (e.target as HTMLElement).getBoundingClientRect()
              const containerRect = (e.target as HTMLElement).closest('.heatmap-container')?.getBoundingClientRect()
              const text = amount
                ? `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ₹${amount.toLocaleString('en-IN')}`
                : `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · No expenses`
              setTooltip({
                text,
                x: rect.left - (containerRect?.left || 0),
                y: rect.top - (containerRect?.top || 0) - 36
              })
            }}
            onMouseLeave={() => setTooltip(null)}
            onClick={(e) => {
              if (isFuture) return
              const rect = (e.target as HTMLElement).getBoundingClientRect()
              const containerRect = (e.target as HTMLElement).closest('.heatmap-container')?.getBoundingClientRect()
              const text = amount
                ? `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ₹${amount.toLocaleString('en-IN')}`
                : `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · No expenses`
              setTooltip(prev =>
                prev?.text === text ? null : { text, x: rect.left - (containerRect?.left || 0), y: rect.top - (containerRect?.top || 0) - 36 }
              )
            }}
            style={{
              width: '11px',
              height: '11px',
              borderRadius: '2px',
              backgroundColor: isFuture ? 'transparent' : color || '#2B2C33',
              border: (!isFuture && !color) ? '1px solid rgba(255,255,255,0.09)' : 'none',
              flexShrink: 0,
              cursor: isFuture ? 'default' : 'pointer'
            }}
          />
        )
      }
      cols.push(
        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {cells}
        </div>
      )
    }

    return (
      <div>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'Active days', value: `${stats.activeDays}`, sub: `of ${stats.totalDays}` },
            { label: 'Longest streak', value: `${stats.longestStreak}`, sub: 'days' },
            { label: 'Biggest day', value: `₹${stats.biggestDay.toLocaleString('en-IN')}`, sub: '' },
            { label: 'Daily average', value: `₹${stats.dailyAverage.toLocaleString('en-IN')}`, sub: 'when spending' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-[16px]" style={{ padding: '12px 14px' }}>
              <div className="text-caption-luma text-[#8A8790]" style={{ textTransform: 'uppercase', marginBottom: '4px' }}>
                {s.label}
              </div>
              <div className="text-number-card text-[#F2EFEA]">
                {s.value} <span className="text-caption-luma text-[#8A8790]" style={{ textTransform: 'none' }}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Month labels */}
        <div style={{ position: 'relative', marginLeft: '28px', height: '16px', marginBottom: '4px' }}>
          {monthPositions.map(mp => (
            <span key={mp.label} style={{
              position: 'absolute',
              left: `${mp.col * 14}px`,
              fontSize: '10px',
              color: '#8A8790'
            }}>{mp.label}</span>
          ))}
        </div>

        {/* Grid + Tooltip wrapper */}
        <div
          className="heatmap-container"
          style={{ position: 'relative' }}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest('.hm-cell')) {
              setTooltip(null)
            }
          }}
        >
          {/* Tooltip */}
          {tooltip && (
            <div className="font-inter font-tnum" style={{
              position: 'absolute',
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              backgroundColor: '#2B2C33',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              color: '#F2EFEA',
              pointerEvents: 'none',
              zIndex: 50,
              whiteSpace: 'nowrap',
            }}>
              {tooltip.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
            {/* Day labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '4px', paddingTop: '0px' }}>
              {['','M','','W','','F',''].map((d, i) => (
                <div key={i} style={{ fontSize: '9px', color: '#5C5A60', height: '11px', lineHeight: '11px', width: '14px' }}>{d}</div>
              ))}
            </div>
            {/* Columns */}
            <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '4px' }}>
              {cols}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '10px', color: '#5C5A60' }}>Less</span>
          {[null, '#1a3a0e', '#3d7a22', '#5aa032', '#7dc845'].map((c, i) => (
            <div key={i} style={{
              width: '11px', height: '11px', borderRadius: '2px',
              backgroundColor: c || '#2B2C33',
              border: !c ? '1px solid rgba(255,255,255,0.09)' : 'none'
            }} />
          ))}
          <span style={{ fontSize: '10px', color: '#5C5A60' }}>More</span>
        </div>
      </div>
    )
  }

  const renderMonthlyChart = () => {
    if (!monthlyData?.monthly?.length) return null
    const max = Math.max(...monthlyData.monthly.map(m => m.amount), 1)

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', marginBottom: '8px' }}>
          {monthlyData.monthly.map((m, i) => {
            const isCurrentMonth = i === monthlyData.monthly.length - 1
            const height = Math.max((m.amount / max) * 100, 4)
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                <div className="font-inter font-tnum" style={{ fontSize: '9px', color: '#8A8790' }}>
                  ₹{m.amount >= 1000 ? `${Math.round(m.amount/1000)}k` : m.amount}
                </div>
                <div style={{
                  width: '100%',
                  height: `${height}%`,
                  backgroundColor: isCurrentMonth ? '#E17A4D' : '#2B2C33',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 500ms ease',
                  border: isCurrentMonth ? 'none' : '1px solid rgba(255,255,255,0.09)'
                }} />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {monthlyData.monthly.map((m, i) => (
            <div key={m.month} style={{
              flex: 1,
              fontSize: '9px',
              color: i === monthlyData.monthly.length - 1 ? '#E17A4D' : '#5C5A60',
              textAlign: 'center',
              fontWeight: i === monthlyData.monthly.length - 1 ? 600 : 400
            }}>{m.label}</div>
          ))}
        </div>
      </div>
    )
  }

  const renderCategoryBreakdown = () => {
    if (!monthlyData?.categories?.length) return null
    const total = monthlyData.categories.reduce((a, c) => a + c.amount, 0)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {monthlyData.categories.map(c => {
          const pct = Math.round((c.amount / total) * 100)
          return (
            <div key={c.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', backgroundColor: '#2B2C33',
                    border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                  }}>{c.icon}</div>
                  <span className="font-fraunces" style={{ fontSize: '13px', fontWeight: 500, color: '#F2EFEA' }}>{c.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-inter font-tnum" style={{ fontSize: '13px', fontWeight: 500, color: '#F2EFEA' }}>
                    ₹{c.amount.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '10px', color: '#8A8790' }}>{pct}%</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#2B2C33', borderRadius: '2px', height: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '3px',
                  backgroundColor: '#E17A4D',
                  borderRadius: '2px',
                  transition: 'width 500ms ease'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const SectionCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="glass-card rounded-[16px]" style={{ padding: '16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{ width: '3px', height: '14px', backgroundColor: '#E17A4D', borderRadius: '2px' }} />
        <span className="text-caption-luma" style={{ letterSpacing: '1px', textTransform: 'uppercase', color: '#8A8790' }}>{title}</span>
      </div>
      {children}
    </div>
  )

  return (
    <div style={{ backgroundColor: '#1B1C21', minHeight: '100vh' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 className="font-fraunces text-header-display text-[#F2EFEA]" style={{ margin: 0 }}>Reports</h1>
          <div style={{ width: '36px', height: '3px', backgroundColor: '#E17A4D', borderRadius: '2px', marginTop: '6px' }} />
          <p className="text-body-muted-luma" style={{ marginTop: '6px' }}>Your spending patterns at a glance</p>
        </div>

        {loading ? (
          <div className="text-body-muted-luma" style={{ textAlign: 'center', padding: '60px 0', fontSize: '14px' }}>
            Loading your data...
          </div>
        ) : (
          <>
            {/* Range selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[
                { label: '30 days', value: 30 },
                { label: '90 days', value: 90 },
                { label: '6 months', value: 180 },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  className={days === opt.value ? 'btn-primary-luma' : 'btn-secondary-luma'}
                  style={{
                    height: 'auto',
                    minHeight: 0,
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: days === opt.value ? 600 : 400,
                    boxShadow: 'none',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Heatmap */}
            <SectionCard title="Spending Activity">
              {renderHeatmap()}
            </SectionCard>

            {/* Monthly bar chart */}
            <SectionCard title="Monthly Spending">
              {renderMonthlyChart()}
            </SectionCard>

            {/* Category breakdown */}
            <SectionCard title="This Month by Category">
              {renderCategoryBreakdown()}
            </SectionCard>
          </>
        )}
      </div>
    </div>
  )
}
