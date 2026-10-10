import React, { useState, useRef } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SummaryCards } from './components/cards/SummaryCards';
import { FeatureImportanceChart } from './components/charts/FeatureImportanceChart';
import { RiskGauge } from './components/charts/RiskGauge';
import { RiskTierPieChart } from './components/charts/RiskTierPieChart';
import { CreditDistributionHistogram } from './components/charts/CreditDistributionHistogram';
import { CustomerDetailsPanel } from './components/cards/CustomerDetailsPanel';
import { ExtraAnalyticsCharts } from './components/charts/ExtraAnalyticsCharts';
import { CustomerTable } from './components/tables/CustomerTable';
import { FileUploadModal } from './components/modals/FileUploadModal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { isLoading, error } = useData();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1.5,
        backgroundColor: '#0F172A',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`credit_risk_dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  const handleExportPNG = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#0F172A',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `credit_risk_dashboard_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center space-y-4 text-white">
        <div className="w-12 h-12 border-4 border-metricBlue border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-lg font-bold tracking-tight">Loading Banking Credit Risk Analytics...</p>
          <p className="text-xs text-textSecondary font-mono">Parsing Excel dataset (30,000 records)...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center p-6 text-white">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center space-y-4 border border-riskRed/40">
          <AlertTriangle className="w-12 h-12 text-riskRed mx-auto" />
          <h2 className="text-xl font-bold text-white">Data Initialization Error</h2>
          <p className="text-xs text-textSecondary">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-metricBlue text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg flex flex-col lg:flex-row text-textPrimary">
      {/* Left Sidebar ("🔍 Customer Search") */}
      <Sidebar onOpenUploadModal={() => setIsUploadModalOpen(true)} />

      {/* Main Dashboard Canvas */}
      <div className="flex-1 flex flex-col overflow-y-auto" ref={dashboardRef}>
        {/* Header Area */}
        <Header onExportPDF={handleExportPDF} onExportPNG={handleExportPNG} />

        {/* Main Dashboard Content */}
        <main className="p-6 md:p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          {/* Top KPI Summary Cards (4 Column Grid) */}
          <SummaryCards />

          {/* Middle Data Visualizations (2 Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FeatureImportanceChart />
            <RiskGauge />
          </div>

          {/* Bottom Portfolio Analytics (2 Column Grid) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 border-b border-cardBorder pb-3">
              <TrendingUp className="w-5 h-5 text-riskGreen" />
              <h2 className="text-xl font-black tracking-tight text-white">
                Overall Portfolio Risk & Limits Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskTierPieChart />
              <CreditDistributionHistogram />
            </div>
          </div>

          {/* Customer Details & Attributes Panel */}
          <CustomerDetailsPanel />

          {/* Extra Risk Radar & Scatter Plot */}
          <ExtraAnalyticsCharts />

          {/* Interactive Customer Table */}
          <CustomerTable />
        </main>
      </div>

      {/* Excel Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
};

export default App;
