import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { Notice, BoletoItem } from '../types';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  Users, 
  AlertCircle, 
  QrCode, 
  Droplets, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  PackageCheck,
  Eye,
  Activity
} from 'lucide-react';

interface MuralViewProps {
  onOpenPixModal: (boleto: BoletoItem) => void;
  onOpenVisitorPass: () => void;
  onOpenTicket: () => void;
  onGoToReservas: () => void;
}

export const MuralView: React.FC<MuralViewProps> = ({
  onOpenPixModal,
  onOpenVisitorPass,
  onOpenTicket,
  onGoToReservas
}) => {
  const { currentUser, notices, boletos, reservations, globalSearch, updateReservationGuests, showToast } = useCondo();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Latest boleto for user
  const latestBoleto = boletos[0] || {
    id: 'bol-default',
    reference: 'Março / 2025',
    dueDate: '10 de Março de 2025',
    amount: 680.00,
    status: 'Em Aberto',
    barcode: '34191.79001 01043.510047 91020.150008 5 96510000068000',
    pixCode: '00020126580014br.gov.bcb.pix0136condogest...',
    breakdown: { ordinary: 520, water: 0, reserveFund: 60, leisureFee: 0, ledApportionment: 100 }
  };

  // Next active reservation for this user or condo
  const activeReservation = reservations.find(r => r.status === 'Confirmado') || reservations[0];

  // Filter notices
  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCategory === 'Todos' || n.category === selectedCategory;
    const matchesSearch = !globalSearch || 
      n.title.toLowerCase().includes(globalSearch.toLowerCase()) || 
      n.body.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 lg:p-6 rounded-2xl border border-[#e2e8f0]/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006a61] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Painel do Condômino
            </span>
            <span className="text-xs text-[#76777d]">•</span>
            <span className="text-xs font-semibold text-[#45464d]">{currentUser?.unit}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
            Olá, {currentUser?.name || 'Morador'}
          </h1>
          <p className="text-xs text-[#76777d] mt-0.5">
            Confira as atualizações de hoje do Condomínio Residencial Solar das Palmeiras.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={onOpenVisitorPass}
            className="flex items-center gap-2 bg-[#eff4ff] hover:bg-[#dfeafc] text-[#006a61] px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#cbd5e1]/40 shadow-xs"
          >
            <QrCode className="w-4 h-4 text-[#006a61]" />
            <span>Liberar Visitante</span>
          </button>

          <button
            onClick={onOpenTicket}
            className="flex items-center gap-2 bg-[#eff4ff] hover:bg-[#dfeafc] text-[#0b1c30] px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#cbd5e1]/40 shadow-xs"
          >
            <PackageCheck className="w-4 h-4 text-[#006a61]" />
            <span>Encomendas (1)</span>
          </button>

          <button
            onClick={() => showToast('Atestado dermatológico do Apto 402 válido até 30/08/2025. Catraca liberada.', 'info')}
            className="flex items-center gap-2 bg-[#86f2e4]/20 hover:bg-[#86f2e4]/30 text-[#006a61] px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#006a61]/20 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#006a61]" />
            <span>Atestado Piscina: OK</span>
          </button>
        </div>
      </div>

      {/* Regimento Destaque: Água Inclusa */}
      <div className="bg-gradient-to-r from-[#006a61]/10 via-[#86f2e4]/20 to-[#eff4ff] border border-[#006a61]/30 p-4 lg:p-5 rounded-2xl flex items-start gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-[#006a61] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Droplets className="w-5 h-5 text-[#86f2e4]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#006a61] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Regulamento Geral
            </span>
            <h4 className="text-xs font-bold text-[#0b1c30]">
              Água Inclusa na Taxa Condominial
            </h4>
          </div>
          <p className="text-xs text-[#3f465c] mt-1 leading-relaxed">
            100% do consumo integral individual e coletivo está coberto pela convenção ordinária. Não há medições individuais nem cobranças adicionais de hidrômetro.
          </p>
        </div>
      </div>

      {/* Dual Cards: Próxima Reserva & Boleto Vigente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Próxima Reserva Ativa */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm text-[#0b1c30]">Próxima Reserva Ativa</h3>
              </div>
              <span className="text-[10px] font-bold text-[#006a61] bg-[#eff4ff] px-2.5 py-1 rounded-full border border-[#cbd5e1]/40">
                Piscina Inclusa
              </span>
            </div>

            {activeReservation ? (
              <div className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-[#0b1c30] leading-tight">
                      {activeReservation.spaceName}
                    </h4>
                    <p className="text-xs text-[#76777d] mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#006a61]" />
                      <span>Sábado, 18 de Maio • {activeReservation.startTime} às {activeReservation.endTime}</span>
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Confirmada
                  </span>
                </div>

                {/* Guest limit bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#76777d] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#006a61]" />
                      Convidados Liberados na Portaria:
                    </span>
                    <span className="font-bold text-[#0b1c30]">
                      {activeReservation.guestsCount} / 20 pessoas
                    </span>
                  </div>
                  <div className="w-full bg-[#eff4ff] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#006a61] h-full rounded-full transition-all"
                      style={{ width: `${(activeReservation.guestsCount / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#cbd5e1]/40 text-xs text-[#45464d] flex items-center justify-between">
                  <span>Regra: Limite de 6 horas respeitado</span>
                  <span className="font-bold text-[#006a61]">Isento de Taxa</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#76777d]">
                Nenhuma reserva agendada no momento.
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#eff4ff] flex gap-2">
            <button
              onClick={() => {
                if (activeReservation) {
                  const newCount = activeReservation.guestsCount >= 20 ? 15 : activeReservation.guestsCount + 1;
                  updateReservationGuests(activeReservation.id, newCount);
                }
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#dfeafc] text-xs font-bold text-[#0b1c30] transition-colors border border-[#cbd5e1]/50 flex items-center justify-center gap-1.5"
            >
              <Users className="w-4 h-4 text-[#006a61]" />
              <span>Gerenciar Convidados</span>
            </button>

            <button
              onClick={onGoToReservas}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#006a61] hover:bg-[#005a52] text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Nova Reserva</span>
            </button>
          </div>
        </div>

        {/* Card 2: Cota Condominial Vigente */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#006a61]" />
                <h3 className="font-bold text-sm text-[#0b1c30]">Cota Condominial Vigente</h3>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                latestBoleto.status === 'Pago'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }`}>
                {latestBoleto.status === 'Pago' ? 'Liquidado' : 'Aguardando Pagamento'}
              </span>
            </div>

            <div className="pt-4">
              <span className="text-xs font-semibold text-[#76777d] uppercase tracking-wider">
                Competência {latestBoleto.reference}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-[#0b1c30] tracking-tight">
                  R$ {latestBoleto.amount.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs font-semibold text-[#76777d]">
                  Vencimento: <strong className="text-[#ba1a1a]">{latestBoleto.dueDate}</strong>
                </span>
              </div>

              {/* Composition Breakdown Mini */}
              <div className="mt-4 bg-[#eff4ff] p-3 rounded-xl border border-[#cbd5e1]/40 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#45464d]">Cota Ordinária Operacional:</span>
                  <span className="font-semibold text-[#0b1c30]">R$ 520,00</span>
                </div>
                <div className="flex justify-between text-[#006a61] font-semibold">
                  <span>Consumo de Água (Individual e Coletivo):</span>
                  <span>R$ 0,00 (Incluso)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#45464d]">Fundo de Reserva (10%):</span>
                  <span className="font-semibold text-[#0b1c30]">R$ 60,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#45464d]">Rateio Modernização LED:</span>
                  <span className="font-semibold text-[#0b1c30]">R$ 100,00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#eff4ff] flex gap-2">
            {latestBoleto.status !== 'Pago' ? (
              <button
                onClick={() => onOpenPixModal(latestBoleto)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <QrCode className="w-4 h-4" />
                <span>Pagar via PIX (Instantâneo)</span>
              </button>
            ) : (
              <button
                onClick={() => showToast('Comprovante de pagamento já emitido e arquivado.', 'success')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Comprovante de Quitação</span>
              </button>
            )}

            <button
              onClick={() => {
                navigator.clipboard.writeText(latestBoleto.barcode);
                showToast('Linha digitável copiada!', 'info');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#dfeafc] text-xs font-bold text-[#0b1c30] transition-colors border border-[#cbd5e1]/50 flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-[#006a61]" />
              <span className="hidden sm:inline">Copiar Código de Barras</span>
              <span className="sm:hidden">Código</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mural de Avisos da Síndica */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#006a61]" />
            <div>
              <h2 className="font-extrabold text-base text-[#0b1c30]">Mural de Avisos da Síndica</h2>
              <p className="text-xs text-[#76777d]">Comunicados oficiais aos moradores dos Blocos A, B e C</p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['Todos', 'Urgente', 'Regimento', 'Convocação', 'Manutenção'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#006a61] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dfeafc]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((notice) => {
            const isUrgent = notice.category === 'Urgente';
            const isReg = notice.category === 'Regimento';

            return (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${
                  isUrgent
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                    : isReg
                    ? 'bg-[#eff4ff]/60 border-[#cbd5e1]/60 hover:border-[#006a61]/40'
                    : 'bg-white border-[#e2e8f0] hover:border-[#006a61]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-[#ba1a1a] text-white'
                          : isReg
                          ? 'bg-[#006a61] text-white'
                          : 'bg-[#86f2e4]/40 text-[#006a61]'
                      }`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-[#76777d]">{notice.time}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0b1c30] leading-snug">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-[#45464d] line-clamp-3 mt-1.5 leading-relaxed">
                    {notice.body}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e2e8f0]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[#76777d]">{notice.targetAudience}</span>
                  <div className="flex items-center gap-1 text-[#006a61] font-bold">
                    <span>Ler comunicado</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regras de Convivência & Ocupação da Semana */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline dos Próximos 7 Dias */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#eff4ff]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#006a61]" />
              <h3 className="font-bold text-sm text-[#0b1c30]">Linha do Tempo de Ocupação da Semana</h3>
            </div>
            <span className="text-[11px] text-[#76777d]">Próximos 7 Dias</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { day: 'Sex (Hoje)', space: 'Churrasqueira 01', user: 'Livre', status: 'Disponível', free: true },
              { day: 'Sáb 17/05', space: 'Churrasqueira 01', user: 'Apto 402 • Bloco B (Você)', status: '12h às 18h', free: false },
              { day: 'Sáb 17/05', space: 'Churrasqueira 02', user: 'Apto 201 • Bloco A', status: '12h às 18h', free: false },
              { day: 'Sáb 17/05', space: 'Salão de Festas', user: 'Apto 502 • Bloco A', status: '18h às 00h', free: false },
              { day: 'Dom 18/05', space: 'Salão de Festas', user: 'Livre', status: 'Disponível', free: true },
            ].map((slot, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] border border-[#cbd5e1]/40 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#0b1c30] w-20">{slot.day}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#0b1c30]">{slot.space}</span>
                    <span className="text-[11px] text-[#76777d]">{slot.user}</span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                    slot.free
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Diretrizes do Regimento Interno */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#eff4ff]">
              <HelpCircle className="w-4 h-4 text-[#006a61]" />
              <h3 className="font-bold text-sm text-[#0b1c30]">Diretrizes de Convivência</h3>
            </div>

            <ul className="space-y-3 text-xs text-[#45464d]">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#006a61] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0b1c30]">Horário de Silêncio:</strong> Das 22h00 às 08h00. Volume de som proibido em áreas externas.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#006a61] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0b1c30]">Piscina:</strong> Seg a Sex até 22h | Sáb e Dom até 00h (somente para moradores e convidados de churrasqueiras).
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 text-[#006a61] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0b1c30]">Duração Máxima de Reserva:</strong> 6 horas consecutivas por unidade.
                </div>
              </li>
            </ul>
          </div>

          <button
            onClick={() => showToast('Regulamento Interno baixado em PDF.', 'info')}
            className="w-full mt-4 py-2 bg-[#eff4ff] hover:bg-[#dfeafc] text-xs font-bold text-[#006a61] rounded-xl border border-[#cbd5e1]/40 transition-colors"
          >
            Baixar Regimento Completo (PDF)
          </button>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]">
            <div className="bg-[#0b1c30] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#86f2e4]">
                  {selectedNotice.category} • {selectedNotice.targetAudience}
                </span>
                <h3 className="font-bold text-base leading-tight mt-1">{selectedNotice.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#76777d] pb-2 border-b border-[#eff4ff]">
                <span>Publicado em {selectedNotice.date} ({selectedNotice.time})</span>
                <span className="font-bold text-[#006a61]">{selectedNotice.readPercentage}% dos moradores leram</span>
              </div>

              <div className="text-xs text-[#3f465c] leading-relaxed whitespace-pre-line">
                {selectedNotice.body}
              </div>

              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#cbd5e1]/40 text-xs text-[#45464d] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#006a61] shrink-0" />
                <span>Assinado digitalmente por Carlos Eduardo Mendes • Síndico Geral</span>
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="w-full py-2.5 bg-[#006a61] text-white font-bold text-xs rounded-xl hover:bg-[#005a52] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
