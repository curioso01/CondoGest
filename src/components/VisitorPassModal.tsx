import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { X, QrCode, CheckCircle, Share2, Copy } from 'lucide-react';

interface VisitorPassModalProps {
  onClose: () => void;
}

export const VisitorPassModal: React.FC<VisitorPassModalProps> = ({ onClose }) => {
  const { currentUser, showToast } = useCondo();
  const [visitorName, setVisitorName] = useState('');
  const [visitorType, setVisitorType] = useState('Visitante / Convidado');
  const [generatedPass, setGeneratedPass] = useState<{ code: string; expires: string } | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const today = new Date();
    const expDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')} até às 23h59`;

    setGeneratedPass({
      code: randomCode,
      expires: expDate
    });
    showToast(`Passe de acesso gerado para ${visitorName}!`, 'success');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Condomínio Solar das Palmeiras\nPasse de Acesso para ${visitorName}\nCódigo Portaria: ${generatedPass?.code}\nValidade: ${generatedPass?.expires}\nUnidade: ${currentUser?.unit}`
    );
    showToast('Convite copiado para a área de transferência!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]">
        <div className="bg-[#0b1c30] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006a61] flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Liberar Acesso de Visitante</h3>
              <p className="text-[11px] text-[#86f2e4]">{currentUser?.unit}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedPass ? (
          <form onSubmit={handleGenerate} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
                Nome Completo do Visitante ou Prestador
              </label>
              <input
                type="text"
                required
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Ex: João da Silva Santos"
                className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
                Tipo de Acesso
              </label>
              <select
                value={visitorType}
                onChange={(e) => setVisitorType(e.target.value)}
                className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
              >
                <option value="Visitante / Convidado">Visitante / Convidado Social</option>
                <option value="Prestador de Serviço">Prestador de Serviço / Manutenção</option>
                <option value="Delivery / Encomenda Rápida">Delivery / Motorista de App</option>
                <option value="Familiar">Familiar / Convidado Frequente</option>
              </select>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#cbd5e1]/40 text-[11px] text-[#45464d] leading-relaxed">
              O visitante poderá apresentar este código de 6 dígitos ou o QR Code diretamente na portaria principal ou no leitor da clausura para liberação imediata.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#45464d] hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#006a61] hover:bg-[#005a52] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Gerar Passe Digital</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#0b1c30]">Acesso Autorizado!</h4>
            <p className="text-xs text-[#76777d] mt-0.5 mb-4">
              Visitante: <strong className="text-[#0b1c30]">{visitorName}</strong> ({visitorType})
            </p>

            <div className="bg-[#0b1c30] text-white p-4 rounded-xl w-full flex flex-col items-center mb-4">
              <span className="text-[10px] text-[#86f2e4] uppercase font-bold tracking-widest">
                Código de Liberação
              </span>
              <span className="text-3xl font-extrabold tracking-widest my-1 font-mono">
                {generatedPass.code}
              </span>
              <span className="text-[10px] text-gray-300">Validade: {generatedPass.expires}</span>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl bg-[#006a61] text-white text-xs font-bold hover:bg-[#005a52] transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Copiar Convite</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#45464d] hover:bg-slate-50 transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
