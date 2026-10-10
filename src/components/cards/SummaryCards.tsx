import React from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, TrendingUp, DollarSign, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

export const SummaryCards: React.FC = () => {
  const { selectedCustomer, effectiveRiskScore, isGovernanceCapped, effectiveApprovedLimit } = useData();

  if (!selectedCustomer) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-cardBg/50 rounded-2xl animate-pulse border border-cardBorder" />
        ))}
      </div>
    );
  }

  const defaultPercentage = (effectiveRiskScore * 100).toFixed(1);
  const isHighRisk = effectiveRiskScore >= 0.50;
  const isMedRisk = effectiveRiskScore >= 0.20 && effectiveRiskScore < 0.50;
  const isLowRisk = effectiveRiskScore < 0.20;

  const currentRiskTier = isHighRisk ? 'High Risk' : isMedRisk ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: Risk Status Card */}
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
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-sm font-extrabold border shadow-inner ${
                isLowRisk
                  ? 'bg-riskGreen/15 text-riskGreen border-riskGreen/40 shadow-riskGreen/10'
                  : isMedRisk
                  ? 'bg-riskYellow/15 text-riskYellow border-riskYellow/40 shadow-riskYellow/10'
                  : 'bg-riskRed/15 text-riskRed border-riskRed/40 shadow-riskRed/10'
              }`}
            >
              {isLowRisk ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
              <span>{currentRiskTier}</span>
            </span>
          </div>
        </div>
        <div
          className={`p-3.5 rounded-xl border shadow-lg ${
            isLowRisk
              ? 'bg-riskGreen/20 text-riskGreen border-riskGreen/30 shadow-riskGreen/20'
              : isMedRisk
              ? 'bg-riskYellow/20 text-riskYellow border-riskYellow/30 shadow-riskYellow/20'
              : 'bg-riskRed/20 text-riskRed border-riskRed/30 shadow-riskRed/20'
          }`}
        >
          <ShieldCheck className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Card 2: Default Risk Score Card */}
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
            <span className="text-3xl font-black text-white tracking-tight font-mono">
              {defaultPercentage}%
            </span>
            <span
              className={`text-xs font-extrabold flex items-center ${
                isHighRisk ? 'text-riskRed' : 'text-riskGreen'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> ↗
            </span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-riskYellow/20 text-riskYellow border border-riskYellow/30 shadow-lg shadow-riskYellow/20">
          <TrendingUp className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Card 3: Current Limit Card */}
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
          <div className="text-3xl font-black text-white tracking-tight font-mono">
            {formatCurrency(selectedCustomer.LIMIT_BAL)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-metricBlue/20 text-metricBlue border border-metricBlue/30 shadow-lg shadow-metricBlue/20">
          <DollarSign className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Card 4: Approved New Limit Card (With Business Rule Cap Enforcement!) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`glass-panel-interactive rounded-2xl p-5 flex items-center justify-between relative overflow-hidden ${
          isGovernanceCapped ? 'border-riskRed/60 shadow-riskRed/10' : ''
        }`}
      >
        <div className="space-y-1 z-10">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block flex items-center gap-1">
            Approved New Limit
            {isGovernanceCapped && (
              <span className="text-[10px] text-riskRed font-bold bg-riskRed/15 px-1.5 py-0.5 rounded border border-riskRed/30 flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Capped ($10k)
              </span>
            )}
          </span>
          <div className="text-3xl font-black text-white tracking-tight font-mono">
            {formatCurrency(effectiveApprovedLimit)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-metricPurple/20 text-metricPurple border border-metricPurple/30 shadow-lg shadow-metricPurple/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
      </motion.div>
    </div>
  );
};
