import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useData } from '../../context/DataContext';
import { PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const RiskTierPieChart: React.FC = () => {
  const { portfolioSummary } = useData();

  const { lowRiskCount, mediumRiskCount, highRiskCount, lowRiskPercentage, mediumRiskPercentage, highRiskPercentage } =
    portfolioSummary;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} customers ({d}%)',
      backgroundColor: '#1B2430',
      borderColor: '#30363D',
      textStyle: { color: '#FFF' },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#B0BEC5',
        fontSize: 12,
      },
      itemGap: 12,
      formatter: (name: string) => {
        if (name === 'Low Risk') return `Low Risk (${lowRiskPercentage}%)`;
        if (name === 'Medium Risk') return `Medium Risk (${mediumRiskPercentage}%)`;
        if (name === 'High Risk') return `High Risk (${highRiskPercentage}%)`;
        return name;
      },
    },
    series: [
      {
        name: 'Risk Tier Distribution',
        type: 'pie',
        radius: ['0%', '70%'],
        center: ['35%', '50%'],
        roseType: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#161B22',
          borderWidth: 2,
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n({d}%)',
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '600',
        },
        labelLine: {
          lineStyle: {
            color: '#30363D',
          },
          smooth: 0.2,
          length: 10,
          length2: 15,
        },
        data: [
          {
            value: lowRiskCount,
            name: 'Low Risk',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#00E676' },
                  { offset: 1, color: '#00C853' },
                ],
              },
            },
          },
          {
            value: mediumRiskCount,
            name: 'Medium Risk',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#FFEA00' },
                  { offset: 1, color: '#FB8C00' },
                ],
              },
            },
          },
          {
            value: highRiskCount,
            name: 'High Risk',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#FF5252' },
                  { offset: 1, color: '#E53935' },
                ],
              },
            },
          },
        ],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between h-full min-h-[360px]"
    >
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <PieChart className="w-5 h-5 text-brandGreen" />
          <h3 className="text-lg font-bold text-white tracking-tight">Risk Tier Distribution</h3>
        </div>
        <p className="text-xs text-textSecondary font-medium pl-7">
          Portfolio Breakdown by Risk Rating
        </p>
      </div>

      <div className="w-full h-64">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </motion.div>
  );
};
