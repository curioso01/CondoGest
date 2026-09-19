import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Notice, Reservation, BoletoItem, CondoRules, SupportTicket } from '../types';
import { DEFAULT_USERS, INITIAL_NOTICES, INITIAL_RESERVATIONS, INITIAL_BOLETOS, INITIAL_RULES } from '../data/initialData';

interface CondoContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  notices: Notice[];
  reservations: Reservation[];
  boletos: BoletoItem[];
  rules: CondoRules;
  tickets: SupportTicket[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedNotice: Notice | null;
  setSelectedNotice: (notice: Notice | null) => void;
  loginUser: (user: UserProfile) => void;
  logout: () => void;
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  updateUser: (id: string, updated: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date' | 'time' | 'isRead' | 'readPercentage'>) => void;
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt'>) => void;
  cancelReservation: (id: string) => void;
  updateReservationGuests: (id: string, newCount: number) => void;
  updateReservation: (id: string, updated: Partial<Reservation>) => void;
  issueBatchBoletos: (options: { month: string; dueDate: string; baseFee: number; reserveFundPercent: number }) => void;
  payBoletoPix: (boletoId: string) => void;
  updateRules: (newRules: Partial<CondoRules>) => void;
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'protocol'>) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  deviceMode: 'auto' | 'mobile' | 'desktop';
  setDeviceMode: (mode: 'auto' | 'mobile' | 'desktop') => void;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
}

const CondoContext = createContext<CondoContextType | undefined>(undefined);

const STORAGE_KEY = 'condogest_storage_v2';

export const CondoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
      if (saved) return JSON.parse(saved);
      // Default to Síndico Carlos Eduardo initially so user sees the rich experience immediately
      return DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reservations`);
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [boletos, setBoletos] = useState<BoletoItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_boletos`);
      return saved ? JSON.parse(saved) : INITIAL_BOLETOS;
    } catch {
      return INITIAL_BOLETOS;
    }
  });

  const [rules, setRules] = useState<CondoRules>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_rules`);
      return saved ? JSON.parse(saved) : INITIAL_RULES;
    } catch {
      return INITIAL_RULES;
    }
  });

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'ticket-1',
      recipient: 'Portaria 24h',
      subject: 'Aviso de entrega pacote grande',
      message: 'Aguardando entrega de eletrodoméstico hoje à tarde.',
      status: 'Em Atendimento',
      createdAt: '15/05/2025 09:30',
      unit: 'Apto 402 • Bloco B',
      protocol: 'CG-8492'
    }
  ]);

  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [deviceMode, setDeviceMode] = useState<'auto' | 'mobile' | 'desktop'>('auto');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
      localStorage.setItem(`${STORAGE_KEY}_reservations`, JSON.stringify(reservations));
      localStorage.setItem(`${STORAGE_KEY}_boletos`, JSON.stringify(boletos));
      localStorage.setItem(`${STORAGE_KEY}_rules`, JSON.stringify(rules));
      if (currentUser) {
        localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_current_user`);
      }
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [users, notices, reservations, boletos, rules, currentUser]);

  // Listen for storage events (sync between tabs)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${STORAGE_KEY}_notices` && e.newValue) {
        try {
          setNotices(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'sindico') {
      showToast(`Bem-vindo, Síndico ${user.name}! Modo Superuser ativo.`, 'info');
    } else {
      showToast(`Bem-vindo, ${user.name}! Acesso de Morador liberado.`, 'info');
      // If activeTab is sindico, shift to inicio
      if (activeTab === 'sindico') {
        setActiveTab('inicio');
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Você encerrou a sessão.', 'info');
  };

  const addUser = (userData: Omit<UserProfile, 'id'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`Condômino ${newUser.name} cadastrado com sucesso!`);
  };

  const updateUser = (id: string, updated: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));
    if (currentUser?.id === id) {
      setCurrentUser(prev => (prev ? { ...prev, ...updated } : null));
    }
    showToast('Cadastro atualizado com sucesso!');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Cadastro removido do condomínio.');
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'date' | 'time' | 'isRead' | 'readPercentage'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newNotice: Notice = {
      ...noticeData,
      id: `notice-${Date.now()}`,
      date: `${now.getDate()} de ${now.toLocaleDateString('pt-BR', { month: 'long' })} de ${now.getFullYear()}`,
      time: `Hoje, às ${timeStr}`,
      isRead: false,
      readPercentage: 100
    };
    setNotices(prev => [newNotice, ...prev]);
    showToast(`Comunicado "${newNotice.title}" publicado e disparado a todos os moradores!`);
  };

  const addReservation = (resData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newRes: Reservation = {
      ...resData,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReservations(prev => [newRes, ...prev]);
    showToast(`Reserva para ${newRes.spaceName} confirmada!`);
  };

  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'Cancelado' } : r)));
    showToast('Reserva cancelada com sucesso. A vaga foi liberada na grade.');
  };

  const updateReservationGuests = (id: string, newCount: number) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === id) {
          const isExempt = newCount <= 15;
          const fee = isExempt ? 0 : 300;
          return { ...r, guestsCount: newCount, fee, isExempt };
        }
        return r;
      })
    );
    showToast(`Lista de convidados atualizada para ${newCount} pessoas.`);
  };

  const updateReservation = (id: string, updated: Partial<Reservation>) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updated } : r))
    );
    showToast('Reserva atualizada com sucesso!');
  };

  const issueBatchBoletos = (options: { month: string; dueDate: string; baseFee: number; reserveFundPercent: number }) => {
    const newBoleto: BoletoItem = {
      id: `bol-${Date.now()}`,
      reference: options.month,
      dueDate: options.dueDate,
      amount: options.baseFee + (options.baseFee * options.reserveFundPercent) / 100,
      status: 'Em Aberto',
      barcode: `34191.${Math.floor(10000 + Math.random() * 90000)} 01043.${Math.floor(100000 + Math.random() * 900000)} 91020.150008 5 96510000068000`,
      pixCode: `00020126580014br.gov.bcb.pix0136condogest-${Date.now()}...`,
      breakdown: {
        ordinary: options.baseFee,
        water: 0,
        reserveFund: (options.baseFee * options.reserveFundPercent) / 100,
        leisureFee: 0,
        ledApportionment: 0
      }
    };

    setBoletos(prev => [newBoleto, ...prev]);
    showToast(`84 Boletos de ${options.month} gerados e disparados por e-mail e push no aplicativo!`);
  };

  const payBoletoPix = (boletoId: string) => {
    setBoletos(prev =>
      prev.map(b =>
        b.id === boletoId
          ? {
              ...b,
              status: 'Pago',
              paymentMethod: 'PIX',
              paymentDate: new Date().toLocaleDateString('pt-BR')
            }
          : b
      )
    );
    showToast('Pagamento PIX liquidado com sucesso! Comprovante autenticado digitalmente.');
  };

  const updateRules = (newRules: Partial<CondoRules>) => {
    setRules(prev => ({ ...prev, ...newRules }));
    showToast('Regimento interno e parâmetros operacionais atualizados com sucesso!');
  };

  const addTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'protocol'>) => {
    const protocolNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `ticket-${Date.now()}`,
      createdAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Aberto',
      protocol: `CG-${protocolNum}`
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast(`Chamado enviado para ${ticketData.recipient}! Protocolo #${newTicket.protocol}.`);
  };

  return (
    <CondoContext.Provider
      value={{
        currentUser,
        users,
        notices,
        reservations,
        boletos,
        rules,
        tickets,
        activeTab,
        setActiveTab,
        selectedNotice,
        setSelectedNotice,
        loginUser,
        logout,
        addUser,
        updateUser,
        deleteUser,
        addNotice,
        addReservation,
        cancelReservation,
        updateReservationGuests,
        updateReservation,
        issueBatchBoletos,
        payBoletoPix,
        updateRules,
        addTicket,
        showToast,
        toast,
        deviceMode,
        setDeviceMode,
        globalSearch,
        setGlobalSearch
      }}
    >
      {children}
    </CondoContext.Provider>
  );
};

export const useCondo = () => {
  const context = useContext(CondoContext);
  if (!context) {
    throw new Error('useCondo must be used within a CondoProvider');
  }
  return context;
};
