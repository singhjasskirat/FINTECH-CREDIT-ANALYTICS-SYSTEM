import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { CustomerRecord } from '../../types/customer';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomerTable: React.FC = () => {
  const { filteredCustomers, selectedCustomer, selectCustomerById } = useData();

  const [sortField, setSortField] = useState<keyof CustomerRecord>('ID');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableSearch, setTableSearch] = useState<string>('');

  const searchFilteredRows = useMemo(() => {
    if (!tableSearch.trim()) return filteredCustomers;
    const term = tableSearch.toLowerCase();
    return filteredCustomers.filter(c =>
      c.ID.toString().includes(term) ||
      c.CustomerName?.toLowerCase().includes(term) ||
      c.EDUCATION.toLowerCase().includes(term) ||
      c.Risk_Tier.toLowerCase().includes(term)
    );
  }, [filteredCustomers, tableSearch]);

  const sortedRows = useMemo(() => {
    return [...searchFilteredRows].sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [searchFilteredRows, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const handleSort = (field: keyof CustomerRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    if (!sortedRows.length) return;
    const headers = Object.keys(sortedRows[0]).join(',');
    const rows = sortedRows.map(r => Object.values(r).map(val => `"${val}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_credit_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-panel-interactive rounded-2xl p-6 space-y-5"
    >
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Interactive Customer Dataset
          </h3>
          <p className="text-xs text-textSecondary font-mono">
            Showing {sortedRows.length.toLocaleString()} matching records
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search table..."
              className="bg-[#1E1E2E] border border-cardBorder focus:border-metricBlue text-white text-xs rounded-lg pl-8 pr-3 py-2 outline-none w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#1E1E2E] border border-cardBorder hover:border-metricBlue text-xs font-semibold text-textSecondary hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5 text-metricBlue" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto border border-cardBorder rounded-xl bg-[#1E1E2E]/50">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1E1E2E] border-b border-cardBorder text-textSecondary uppercase font-semibold">
            <tr>
              <th
                onClick={() => handleSort('ID')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Customer ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('CustomerName')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Risk_Tier')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Risk Tier</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Default_Risk_Score')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Default Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('LIMIT_BAL')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Current Limit</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Final_Approved_Limit')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Approved Limit</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('AGE')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Age</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-center">Education</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder/40 font-mono">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-textSecondary font-sans text-sm">
                  No matching customer records found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => {
                const isSelected = selectedCustomer?.ID === row.ID;
                const isLow = row.Risk_Tier === 'Low Risk';
                const isMed = row.Risk_Tier === 'Medium Risk';

                return (
                  <tr
                    key={row.ID}
                    onClick={() => selectCustomerById(row.ID)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-metricBlue/20 border-l-4 border-l-metricBlue font-semibold text-white'
                        : 'hover:bg-[#1E293B]/60 text-textSecondary hover:text-white'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-metricBlue font-mono">{row.ID}</td>
                    <td className="py-3 px-4 font-sans text-white">{row.CustomerName}</td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          isLow
                            ? 'bg-riskGreen/20 text-riskGreen'
                            : isMed
                            ? 'bg-riskYellow/20 text-riskYellow'
                            : 'bg-riskRed/20 text-riskRed'
                        }`}
                      >
                        {row.Risk_Tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {(row.Default_Risk_Score * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-textSecondary">{formatCurrency(row.LIMIT_BAL)}</td>
                    <td className="py-3 px-4 text-right text-metricPurple font-bold">
                      {formatCurrency(row.Final_Approved_Limit)}
                    </td>
                    <td className="py-3 px-4 text-center text-textSecondary">{row.AGE}</td>
                    <td className="py-3 px-4 text-center font-sans text-textSecondary/90 truncate max-w-[150px]">
                      {row.EDUCATION}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-textSecondary">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-[#1E1E2E] border border-cardBorder text-white rounded px-2 py-1 outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-[#1E1E2E] border border-cardBorder disabled:opacity-40 hover:bg-[#2A2A3C] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-[#1E1E2E] border border-cardBorder disabled:opacity-40 hover:bg-[#2A2A3C] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
