const ALPHA = 500
const BETA = 1.0
const C_PARAM = 0.3
const COST_MIN = 80
const COST_MAX = 250

function generateDummyStrategy(nFirms) {
  const points = []
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const cost = COST_MIN + (i / steps) * (COST_MAX - COST_MIN)
    const markupFactor = nFirms === 2 ? 0.42 : nFirms === 3 ? 0.28 : 0.18
    const baseOffset = nFirms === 2 ? 68 : nFirms === 3 ? 44 : 28
    const price = cost + baseOffset + markupFactor * (cost - COST_MIN)
    points.push({ cost: Math.round(cost * 10) / 10, price: Math.round(price * 10) / 10 })
  }
  return points
}

export const strategyData = {
  2: generateDummyStrategy(2),
  3: generateDummyStrategy(3),
  5: generateDummyStrategy(5),
}

export function interpolatePrice(cost, nFirms) {
  const data = strategyData[nFirms]
  if (!data) return null
  if (cost <= data[0].cost) return data[0].price
  if (cost >= data[data.length - 1].cost) return data[data.length - 1].price
  for (let i = 0; i < data.length - 1; i++) {
    if (cost >= data[i].cost && cost <= data[i + 1].cost) {
      const t = (cost - data[i].cost) / (data[i + 1].cost - data[i].cost)
      return Math.round((data[i].price + t * (data[i + 1].price - data[i].price)) * 10) / 10
    }
  }
  return null
}

export function computeMetrics(myCost, myPrice, nFirms) {
  const data = strategyData[nFirms]
  const avgCompetitorPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length
  const totalCompetitorPrice = (nFirms - 1) * avgCompetitorPrice
  const quantity = Math.max(0, ALPHA - BETA * C_PARAM * (myPrice + totalCompetitorPrice))
  const profit = (myPrice - myCost) * quantity
  const markup = ((myPrice - myCost) / myCost) * 100
  const winFrac = data.filter(d => d.price > myPrice).length / data.length
  const winProb = Math.pow(winFrac, nFirms - 1) * 100
  return {
    quantity: Math.round(quantity),
    profit: Math.round(profit),
    markup: Math.round(markup * 10) / 10,
    winProb: Math.round(winProb * 10) / 10,
    avgCompetitorPrice: Math.round(avgCompetitorPrice * 10) / 10,
  }
}

export function getCompetitorDistribution(nFirms, myPrice) {
  const data = strategyData[nFirms]
  const minP = Math.min(...data.map(d => d.price))
  const maxP = Math.max(...data.map(d => d.price))
  const bins = 10
  const binSize = (maxP - minP) / bins
  const hist = Array.from({ length: bins }, (_, i) => ({
    label: Math.round(minP + i * binSize),
    count: 0,
    belowMyPrice: false,
  }))
  data.forEach(d => {
    const idx = Math.min(Math.floor((d.price - minP) / binSize), bins - 1)
    hist[idx].count++
  })
  const maxCount = Math.max(...hist.map(b => b.count))
  return hist.map(b => ({
    ...b,
    pct: Math.round((b.count / maxCount) * 100),
    belowMyPrice: b.label < myPrice,
  }))
}

export { COST_MIN, COST_MAX }
