import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import {
  strategyData, interpolatePrice, computeMetrics,
  COST_MIN, COST_MAX
} from '../data/strategyData'
import './IncompleteInfo.css'

const N_OPTIONS = [2, 3, 5]

const N_STYLES = {
  2: { stroke: '#3d6644', strokeWidth: 2.5, strokeDasharray: null,  label: 'N = 2' },
  3: { stroke: '#3d6644', strokeWidth: 1.5, strokeDasharray: '6 3', label: 'N = 3' },
  5: { stroke: '#3d6644', strokeWidth: 1.5, strokeDasharray: '2 3', label: 'N = 5' },
}

// Merge all three datasets into one array keyed by cost for Recharts
function buildChartData() {
  const map = {}
  for (const n of N_OPTIONS) {
    for (const d of strategyData[n]) {
      const key = Math.round(d.cost * 10) / 10
      if (!map[key]) map[key] = { cost: key }
      map[key][`price_${n}`] = d.price
    }
  }
  return Object.values(map).sort((a, b) => a.cost - b.cost)
}

const chartData = buildChartData()

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`stat-card ${accent ? 'stat-card-accent' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="tt-row"><span className="tt-key">cost</span><span className="tt-val">{label}</span></div>
      {N_OPTIONS.map(n => {
        const entry = payload.find(p => p.dataKey === `price_${n}`)
        if (!entry) return null
        return (
          <div className="tt-row" key={n}>
            <span className="tt-key">N = {n}</span>
            <span className="tt-val tt-accent">{entry.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function IncompleteInfo() {
  const [nFirms, setNFirms] = useState(2)
  const [cost, setCost] = useState(165)

  const myPrice = useMemo(() => interpolatePrice(cost, nFirms), [cost, nFirms])
  const metrics = useMemo(() => computeMetrics(cost, myPrice, nFirms), [cost, myPrice, nFirms])

  return (
    <div className="ii-page">
      <div className="ii-header">
        <div className="ii-title-group">
          <div className="ii-eyebrow">Bayesian Nash Equilibrium · Incomplete information</div>
          <h1 className="ii-title">Strategy explorer</h1>
        </div>
        <div className="ii-n-toggle">
          <span className="ii-toggle-label">Firms</span>
          {N_OPTIONS.map(n => (
            <button
              key={n}
              className={`ii-toggle-btn ${nFirms === n ? 'active' : ''}`}
              onClick={() => setNFirms(n)}
            >
              N = {n}
            </button>
          ))}
        </div>
      </div>

      <div className="ii-layout">
        <div className="ii-chart-panel">
          <div className="ii-chart-header">
            <div className="ii-chart-title">Equilibrium strategy β(c) — all firm counts</div>
            <div className="ii-chart-sub">Optimal price as a function of private cost · selected N highlighted</div>
          </div>

          <div className="ii-chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 24, left: 10 }}>
                <CartesianGrid stroke="rgba(61,102,68,0.07)" strokeDasharray="0" />
                <XAxis
                  dataKey="cost"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  ticks={[80, 110, 140, 170, 200, 230, 250]}
                  tick={{ fontFamily: 'DM Mono', fontSize: 11, fill: '#8e9e8c' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(61,102,68,0.15)' }}
                  label={{ value: 'cost c', position: 'insideBottom', offset: -10, fontFamily: 'DM Mono', fontSize: 11, fill: '#8e9e8c' }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontFamily: 'DM Mono', fontSize: 11, fill: '#8e9e8c' }}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'price β(c)', angle: -90, position: 'insideLeft', fontFamily: 'DM Mono', fontSize: 11, fill: '#8e9e8c' }}
                />
                <Tooltip content={<CustomTooltip />} />

                <ReferenceLine
                  x={cost}
                  stroke="#3d6644"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <ReferenceLine
                  y={myPrice}
                  stroke="#8e9e8c"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />

                {N_OPTIONS.map(n => {
                  const isActive = n === nFirms
                  const style = N_STYLES[n]
                  return (
                    <Line
                      key={n}
                      type="monotone"
                      dataKey={`price_${n}`}
                      stroke={style.stroke}
                      strokeWidth={isActive ? style.strokeWidth + 0.5 : 1}
                      strokeDasharray=""
                      strokeOpacity={isActive ? 1 : 0.2}
                      dot={false}
                      isAnimationActive={false}
                      activeDot={isActive ? { r: 4, fill: '#3d6644', strokeWidth: 0 } : false}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="ii-legend">
            {N_OPTIONS.map(n => (
              <div
                key={n}
                className={`ii-legend-item ${nFirms === n ? 'active' : ''}`}
                onClick={() => setNFirms(n)}
              >
                <svg width="24" height="10" viewBox="0 0 24 10">
                  <line
                    x1="0" y1="5" x2="24" y2="5"
                    stroke="#3d6644"
                    strokeWidth={N_STYLES[n].strokeWidth}
                    strokeDasharray=""
                    strokeOpacity={nFirms === n ? 1 : 0.3}
                  />
                </svg>
                <span>{N_STYLES[n].label}</span>
                
              </div>
            ))}
          </div>

          {/* Slider */}
          <div className="ii-slider-section">
            <div className="ii-slider-header">
              <span className="ii-slider-label">Your private cost</span>
              <span className="ii-slider-value">{cost}</span>
            </div>
            <input
              type="range"
              className="ii-slider"
              min={COST_MIN}
              max={COST_MAX}
              step={1}
              value={cost}
              onChange={e => setCost(Number(e.target.value))}
            />
            <div className="ii-slider-range">
              <span>{COST_MIN}</span>
              <span>{COST_MAX}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="ii-sidebar">
          <div className="ii-stats-grid">
            <StatCard
              label="Optimal price β(c)"
              value={myPrice}
              sub={`at cost ${cost}`}
              accent
            />
            <StatCard
              label="Markup over cost"
              value={`+${metrics.markup}%`}
              sub={`${myPrice} − ${cost}`}
            />
            <StatCard
              label="Expected profit"
              value={`$${metrics.profit.toLocaleString()}`}
              sub={`per seat: $${metrics.profitPerSeat}`}
            />
            <StatCard
              label="Expected quantity"
              value={metrics.quantity.toLocaleString()}
              sub="units sold"
            />
          </div>
          <div className="ii-insight">
            <div className="ii-insight-label">Equilibrium insight</div>
            <p>
              With <code>N = {nFirms}</code> firm{nFirms > 1 ? 's' : ''}, a cost of <code>{cost}</code> maps
              to an equilibrium price of <code>{myPrice}</code> — a <code>{metrics.markup}%</code> markup.
              {nFirms >= 5 && ' At this competitor count, strategic feedback loops are strong — interpret prices with caution.'}
            </p>
          </div>

          <div className="ii-n-story">
            <div className="ii-n-story-label">What changes with N?</div>
            <p>
              In differentiated markets, more competitors can push prices <em>up</em>, not down.
              When a rival raises fares, you capture some of their passengers — so your best response
              is to raise yours too. With more firms, these feedback loops multiply. At low N this
              produces modest markups. At high N the loops amplify each other strongly, and the
              linear demand model approaches its limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
