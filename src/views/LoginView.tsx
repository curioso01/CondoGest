import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { LOGO_URL } from '../data/initialData';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  Building2, 
  CheckCircle2,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { users, loginUser, showToast } = useCondo();
  const [selectedRole, setSelectedRole] = useState<'sindico' | 'morador'>('sindico');
  const [email, setEmail] = useState('carlos.mendes@email.com');
  const [password, setPassword] = useState('••••••••');

  const handleSelectRoleTab = (role: 'sindico' | 'morador') => {
    setSelectedRole(role);
    if (role === 'sindico') {
      setEmail('carlos.mendes@email.com');
      setPassword('••••••••');
    } else {
      setEmail('mariana.alb@gmail.com');
      setPassword('••••••••');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'sindico') {
      const sindicoUser = users.find(u => u.role === 'sindico') || users[0];
      loginUser(sindicoUser);
    } else {
      const moradorUser = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users.find(u => u.role === 'morador') || users[1];
      loginUser(moradorUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Background Decorative Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#006a61]/15 to-[#86f2e4]/25 blur-3xl rounded-full" />
      </div>

      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#e2e8f0] shadow-xl overflow-hidden">
        {/* Brand Top Header */}
        <div className="bg-[#0b1c30] text-white p-6 sm:p-7 flex flex-col items-center text-center relative">
          <div className="w-16 h-16 rounded-2xl shadow-xl mb-3 flex items-center justify-center border border-[#86f2e4]/40 overflow-hidden">
            <img
              src={LOGO_URL}
              alt="CondoGest"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
            CondoGest
            <span className="bg-[#006a61] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Residencial
            </span>
          </h1>
          <p className="text-xs text-[#86f2e4] mt-0.5 font-semibold">
            Condomínio Solar das Palmeiras (84 Apts)
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex bg-[#eff4ff] p-1 rounded-2xl border border-[#cbd5e1]/40">
            <button
              type="button"
              onClick={() => handleSelectRoleTab('sindico')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'sindico'
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Acesso Síndico (Superuser)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRoleTab('morador')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'morador'
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Acesso Morador</span>
            </button>
          </div>

          {/* Context Explanatory Notice */}
          <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
            selectedRole === 'sindico'
              ? 'bg-[#eff4ff] border-[#006a61]/30 text-[#006a61]'
              : 'bg-[#eff4ff] border-[#cbd5e1]/50 text-[#3f465c]'
          }`}>
            {selectedRole === 'sindico' ? (
              <span className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Modo Superuser:</strong> Acesso irrestrito a emissão de boletos em lote, avisos gerais, cadastro/edição de moradores e regras regimentais.
                </span>
              </span>
            ) : (
              <span className="flex items-start gap-2">
                <Building2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Portal do Morador:</strong> Acesso à cota condominial, pagamento instantâneo via PIX, agendamento de áreas comuns e mural.
                </span>
              </span>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
                E-mail ou Apartamento
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com ou Apto 402"
                  className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wide">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#006a61] hover:bg-[#005a52] active:scale-[0.99] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Entrar no CondoGest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Fast-Click Demo Profiles */}
          <div className="pt-2 border-t border-[#eff4ff]">
            <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block mb-2 text-center">
              Login Rápido de Teste (1 Clique):
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  const sindico = users.find(u => u.role === 'sindico') || users[0];
                  loginUser(sindico);
                }}
                className="w-full p-2.5 rounded-xl border border-[#006a61]/30 bg-[#eff4ff] hover:bg-[#dfeafc] transition-all flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#006a61] text-white flex items-center justify-center font-bold text-xs">
                    CE
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#0b1c30] block leading-tight">
                      Carlos Eduardo (Síndico Geral)
                    </span>
                    <span className="text-[10px] text-[#006a61] font-bold">
                      Superuser • Todas as Funções Administrativas
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#006a61] font-extrabold">Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const morador = users.find(u => u.id === 'user-morador-1') || users[1];
                  loginUser(morador);
                }}
                className="w-full p-2.5 rounded-xl border border-[#cbd5e1]/40 bg-white hover:bg-slate-50 transition-all flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-[#0b1c30] flex items-center justify-center font-bold text-xs">
                    MA
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#0b1c30] block leading-tight">
                      Mariana Albuquerque (Moradora)
                    </span>
                    <span className="text-[10px] text-[#76777d]">
                      Apto 102 • Bloco A (Inquilina)
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#76777d] font-bold">Entrar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="bg-[#fcfdff] p-4 border-t border-[#eff4ff] text-center">
          <p className="text-[11px] text-[#76777d]">
            Portaria 24h & Emergência Condominial: <strong>Ramal 94</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
