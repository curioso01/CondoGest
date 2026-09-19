import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { SpaceOption } from '../types';
import {
  X,
  Calendar,
  Clock,
  Users,
  Check
} from 'lucide-react';

interface ReservationDrawerProps {
  space: SpaceOption | null;
  onClose: () => void;

  /**
   * Data opcional enviada pelo calendário.
   *
   * Formato esperado:
   * YYYY-MM-DD
   *
   * Exemplo:
   * 2026-09-30
   */
  selectedDate?: string;
  editingReservation?: import('../types').Reservation | null;
}

/**
 * Retorna a data local no formato YYYY-MM-DD.
 *
 * NÃO utiliza toISOString(), pois toISOString()
 * converte a data para UTC e pode causar deslocamento
 * de um dia em fusos horários como o do Brasil.
 */
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Retorna a data padrão para uma nova reserva.
 *
 * Atualmente o sistema utiliza D+2.
 * Exemplo:
 * hoje = 18/09
 * padrão = 20/09
 */
const getDefaultReservationDate = (): string => {
  const date = new Date();

  date.setDate(
    date.getDate() + 2
  );

  return getLocalDateString(date);
};

export const ReservationDrawer: React.FC<
  ReservationDrawerProps
> = ({
  space,
  onClose,
  selectedDate,
  editingReservation
}) => {
  const {
    currentUser,
    addReservation,
    updateReservation,
    reservations,
    showToast
  } = useCondo();

  /**
   * Se o calendário enviou uma data, ela tem prioridade.
   *
   * Caso contrário, usamos a data padrão D+2.
   */
  const [date, setDate] = useState<string>(
    selectedDate || ''
  );

  const [startTime, setStartTime] =
    useState('12:00');

  const [endTime, setEndTime] =
    useState('18:00');

  const [guestsCount, setGuestsCount] =
    useState(15);

  const [agreedTerms, setAgreedTerms] =
    useState(true);

  const [notes, setNotes] =
    useState('');

  React.useEffect(() => {
    if (editingReservation) {
      setDate(editingReservation.date);
      setStartTime(editingReservation.startTime);
      setEndTime(editingReservation.endTime);
      setGuestsCount(editingReservation.guestsCount);
      setNotes(editingReservation.notes || '');
    }
  }, [editingReservation]);

  if (!space) return null;

  // Calculate duration in hours.
  const startHour = parseInt(
    startTime.split(':')[0],
    10
  );

  const endHour = parseInt(
    endTime.split(':')[0],
    10
  );

  const duration =
    endHour >= startHour
      ? endHour - startHour
      : 24 - startHour + endHour;

  const isOverDuration =
    duration > 6;

  // Fee calculation.
  let fee = 0;
  let feeReason =
    'Isento de taxa';

  if (
    space.id === 'churrasqueira-1' ||
    space.id === 'churrasqueira-2'
  ) {
    fee = 0;

    feeReason =
      'Área com uso gratuito aos moradores adimplentes';
  } else if (
    space.id === 'salao-festas'
  ) {
    if (guestsCount <= 15) {
      fee = 0;

      feeReason =
        'Isento (até 15 convidados)';
    } else {
      fee = 300;

      feeReason =
        'Taxa de R$ 300,00 lançada no próximo boleto (acima de 15 convidados)';
    }
  } else if (
    space.id === 'combo-completo'
  ) {
    fee = 300;

    feeReason =
      'Taxa de R$ 300,00 lançada no próximo boleto';
  }

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (isOverDuration) {
      return;
    }

    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h + (m / 60);
    };

    const getConflictingReservation = (targetSpace: string) => {
      const newStart = parseTime(startTime);
      const newEnd = parseTime(endTime);
      
      return reservations.find(r => {
        if (
          r.id !== editingReservation?.id &&
          r.date === date && 
          r.spaceName === targetSpace && 
          r.status !== 'Cancelado'
        ) {
          const rStart = parseTime(r.startTime);
          const rEnd = parseTime(r.endTime);
          return (newStart < rEnd && newEnd > rStart);
        }
        return false;
      });
    };

    const conflict = getConflictingReservation(space.name);
    if (conflict) {
      let altMsg = `e só pode ser reservada a partir das ${conflict.endTime}`;
      
      if (space.id === 'churrasqueira-1') {
        const altSpaceName = 'Churrasqueira 02 (Deck Sul)';
        const altConflict = getConflictingReservation(altSpaceName);
        if (!altConflict) {
          altMsg += `, ou você pode escolher a ${altSpaceName} que está disponível neste horário`;
        }
      } else if (space.id === 'churrasqueira-2') {
        const altSpaceName = 'Churrasqueira 01 (Gourmet Norte)';
        const altConflict = getConflictingReservation(altSpaceName);
        if (!altConflict) {
          altMsg += `, ou você pode escolher a ${altSpaceName} que está disponível neste horário`;
        }
      }
      
      showToast(`${space.name} já possui uma reserva das ${conflict.startTime} às ${conflict.endTime} ${altMsg}.`, 'error');
      return;
    }

    /**
     * IMPORTANTE:
     *
     * A data é enviada diretamente como string.
     *
     * NÃO fazemos:
     * new Date(date)
     *
     * NÃO fazemos:
     * date.toISOString()
     *
     * Portanto:
     *
     * "2026-09-30"
     *
     * continua sendo:
     *
     * "2026-09-30"
     */
    if (editingReservation) {
      updateReservation(editingReservation.id, {
        date,
        startTime,
        endTime,
        guestsCount,
        fee,
        isExempt: fee === 0,
        notes
      });
    } else {
      addReservation({
        spaceName: space.name,
        date,
        startTime,
        endTime,
        guestsCount,
        fee,
        isExempt: fee === 0,
        status: 'Confirmado',
        userUnit:
          currentUser?.unit ||
          'Unidade',
        userName:
          currentUser?.name ||
          'Morador',
        notes
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col border-l border-[#e2e8f0]">

        {/* Drawer Header */}
        <div className="bg-[#0b1c30] text-white p-5 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006a61] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>

            <div>
              <h3 className="font-bold text-sm leading-tight">
                {editingReservation ? 'Editar Horário da Reserva' : 'Solicitar Reserva de Espaço'}
              </h3>

              <p className="text-[11px] text-[#86f2e4]">
                {space.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 flex-1 space-y-5"
        >
          {/* Space Card Preview */}
          <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-xl border border-[#cbd5e1]/40">
            <img
              src={space.imageUrl}
              alt={space.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-lg object-cover"
            />

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#0b1c30] truncate">
                {space.name}
              </span>

              <span className="text-[11px] text-[#76777d]">
                {space.tag} • Capacidade {space.capacity} pessoas
              </span>

              <span className="text-[11px] font-bold text-[#006a61] mt-0.5">
                {space.feeLabel}
              </span>
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
              Data do Evento
            </label>

            <div className="relative">
              <input
                type="date"
                required
                disabled={!!editingReservation}
                value={date}
                min={getLocalDateString()}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Time Windows */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
                Horário Início
              </label>

              <select
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
              >
                <option value="09:00">
                  09:00
                </option>

                <option value="10:00">
                  10:00
                </option>

                <option value="11:00">
                  11:00
                </option>

                <option value="12:00">
                  12:00 (Almoço)
                </option>

                <option value="13:00">
                  13:00
                </option>

                <option value="14:00">
                  14:00
                </option>

                <option value="17:00">
                  17:00
                </option>

                <option value="18:00">
                  18:00 (Jantar)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
                Horário Término
              </label>

              <select
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
              >
                <option value="15:00">
                  15:00
                </option>

                <option value="16:00">
                  16:00
                </option>

                <option value="17:00">
                  17:00
                </option>

                <option value="18:00">
                  18:00
                </option>

                <option value="20:00">
                  20:00
                </option>

                <option value="22:00">
                  22:00 (Seg-Sex máx)
                </option>

                <option value="23:30">
                  23:30
                </option>

                <option value="00:00">
                  00:00 (Sáb-Dom máx)
                </option>
              </select>
            </div>
          </div>

          {/* Duration Indicator */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
              isOverDuration
                ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold'
                : 'bg-[#eff4ff] border-[#cbd5e1]/40 text-[#45464d]'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0 text-[#006a61]" />

            <span>
              Duração estimada:{' '}
              <strong>
                {duration} horas
              </strong>{' '}
              {isOverDuration
                ? '(Excede o limite regimental de 6 horas!)'
                : '(Permitido)'}
            </span>
          </div>

          {/* Guests Counter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wide">
                Número de Convidados
              </label>

              <span className="text-xs font-bold text-[#006a61]">
                {guestsCount} pessoas (Máx:{' '}
                {space.capacity})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setGuestsCount(
                    Math.max(
                      1,
                      guestsCount - 1
                    )
                  )
                }
                className="w-10 h-10 rounded-xl bg-[#eff4ff] hover:bg-slate-200 text-lg font-bold text-[#0b1c30] transition-colors"
              >
                -
              </button>

              <input
                type="range"
                min="1"
                max={space.capacity}
                value={guestsCount}
                onChange={(e) =>
                  setGuestsCount(
                    parseInt(
                      e.target.value,
                      10
                    )
                  )
                }
                className="flex-1 accent-[#006a61]"
              />

              <button
                type="button"
                onClick={() =>
                  setGuestsCount(
                    Math.min(
                      space.capacity,
                      guestsCount + 1
                    )
                  )
                }
                className="w-10 h-10 rounded-xl bg-[#eff4ff] hover:bg-slate-200 text-lg font-bold text-[#0b1c30] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#006a61]/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#0b1c30]">
                Taxa de Utilização:
              </span>

              <span
                className={`text-base font-extrabold ${
                  fee > 0
                    ? 'text-[#ba1a1a]'
                    : 'text-emerald-700'
                }`}
              >
                {fee === 0
                  ? 'R$ 0,00 (ISENTO)'
                  : `R$ ${fee
                      .toFixed(2)
                      .replace(
                        '.',
                        ','
                      )}`}
              </span>
            </div>

            <p className="text-[11px] text-[#76777d]">
              {feeReason}
            </p>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
              Observações (Opcional)
            </label>

            <input
              type="text"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Ex: Aniversário infantil, contratação de buffet"
              className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
            />
          </div>

          {/* Rules Acceptance */}
          <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-xl">
            <input
              type="checkbox"
              required
              checked={agreedTerms}
              onChange={(e) =>
                setAgreedTerms(
                  e.target.checked
                )
              }
              className="mt-0.5 rounded text-[#006a61] focus:ring-[#006a61]"
            />

            <span className="text-[11px] text-[#45464d] leading-tight">
              Declaro estar ciente das regras do condomínio: duração máxima de 6h, horário de silêncio rigoroso, conservação dos móveis e limpeza básica após o evento.
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#45464d] hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isOverDuration}
              className={`flex-1 py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                isOverDuration
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#006a61] hover:bg-[#005a52]'
              }`}
            >
              <Check className="w-4 h-4" />

              <span>
                Confirmar Agendamento
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
