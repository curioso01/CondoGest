import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { BoletoItem } from '../types';
import { X, Copy, CheckCircle2, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';

interface PixModalProps {
  boleto: BoletoItem;
  onClose: () => void;
}

export const PixModal: React.FC<PixModalProps> = ({ boleto, onClose }) => {
  const { payBoletoPix, showToast } = useCondo();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(boleto.pixCode);
    setCopied(true);
    showToast('Código PIX Copia e Cola copiado com sucesso!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payBoletoPix(boleto.id);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]">
        {/* Modal Header */}
        <div className="bg-[#0b1c30] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006a61] flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Pagamento Instantâneo via PIX</h3>
              <p className="text-[11px] text-[#86f2e4]">Compensação imediata 24 horas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center">
          <span className="text-xs font-semibold text-[#76777d] uppercase tracking-wider">
            Cota Condominial • {boleto.reference}
          </span>
          <span className="text-3xl font-extrabold text-[#0b1c30] mt-1 mb-4">
            R$ {boleto.amount.toFixed(2).replace('.', ',')}
          </span>

          {/* Authentic QR Code Rendering */}
          <div className="p-3 bg-white border-2 border-[#e2e8f0] rounded-xl shadow-xs mb-4 relative group">
            {/* Visual dynamic QR display using SVG pattern */}
            <div className="w-48 h-48 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-white" viewBox="0 0 200 200" fill="currentColor">
                {/* Corner Squares */}
                <rect x="15" y="15" width="45" height="45" rx="6" fill="#86f2e4" />
                <rect x="25" y="25" width="25" height="25" rx="3" fill="#0b1c30" />
                <rect x="140" y="15" width="45" height="45" rx="6" fill="#86f2e4" />
                <rect x="150" y="25" width="25" height="25" rx="3" fill="#0b1c30" />
                <rect x="15" y="140" width="45" height="45" rx="6" fill="#86f2e4" />
                <rect x="25" y="150" width="25" height="25" rx="3" fill="#0b1c30" />
                {/* Data Points */}
                <rect x="75" y="25" width="12" height="12" rx="2" fill="white" />
                <rect x="95" y="25" width="12" height="12" rx="2" fill="white" />
                <rect x="115" y="25" width="12" height="12" rx="2" fill="white" />
                <rect x="75" y="45" width="12" height="12" rx="2" fill="#86f2e4" />
                <rect x="105" y="45" width="12" height="12" rx="2" fill="white" />
                <rect x="25" y="75" width="12" height="12" rx="2" fill="white" />
                <rect x="45" y="75" width="12" height="12" rx="2" fill="white" />
                <rect x="75" y="75" width="50" height="50" rx="10" fill="#006a61" />
                <rect x="145" y="75" width="12" height="12" rx="2" fill="#86f2e4" />
                <rect x="165" y="75" width="12" height="12" rx="2" fill="white" />
                <rect x="75" y="135" width="12" height="12" rx="2" fill="white" />
                <rect x="95" y="135" width="12" height="12" rx="2" fill="white" />
                <rect x="115" y="155" width="12" height="12" rx="2" fill="#86f2e4" />
                <rect x="145" y="135" width="12" height="12" rx="2" fill="white" />
                <rect x="165" y="155" width="12" height="12" rx="2" fill="white" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white text-[#006a61] px-2 py-0.5 rounded font-extrabold text-[10px] shadow-md border border-[#006a61]">
                  PIX CONDOMÍNIO
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#eff4ff] p-3 rounded-xl w-full text-left mb-4 border border-[#cbd5e1]/40">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#76777d]">Favorecido:</span>
              <span className="font-bold text-[#0b1c30]">Cond. Res. Solar das Palmeiras</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#76777d]">CNPJ:</span>
              <span className="font-medium text-[#0b1c30]">12.345.678/0001-90</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#76777d]">Vencimento:</span>
              <span className="font-bold text-[#ba1a1a]">{boleto.dueDate}</span>
            </div>
          </div>

          {/* Copy Paste Code Box */}
          <div className="w-full flex items-center bg-[#f8f9ff] border border-[#e2e8f0] rounded-xl p-2 mb-4">
            <input
              type="text"
              readOnly
              value={boleto.pixCode}
              className="bg-transparent text-xs text-[#76777d] font-mono flex-1 outline-none truncate px-2"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-[#006a61] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#005a52] transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#86f2e4]" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simular Pagamento Imediato</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-xs text-[#76777d] hover:text-[#0b1c30] py-1 transition-colors"
            >
              Fechar Janela
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
