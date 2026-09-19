import React, { useState } from 'react';
import { CondoProvider, useCondo } from './context/CondoContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MuralView } from './views/MuralView';
import { ReservasView } from './views/ReservasView';
import { FinanceiroView } from './views/FinanceiroView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { PixModal } from './components/PixModal';
import { ReservationDrawer } from './components/ReservationDrawer';
import { TicketModal } from './components/TicketModal';
import { VisitorPassModal } from './components/VisitorPassModal';
import { BoletoItem, SpaceOption } from './types';
import { LOGO_URL } from './data/initialData';
import { Smartphone, Monitor, CheckCircle, Info, AlertTriangle, Wifi, Battery, Signal } from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    toast, 
    deviceMode, 
    setDeviceMode,
    boletos 
  } = useCondo();

  // Modals state
  const [activePixBoleto, setActivePixBoleto] = useState<BoletoItem | null>(null);
  const [bookingSpace, setBookingSpace] = useState<SpaceOption | null>(null);
  const [bookingDate, setBookingDate] = useState<string | undefined>(undefined);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isVisitorPassOpen, setIsVisitorPassOpen] = useState(false);

  // If not logged in, show the login view
  if (!currentUser) {
    return <LoginView />;
  }

  // Active View Renderer
  const renderActiveView = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <MuralView
            onOpenPixModal={(bol) => setActivePixBoleto(bol)}
            onOpenVisitorPass={() => setIsVisitorPassOpen(true)}
            onOpenTicket={() => setIsTicketOpen(true)}
            onGoToReservas={() => setActiveTab('reservas')}
          />
        );
      case 'reservas':
        return (
          <ReservasView
            onOpenBooking={(space, date) => {
              setBookingSpace(space);
              setBookingDate(date);
            }}
            onEditBooking={(res, space) => {
              setEditingReservation(res);
              setBookingSpace(space);
            }}
          />
        );
      case 'boletos':
        return (
          <FinanceiroView
            onOpenPixModal={(bol) => setActivePixBoleto(bol)}
          />
        );
      case 'sindico':
        return <AdminView />;
      default:
        return (
          <MuralView
            onOpenPixModal={(bol) => setActivePixBoleto(bol)}
            onOpenVisitorPass={() => setIsVisitorPassOpen(true)}
            onOpenTicket={() => setIsTicketOpen(true)}
            onGoToReservas={() => setActiveTab('reservas')}
          />
        );
    }
  };

  // If Mobile Mode is active on desktop (Simulator Frame)
  if (deviceMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center">
        {/* Simulator Bar Controls */}
        <div className="mb-4 flex items-center gap-3 bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 shadow-md">
          <Smartphone className="w-4 h-4 text-[#86f2e4]" />
          <span className="text-xs font-bold">Simulador Mobile Ativo (Visualização Celular)</span>
          <button
            onClick={() => setDeviceMode('desktop')}
            className="text-xs bg-[#006a61] hover:bg-[#005a52] px-3 py-1 rounded-lg font-bold text-white transition-colors"
          >
            Voltar para Web
          </button>
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="w-full max-w-[400px] h-[844px] bg-white rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-slate-800 relative flex flex-col">
          {/* Status Bar */}
          <div className="h-9 bg-white px-6 flex items-center justify-between text-slate-800 text-xs font-bold shrink-0 z-50">
            <span>09:41</span>
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile Top Header */}
          <div className="h-14 bg-white/95 px-4 flex items-center justify-between border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="CondoGest"
                className="w-6 h-6 rounded-lg object-cover shadow-2xs border border-[#006a61]/20"
              />
              <span className="font-extrabold text-sm text-[#0b1c30]">CondoGest</span>
              <span className="text-[10px] bg-[#006a61] text-white px-1.5 py-0.5 rounded font-bold">
                {currentUser.unit}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#006a61]"
              />
            </div>
          </div>

          {/* Mobile Viewport Body */}
          <div className="flex-1 overflow-y-auto p-4 pb-20 bg-[#f8f9ff]">
            {renderActiveView()}
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />

          {/* Home Bar Indicator */}
          <div className="h-4 bg-white flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>

        {/* Modals in Simulator */}
        {activePixBoleto && (
          <PixModal
            boleto={activePixBoleto}
            onClose={() => setActivePixBoleto(null)}
          />
        )}
        {bookingSpace && (
          <ReservationDrawer
            space={bookingSpace}
            selectedDate={bookingDate}
            editingReservation={editingReservation}
            onClose={() => {
              setBookingSpace(null);
              setBookingDate(undefined);
              setEditingReservation(null);
            }}
          />
        )}
        {isTicketOpen && (
          <TicketModal
            onClose={() => setIsTicketOpen(false)}
          />
        )}
        {isVisitorPassOpen && (
          <VisitorPassModal
            onClose={() => setIsVisitorPassOpen(false)}
          />
        )}
      </div>
    );
  }

  // Standard Web Responsive View (Desktop Sidebar + Mobile Bottom Nav)
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex">
      {/* Desktop Sidebar (visible on lg screens) */}
      <div className="hidden lg:block">
        <Sidebar onOpenTicketModal={() => setIsTicketOpen(true)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all">
        <Header />

        {/* Dynamic Toast Message */}
        {toast && (
          <div className="fixed top-20 right-4 lg:right-8 z-[100] animate-in slide-in-from-top duration-300">
            <div className={`p-3.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 max-w-sm ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : toast.type === 'info'
                ? 'bg-[#eff4ff] border-[#006a61]/30 text-[#006a61]'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {toast.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-[#006a61] shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {renderActiveView()}
        </main>

        {/* Mobile Bottom Navigation (visible on < lg screens) */}
        <MobileBottomNav />
      </div>

      {/* Global Interactive Modals */}
      {activePixBoleto && (
        <PixModal
          boleto={activePixBoleto}
          onClose={() => setActivePixBoleto(null)}
        />
      )}

      {bookingSpace && (
        <ReservationDrawer
          space={bookingSpace}
          selectedDate={bookingDate}
          editingReservation={editingReservation}
          onClose={() => {
            setBookingSpace(null);
            setBookingDate(undefined);
            setEditingReservation(null);
          }}
        />
      )}

      {isTicketOpen && (
        <TicketModal
          onClose={() => setIsTicketOpen(false)}
        />
      )}

      {isVisitorPassOpen && (
        <VisitorPassModal
          onClose={() => setIsVisitorPassOpen(false)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <CondoProvider>
      <MainApp />
    </CondoProvider>
  );
}

export default App;
