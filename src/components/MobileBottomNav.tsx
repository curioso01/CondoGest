import React from 'react';
import { useCondo } from '../context/CondoContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Receipt, 
  ShieldAlert, 
  Lock 
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, showToast } = useCondo();

  const isSindico = currentUser?.role === 'sindico';

  const navItems = [
    {
      id: 'inicio',
      label: 'Início',
      icon: LayoutDashboard,
      roleRequired: 'all'
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: CalendarCheck,
      roleRequired: 'all'
    },
    {
      id: 'boletos',
      label: 'Boletos',
      icon: Receipt,
      roleRequired: 'all'
    },
    {
      id: 'sindico',
      label: 'Síndico',
      icon: ShieldAlert,
      roleRequired: 'sindico',
      badge: 'Admin'
    }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.roleRequired === 'sindico' && !isSindico) {
      showToast('Acesso Restrito ao Síndico Geral. Faça login como síndico para acessar o painel de gestão.', 'error');
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0]/80 z-40 lg:hidden flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isRestricted = item.roleRequired === 'sindico' && !isSindico;

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
              isActive ? 'text-[#006a61]' : isRestricted ? 'text-gray-400 opacity-60' : 'text-[#76777d]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {isRestricted && (
                <Lock className="w-2.5 h-2.5 absolute -top-1 -right-2 text-gray-500" />
              )}
            </div>
            <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 bg-[#006a61] rounded-full absolute bottom-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
