import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useData } from '../../context/DataContext';
import { Radar, ScatterChart, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExtraAnalyticsCharts: React.FC = () => {
  const { selectedCustomer, customers } = useData();

  if (!selectedCustomer) return null;

  // Radar Chart option: Customer Risk Profile vs Portfolio Benchmark
  const radarOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    radar: {
      indicator: [
        { name: 'Default Score', max: 100 },
        { name: 'Utilization %', max: 100 },
        { name: 'Max Pay Delay', max: 6 },
        { name: 'Bill Amount Ratio', max: 100 },
        { name: 'Age Factor', max: 80 },
      ],
      shape: 'polygon',
      axisName: { color: '#B0BEC5', fontSize: 11 },
      splitArea: {
        areaStyle: {
          color: ['rgba(27, 36, 48, 0.6)', 'rgba(22, 27, 34, 0.4)'],
        },
      },
      splitLine: { lineStyle: { color: '#30363D' } },
    },
    series: [
      {
        name: 'Risk Profile Comparison',
        type: 'radar',
        data: [
          {
            value: [
              Number((selectedCustomer.Default_Risk_Score * 100).toFixed(0)),
              Number((selectedCustomer['credit utilization ratio'] * 100).toFixed(0)),
              selectedCustomer.max_payment_delay,
              Number((selectedCustomer.pay_to_bill_ratio * 100).toFixed(0)),
              selectedCustomer.AGE,
            ],
            name: `Customer #${selectedCustomer.ID}`,
            itemStyle: { color: '#FB8C00' },
            areaStyle: { color: 'rgba(251, 140, 0, 0.3)' },
          },
          {
            value: [22, 35, 1, 15, 35], // Portfolio average baseline
            name: 'Portfolio Average',
            itemStyle: { color: '#2979FF' },
            areaStyle: { color: 'rgba(41, 121, 255, 0.2)' },
          },
        ],
      },
    ],
  };

  // Scatter Plot: Credit Limit vs Default Risk Score across customers sample
  const sampleData = customers.slice(0, 300).map(c => [
    c.LIMIT_BAL / 1000,
    Number((c.Default_Risk_Score * 100).toFixed(1)),
    c.ID,
    c.Risk_Tier,
  ]);

  const scatterOption = {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (param: any) => {
        return `Customer ID: ${param.data[2]}<br/>Limit: $${param.data[0]}k<br/>Risk Score: ${param.data[1]}%<br/>Tier: ${param.data[3]}`;
      },
      backgroundColor: '#1B2430',
      borderColor: '#30363D',
      textStyle: { color: '#FFF' },
    },
    grid: { left: '12%', right: '5%', top: '15%', bottom: '15%' },
    xAxis: {
      type: 'value',
      name: 'Credit Limit ($k)',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: { color: '#B0BEC5', fontSize: 11 },
      axisLabel: { color: '#B0BEC5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(48, 54, 61, 0.4)', type: 'dashed' } },
    },
    yAxis: {
      type: 'value',
      name: 'Default Risk Score (%)',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#B0BEC5', fontSize: 11 },
      axisLabel: { color: '#B0BEC5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(48, 54, 61, 0.4)', type: 'dashed' } },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 8,
        data: sampleData,
        itemStyle: {
          color: (param: any) => {
            const tier = param.data[3];
            if (tier === 'Low Risk') return '#00C853';
            if (tier === 'Medium Risk') return '#FB8C00';
            return '#E53935';
          },
        },
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass-panel-interactive rounded-2xl p-6 min-h-[360px]"
      >
        <div className="flex items-center space-x-2 mb-1">
          <Radar className="w-5 h-5 text-brandPurple" />
          <h3 className="text-lg font-bold text-white tracking-tight">Customer Risk Radar Profile</h3>
        </div>
        <p className="text-xs text-textSecondary font-medium pl-7">
          Benchmark against Portfolio Averages
        </p>

        <div className="w-full h-64">
          <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </motion.div>

      {/* Scatter Plot */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="glass-panel-interactive rounded-2xl p-6 min-h-[360px]"
      >
        <div className="flex items-center space-x-2 mb-1">
          <ScatterChart className="w-5 h-5 text-brandBlue" />
          <h3 className="text-lg font-bold text-white tracking-tight">Limit vs Risk Score Scatter</h3>
        </div>
        <p className="text-xs text-textSecondary font-medium pl-7">
          Risk Tier Distribution Across Portfolio Samples
        </p>

        <div className="w-full h-64">
          <ReactECharts option={scatterOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </motion.div>
    </div>
  );
};
