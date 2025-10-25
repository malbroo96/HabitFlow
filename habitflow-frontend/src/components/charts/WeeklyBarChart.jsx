// src/components/charts/WeeklyBarChart.jsx
import React, { useEffect, useRef } from 'react';

const WeeklyBarChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const barWidth = chartWidth / data.length - 10;
    const maxValue = 100;

    data.forEach((item, index) => {
      const barHeight = (item.percentage / maxValue) * chartHeight;
      const x = padding.left + (index * (chartWidth / data.length)) + 5;
      const y = padding.top + chartHeight - barHeight;

      ctx.fillStyle = item.percentage > 70 ? '#10b981' : item.percentage > 40 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${item.percentage}%`, x + barWidth / 2, y - 5);

      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText(item.dayName, x + barWidth / 2, height - padding.bottom + 20);
    });

    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i;
      const y = padding.top + chartHeight - (chartHeight / 5) * i;
      ctx.fillText(`${Math.round(value)}%`, padding.left - 10, y + 4);
    }

  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Progress</h3>
      <div className="relative" style={{ height: '300px' }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default WeeklyBarChart;