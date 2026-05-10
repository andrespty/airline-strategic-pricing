import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import {
  strategyData, interpolatePrice, computeMetrics,
  getCompetitorDistribution, COST_MIN, COST_MAX
} from '../data/strategyData'
import './IncompleteInfo.css'

const N_OPTIONS = [2, 3, 5]

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
      <div className="tt-row"><span className="tt-key">price β(c)</span><span className="tt-val tt-accent">{payload[0]?.value}</span></div>
    </div>
  )
}

export default function IncompleteInfo() {
  const [nFirms, setNFirms] = useState(2)
  const [cost, setCost] = useState(165)

  const myPrice = useMemo(() => interpolatePrice(cost, nFirms), [cost, nFirms])
  const metrics = useMemo(() => computeMetrics(cost, myPrice, nFirms), [cost, myPrice, nFirms])
  const distData = useMemo(() => getCompetitorDistribution(nFirms, myPrice), [nFirms, myPrice])
  const chartData = strategyData[nFirms]

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

      <div className="ii-note">
        <span className="ii-note-dot" />
        Using placeholder strategy data. Replace <code>src/data/strategyData.js</code> with real NN output to update all charts and metrics automatically.
      </div>

      <div className="ii-layout">
        {/* Main chart */}
        <div className="ii-chart-panel">
          <div className="ii-chart-header">
            <div className="ii-chart-title">Equilibrium strategy β(c)</div>
            <div className="ii-chart-sub">Optimal price as a function of private cost</div>
          </div>
          <div className="ii-chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" />
                <XAxis
                  dataKey="cost"
                  tick={{ fontFamily: 'DM Mono', fontSize: 11, fill: '#555350' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  label={{ value: 'cost c', position: 'insideBottom', offset: -4, fontFamily: 'DM Mono', fontSize: 11, fill: '#555350' }}
                />
                <YAxis
                  tick={{ fontFamily: 'DM Mono', fontSize: 11, fill: '#555350' }}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'price β(c)', angle: -90, position: 'insideLeft', fontFamily: 'DM Mono', fontSize: 11, fill: '#555350' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  x={cost}
                  stroke="rgba(200,240,96,0.5)"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <ReferenceLine
                  y={myPrice}
                  stroke="rgba(200,240,96,0.2)"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#c8f060"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#c8f060', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cost slider */}
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
              label="Win probability"
              value={`${metrics.winProb}%`}
              sub={`beat all ${nFirms - 1} competitor${nFirms > 2 ? 's' : ''}`}
            />
            <StatCard
              label="Expected quantity"
              value={metrics.quantity}
              sub="units sold"
            />
          </div>

          <div className="ii-dist-panel">
            <div className="ii-dist-title">Competitor price distribution</div>
            <div className="ii-dist-sub">Equilibrium prices across all cost realizations</div>
            <div className="ii-dist-bars">
              {distData.map((bin, i) => (
                <div key={i} className="ii-dist-row">
                  <span className="ii-dist-price">{bin.label}</span>
                  <div className="ii-dist-track">
                    <div
                      className={`ii-dist-fill ${bin.belowMyPrice ? 'below' : 'above'}`}
                      style={{ width: `${bin.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="ii-dist-legend">
                <span className="ii-legend-item"><span className="ii-legend-dot below-dot" />below your price (you win)</span>
                <span className="ii-legend-item"><span className="ii-legend-dot above-dot" />above your price (you lose)</span>
              </div>
            </div>
          </div>

          <div className="ii-insight">
            <div className="ii-insight-label">Equilibrium insight</div>
            <p>
              With N = {nFirms} firm{nFirms > 1 ? 's' : ''}, a cost of <code>{cost}</code> maps
              to an optimal price of <code>{myPrice}</code> — a <code>{metrics.markup}%</code> markup.
              {nFirms > 2 && ' More competitors compress margins toward cost.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
