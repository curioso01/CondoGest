import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { BoletoItem } from '../types';
import { 
  Receipt, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  FileText, 
  Download, 
  ShieldCheck, 
  PieChart, 
  Calendar, 
  ExternalLink,
  Droplets,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface FinanceiroViewProps {
  onOpenPixModal: (boleto: BoletoItem) => void;
}

export const FinanceiroView: React.FC<FinanceiroViewProps> = ({ onOpenPixModal }) => {
  const { currentUser, boletos, showToast, deviceMode, globalSearch } = useCondo();
  const isMobile = deviceMode === 'mobile';
  
  const filteredBoletos = boletos.filter(b => {
    return !globalSearch || 
      b.reference.toLowerCase().includes(globalSearch.toLowerCase()) || 
      b.status.toLowerCase().includes(globalSearch.toLowerCase()) ||
      b.amount.toString().includes(globalSearch);
  });
  
  const [selectedBoleto, setSelectedBoleto] = useState<BoletoItem>(boletos[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyBarcode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Linha digitável do boleto copiada!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Condo Expenses Breakdown
  const expenses = [
    { name: 'Folha de Pessoal & Encargos (Portaria e Zeladoria)', pct: 45, color: '#006a61', value: 'R$ 25.704,00' },
    { name: 'Água & Saneamento Básico (100% Coberto)', pct: 20, color: '#0d9488', value: 'R$ 11.424,00' },
    { name: 'Energia Elétrica (Bombas, Elevadores e Iluminação)', pct: 15, color: '#14b8a6', value: 'R$ 8.568,00' },
    { name: 'Manutenções Preventivas & Contratos de Conservação', pct: 12, color: '#5eead4', value: 'R$ 6.854,40' },
    { name: 'Aporte Mandatório do Fundo de Reserva', pct: 8, color: '#99f6e4', value: 'R$ 4.569,60' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className={`bg-white p-5 lg:p-6 rounded-2xl border border-[#e2e8f0]/80 shadow-xs flex flex-col ${!isMobile ? 'md:flex-row md:items-center' : ''} justify-between gap-4`}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#006a61] flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Transparência & Gestão Financeira
          </span>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
            Boletos, PIX & Prestação de Contas
          </h1>
          <p className="text-xs text-[#76777d] mt-0.5">
            Consulte sua cota condominial, realize pagamentos instantâneos e audite as contas do condomínio.
          </p>
        </div>

        <button
          onClick={() => showToast('Abrindo formulário de contestação ou dúvidas para a administradora.', 'info')}
          className="flex items-center gap-2 bg-[#eff4ff] hover:bg-[#dfeafc] text-[#006a61] px-4 py-2.5 rounded-xl text-xs font-bold border border-[#cbd5e1]/50 transition-colors shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Fale com o Financeiro</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className={`grid grid-cols-1 ${!isMobile ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Left Column: Current Boleto */}
        <div className={`${!isMobile ? 'lg:col-span-2' : ''} bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between`}>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#eff4ff]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#76777d]">
                  Cota Condominial Vigente
                </span>
                <h3 className="font-black text-2xl text-[#0b1c30] mt-0.5">
                  R$ {selectedBoleto.amount.toFixed(2).replace('.', ',')}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#76777d]">Vencimento:</span>
                <span className="text-xs font-extrabold text-[#ba1a1a] bg-[#ffdad6]/60 px-2.5 py-1 rounded-lg border border-[#ba1a1a]/20">
                  {selectedBoleto.dueDate}
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                  selectedBoleto.status === 'Pago'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {selectedBoleto.status}
                </span>
              </div>
            </div>

            {/* Composição Discriminada */}
            <div className="py-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#0b1c30]">
                Detalhamento da Composição da Taxa:
              </h4>

              <div className="space-y-2 bg-[#eff4ff] p-4 rounded-xl border border-[#cbd5e1]/40 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#45464d]">Cota Ordinária (Manutenção Geral & Pessoal):</span>
                  <span className="font-bold text-[#0b1c30]">R$ {selectedBoleto.breakdown.ordinary.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="flex justify-between items-center text-[#006a61] font-bold bg-[#86f2e4]/20 p-2 rounded-lg border border-[#006a61]/20">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" />
                    Consumo Integral de Água (Individual e Coletivo):
                  </span>
                  <span>R$ 0,00 (100% Incluso)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#45464d]">Fundo de Reserva Mandatório (10%):</span>
                  <span className="font-bold text-[#0b1c30]">R$ {selectedBoleto.breakdown.reserveFund.toFixed(2).replace('.', ',')}</span>
                </div>

                {selectedBoleto.breakdown.leisureFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#45464d]">Taxa de Uso de Salão de Festas:</span>
                    <span className="font-bold text-[#ba1a1a]">R$ {selectedBoleto.breakdown.leisureFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                {selectedBoleto.breakdown.ledApportionment > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#45464d]">Rateio Extra Aprovado: Retrofit Iluminação LED (Parcela 02/06):</span>
                    <span className="font-bold text-[#0b1c30]">R$ {selectedBoleto.breakdown.ledApportionment.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#cbd5e1]/60 flex justify-between items-center font-extrabold text-sm text-[#0b1c30]">
                  <span>Total da Cota Mensal:</span>
                  <span>R$ {selectedBoleto.amount.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>

            {/* Barcode Box */}
            <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase text-[#76777d]">Linha Digitável Bancária:</span>
                <span className="font-mono text-xs text-[#0b1c30] truncate">{selectedBoleto.barcode}</span>
              </div>
              <button
                onClick={() => handleCopyBarcode(selectedBoleto.barcode)}
                className="py-1.5 px-3 bg-[#eff4ff] hover:bg-[#dfeafc] text-xs font-bold text-[#006a61] rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-[#006a61]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#eff4ff] flex flex-wrap gap-3">
            {selectedBoleto.status !== 'Pago' && (
              <button
                onClick={() => onOpenPixModal(selectedBoleto)}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Pagar via PIX com Baixa Instantânea</span>
              </button>
            )}

            <button
              onClick={() => showToast('Boleto bancário em PDF baixado com sucesso.', 'info')}
              className="py-3 px-4 bg-[#eff4ff] hover:bg-[#dfeafc] text-xs font-bold text-[#0b1c30] rounded-xl border border-[#cbd5e1]/40 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#006a61]" />
              <span>Baixar Boleto PDF</span>
            </button>
          </div>
        </div>

        {/* PIX Instantâneo Side Card */}
        <div className="bg-[#0b1c30] text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
              <QrCode className="w-5 h-5 text-[#86f2e4]" />
              <h3 className="font-bold text-sm">Chave PIX do Condomínio</h3>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              O pagamento via PIX autentica automaticamente seu comprovante no sistema da administradora em até 30 segundos.
            </p>

            {/* Visual QR Code Display */}
            <div className="my-5 flex flex-col items-center">
              <div
                onClick={() => onOpenPixModal(selectedBoleto)}
                className="w-40 h-40 bg-white p-2 rounded-xl cursor-pointer hover:scale-105 transition-transform flex items-center justify-center shadow-lg group relative"
              >
                <svg className="w-full h-full text-[#0b1c30]" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="10" y="10" width="25" height="25" rx="3" />
                  <rect x="65" y="10" width="25" height="25" rx="3" />
                  <rect x="10" y="65" width="25" height="25" rx="3" />
                  <rect x="42" y="10" width="16" height="16" rx="2" />
                  <rect x="10" y="42" width="16" height="16" rx="2" />
                  <rect x="40" y="40" width="20" height="20" rx="3" fill="#006a61" />
                  <rect x="65" y="42" width="10" height="10" rx="1" />
                  <rect x="42" y="65" width="10" height="10" rx="1" />
                  <rect x="65" y="65" width="25" height="25" rx="3" />
                </svg>
                <div className="absolute inset-0 bg-[#006a61]/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold">
                  Ampliar QR Code
                </div>
              </div>
              <span className="text-[11px] text-slate-400 mt-2">Clique no QR code para pagar</span>
            </div>
          </div>

          <button
            onClick={() => onOpenPixModal(selectedBoleto)}
            className="w-full py-2.5 bg-[#86f2e4] hover:bg-[#5eead4] text-[#006a61] text-xs font-extrabold rounded-xl transition-colors shadow-xs"
          >
            Abrir Tela de Pagamento
          </button>
        </div>
      </div>

      {/* Transparência Coletiva: Distribuição de Despesas do Condomínio */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#006a61]" />
            <div>
              <h3 className="font-extrabold text-base text-[#0b1c30]">
                Distribuição das Despesas Coletivas (100% Auditado)
              </h3>
              <p className="text-xs text-[#76777d]">Orçamento mensal executado de R$ 57.120,00 (84 unidades)</p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#006a61] bg-[#eff4ff] px-3 py-1 rounded-full border border-[#cbd5e1]/40">
            Prestação de Contas Vigente
          </span>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          {expenses.map((exp) => (
            <div key={exp.name} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-[#0b1c30]">
                <span>{exp.name}</span>
                <span>{exp.pct}% ({exp.value})</span>
              </div>
              <div className="w-full bg-[#eff4ff] h-3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${exp.pct}%`, backgroundColor: exp.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#cbd5e1]/40 text-xs text-[#45464d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#006a61]" />
            <span>Auditoria externa independente realizada trimestralmente pela Conselho Fiscal.</span>
          </div>
          <button
            onClick={() => showToast('Parecer da auditoria externa baixado.', 'info')}
            className="text-xs font-bold text-[#006a61] hover:underline"
          >
            Ver Parecer Oficial
          </button>
        </div>
      </div>

      {/* Balancetes Assinados em      {/* Histórico e Demonstrativo em Duas Colunas */}
      <div className={`grid grid-cols-1 ${!isMobile ? 'lg:grid-cols-2' : ''} gap-6`}>
        {/* Balancetes Mensais Assinados */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
            <h3 className="font-bold text-sm text-[#0b1c30]">Balancetes Mensais Assinados</h3>
            <span className="text-xs text-[#76777d]">Arquivos Oficiais (PDF)</span>
          </div>

          <div className="space-y-2">
            {[
              { title: 'Balancete Financeiro - Janeiro / 2025', size: '2.4 MB', date: '05/02/2025' },
              { title: 'Balancete Financeiro - Dezembro / 2024', size: '3.1 MB', date: '08/01/2025' },
              { title: 'Prestação Anual de Contas - Exercício 2024', size: '8.7 MB', date: '15/01/2025' },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] border border-[#cbd5e1]/40 hover:bg-[#dfeafc] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#006a61]" />
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30]">{doc.title}</p>
                    <p className="text-[11px] text-[#76777d]">{doc.size} • Publicado em {doc.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Download do ${doc.title} iniciado.`, 'info')}
                  className="p-2 text-[#006a61] hover:bg-white rounded-lg transition-colors"
                  title="Baixar Documento"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico dos Últimos 12 Meses */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
            <h3 className="font-bold text-sm text-[#0b1c30]">Histórico de Quitações</h3>
            <span className="text-xs text-[#76777d]">Últimos Meses</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredBoletos.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBoleto(b)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedBoleto.id === b.id
                    ? 'border-[#006a61] bg-[#eff4ff]'
                    : 'border-[#e2e8f0] bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30]">{b.reference}</span>
                  <span className="text-[11px] text-[#76777d]">
                    {b.status === 'Pago' ? `Pago em ${b.paymentDate} via ${b.paymentMethod}` : `Vencimento: ${b.dueDate}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#0b1c30]">
                    R$ {b.amount.toFixed(2).replace('.', ',')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    b.status === 'Pago'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
