import { OHLCV, BollingerBandsOptions } from '../types';

/**
 * Calculate Simple Moving Average
 */
function calculateSMA(values: number[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = values.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      sma.push(sum / period);
    }
  }
  
  return sma;
}

/**
 * Calculate Standard Deviation (Population)
 * Using population standard deviation for consistency with trading platforms
 */
function calculateStandardDeviation(values: number[], period: number): number[] {
  const stdDev: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      stdDev.push(NaN);
    } else {
      const slice = values.slice(i - period + 1, i + 1);
      const mean = slice.reduce((acc, val) => acc + val, 0) / period;
      const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
      stdDev.push(Math.sqrt(variance));
    }
  }
  
  return stdDev;
}

/**
 * Apply offset to shift the bands
 */
function applyOffset(values: number[], offset: number): number[] {
  if (offset === 0) return values;
  
  const result = new Array(values.length).fill(NaN);
  
  if (offset > 0) {
    // Shift forward (into the future)
    for (let i = 0; i < values.length - offset; i++) {
      result[i + offset] = values[i];
    }
  } else {
    // Shift backward (into the past)
    for (let i = -offset; i < values.length; i++) {
      result[i + offset] = values[i];
    }
  }
  
  return result;
}

/**
 * Compute Bollinger Bands indicator
 * Returns arrays of upper, middle (basis), and lower band values
 */
export function computeBollingerBands(
  data: OHLCV[],
  options: BollingerBandsOptions
): {
  upper: number[];
  middle: number[];
  lower: number[];
} {
  const { length, stdDevMultiplier, offset } = options;
  
  // Extract close prices (source)
  const closePrices = data.map(candle => candle.close);
  
  // Calculate Simple Moving Average (Basis/Middle Band)
  const sma = calculateSMA(closePrices, length);
  
  // Calculate Standard Deviation
  const stdDev = calculateStandardDeviation(closePrices, length);
  
  // Calculate Upper and Lower Bands
  const upperRaw = sma.map((basis, i) => 
    isNaN(basis) || isNaN(stdDev[i]) ? NaN : basis + (stdDevMultiplier * stdDev[i])
  );
  
  const lowerRaw = sma.map((basis, i) => 
    isNaN(basis) || isNaN(stdDev[i]) ? NaN : basis - (stdDevMultiplier * stdDev[i])
  );
  
  // Apply offset
  const middle = applyOffset(sma, offset);
  const upper = applyOffset(upperRaw, offset);
  const lower = applyOffset(lowerRaw, offset);
  
  return { upper, middle, lower };
}

/**
 * Format Bollinger Bands data for KLineCharts
 */
export function formatBollingerBandsForChart(
  data: OHLCV[],
  bandsData: { upper: number[]; middle: number[]; lower: number[] }
): any[] {
  return data.map((candle, index) => ({
    timestamp: candle.timestamp,
    upper: bandsData.upper[index],
    middle: bandsData.middle[index],
    lower: bandsData.lower[index]
  }));
}