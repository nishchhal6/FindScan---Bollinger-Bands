export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBandsData {
  upper: number;
  middle: number;
  lower: number;
}

export interface BollingerBandsOptions {
  length: number;
  maType: 'SMA';
  source: 'close';
  stdDevMultiplier: number;
  offset: number;
}

export interface BollingerBandsStyle {
  middle: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  upper: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  lower: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  background: {
    visible: boolean;
    opacity: number;
  };
}