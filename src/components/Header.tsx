import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  Smartphone, 
  Monitor, 
  LogOut, 
  User, 
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    users, 
    loginUser, 
    logout, 
    globalSearch, 
    setGlobalSearch,
    deviceMode,
    setDeviceMode,
    notices,
    setActiveTab,
    setSelectedNotice
  } = useCondo();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNoticesCount = notices.filter(n => !n.isRead).length || 3;

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#ffffff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 border-b border-[#e2e8f0]/60 transition-all">
      <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3.5 text-[#76777d] w-[18px] h-[18px]" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Buscar comunicados, moradores, reservas ou boletos..."
              className="w-full h-10 pl-10 pr-4 bg-[#eff4ff] rounded-lg font-body-sm text-sm text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 text-xs text-[#76777d] hover:text-[#0b1c30]"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-2 lg:gap-3.5 ml-auto">
          {/* Simulator View Switcher */}
          <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-lg border border-[#e2e8f0]">
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Modo Tela Web"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-white text-[#0b1c30] shadow-xs'
                  : 'text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              <Monitor className="w-4 h-4 text-[#006a61]" />
              <span className="hidden xl:inline text-xs">Web</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Modo Tela Mobile (Simulador App Celular)"
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-white text-[#0b1c30] shadow-xs'
                  : 'text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#006a61]" />
              <span className="hidden xl:inline text-xs">Mobile</span>
            </button>
          </div>

          {/* Superuser / Role Pill */}
          {currentUser?.role === 'sindico' ? (
            <div className="hidden md:flex items-center gap-1.5 bg-[#86f2e4]/30 text-[#006a61] px-3 py-1.5 rounded-full border border-[#006a61]/20">
              <ShieldCheck className="w-4 h-4 text-[#006a61]" />
              <span className="text-xs font-bold tracking-tight">Síndico Geral • Gestão Ativa</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 bg-[#eff4ff] text-[#3f465c] px-3 py-1.5 rounded-full border border-[#cbd5e1]/40">
              <UserCheck className="w-4 h-4 text-[#006a61]" />
              <span className="text-xs font-semibold">Morador • {currentUser?.unit}</span>
            </div>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-full transition-colors"
              title="Notificações e Avisos"
              type="button"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                  <h4 className="font-bold text-sm text-[#0b1c30]">Mural de Notificações</h4>
                  <span className="text-xs bg-[#ffdad6] text-[#93000a] font-bold px-2 py-0.5 rounded-full">
                    {unreadNoticesCount} novas
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 py-2 max-h-80 overflow-y-auto">
                  {notices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => {
                        setShowNotifications(false);
                        setActiveTab('inicio');
                        setSelectedNotice(notice);
                      }}
                      className="p-2.5 rounded-lg hover:bg-[#eff4ff] cursor-pointer transition-colors border-l-3 border-[#006a61]"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold uppercase text-[#006a61]">{notice.category}</span>
                        <span className="text-[#76777d]">{notice.time}</span>
                      </div>
                      <p className="font-semibold text-xs text-[#0b1c30] leading-snug">{notice.title}</p>
                      <p className="text-[11px] text-[#45464d] line-clamp-2 mt-0.5">{notice.body}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('inicio');
                  }}
                  className="w-full mt-2 text-center text-xs font-bold text-[#006a61] hover:underline pt-2 border-t border-[#eff4ff]"
                >
                  Ver todos os comunicados
                </button>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-[#e2e8f0] hidden sm:block" />

          {/* User Profile Selector Menu */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-[#eff4ff] transition-colors"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={currentUser?.name || 'Perfil'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006a61]/30 shadow-xs"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#0b1c30] leading-tight flex items-center gap-1">
                  {currentUser?.name}
                  {currentUser?.role === 'sindico' && (
                    <span className="text-[10px] bg-[#006a61] text-white px-1 rounded font-extrabold">ADMIN</span>
                  )}
                </span>
                <span className="text-[11px] text-[#76777d]">{currentUser?.unit}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#76777d]" />
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-[#eff4ff] flex items-center gap-2.5 mb-2">
                  <img
                    src={currentUser?.avatarUrl}
                    alt={currentUser?.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#006a61]"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#0b1c30] truncate">{currentUser?.name}</span>
                    <span className="text-[11px] text-[#76777d] truncate">{currentUser?.email}</span>
                    <span className="text-[10px] text-[#006a61] font-bold uppercase mt-0.5">
                      {currentUser?.role === 'sindico' ? 'Superuser (Síndico)' : 'Morador Titular'}
                    </span>
                  </div>
                </div>

                {/* Switch Profiles Section */}
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-[10px] uppercase font-bold text-[#76777d] px-2">Alternar Perfil p/ Teste:</span>
                  
                  {/* Síndico Carlos Eduardo */}
                  <button
                    onClick={() => {
                      const sindico = users.find(u => u.role === 'sindico');
                      if (sindico) loginUser(sindico);
                      setShowProfileMenu(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser?.role === 'sindico'
                        ? 'bg-[#eff4ff] font-bold text-[#006a61]'
                        : 'hover:bg-slate-50 text-[#0b1c30]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#006a61]" />
                    <div className="flex flex-col">
                      <span>Carlos Eduardo (Síndico Geral)</span>
                      <span className="text-[10px] text-[#76777d]">Superuser: Boletos, Avisos, Moradores</span>
                    </div>
                  </button>

                  {/* Morador Mariana */}
                  <button
                    onClick={() => {
                      const morador = users.find(u => u.id === 'user-morador-1') || users.find(u => u.role === 'morador');
                      if (morador) loginUser(morador);
                      setShowProfileMenu(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser?.id === 'user-morador-1'
                        ? 'bg-[#eff4ff] font-bold text-[#006a61]'
                        : 'hover:bg-slate-50 text-[#0b1c30]'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#3f465c]" />
                    <div className="flex flex-col">
                      <span>Mariana Albuquerque (Moradora)</span>
                      <span className="text-[10px] text-[#76777d]">Apto 102 • Bloco A (Inquilina)</span>
                    </div>
                  </button>

                  {/* Morador Roberto Fontes */}
                  <button
                    onClick={() => {
                      const morador2 = users.find(u => u.id === 'user-morador-2');
                      if (morador2) loginUser(morador2);
                      setShowProfileMenu(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser?.id === 'user-morador-2'
                        ? 'bg-[#eff4ff] font-bold text-[#006a61]'
                        : 'hover:bg-slate-50 text-[#0b1c30]'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#ba1a1a]" />
                    <div className="flex flex-col">
                      <span>Roberto Fontes (Pendente)</span>
                      <span className="text-[10px] text-[#76777d]">Apto 301 • Bloco C (1 Cota Pendente)</span>
                    </div>
                  </button>
                </div>

                <div className="border-t border-[#eff4ff] mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 p-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta (Trocar Usuário)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
