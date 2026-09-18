import React from 'react';
import { useCondo } from '../context/CondoContext';
import { LOGO_URL } from '../data/initialData';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Receipt, 
  ShieldAlert, 
  FileText, 
  Settings, 
  PhoneCall, 
  Building2,
  Lock
} from 'lucide-react';

interface SidebarProps {
  onOpenTicketModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenTicketModal }) => {
  const { activeTab, setActiveTab, currentUser, showToast } = useCondo();

  const isSindico = currentUser?.role === 'sindico';

  const navItems = [
    {
      id: 'inicio',
      label: 'Início / Mural',
      icon: LayoutDashboard,
      roleRequired: 'all'
    },
    {
      id: 'reservas',
      label: 'Reservas & Áreas Comuns',
      icon: CalendarCheck,
      roleRequired: 'all'
    },
    {
      id: 'boletos',
      label: 'Boletos & Financeiro',
      icon: Receipt,
      roleRequired: 'all'
    },
    {
      id: 'sindico',
      label: 'Painel do Síndico',
      icon: ShieldAlert,
      roleRequired: 'sindico',
      badge: 'Superuser'
    }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.roleRequired === 'sindico' && !isSindico) {
      showToast('Acesso Restrito ao Síndico Geral. Faça login como síndico para acessar.', 'error');
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-[#e2e8f0]/60 flex flex-col z-50 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#eff4ff] flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="CondoGest Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-sm border border-[#006a61]/20"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#0b1c30] flex items-center gap-1.5">
              CondoGest
              <span className="bg-[#006a61] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Residencial
              </span>
            </span>
            <span className="text-xs text-[#76777d] font-medium truncate">Solar das Palmeiras</span>
          </div>
        </div>

        {/* Current User Unit Badge */}
        <div className="bg-[#eff4ff] p-2.5 rounded-xl flex items-center gap-2.5 border border-[#cbd5e1]/40">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#006a61] shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-[#76777d] uppercase tracking-wide">
              {currentUser?.residentType || 'Morador'}
            </span>
            <span className="text-xs font-bold text-[#0b1c30] truncate">
              {currentUser?.unit || 'Unidade'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#76777d]">
          Módulos do Condômino
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isRestricted = item.roleRequired === 'sindico' && !isSindico;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-[#006a61] text-white font-bold shadow-sm shadow-[#006a61]/20'
                  : isRestricted
                  ? 'text-[#76777d] opacity-75 hover:bg-[#eff4ff]'
                  : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#86f2e4]' : isRestricted ? 'text-[#76777d]' : 'text-[#006a61]'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isActive
                      ? 'bg-[#86f2e4] text-[#006a61]'
                      : isRestricted
                      ? 'bg-[#f1f5f9] text-[#76777d]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {isRestricted && <Lock className="w-2.5 h-2.5" />}
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#76777d]">
          Informações & Gestão
        </div>

        <button
          onClick={() => {
            showToast('Convenção e Regulamento Interno disponíveis para download nos comunicados.', 'info');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-[#45464d] hover:bg-[#eff4ff] transition-all"
        >
          <FileText className="w-4 h-4 text-[#76777d]" />
          <span>Regimento Interno & Atas</span>
        </button>

        <button
          onClick={() => {
            if (!isSindico) {
              showToast('Configurações do condomínio são administradas pelo Síndico.', 'info');
            } else {
              setActiveTab('sindico');
            }
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-[#45464d] hover:bg-[#eff4ff] transition-all"
        >
          <Settings className="w-4 h-4 text-[#76777d]" />
          <span>Configurações Operacionais</span>
        </button>
      </nav>

      {/* Portaria 24h & Chamado Direto Footer */}
      <div className="p-4 border-t border-[#eff4ff] bg-[#fcfdff]">
        <div className="bg-[#eff4ff] rounded-xl p-3 border border-[#cbd5e1]/40 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Portaria 24h (Ramal 94)
            </span>
            <span className="text-[10px] text-[#006a61] font-semibold">Online</span>
          </div>
          <p className="text-[10px] text-[#45464d] leading-tight">
            Autorização de visitantes, entregas ou suporte emergencial.
          </p>
          <button
            onClick={onOpenTicketModal}
            className="w-full py-1.5 bg-[#006a61] hover:bg-[#005a52] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Abrir Chamado Rápido</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
