import { NS } from '@ns';

export async function main(ns: NS) {
  const symbols = ns.stock.getSymbols();
  const metadata = symbols.map((symbol) => {
    const forecast = ns.stock.getForecast(symbol);
    const volatility = ns.stock.getVolatility(symbol);
    const profitPotential = (forecast - 0.5) * volatility;

    ns.tprintf('[%s] %s', symbol, profitPotential);

    return {
      symbol,
      forecast,
      profitPotential,
    };
  });

  const sortedMeta = metadata.sort((symbolA, symbolB) => {
    return symbolB.profitPotential - symbolA.profitPotential;
  });

  ns.tprint(sortedMeta);

  // if (forecast > 0.6) {
  //   // const price = ns.stock.buyStock(symbol, 10000);
  //   // ns.stock.placeOrder(symbol, 100, price + 1, 'Limit', 'Long');
  //   // ns.tprintf("Bought %s at $%s and placed a limit order at $%s", symbol, price, price + 1)
  //   // ns.tprintf("Bought %s at $%s", symbol, price)
  // }
}
