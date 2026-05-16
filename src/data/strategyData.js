import n2Data from './n2.json'
import n3Data from './n3.json'
import n5Data from './n5.json'

const ALPHA = 500
const BETA = 1.0
const C_PARAM = 0.3
export const COST_MIN = 80
export const COST_MAX = 250

export const strategyData = {
  2: n2Data.map(d => ({ cost: Math.round(d.cost*10)/10, price: Math.round(d.price*10)/10 })),
  3: n3Data.map(d => ({ cost: Math.round(d.cost*10)/10, price: Math.round(d.price*10)/10 })),
  5: n5Data.map(d => ({ cost: Math.round(d.cost*10)/10, price: Math.round(d.price*10)/10 })),
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
  // const quantity = Math.max(0, ALPHA - BETA * C_PARAM * (myPrice + totalCompetitorPrice))
  const quantity = Math.max(0, ALPHA - BETA * myPrice + C_PARAM * totalCompetitorPrice)
  const profit = Math.round((myPrice - myCost) * quantity)
  const profitPerSeat = Math.round(myPrice - myCost)
  const markup = Math.round(((myPrice - myCost) / myCost) * 100 * 10) / 10
  return {
    quantity: Math.round(quantity),
    profit,
    profitPerSeat,
    markup,
    avgCompetitorPrice: Math.round(avgCompetitorPrice * 10) / 10,
  }
}
