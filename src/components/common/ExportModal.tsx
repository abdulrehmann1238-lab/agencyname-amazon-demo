import React, { useState } from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportName: string;
  dataSummary: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  reportName,
  dataSummary,
}) => {
  const { dateRange, selectedMarketplace, showToast, inventory, costs } = useApp();
  const [format, setFormat] = useState<'csv' | 'summary'>('csv');
  const [includeFormulas, setIncludeFormulas] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      // Build realistic CSV text
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += `Report,${reportName}\n`;
      csvContent += `Date Range,${dateRange}\n`;
      csvContent += `Marketplace,${selectedMarketplace}\n`;
      csvContent += `Export Timestamp,${new Date().toISOString()}\n\n`;

      if (reportName.toLowerCase().includes('inventory')) {
        csvContent += 'SKU,Product Title,Brand,Marketplace,FBA Available,Vendor Stock,3PL Stock,Total Available,Daily Demand,Days of Cover,Status\n';
        inventory.forEach((i) => {
          csvContent += `"${i.sku}","${i.productTitle}","${i.brandName}","${i.marketplace}",${i.fbaStock},${i.vendorStock},${i.thirdPartyStock},${i.totalStock},${i.averageDailySales},${i.daysOfCover},"${i.status}"\n`;
        });
      } else {
        csvContent += 'SKU,Product Title,Brand,Marketplace,Retail Price,Net Sales,COGS,Landed Cost,Amazon Fees,Ad Spend,Net Contribution,Margin %\n';
        costs.forEach((c) => {
          csvContent += `"${c.sku}","${c.productTitle}","${c.brandName}","${c.marketplace}",${c.retailPrice},${c.netSales},${c.costOfGoods},${c.landedCost},${c.amazonFees},${c.adSpendPerUnit},${c.netContribution},${c.contributionMarginPercent}%\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `aurel_${reportName.toLowerCase().replace(/\s+/g, '_')}_${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      showToast('Sample export prepared', `Downloaded local CSV for ${reportName}.`, 'success');
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Export ${reportName}`}
      subtitle="Export operational telemetry and financial records for offline review"
      maxWidth="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-btn hover:bg-sage transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <span>Preparing file...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate Export</span>
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-sage-light rounded-btn border border-border text-xs text-text-secondary leading-relaxed">
          <p className="font-semibold text-text-primary mb-1">Export Scope</p>
          <p>{dataSummary}</p>
          <div className="mt-2 flex gap-4 text-text-muted">
            <span>Range: <strong>{dateRange}</strong></span>
            <span>Marketplace: <strong>{selectedMarketplace}</strong></span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
            File Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-2.5 p-3 rounded-btn border text-left transition-all ${
                format === 'csv'
                  ? 'border-primary bg-sage/40 text-text-primary font-medium'
                  : 'border-border bg-card text-text-secondary hover:border-text-muted'
              }`}
            >
              <Download className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm">CSV Data File</p>
                <p className="text-xs text-text-muted">Excel / Sheets ready</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('summary')}
              className={`flex items-center gap-2.5 p-3 rounded-btn border text-left transition-all ${
                format === 'summary'
                  ? 'border-primary bg-sage/40 text-text-primary font-medium'
                  : 'border-border bg-card text-text-secondary hover:border-text-muted'
              }`}
            >
              <FileText className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm">Executive Brief</p>
                <p className="text-xs text-text-muted">Printable snapshot</p>
              </div>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={includeFormulas}
              onChange={(e) => setIncludeFormulas(e.target.checked)}
              className="rounded text-primary focus:ring-primary border-border"
            />
            <span>Include reconciled Amazon fee formulas and margin calculations</span>
          </label>
        </div>

        <div className="p-3 bg-sand-light rounded-btn border border-sand-dark/40 text-xs text-text-secondary">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p>
              <strong>Demo simulation:</strong> File will be compiled directly in your browser from currently loaded client data. No external server transfer occurs.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
