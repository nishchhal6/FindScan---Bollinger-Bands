"use client";

import { useEffect, useRef, useState } from "react";
// import klinecharts from 'klinecharts';  <- Ise comment hi rehne dein

import { Button } from "@/components/ui/button";
import { Settings, TrendingUp } from "lucide-react";
import BollingerSettings from "./BollingerSettings";
import { generateDemoData } from "@/lib/data/demo-data";
import { computeBollingerBands } from "@/lib/indicators/bollinger";
import { OHLCV, BollingerBandsOptions, BollingerBandsStyle } from "@/lib/types";

const defaultOptions: BollingerBandsOptions = {
  length: 20,
  maType: "SMA",
  source: "close",
  stdDevMultiplier: 2,
  offset: 0,
};

const defaultStyle: BollingerBandsStyle = {
  middle: {
    visible: true,
    color: "#2563eb",
    lineWidth: 1,
    lineStyle: "solid",
  },
  upper: {
    visible: true,
    color: "#16a34a",
    lineWidth: 1,
    lineStyle: "solid",
  },
  lower: {
    visible: true,
    color: "#dc2626",
    lineWidth: 1,
    lineStyle: "solid",
  },
  background: {
    visible: true,
    opacity: 0.1,
  },
};

export default function Chart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [indicatorAdded, setIndicatorAdded] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [style, setStyle] = useState(defaultStyle);
  const [data] = useState<OHLCV[]>(generateDemoData());

  // Initialize chart using dynamic import
  useEffect(() => {
    let klinecharts: any;

    const initChart = async () => {
      if (chartRef.current && !chartInstance.current) {
        // Dynamic import - Naya Sahi Tareeka
        klinecharts = await import("klinecharts");

        // Ab klinecharts.init chalna chahiye
        chartInstance.current = klinecharts.init(chartRef.current);

        // Configure chart appearance
        chartInstance.current.setStyles({
          grid: {
            show: true,
            horizontal: {
              show: true,
              color: "#374151",
              style: "dashed",
            },
            vertical: {
              show: true,
              color: "#374151",
              style: "dashed",
            },
          },
          candle: {
            type: "candle_solid",
            bar: {
              upColor: "#10b981",
              downColor: "#ef4444",
              noChangeColor: "#6b7280",
              upBorderColor: "#10b981",
              downBorderColor: "#ef4444",
              noChangeBorderColor: "#6b7280",
              upWickColor: "#10b981",
              downWickColor: "#ef4444",
              noChangeWickColor: "#6b7280",
            },
            tooltip: {
              showRule: "always",
              showType: "standard",
            },
          },
          crosshair: {
            show: true,
            horizontal: {
              show: true,
              line: {
                color: "#9ca3af",
                width: 1,
                style: "dashed",
              },
              text: {
                show: true,
                color: "#f3f4f6",
                backgroundColor: "#374151",
                borderColor: "#6b7280",
              },
            },
            vertical: {
              show: true,
              line: {
                color: "#9ca3af",
                width: 1,
                style: "dashed",
              },
              text: {
                show: true,
                color: "#f3f4f6",
                backgroundColor: "#374151",
                borderColor: "#6b7280",
              },
            },
          },
          yAxis: {
            show: true,
            position: "right",
            type: "normal",
            inside: false,
            reverse: false,
            tick: {
              show: true,
              text: {
                show: true,
                color: "#d1d5db",
                size: 12,
              },
              line: {
                show: true,
                color: "#6b7280",
              },
            },
            axisLine: {
              show: true,
              color: "#6b7280",
            },
          },
          xAxis: {
            show: true,
            position: "bottom",
            type: "time",
            inside: false,
            reverse: false,
            tick: {
              show: true,
              text: {
                show: true,
                color: "#d1d5db",
                size: 12,
              },
              line: {
                show: true,
                color: "#6b7280",
              },
            },
            axisLine: {
              show: true,
              color: "#6b7280",
            },
          },
        });

        // Load initial data
        const formattedData = data.map((candle) => ({
          timestamp: candle.timestamp,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
        }));

        chartInstance.current.applyNewData(formattedData);
      }
    };

    initChart();

    return () => {
      if (chartInstance.current && klinecharts) {
        klinecharts.dispose(chartRef.current as HTMLElement);
        chartInstance.current = null;
      }
    };
  }, [data]);

  // Update Bollinger Bands when options or style change
  useEffect(() => {
    if (!chartInstance.current || !indicatorAdded) return;
    updateBollingerBands();
  }, [options, style, indicatorAdded]);

  const updateBollingerBands = () => {
    if (!chartInstance.current) return;

    // Remove existing indicator
    chartInstance.current.removeIndicator("bollinger_bands");

    // Calculate Bollinger Bands
    const bandsData = computeBollingerBands(data, options);

    // Create custom Bollinger Bands indicator
    const bollingerIndicator = {
      name: "bollinger_bands",
      shortName: "BB",
      series: "price",
      precision: 2,
      figures: [
        { key: "upper", title: "Upper: ", type: "line" },
        { key: "middle", title: "Middle: ", type: "line" },
        { key: "lower", title: "Lower: ", type: "line" },
      ],
      calc: () => {
        return data.map((_, index) => ({
          upper: bandsData.upper[index],
          middle: bandsData.middle[index],
          lower: bandsData.lower[index],
        }));
      },
      draw: ({ ctx, barSpace, visibleRange, indicator, xAxis, yAxis }: any) => {
        const { from, to } = visibleRange;

        ctx.save();

        // Draw background fill if visible
        if (style.background.visible) {
          ctx.globalAlpha = style.background.opacity;
          ctx.fillStyle = style.upper.color;

          ctx.beginPath();
          let hasValidData = false;

          // Draw upper band path
          for (let i = from; i < to; i++) {
            const data = indicator.result[i];
            if (!data || isNaN(data.upper) || isNaN(data.lower)) continue;

            const x = xAxis.convertToPixel(i);
            const upperY = yAxis.convertToPixel(data.upper);

            if (!hasValidData) {
              ctx.moveTo(x, upperY);
              hasValidData = true;
            } else {
              ctx.lineTo(x, upperY);
            }
          }

          // Draw lower band path in reverse
          for (let i = to - 1; i >= from; i--) {
            const data = indicator.result[i];
            if (!data || isNaN(data.upper) || isNaN(data.lower)) continue;

            const x = xAxis.convertToPixel(i);
            const lowerY = yAxis.convertToPixel(data.lower);
            ctx.lineTo(x, lowerY);
          }

          if (hasValidData) {
            ctx.closePath();
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1;

        // Draw band lines
        const lines = [
          { key: "upper", style: style.upper },
          { key: "middle", style: style.middle },
          { key: "lower", style: style.lower },
        ];

        lines.forEach(({ key, style: lineStyle }) => {
          if (!lineStyle.visible) return;

          ctx.strokeStyle = lineStyle.color;
          ctx.lineWidth = lineStyle.lineWidth;
          ctx.setLineDash(lineStyle.lineStyle === "dashed" ? [5, 5] : []);

          ctx.beginPath();
          let hasValidData = false;

          for (let i = from; i < to; i++) {
            const data = indicator.result[i];
            if (!data || isNaN(data[key])) continue;

            const x = xAxis.convertToPixel(i);
            const y = yAxis.convertToPixel(data[key]);

            if (!hasValidData) {
              ctx.moveTo(x, y);
              hasValidData = true;
            } else {
              ctx.lineTo(x, y);
            }
          }

          if (hasValidData) {
            ctx.stroke();
          }
        });

        ctx.restore();
      },
    };

    // Add the indicator to chart
    chartInstance.current.createIndicator(bollingerIndicator, false, {
      id: "bollinger_bands",
    });
  };

  const handleAddIndicator = () => {
    setIndicatorAdded(true);
  };

  const handleRemoveIndicator = () => {
    if (chartInstance.current) {
      chartInstance.current.removeIndicator("bollinger_bands");
      setIndicatorAdded(false);
    }
  };

  const handleOptionsChange = (newOptions: BollingerBandsOptions) => {
    setOptions(newOptions);
  };

  const handleStyleChange = (newStyle: BollingerBandsStyle) => {
    setStyle(newStyle);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">
            FindScan - Bollinger Bands
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {!indicatorAdded ? (
            <Button
              onClick={handleAddIndicator}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Add Bollinger Bands
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(true)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveIndicator}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove Indicator
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 bg-gray-900">
        <div ref={chartRef} className="w-full h-full" />
      </div>

      {/* Settings Modal */}
      <BollingerSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        options={options}
        style={style}
        onOptionsChange={handleOptionsChange}
        onStyleChange={handleStyleChange}
      />
    </div>
  );
}
