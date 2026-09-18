import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { SPACES } from '../data/initialData';
import { SpaceOption, Reservation } from '../types';
import { 
  Calendar, 
  Users, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ReservasViewProps {
  onOpenBooking: (space: SpaceOption) => void;
}

export const ReservasView: React.FC<ReservasViewProps> = ({ onOpenBooking }) => {
  const { reservations, cancelReservation, updateReservationGuests, currentUser, showToast } = useCondo();
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<'maio' | 'junho'>('maio');

  // Days simulation for calendar view
  const daysInMay = Array.from({ length: 31 }, (_, i) => i + 1);

  // Status mapping for days in May
  const getDayStatus = (day: number) => {
    if (day === 18) return { status: 'occupied', label: '3 Reservas (Sábado)', color: 'bg-rose-500' };
    if (day === 24) return { status: 'partial', label: '1 Reserva (Salão)', color: 'bg-amber-500' };
    if (day === 25) return { status: 'occupied', label: 'Churrasqueira 01', color: 'bg-rose-500' };
    if (day === 31) return { status: 'partial', label: 'Churrasqueira 02', color: 'bg-amber-500' };
    return { status: 'free', label: 'Livre', color: 'bg-emerald-500' };
  };

  const filteredSpaces = selectedSpaceFilter === 'all'
    ? SPACES
    : SPACES.filter(s => s.id === selectedSpaceFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#e2e8f0]/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#006a61] flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Lazer & Integração
          </span>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
            Reservas de Espaços & Áreas Comuns
          </h1>
          <p className="text-xs text-[#76777d] mt-0.5">
            Agende churrasqueiras e salão nobre com confirmação imediata e regras regimentais transparentes.
          </p>
        </div>

        <button
          onClick={() => onOpenBooking(SPACES[0])}
          className="flex items-center justify-center gap-2 bg-[#006a61] hover:bg-[#005a52] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Solicitação de Reserva</span>
        </button>
      </div>

      {/* Regimento Interno Consolidado Banner */}
      <div className="bg-[#eff4ff] border border-[#006a61]/20 p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-[#006a61]" />
          <h3 className="font-extrabold text-sm text-[#0b1c30]">
            Regimento Interno das Áreas de Convivência
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-[#cbd5e1]/40">
            <span className="font-bold text-[#0b1c30] block mb-0.5">Duração Máxima:</span>
            <span className="text-[#45464d]">Até 6 horas contínuas por unidade no mesmo dia.</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#cbd5e1]/40">
            <span className="font-bold text-[#0b1c30] block mb-0.5">Janelas de Horário:</span>
            <span className="text-[#45464d]">Seg a Sex até 22h00 | Sáb e Dom até 00h00.</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#cbd5e1]/40">
            <span className="font-bold text-[#0b1c30] block mb-0.5">Piscina Inclusa:</span>
            <span className="text-[#006a61] font-semibold">Liberada para convidados de churrasqueira com atestado.</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#cbd5e1]/40">
            <span className="font-bold text-[#0b1c30] block mb-0.5">Taxas do Salão:</span>
            <span className="text-[#45464d]">Até 15 convidados: R$ 0,00 | Acima de 15: R$ 300,00.</span>
          </div>
        </div>
      </div>

      {/* Grid de Espaços Disponíveis */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="font-extrabold text-base text-[#0b1c30] flex items-center gap-2">
            <span>Espaços Disponíveis para Confraternização</span>
            <span className="text-xs font-normal text-[#76777d]">({SPACES.length} opções)</span>
          </h2>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#76777d]" />
            <select
              value={selectedSpaceFilter}
              onChange={(e) => setSelectedSpaceFilter(e.target.value)}
              className="p-1.5 bg-white border border-[#e2e8f0] rounded-xl text-xs font-semibold text-[#0b1c30] focus:ring-2 focus:ring-[#006a61]/30"
            >
              <option value="all">Exibir Todos os Espaços</option>
              {SPACES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Frame */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={space.imageUrl}
                    alt={space.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-[#0b1c30]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {space.tag}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-[#0b1c30] text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
                      Até {space.capacity} pessoas
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-[#006a61] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      {space.feeLabel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0b1c30] group-hover:text-[#006a61] transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                      {space.subtitle}
                    </p>
                  </div>

                  {/* Amenities Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {space.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-[#eff4ff] text-[#006a61] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#cbd5e1]/40"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 mt-2 flex items-center justify-between border-t border-[#eff4ff]">
                <div className="flex items-center gap-1.5 text-xs text-[#76777d]">
                  <Clock className="w-3.5 h-3.5 text-[#006a61]" />
                  <span>{space.nextSlot}</span>
                </div>

                <button
                  onClick={() => onOpenBooking(space)}
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#005a52] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar Espaço</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visão do Calendário Bimestral Interativo */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eff4ff]">
          <div>
            <h3 className="font-extrabold text-base text-[#0b1c30]">
              Disponibilidade em Tempo Real • Maio / 2025
            </h3>
            <p className="text-xs text-[#76777d]">
              Selecione uma data para verificar os horários e abrir agendamento direto
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#45464d]">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Livre
            </span>
            <span className="flex items-center gap-1.5 text-[#45464d]">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              Parcial
            </span>
            <span className="flex items-center gap-1.5 text-[#45464d]">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              Reservado
            </span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-[11px] font-bold text-[#76777d] py-1">
              {day}
            </div>
          ))}

          {/* Offset for May 2025 (starts on Thursday = 4 empty boxes) */}
          <div className="p-2" />
          <div className="p-2" />
          <div className="p-2" />
          <div className="p-2" />

          {daysInMay.map((day) => {
            const info = getDayStatus(day);
            const isClickable = info.status !== 'occupied';

            return (
              <button
                key={day}
                onClick={() => {
                  if (isClickable) {
                    onOpenBooking(SPACES[0]);
                  } else {
                    showToast(`Dia ${day} de Maio já possui ocupação máxima nas áreas comuns.`, 'info');
                  }
                }}
                className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center justify-between transition-all min-h-[56px] sm:min-h-[70px] ${
                  info.status === 'occupied'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-800'
                    : info.status === 'partial'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900 hover:scale-105'
                    : 'bg-white border-[#e2e8f0] text-[#0b1c30] hover:border-[#006a61] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="font-extrabold text-xs sm:text-sm">{day}</span>
                <span className={`w-2 h-2 rounded-full ${info.color}`} />
                <span className="text-[9px] truncate max-w-full font-semibold hidden sm:inline">
                  {info.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Minhas Reservas Agendadas */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff]">
          <div>
            <h3 className="font-extrabold text-base text-[#0b1c30]">Minhas Reservas Agendadas</h3>
            <p className="text-xs text-[#76777d]">Gerenciamento de convidados e cancelamentos permitidos com até 24h de antecedência</p>
          </div>
          <span className="text-xs font-bold text-[#006a61] bg-[#eff4ff] px-3 py-1 rounded-full border border-[#cbd5e1]/40">
            {reservations.length} agendamentos registrados
          </span>
        </div>

        <div className="space-y-3">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#006a61]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#0b1c30]">{res.spaceName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    res.status === 'Confirmado'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {res.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#76777d]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#006a61]" />
                    {res.date} ({res.startTime} às {res.endTime})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#006a61]" />
                    {res.guestsCount} convidados
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-[#006a61]">
                    {res.fee === 0 ? 'Isento de taxa' : `Taxa: R$ ${res.fee.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newCount = prompt('Digite o novo número de convidados:', String(res.guestsCount));
                    if (newCount) updateReservationGuests(res.id, parseInt(newCount, 10) || res.guestsCount);
                  }}
                  className="py-2 px-3 bg-[#eff4ff] hover:bg-[#dfeafc] text-xs font-bold text-[#0b1c30] rounded-xl border border-[#cbd5e1]/40 transition-colors"
                >
                  Editar Convidados
                </button>

                {res.status === 'Confirmado' && (
                  <button
                    onClick={() => cancelReservation(res.id)}
                    className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 rounded-xl border border-rose-200 transition-colors"
                  >
                    Cancelar Reserva
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
