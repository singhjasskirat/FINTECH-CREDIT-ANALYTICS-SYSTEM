import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
  const { loadExcelFile } = useData();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        setStatusMsg(null);
      } else {
        setStatusMsg('Please upload a valid Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setStatusMsg(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      await loadExcelFile(selectedFile);
      setStatusMsg('Dataset loaded successfully!');
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 600);
    } catch (err: any) {
      setIsProcessing(false);
      setStatusMsg('Failed to process Excel file.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel w-full max-w-lg rounded-2xl p-6 relative space-y-6 shadow-2xl border border-cardBorder"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-textSecondary hover:text-white p-1.5 rounded-lg hover:bg-cardBg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brandGreen/20 text-brandGreen border border-brandGreen/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Upload Excel Dataset</h3>
              <p className="text-xs text-textSecondary">
                Dynamically update credit analytics from any custom .xlsx file
              </p>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center space-y-3 ${
              dragActive
                ? 'border-brandBlue bg-brandBlue/10 scale-[1.01]'
                : selectedFile
                ? 'border-brandGreen bg-brandGreen/10'
                : 'border-cardBorder bg-[#161B22]/50 hover:border-textSecondary'
            }`}
          >
            {selectedFile ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-brandGreen" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white font-mono">{selectedFile.name}</p>
                  <p className="text-xs text-textSecondary">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-brandBlue animate-bounce" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Drag and drop your Excel file here
                  </p>
                  <p className="text-xs text-textSecondary">or click to browse from your computer</p>
                </div>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="excel-file-input"
                />
                <label
                  htmlFor="excel-file-input"
                  className="px-4 py-2 rounded-lg bg-brandBlue/20 hover:bg-brandBlue/30 text-brandBlue text-xs font-semibold cursor-pointer transition-colors border border-brandBlue/40"
                >
                  Select File
                </label>
              </>
            )}
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                statusMsg.includes('successfully')
                  ? 'bg-brandGreen/20 text-brandGreen border border-brandGreen/30'
                  : 'bg-brandRed/20 text-brandRed border border-brandRed/30'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-cardBorder">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-cardBorder text-textSecondary hover:text-white text-xs font-semibold hover:bg-cardBg transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isProcessing}
              className="px-5 py-2 rounded-lg bg-brandGreen hover:bg-green-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-brandGreen/30 flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Load Dataset</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
