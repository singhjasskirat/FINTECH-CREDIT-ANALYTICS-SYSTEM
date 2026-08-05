import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User, DollarSign, Calendar, CreditCard, Clock, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomerDetailsPanel: React.FC = () => {
  const { selectedCustomer } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'paymentHistory' | 'bills'>('overview');

  if (!selectedCustomer) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-64 flex items-center justify-center">
        <span className="text-textSecondary text-sm">No customer record available.</span>
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-panel-interactive rounded-2xl p-6 space-y-6"
    >
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cardBorder pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-brandBlue/15 text-brandBlue border border-brandBlue/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Customer Information & Risk Attributes
            </h3>
            <p className="text-xs text-textSecondary font-mono">
              ID: {selectedCustomer.ID} • {selectedCustomer.CustomerName}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#161B22] p-1 rounded-xl border border-cardBorder text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-brandBlue text-white shadow-md' : 'text-textSecondary hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('paymentHistory')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'paymentHistory' ? 'bg-brandBlue text-white shadow-md' : 'text-textSecondary hover:text-white'
            }`}
          >
            Pay Delays
          </button>
          <button
            onClick={() => setActiveTab('bills')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bills' ? 'bg-brandBlue text-white shadow-md' : 'text-textSecondary hover:text-white'
            }`}
          >
            Bills & Payments
          </button>
        </div>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Age</span>
            <span className="text-base font-bold text-white font-mono">{selectedCustomer.AGE} years</span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Gender</span>
            <span className="text-base font-bold text-white">{selectedCustomer.GenderLabel}</span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Education</span>
            <span className="text-base font-bold text-white truncate block" title={selectedCustomer.EDUCATION}>
              {selectedCustomer.EDUCATION}
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Marital Status</span>
            <span className="text-base font-bold text-white">{selectedCustomer.MarriageLabel}</span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Occupation</span>
            <span className="text-base font-bold text-white truncate block" title={selectedCustomer.Occupation}>
              {selectedCustomer.Occupation}
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Utilization Ratio</span>
            <span className="text-base font-bold text-brandOrange font-mono">
              {(selectedCustomer['credit utilization ratio'] * 100).toFixed(1)}%
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Mean Monthly Bill</span>
            <span className="text-base font-bold text-white font-mono">
              {formatCurrency(selectedCustomer.mean_monthly_bill)}
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Mean Monthly Pay</span>
            <span className="text-base font-bold text-brandGreen font-mono">
              {formatCurrency(selectedCustomer.mean_monthly_payment)}
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Max Pay Delay</span>
            <span className="text-base font-bold text-brandRed font-mono">
              {selectedCustomer.max_payment_delay} month(s)
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Pay-to-Bill Ratio</span>
            <span className="text-base font-bold text-white font-mono">
              {(selectedCustomer.pay_to_bill_ratio * 100).toFixed(1)}%
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Risk Tier</span>
            <span className="text-base font-bold text-brandPurple font-mono">
              {selectedCustomer.Risk_Tier}
            </span>
          </div>

          <div className="bg-[#161B22]/60 p-3.5 rounded-xl border border-cardBorder/60 space-y-1">
            <span className="text-[11px] text-textSecondary uppercase font-medium block">Next Month Default</span>
            <span
              className={`text-base font-bold font-mono ${
                selectedCustomer['Default payment next month'] === 1 ? 'text-brandRed' : 'text-brandGreen'
              }`}
            >
              {selectedCustomer['Default payment next month'] === 1 ? 'Yes (Default)' : 'No (Clean)'}
            </span>
          </div>
        </div>
      )}

      {/* Tab Content 2: Payment Delay History */}
      {activeTab === 'paymentHistory' && (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { label: 'PAY_0 (Sep)', val: selectedCustomer.PAY_0 },
            { label: 'PAY_2 (Aug)', val: selectedCustomer.PAY_2 },
            { label: 'PAY_3 (Jul)', val: selectedCustomer.PAY_3 },
            { label: 'PAY_4 (Jun)', val: selectedCustomer.PAY_4 },
            { label: 'PAY_5 (May)', val: selectedCustomer.PAY_5 },
            { label: 'PAY_6 (Apr)', val: selectedCustomer.PAY_6 },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-center font-mono space-y-1 ${
                item.val <= 0
                  ? 'bg-brandGreen/10 border-brandGreen/30 text-brandGreen'
                  : item.val === 1
                  ? 'bg-brandOrange/10 border-brandOrange/30 text-brandOrange'
                  : 'bg-brandRed/10 border-brandRed/30 text-brandRed'
              }`}
            >
              <span className="text-xs text-textSecondary font-sans block">{item.label}</span>
              <span className="text-xl font-black">{item.val <= 0 ? 'Duly Paid' : `+${item.val} mo`}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Bills & Payments */}
      {activeTab === 'bills' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cardBorder text-textSecondary">
                <th className="py-2 px-3 font-semibold font-sans">Month</th>
                <th className="py-2 px-3 font-semibold font-sans text-right">Billed Amount</th>
                <th className="py-2 px-3 font-semibold font-sans text-right">Paid Amount</th>
                <th className="py-2 px-3 font-semibold font-sans text-right">Outstanding Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder/40">
              {[
                { month: 'September (M1)', bill: selectedCustomer.BILL_AMT1, pay: selectedCustomer.PAY_AMT1 },
                { month: 'August (M2)', bill: selectedCustomer.BILL_AMT2, pay: selectedCustomer.PAY_AMT2 },
                { month: 'July (M3)', bill: selectedCustomer.BILL_AMT3, pay: selectedCustomer.PAY_AMT3 },
                { month: 'June (M4)', bill: selectedCustomer.BILL_AMT4, pay: selectedCustomer.PAY_AMT4 },
                { month: 'May (M5)', bill: selectedCustomer.BILL_AMT5, pay: selectedCustomer.PAY_AMT5 },
                { month: 'April (M6)', bill: selectedCustomer.BILL_AMT6, pay: selectedCustomer.PAY_AMT6 },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-cardBg/40">
                  <td className="py-2.5 px-3 font-sans text-white">{row.month}</td>
                  <td className="py-2.5 px-3 text-right text-textSecondary">{formatCurrency(row.bill)}</td>
                  <td className="py-2.5 px-3 text-right text-brandGreen">{formatCurrency(row.pay)}</td>
                  <td className="py-2.5 px-3 text-right text-brandOrange">
                    {formatCurrency(Math.max(0, row.bill - row.pay))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};
