import React from 'react';
import { useData } from '../../context/DataContext';
import { CreditCard, User, Download, FileSpreadsheet, Printer, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface HeaderProps {
  onExportPDF: () => void;
  onExportPNG: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportPDF, onExportPNG }) => {
  const { selectedCustomer, customers } = useData();

  const handleExportExcel = () => {
    if (!customers.length) return;
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, `credit_risk_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="w-full bg-[#161B22]/80 backdrop-blur-md border-b border-[#30363D] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-lg">
      <div>
        {/* Main Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-brandBlue to-purple-600 text-white shadow-lg shadow-brandBlue/30">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
            Credit Risk Analytics & Customer Lookup Dashboard
          </h1>
        </div>

        {/* Customer Profile Banner */}
        {selectedCustomer ? (
          <div className="flex items-center space-x-2 mt-2 text-sm text-textSecondary font-medium">
            <User className="w-4 h-4 text-brandBlue" />
            <span className="text-white font-semibold">
              Customer Profile — ID: <span className="font-mono text-brandBlue">{selectedCustomer.ID}</span>
            </span>
            <span className="text-cardBorder">|</span>
            <span className="text-textSecondary">{selectedCustomer.CustomerName}</span>
            <span className="text-cardBorder">|</span>
            <span className="text-textSecondary font-mono">{selectedCustomer.AGE} yrs</span>
            <span className="text-cardBorder">|</span>
            <span className="text-textSecondary">{selectedCustomer.GenderLabel}</span>
            <span className="text-cardBorder">|</span>
            <span className="text-textSecondary">{selectedCustomer.EDUCATION}</span>
          </div>
        ) : (
          <div className="mt-2 text-sm text-textSecondary font-medium">
            No customer selected
          </div>
        )}
      </div>

      {/* Export & Actions Toolbar */}
      <div className="flex items-center space-x-2 self-start md:self-auto">
        <button
          onClick={onExportPDF}
          title="Export Dashboard as PDF"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#1B2430] border border-[#30363D] hover:border-brandRed/60 hover:bg-brandRed/10 text-xs font-semibold text-textSecondary hover:text-white transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-brandRed" />
          <span>PDF</span>
        </button>

        <button
          onClick={onExportPNG}
          title="Export Dashboard as PNG Image"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#1B2430] border border-[#30363D] hover:border-brandBlue/60 hover:bg-brandBlue/10 text-xs font-semibold text-textSecondary hover:text-white transition-all"
        >
          <Download className="w-3.5 h-3.5 text-brandBlue" />
          <span>PNG</span>
        </button>

        <button
          onClick={handleExportExcel}
          title="Export Customer Dataset to Excel"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#1B2430] border border-[#30363D] hover:border-brandGreen/60 hover:bg-brandGreen/10 text-xs font-semibold text-textSecondary hover:text-white transition-all"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-brandGreen" />
          <span>Excel</span>
        </button>

        <button
          onClick={handlePrint}
          title="Print Dashboard"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#1B2430] border border-[#30363D] hover:bg-[#21262D] text-xs font-semibold text-textSecondary hover:text-white transition-all"
        >
          <Printer className="w-3.5 h-3.5 text-textSecondary" />
          <span>Print</span>
        </button>
      </div>
    </header>
  );
};
