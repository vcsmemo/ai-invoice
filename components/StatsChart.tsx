'use client';

import { useEffect, useRef } from 'react';

interface StatsChartProps {
  width?: number;
  height?: number;
}

export default function StatsChart({ width = 800, height = 200 }: StatsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulated data - showing growth over 30 days
  const generateData = () => {
    const data = [];
    let value = 1250; // Starting value (total invoices created)

    for (let i = 0; i < 30; i++) {
      // Add some random growth with occasional spikes
      const growth = Math.random() * 150 + 20;
      value += growth;
      data.push({
        day: i + 1,
        value: Math.floor(value),
      });
    }

    return data;
  };

  const data = generateData();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up styles
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max values
    const minValue = Math.min(...data.map(d => d.value));
    const maxValue = Math.max(...data.map(d => d.value));
    const valueRange = maxValue - minValue;

    // Helper function to convert data point to canvas coordinates
    const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw gradient fill under the line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(200, 245, 66, 0.3)');
    gradient.addColorStop(1, 'rgba(200, 245, 66, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0].value));

    for (let i = 1; i < data.length; i++) {
      // Create smooth curve using bezier
      const xc = (getX(i) + getX(i - 1)) / 2;
      const yc = (getY(data[i].value) + getY(data[i - 1].value)) / 2;
      ctx.quadraticCurveTo(getX(i - 1), getY(data[i - 1].value), xc, yc);
    }

    ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1].value));
    ctx.lineTo(getX(data.length - 1), height - padding.bottom);
    ctx.lineTo(getX(0), height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the line
    ctx.strokeStyle = 'rgb(200, 245, 66)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    ctx.moveTo(getX(0), getY(data[0].value));

    for (let i = 1; i < data.length; i++) {
      const xc = (getX(i) + getX(i - 1)) / 2;
      const yc = (getY(data[i].value) + getY(data[i - 1].value)) / 2;
      ctx.quadraticCurveTo(getX(i - 1), getY(data[i - 1].value), xc, yc);
    }

    ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1].value));
    ctx.stroke();

    // Draw dots at data points
    ctx.fillStyle = 'rgb(200, 245, 66)';
    data.forEach((point, index) => {
      if (index % 5 === 0 || index === data.length - 1) {
        ctx.beginPath();
        ctx.arc(getX(index), getY(point.value), 4, 0, Math.PI * 2);
        ctx.fill();

        // Add white border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 4; i++) {
      const value = minValue + (valueRange / 4) * (4 - i);
      const y = padding.top + (chartHeight / 4) * i;
      const formattedValue = (value / 1000).toFixed(1) + 'k';
      ctx.fillText(formattedValue, padding.left - 10, y);
    }

    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const xLabels = ['Day 1', '', '', '', '', 'Day 15', '', '', '', '', 'Day 30'];
    xLabels.forEach((label, index) => {
      if (label) {
        const x = padding.left + (chartWidth / 11) * index;
        ctx.fillText(label, x, height - padding.bottom + 10);
      }
    });
  }, [data, width, height]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </div>
  );
}
