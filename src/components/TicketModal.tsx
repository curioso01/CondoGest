import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { X, Send, PhoneCall, ShieldAlert, Package, Wrench, Volume2 } from 'lucide-react';

interface TicketModalProps {
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ onClose }) => {
  const { currentUser, addTicket } = useCondo();
  const [recipient, setRecipient] = useState<'Portaria 24h' | 'Zeladoria / Síndico'>('Portaria 24h');
  const [subjectType, setSubjectType] = useState('Encomenda');
  const [message, setMessage] = useState('');

  const quickSubjects = [
    { label: 'Encomenda / Pacote', icon: Package },
    { label: 'Manutenção Predial', icon: Wrench },
    { label: 'Barulho / Regimento', icon: Volume2 },
    { label: 'Outros Assuntos', icon: ShieldAlert },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addTicket({
      recipient,
      subject: `${subjectType} - ${message.slice(0, 30)}...`,
      message,
      unit: currentUser?.unit || 'Unidade'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]">
        <div className="bg-[#0b1c30] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006a61] flex items-center justify-center">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Chamado Interno / Portaria 24h</h3>
              <p className="text-[11px] text-[#86f2e4]">{currentUser?.unit} • Ramal 94</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
              Destinatário do Chamado
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRecipient('Portaria 24h')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  recipient === 'Portaria 24h'
                    ? 'bg-[#006a61] text-white border-[#006a61] shadow-xs'
                    : 'bg-[#eff4ff] text-[#45464d] border-[#cbd5e1]/40 hover:bg-slate-100'
                }`}
              >
                Portaria 24h (Imediato)
              </button>
              <button
                type="button"
                onClick={() => setRecipient('Zeladoria / Síndico')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  recipient === 'Zeladoria / Síndico'
                    ? 'bg-[#006a61] text-white border-[#006a61] shadow-xs'
                    : 'bg-[#eff4ff] text-[#45464d] border-[#cbd5e1]/40 hover:bg-slate-100'
                }`}
              >
                Zeladoria & Síndico
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickSubjects.map((item) => {
                const Icon = item.icon;
                const selected = subjectType === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSubjectType(item.label)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'border-[#006a61] bg-[#006a61]/10 text-[#006a61]'
                        : 'border-[#e2e8f0] bg-white text-[#45464d] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
              Mensagem ou Instruções
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva detalhadamente o ocorrido ou instruções de entrega..."
              className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all resize-none"
            />
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
              <Send className="w-4 h-4" />
              <span>Enviar Chamado</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
