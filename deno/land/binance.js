import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/x/lodash@4.17.19/dist/lodash.js";
const _ = (self as any)._;

const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.body = "hi";
});

router.get("/currentPrice", async (ctx) => {
  const symbol = ctx.request.url.searchParams.get('symbol')

  const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
    .then(res => res.json())

  ctx.response.body = res.price;
});

router.get("/candlestick", async (ctx) => {
  const start = ctx.request.url.searchParams.get('start')
  const end = ctx.request.url.searchParams.get('end')
  const symbol = ctx.request.url.searchParams.get('symbol')
  const isFull = ctx.request.url.searchParams.get('full')

  const q = new URLSearchParams()
  const startUtc = parseDate(start)
  const endUtc = parseDate(end)

  if(startUtc <= 0) {
    throw new Error('invalid start') 
  }
  if(endUtc <= 0) {
    throw new Error('invalid end') 
  }
  q.append('startTime', startUtc)
  q.append('endTime', endUtc)
  q.append('symbol', symbol)
  q.append('interval', '1d')

  const res = await fetch(`https://api.binance.com/api/v3/klines?${q.toString()}`)
    .then(res => res.json())

  const calData =  parseBinanceCandlestick(symbol, res)

  if(isFull)
    ctx.response.body = calData;
  else
    ctx.response.body = calData.stats;
});

function parseDate(d: string) {
  const ins = new Date(d)
  console.log(d, ins)
  if(ins.valueOf() === NaN) return -1
  return ins.valueOf()
}

// https://binance-docs.github.io/apidocs/spot/en/#compressed-aggregate-trades-list
// https://www.investopedia.com/trading/candlestick-charting-what-is-it/
//  [
//     1499040000000,      // Open time
//     "0.01634790",       // Open
//     "0.80000000",       // High
//     "0.01575800",       // Low
//     "0.01577100",       // Close
//     "148976.11427815",  // Volume
//     1499644799999,      // Close time
//     "2434.19055334",    // Quote asset volume
//     308,                // Number of trades
//     "1756.87402397",    // Taker buy base asset volume
//     "28.46694368",      // Taker buy quote asset volume
//     "17928899.62484339" // Ignore.
//   ]
function parseBinanceCandlestick(code:string, res: any[]) {
  const mappedData = res.map(itm => {
    const [openUtc, openPrice, highPrice, lowPrice, closePrice, volume, closeUTC] = itm
    return {
      openUtc: new Date(openUtc),
      closeUTC: new Date(closeUTC),
      openPrice: +openPrice,
      closePrice: +closePrice,
      volume: +volume,
      highPrice: +highPrice,
      lowPrice: +lowPrice,
      avgPrice: ((+openPrice) + (+closePrice)) / 2
    }
  })
  const highest = _.maxBy(mappedData, "highPrice")?.highPrice
  const lowest = _.minBy(mappedData, "lowPrice")?.lowPrice
  const mean = _.meanBy(mappedData, "avgPrice")
  const open = _.meanBy(mappedData, "openPrice")
  const close = _.meanBy(mappedData, "closePrice")

  const samples = mappedData.length
  return {
    stats: {code, max: highest, min: lowest, mean, open, close, samples},
    mappedData
  }
}

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  (e) => console.log("Listening on http://localhost:8080"),
);
await app.listen({ port: 8080 });
