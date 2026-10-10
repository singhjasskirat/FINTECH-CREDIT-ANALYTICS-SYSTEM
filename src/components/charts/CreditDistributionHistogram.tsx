import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useData } from '../../context/DataContext';
import { BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const CreditDistributionHistogram: React.FC = () => {
  const { portfolioSummary } = useData();

  const { limitBins } = portfolioSummary;

  const bins = limitBins.map(b => b.bin);
  const lowRiskData = limitBins.map(b => b.lowRisk);
  const medRiskData = limitBins.map(b => b.medRisk);
  const highRiskData = limitBins.map(b => b.highRisk);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#1E293B',
      borderColor: '#334155',
      textStyle: { color: '#FFF' },
    },
    legend: {
      top: '0%',
      right: '5%',
      textStyle: { color: '#94A3B8', fontSize: 11 },
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '15%',
      bottom: '15%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: bins,
      name: 'Approved New Limit',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#94A3B8', fontSize: 11 },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      name: 'Count of Customers',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: { color: '#94A3B8', fontSize: 11 },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.4)', type: 'dashed' } },
    },
    series: [
      {
        name: 'High Risk',
        type: 'bar',
        stack: 'total',
        data: highRiskData,
        itemStyle: { color: '#EF4444', borderRadius: [0, 0, 2, 2] },
      },
      {
        name: 'Medium Risk',
        type: 'bar',
        stack: 'total',
        data: medRiskData,
        itemStyle: { color: '#F59E0B' },
      },
      {
        name: 'Low Risk',
        type: 'bar',
        stack: 'total',
        data: lowRiskData,
        itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between h-full min-h-[360px]"
    >
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <BarChart className="w-5 h-5 text-metricBlue" />
          <h3 className="text-lg font-bold text-white tracking-tight">Approved Credit Limit Distribution</h3>
        </div>
        <p className="text-xs text-textSecondary font-medium pl-7">
          Customer Count by Approved Credit Tier
        </p>
      </div>

      <div className="w-full h-64">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </motion.div>
  );
};
