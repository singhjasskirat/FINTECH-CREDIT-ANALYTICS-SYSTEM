import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useData } from '../../context/DataContext';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export const RiskGauge: React.FC = () => {
  const { effectiveRiskScore } = useData();

  const riskScore = Number((effectiveRiskScore * 100).toFixed(1));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: 'Default Risk Probability',
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '90%',
        center: ['50%', '65%'],
        axisLine: {
          lineStyle: {
            width: 26,
            color: [
              [0.3, '#10B981'], // Green (0-30%)
              [0.6, '#F59E0B'], // Yellow (30-60%)
              [1, '#EF4444'],    // Red (60-100%)
            ],
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
          },
        },
        pointer: {
          icon: 'path://M2,2 L2,-80 L-2,-80 Z',
          length: '75%',
          width: 8,
          offsetCenter: [0, '5%'],
          itemStyle: {
            color: '#38BDF8', // Bright blue needle matching reference UI accent
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowBlur: 8,
          },
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 20,
          itemStyle: {
            borderWidth: 4,
            borderColor: '#334155',
            color: '#1E293B',
          },
        },
        axisTick: {
          length: 8,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        splitLine: {
          length: 14,
          lineStyle: {
            color: 'auto',
            width: 3,
          },
        },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 12,
          distance: 12,
          formatter: (value: number) => {
            if (value === 0) return '0-30';
            if (value === 30) return '30';
            if (value === 60) return '60';
            if (value === 100) return '60-100';
            return '';
          },
        },
        title: {
          offsetCenter: [0, '30%'],
          fontSize: 13,
          color: '#94A3B8',
          fontWeight: '500',
        },
        detail: {
          fontSize: 28,
          offsetCenter: [0, '-10%'],
          valueAnimation: true,
          formatter: '{value}%',
          color: '#FFFFFF',
          fontWeight: '800',
          fontFamily: 'monospace',
        },
        data: [
          {
            value: riskScore,
            name: '',
          },
        ],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between h-full min-h-[380px]"
    >
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <Target className="w-5 h-5 text-riskRed" />
          <h3 className="text-lg font-bold text-white tracking-tight">Risk Score Gauge</h3>
        </div>
        <p className="text-xs text-textSecondary font-medium pl-7">
          Default Risk Probability (%)
        </p>
      </div>

      <div className="w-full h-72 flex items-center justify-center">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </motion.div>
  );
};
