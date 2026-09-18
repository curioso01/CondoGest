export type UserRole = 'morador' | 'sindico';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  unit: string;
  block: 'A' | 'B' | 'C';
  apartment: string;
  residentType: 'Proprietário' | 'Inquilino' | 'Proprietário Não Residente';
  isSindico: boolean;
  avatarUrl: string;
  carModel?: string;
  carPlate?: string;
  parkingSpots: string[];
  tagCode: string;
  financialStatus: 'Adimplente' | 'Pendente';
  pendingAmount?: number;
}

export interface SpaceOption {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  capacity: number;
  isFree: boolean;
  feeLabel: string;
  description: string;
  amenities: string[];
  imageUrl: string;
  nextSlot: string;
  badgeStatus: string;
  badgeColor: string;
}

export interface Reservation {
  id: string;
  spaceName: string;
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  fee: number;
  isExempt: boolean;
  status: 'Confirmado' | 'Pendente' | 'Cancelado';
  userUnit: string;
  userName: string;
  notes?: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Urgente' | 'Regimento' | 'Convocação' | 'Manutenção' | 'Festas';
  targetAudience: string;
  body: string;
  date: string;
  time: string;
  isRead: boolean;
  readPercentage: number;
  channels: {
    push: boolean;
    email: boolean;
    mural: boolean;
  };
  pinned?: boolean;
}

export interface BoletoItem {
  id: string;
  reference: string;
  dueDate: string;
  amount: number;
  status: 'Pago' | 'Em Aberto' | 'Atrasado';
  barcode: string;
  pixCode: string;
  paymentMethod?: 'PIX' | 'Boleto' | 'Débito Automático';
  paymentDate?: string;
  breakdown: {
    ordinary: number;
    water: number;
    reserveFund: number;
    leisureFee: number;
    ledApportionment: number;
  };
}

export interface CondoRules {
  silenceStart: string;
  silenceEnd: string;
  ballroomFee: number;
  ballroomMaxGuests: number;
  barbecueFee: number;
  barbecueMaxDaysAdvance: number;
  visitorParkingMaxHours: string;
  petVaccinationRequired: boolean;
  worksWeekdayHours: string;
  worksSaturdayHours: string;
}

export interface SupportTicket {
  id: string;
  recipient: 'Portaria 24h' | 'Zeladoria / Síndico';
  subject: string;
  message: string;
  status: 'Aberto' | 'Em Atendimento' | 'Concluído';
  createdAt: string;
  unit: string;
  protocol: string;
}
