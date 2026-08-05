import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper for currency formatting
const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

export const SummaryCards: React.FC = () => {
  const { selectedCustomer } = useData();

  if (!selectedCustomer) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-[#1B2430]/50 rounded-xl animate-pulse border border-[#30363D]" />
        ))}
      </div>
    );
  }

  const defaultPercentage = (selectedCustomer.Default_Risk_Score * 100).toFixed(1);
  const isLowRisk = selectedCustomer.Risk_Tier === 'Low Risk';
  const isMedRisk = selectedCustomer.Risk_Tier === 'Medium Risk';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: Risk Status */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="glass-panel-interactive rounded-2xl p-5 flex items-center justify-between relative overflow-hidden"
      >
        <div className="space-y-3 z-10">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">
            Risk Status
          </span>
          <div>
            <span
              className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-base font-bold border shadow-inner ${
                isLowRisk
                  ? 'bg-brandGreen/15 text-brandGreen border-brandGreen/40 shadow-brandGreen/10'
                  : isMedRisk
                  ? 'bg-brandOrange/15 text-brandOrange border-brandOrange/40 shadow-brandOrange/10'
                  : 'bg-brandRed/15 text-brandRed border-brandRed/40 shadow-brandRed/10'
              }`}
            >
              {selectedCustomer.Risk_Tier}
            </span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-brandGreen/20 text-brandGreen border border-brandGreen/30 shadow-lg shadow-brandGreen/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Card 2: Default Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-panel-interactive rounded-2xl p-5 flex items-center justify-between relative overflow-hidden"
      >
        <div className="space-y-1 z-10">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">
            Default Risk Score
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {defaultPercentage}%
            </span>
            <span className={`text-xs font-bold flex items-center ${isLowRisk ? 'text-brandGreen' : 'text-brandRed'}`}>
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
              {isLowRisk ? '-2.4%' : '+4.1%'}
            </span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-brandOrange/20 text-brandOrange border border-brandOrange/30 shadow-lg shadow-brandOrange/20">
          <TrendingUp className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Card 3: Current Credit Limit */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="glass-panel-interactive rounded-2xl p-5 flex items-center justify-between relative overflow-hidden"
      >
        <div className="space-y-1 z-10">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">
            Current Limit
          </span>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {formatCurrency(selectedCustomer.LIMIT_BAL)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-brandBlue/20 text-brandBlue border border-brandBlue/30 shadow-lg shadow-brandBlue/20">
          <DollarSign className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Card 4: Approved New Limit */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass-panel-interactive rounded-2xl p-5 flex items-center justify-between relative overflow-hidden"
      >
        <div className="space-y-1 z-10">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">
            Approved New Limit
          </span>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {formatCurrency(selectedCustomer.Final_Approved_Limit)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-brandPurple/20 text-brandPurple border border-brandPurple/30 shadow-lg shadow-brandPurple/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
      </motion.div>
    </div>
  );
};
