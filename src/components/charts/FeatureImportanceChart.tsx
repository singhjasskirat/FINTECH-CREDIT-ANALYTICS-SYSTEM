import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useData } from '../../context/DataContext';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeatureImportanceChart: React.FC = () => {
  const { featureImportance, selectedCustomer } = useData();

  if (!selectedCustomer || !featureImportance.length) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-80 flex items-center justify-center">
        <span className="text-textSecondary text-sm">Select a customer to view key indicators</span>
      </div>
    );
  }

  // Reverse so top predictor appears at the top of horizontal EChart
  const sortedItems = [...featureImportance].sort((a, b) => a.importance - b.importance);
  const categories = sortedItems.map(item => item.name);
  const dataValues = sortedItems.map(item => item.importance);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}: {c}%',
      backgroundColor: '#1B2430',
      borderColor: '#30363D',
      textStyle: { color: '#FFF' },
    },
    grid: {
      left: '25%',
      right: '12%',
      top: '8%',
      bottom: '12%',
      containLabel: false,
    },
    xAxis: {
      type: 'value',
      max: 70,
      interval: 10,
      axisLabel: {
        color: '#B0BEC5',
        fontSize: 11,
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(48, 54, 61, 0.4)',
          type: 'dashed',
        },
      },
      name: 'Importance',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
        color: '#B0BEC5',
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'Importance',
        type: 'bar',
        barWidth: 18,
        data: dataValues,
        label: {
          show: true,
          position: 'right',
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{c}%',
        },
        itemStyle: {
          borderRadius: [0, 99, 99, 0],
          // 3D Glossy orange gradient matching reference image
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#E65100' },
              { offset: 0.5, color: '#FB8C00' },
              { offset: 1, color: '#FFA726' },
            ],
          },
          shadowColor: 'rgba(251, 140, 0, 0.4)',
          shadowBlur: 10,
        },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between h-full min-h-[380px]"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brandOrange" />
            <h3 className="text-lg font-bold text-white tracking-tight">Customer Key Indicators</h3>
          </div>
        </div>
        <p className="text-xs text-textSecondary font-medium pl-7">
          Key Default Predictors
        </p>
      </div>

      <div className="w-full h-72">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </motion.div>
  );
};
