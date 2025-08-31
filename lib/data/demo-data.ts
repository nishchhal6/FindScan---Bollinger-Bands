import { OHLCV } from '../types';

// Generate realistic demo OHLCV data for testing - 250 candles
export function generateDemoData(): OHLCV[] {
  const data: OHLCV[] = [];
  const startPrice = 150;
  const startTime = Date.now() - (250 * 24 * 60 * 60 * 1000); // 250 days ago
  
  let currentPrice = startPrice;
  
  for (let i = 0; i < 250; i++) {
    const timestamp = startTime + (i * 24 * 60 * 60 * 1000); // Daily candles
    
    // Add realistic price movement with trends and volatility
    const volatility = 0.025;
    const trend = Math.sin(i / 30) * 0.002; // Longer trend cycles
    const randomWalk = (Math.random() - 0.5) * volatility;
    const momentum = Math.sin(i / 10) * 0.001; // Short-term momentum
    
    const totalChange = trend + randomWalk + momentum;
    
    const open = currentPrice;
    const change = open * totalChange;
    const close = open + change;
    
    // Generate realistic high and low
    const minPrice = Math.min(open, close);
    const maxPrice = Math.max(open, close);
    
    const wickMultiplier = Math.random() * 0.015 + 0.005;
    const high = maxPrice + (maxPrice * wickMultiplier);
    const low = minPrice - (minPrice * wickMultiplier);
    
    // Generate realistic volume with some correlation to price movement
    const baseVolume = 1500000;
    const volatilityBoost = Math.abs(totalChange) * 2;
    const volumeVariation = (Math.random() * 0.6 + 0.7) * (1 + volatilityBoost);
    const volume = Math.floor(baseVolume * volumeVariation);
    
    data.push({
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
}