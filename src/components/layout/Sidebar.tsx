import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, RotateCcw, Filter, Upload, Shield, GraduationCap, Users } from 'lucide-react';
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
    setGenderFilter,
    resetFilters,
    selectCustomerById,
  } = useData();

  const [inputVal, setInputVal] = useState<string>(filters.searchId);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  // Extract unique education levels from customer dataset
  const educationOptions = Array.from(new Set(customers.map(c => c.EDUCATION).filter(Boolean)));

  // Autocomplete matching list (top 8 results)
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
        <div className="flex items-center space-x-3 border-b border-cardBorder/60 pb-4">
          <div className="p-2 rounded-lg bg-brandBlue/10 border border-brandBlue/30 text-brandBlue">
            <Search className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Customer Search
          </h2>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-5">
          {/* Search Customer ID Input */}
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
                placeholder="e.g. 12345678 or 1"
                className="w-full bg-[#1B2430] border border-[#30363D] focus:border-brandBlue focus:ring-1 focus:ring-brandBlue text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-500 font-mono"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showAutocomplete && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-50 left-0 right-0 mt-1 bg-[#1B2430] border border-[#30363D] rounded-lg shadow-2xl max-h-48 overflow-y-auto divide-y divide-cardBorder/40"
                >
                  {suggestions.map((c) => (
                    <li
                      key={c.ID}
                      onClick={() => handleSelectSuggestion(c.ID)}
                      className="px-3.5 py-2 hover:bg-brandBlue/20 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-mono text-white font-medium">ID: {c.ID}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          c.Risk_Tier === 'Low Risk'
                            ? 'bg-brandGreen/20 text-brandGreen'
                            : c.Risk_Tier === 'Medium Risk'
                            ? 'bg-brandOrange/20 text-brandOrange'
                            : 'bg-brandRed/20 text-brandRed'
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

          {/* Risk Tier Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brandOrange" /> Risk Tier
            </label>
            <select
              value={filters.riskTier}
              onChange={(e) => setRiskTierFilter(e.target.value)}
              className="w-full bg-[#1B2430] border border-[#30363D] focus:border-brandOrange text-white text-sm rounded-lg px-3 py-2.5 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>

          {/* Education Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-brandPurple" /> Education
            </label>
            <select
              value={filters.education}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="w-full bg-[#1B2430] border border-[#30363D] focus:border-brandPurple text-white text-sm rounded-lg px-3 py-2.5 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All Education Levels</option>
              {educationOptions.map((edu) => (
                <option key={edu} value={edu}>
                  {edu}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider block flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brandBlue" /> Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full bg-[#1B2430] border border-[#30363D] focus:border-brandBlue text-white text-sm rounded-lg px-3 py-2.5 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All Genders</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>

          {/* Action Buttons: Reset & Search */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setInputVal('1');
                resetFilters();
              }}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-[#30363D] hover:bg-[#21262D] text-textSecondary hover:text-white transition-all text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-gradient-to-r from-brandBlue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all text-xs shadow-lg shadow-brandBlue/20"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Section: Data Upload & Summary Info */}
      <div className="pt-6 border-t border-cardBorder/60 space-y-4">
        <button
          onClick={onOpenUploadModal}
          className="w-full py-2.5 px-3 rounded-lg border border-brandGreen/40 bg-brandGreen/10 hover:bg-brandGreen/20 text-brandGreen flex items-center justify-center space-x-2 text-xs font-semibold transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Excel Dataset</span>
        </button>

        <div className="text-[11px] text-textSecondary/80 text-center font-mono">
          <span>Active Dataset: </span>
          <span className="text-white font-semibold">{customers.length.toLocaleString()} Customers</span>
        </div>
      </div>
    </aside>
  );
};
