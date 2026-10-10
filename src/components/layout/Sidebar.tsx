import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, RotateCcw, Shield, GraduationCap, Upload, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onOpenUploadModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenUploadModal }) => {
  const {
    customers,
    filters,
    setSearchId,
    setRiskTierFilter,
    setEducationFilter,
    setNtcModeFilter,
    resetFilters,
    selectCustomerById,
  } = useData();

  const [inputVal, setInputVal] = useState<string>(filters.searchId || '12345678');
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  const educationOptions = Array.from(new Set(customers.map(c => c.EDUCATION).filter(Boolean)));

  const suggestions = customers
    .filter(c => inputVal.trim() !== '' && c.ID.toString().startsWith(inputVal.trim()))
    .slice(0, 8);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchId(inputVal);
    setShowAutocomplete(false);
  };

  const handleSelectSuggestion = (id: number) => {
    setInputVal(id.toString());
    selectCustomerById(id);
    setShowAutocomplete(false);
  };

  return (
    <aside className="w-full lg:w-72 bg-sidebarBg border-r border-cardBorder flex flex-col justify-between p-5 min-h-screen text-textPrimary shadow-2xl relative z-20">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex items-center space-x-2.5 border-b border-cardBorder/80 pb-4">
          <Search className="w-5 h-5 text-white" />
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            Customer Search
          </h2>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-5">
          {/* 1. Search ID Input (with Red/Accent outline as in prompt reference UI) */}
          <div className="space-y-2 relative">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">
              Search ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
                placeholder="12345678"
                className="w-full bg-[#181825] border-2 border-riskRed/90 focus:border-riskRed focus:ring-2 focus:ring-riskRed/40 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-500 font-mono shadow-md shadow-riskRed/20"
              />
              <Search className="w-4 h-4 text-riskRed absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showAutocomplete && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-50 left-0 right-0 mt-1 bg-[#1E293B] border border-cardBorder rounded-lg shadow-2xl max-h-48 overflow-y-auto divide-y divide-cardBorder/40"
                >
                  {suggestions.map((c) => (
                    <li
                      key={c.ID}
                      onClick={() => handleSelectSuggestion(c.ID)}
                      className="px-3.5 py-2 hover:bg-metricBlue/20 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-mono text-white font-medium">ID: {c.ID}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          c.Risk_Tier === 'Low Risk'
                            ? 'bg-riskGreen/20 text-riskGreen'
                            : c.Risk_Tier === 'Medium Risk'
                            ? 'bg-riskYellow/20 text-riskYellow'
                            : 'bg-riskRed/20 text-riskRed'
                        }`}
                      >
                        {c.Risk_Tier}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Risk Tier Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-riskYellow" /> Risk Tier
            </label>
            <select
              value={filters.riskTier}
              onChange={(e) => setRiskTierFilter(e.target.value)}
              className="w-full bg-[#181825] border border-cardBorder focus:border-metricBlue text-white text-sm rounded-lg px-3 py-2.5 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>

          {/* 3. Education Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-metricPurple" /> Education
            </label>
            <select
              value={filters.education}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="w-full bg-[#181825] border border-cardBorder focus:border-metricPurple text-white text-sm rounded-lg px-3 py-2.5 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All Education Levels</option>
              {educationOptions.map((edu) => (
                <option key={edu} value={edu}>
                  {edu}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Thin-File / NTC Mode Toggle Switch */}
          <div className="pt-1">
            <div className="p-3.5 rounded-xl bg-[#181825] border border-cardBorder flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-riskYellow" /> Thin-File / NTC Mode
                </span>
                <p className="text-[10px] text-textSecondary">New-To-Credit Assessment</p>
              </div>

              <button
                type="button"
                onClick={() => setNtcModeFilter(!filters.isNtcMode)}
                className="focus:outline-none transition-transform active:scale-95"
              >
                {filters.isNtcMode ? (
                  <ToggleRight className="w-8 h-8 text-metricBlue" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-textSecondary" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setInputVal('12345678');
                resetFilters();
              }}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-cardBorder hover:bg-[#2A2A3C] text-textSecondary hover:text-white transition-all text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-gradient-to-r from-metricBlue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold transition-all text-xs shadow-lg shadow-metricBlue/20"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Section */}
      <div className="pt-6 border-t border-cardBorder/80 space-y-4">
        <button
          onClick={onOpenUploadModal}
          className="w-full py-2.5 px-3 rounded-lg border border-riskGreen/40 bg-riskGreen/10 hover:bg-riskGreen/20 text-riskGreen flex items-center justify-center space-x-2 text-xs font-semibold transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Excel Dataset</span>
        </button>

        <div className="text-[11px] text-textSecondary text-center font-mono">
          <span>Active Dataset: </span>
          <span className="text-white font-semibold">{customers.length.toLocaleString()} Customers</span>
        </div>
      </div>
    </aside>
  );
};
