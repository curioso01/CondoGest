import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { UserProfile, Notice } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Receipt, 
  BellPlus, 
  Settings, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Send, 
  DollarSign, 
  Building, 
  KeyRound, 
  Calendar, 
  AlertTriangle,
  Car,
  Filter,
  Check,
  X,
  Clock,
  Sparkles,
  Phone
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    notices, 
    reservations, 
    boletos, 
    tickets,
    addNotice, 
    issueBatchBoletos, 
    rules, 
    updateRules, 
    showToast,
    deviceMode,
    setActiveTab,
    globalSearch
  } = useCondo();

  const isMobile = deviceMode === 'mobile';

  const [currentAdminTab, setCurrentAdminTab] = useState<'moradores' | 'boletos' | 'avisos' | 'regras'>('moradores');

  // Moradores filter & search state
  const [residentSearch, setResidentSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState<'Todos' | 'A' | 'B' | 'C'>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Adimplente' | 'Pendente'>('Todos');

  // Modal states for Moradores
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // New Morador Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    block: 'A' as 'A' | 'B' | 'C',
    apartment: '',
    residentType: 'Proprietário' as 'Proprietário' | 'Inquilino' | 'Proprietário Não Residente',
    carModel: '',
    carPlate: '',
    parkingSpot: '',
    tagCode: ''
  });

  // Boleto Batch Generation Form State
  const [batchMonth, setBatchMonth] = useState('Junho / 2025');
  const [batchDueDate, setBatchDueDate] = useState('10/06/2025');
  const [baseFee, setBaseFee] = useState(520);
  const [reserveFundPercent, setReserveFundPercent] = useState(10);
  const [isGeneratingBoletos, setIsGeneratingBoletos] = useState(false);
  const [boletoSuccess, setBoletoSuccess] = useState(false);

  // New Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Urgente' | 'Regimento' | 'Convocação' | 'Manutenção' | 'Festas'>('Urgente');
  const [noticeAudience, setNoticeAudience] = useState('Todos os Blocos (A, B e C)');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticePush, setNoticePush] = useState(true);
  const [noticeEmail, setNoticeEmail] = useState(true);
  const [noticeMural, setNoticeMural] = useState(true);

  // Rules Edit State
  const [editableRules, setEditableRules] = useState(rules);

  // Security check: Only Síndico can access
  if (currentUser?.role !== 'sindico') {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-[#0b1c30]">Acesso Restrito ao Síndico</h2>
        <p className="text-xs text-[#76777d] mt-2 mb-6">
          Esta área é exclusiva para a administração e superuser do condomínio. Por favor, conecte-se com as credenciais de Síndico.
        </p>
      </div>
    );
  }

  // Filtered residents list
  const filteredUsers = users.filter((u) => {
    const combinedSearch = (residentSearch || '') + ' ' + (globalSearch || '');
    const matchesSearch = !combinedSearch.trim() || 
      u.name.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      u.apartment.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      (u.carPlate && u.carPlate.toLowerCase().includes(combinedSearch.toLowerCase())) ||
      (u.tagCode && u.tagCode.toLowerCase().includes(combinedSearch.toLowerCase()));

    const matchesBlock = blockFilter === 'Todos' || u.block === blockFilter;
    const matchesStatus = statusFilter === 'Todos' || u.financialStatus === statusFilter;

    return matchesSearch && matchesBlock && matchesStatus;
  });

  const filteredNotices = notices.filter(n => {
    return !globalSearch || 
      n.title.toLowerCase().includes(globalSearch.toLowerCase()) || 
      n.body.toLowerCase().includes(globalSearch.toLowerCase()) ||
      n.category.toLowerCase().includes(globalSearch.toLowerCase());
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.apartment) return;

    addUser({
      name: newUserForm.name,
      email: newUserForm.email || `${newUserForm.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: newUserForm.phone || '(11) 99999-0000',
      role: 'morador',
      unit: `Apto ${newUserForm.apartment} • Bloco ${newUserForm.block}`,
      block: newUserForm.block,
      apartment: newUserForm.apartment,
      residentType: newUserForm.residentType,
      isSindico: false,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      carModel: newUserForm.carModel || 'Não informado',
      carPlate: newUserForm.carPlate || '---',
      parkingSpots: newUserForm.parkingSpot ? [newUserForm.parkingSpot] : ['Vaga Rotativa'],
      tagCode: newUserForm.tagCode || `TAG-${Math.floor(1000 + Math.random() * 9000)}-${newUserForm.block}`,
      financialStatus: 'Adimplente'
    });

    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      block: 'A',
      apartment: '',
      residentType: 'Proprietário',
      carModel: '',
      carPlate: '',
      parkingSpot: '',
      tagCode: ''
    });
  };

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  const handleBatchEmitBoletos = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingBoletos(true);
    setTimeout(() => {
      issueBatchBoletos({
        month: batchMonth,
        dueDate: batchDueDate,
        baseFee,
        reserveFundPercent
      });
      setIsGeneratingBoletos(false);
      setBoletoSuccess(true);
      setTimeout(() => setBoletoSuccess(false), 4000);
    }, 1500);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeBody) return;

    addNotice({
      title: noticeTitle,
      category: noticeCategory,
      targetAudience: noticeAudience,
      body: noticeBody,
      channels: {
        push: noticePush,
        email: noticeEmail,
        mural: noticeMural
      }
    });

    setNoticeTitle('');
    setNoticeBody('');
    
    // Auto redirect back to the Mural to see the new notice
    setActiveTab('inicio');
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateRules(editableRules);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner do Síndico */}
      <div className="bg-[#0b1c30] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#006a61] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Superuser Síndico Ativo
            </span>
            <span className="text-xs text-slate-400">Residencial Solar das Palmeiras • Gestão 2024/2025</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-white">
            Painel Administrativo do Síndico
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Controle total de moradores, emissão de cobranças, comunicados e regras do condomínio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex items-center gap-2.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#006a61]"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">{currentUser.name}</span>
              <span className="text-[11px] text-[#86f2e4]">{currentUser.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores Principais (Cards) */}
      <div className={`grid grid-cols-2 ${!isMobile ? 'lg:grid-cols-4' : ''} gap-4`}>
        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-semibold text-[#76777d]">Total de Unidades</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0b1c30]">84</span>
            <span className="text-xs font-bold text-emerald-600">100% Ocupado</span>
          </div>
          <p className="text-[11px] text-[#76777d] mt-1">3 Blocos (A, B e C)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-semibold text-[#76777d]">Taxa de Inadimplência</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0b1c30]">2.3%</span>
            <span className="text-xs font-bold text-emerald-600">-0.8%</span>
          </div>
          <p className="text-[11px] text-[#76777d] mt-1">Apenas 2 apts pendentes</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-semibold text-[#76777d]">Reservas no Mês</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0b1c30]">28</span>
            <span className="text-xs font-bold text-[#006a61]">+R$ 4.200</span>
          </div>
          <p className="text-[11px] text-[#76777d] mt-1">Arrecadação de lazer</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-semibold text-[#76777d]">Boletos Emitidos</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0b1c30]">84 / 84</span>
            <span className="text-xs font-bold text-emerald-600">100%</span>
          </div>
          <p className="text-[11px] text-[#76777d] mt-1">Competência atual</p>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#eff4ff] p-1.5 rounded-2xl border border-[#cbd5e1]/40 overflow-x-auto">
        {[
          { id: 'moradores', label: 'Cadastrar & Editar Moradores', icon: Users },
          { id: 'boletos', label: 'Emissão de Boletos em Lote', icon: Receipt },
          { id: 'avisos', label: 'Publicar Aviso / Comunicado', icon: BellPlus },
          { id: 'regras', label: 'Configurações de Regras', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'text-[#45464d] hover:bg-white hover:text-[#0b1c30]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CADASTRO E EDIÇÃO DE MORADORES */}
      {currentAdminTab === 'moradores' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-base text-[#0b1c30]">
                Gestão Cadastral dos Condôminos
              </h2>
              <p className="text-xs text-[#76777d]">
                Cadastro de proprietários e inquilinos, veículos, vagas e tags de acesso
              </p>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 bg-[#006a61] hover:bg-[#005a52] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Morador</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 bg-[#eff4ff] p-3 rounded-xl border border-[#cbd5e1]/40">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" />
              <input
                type="text"
                value={residentSearch}
                onChange={(e) => setResidentSearch(e.target.value)}
                placeholder="Buscar por nome, apto, placa do veículo ou tag..."
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg text-xs text-[#0b1c30] border border-[#cbd5e1]/60 focus:outline-none focus:ring-2 focus:ring-[#006a61]/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#45464d]">Bloco:</span>
              {(['Todos', 'A', 'B', 'C'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBlockFilter(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    blockFilter === b
                      ? 'bg-[#006a61] text-white'
                      : 'bg-white text-[#45464d] hover:bg-slate-100 border border-[#cbd5e1]/60'
                  }`}
                >
                  {b === 'Todos' ? 'Todos' : `Bloco ${b}`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#45464d]">Status:</span>
              {(['Todos', 'Adimplente', 'Pendente'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === s
                      ? 'bg-[#006a61] text-white'
                      : 'bg-white text-[#45464d] hover:bg-slate-100 border border-[#cbd5e1]/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Residents List */}
          <div className="space-y-3">
            {filteredUsers.map((resident) => (
              <div
                key={resident.id}
                className={`p-4 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#006a61]/40 transition-all flex flex-col ${!isMobile ? 'lg:flex-row lg:items-center' : ''} justify-between gap-4`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <img
                    src={resident.avatarUrl}
                    alt={resident.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#006a61]/30 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#0b1c30]">{resident.name}</span>
                      {resident.isSindico && (
                        <span className="bg-[#006a61] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                          Síndico Geral
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        resident.financialStatus === 'Adimplente'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {resident.financialStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#76777d]">
                      <span className="font-bold text-[#006a61]">{resident.unit}</span>
                      <span>•</span>
                      <span>{resident.residentType}</span>
                      <span>•</span>
                      <span>{resident.phone}</span>
                      <span>•</span>
                      <span>{resident.email}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#45464d]">
                      <span className="flex items-center gap-1 bg-[#eff4ff] px-2 py-0.5 rounded-md">
                        <Car className="w-3 h-3 text-[#006a61]" />
                        {resident.carModel} ({resident.carPlate}) • {resident.parkingSpots.join(', ')}
                      </span>
                      <span className="flex items-center gap-1 bg-[#eff4ff] px-2 py-0.5 rounded-md">
                        <KeyRound className="w-3 h-3 text-[#006a61]" />
                        TAG: {resident.tagCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className={`flex items-center gap-2 self-end ${!isMobile ? 'lg:self-center' : ''}`}>
                  {resident.financialStatus === 'Pendente' && (
                    <button
                      onClick={() => showToast(`Notificação de cobrança amigável enviada para ${resident.email}`, 'info')}
                      className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      Cobrança Amigável
                    </button>
                  )}

                  <button
                    onClick={() => setEditingUser(resident)}
                    className="py-1.5 px-3 bg-[#eff4ff] hover:bg-[#dfeafc] text-[#006a61] border border-[#cbd5e1]/50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  {!resident.isSindico && (
                    <button
                      onClick={() => {
                        if (confirm(`Deseja realmente remover ${resident.name} do condomínio?`)) {
                          deleteUser(resident.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir Morador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EMISSÃO DE BOLETOS EM LOTE */}
      {currentAdminTab === 'boletos' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-5">
          <div>
            <h2 className="font-extrabold text-base text-[#0b1c30]">
              Faturamento & Emissão de Boletos em Lote
            </h2>
            <p className="text-xs text-[#76777d]">
              Geração automática da taxa condominial para as 84 unidades, com inclusão de despesas extras e envio via PIX e e-mail
            </p>
          </div>

          {boletoSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Lote emitido e disparado com sucesso!</p>
                <p className="text-[11px] text-emerald-700">84 e-mails enviados com os boletos em anexo e notificações push emitidas no app.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleBatchEmitBoletos} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Mês de Referência (Competência)
                </label>
                <input
                  type="text"
                  required
                  value={batchMonth}
                  onChange={(e) => setBatchMonth(e.target.value)}
                  placeholder="Ex: Junho / 2025"
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Data de Vencimento
                </label>
                <input
                  type="text"
                  required
                  value={batchDueDate}
                  onChange={(e) => setBatchDueDate(e.target.value)}
                  placeholder="Ex: 10/06/2025"
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Cota Ordinária Base (Por Apartamento)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#76777d]">R$</span>
                  <input
                    type="number"
                    required
                    value={baseFee}
                    onChange={(e) => setBaseFee(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Fundo de Reserva Mandatório (%)
                </label>
                <input
                  type="number"
                  required
                  value={reserveFundPercent}
                  onChange={(e) => setReserveFundPercent(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>
            </div>

            {/* Preview Box */}
            <div className="bg-[#eff4ff] p-5 rounded-2xl border border-[#cbd5e1]/50 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#006a61] uppercase tracking-wide">
                  Resumo do Faturamento em Lote
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Unidades Faturadas:</span>
                    <span className="font-bold text-[#0b1c30]">84 Apartamentos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Cota Ordinária Individual:</span>
                    <span className="font-bold text-[#0b1c30]">R$ {baseFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Fundo de Reserva (10%):</span>
                    <span className="font-bold text-[#0b1c30]">R$ {((baseFee * reserveFundPercent) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#006a61] font-bold">
                    <span>Água e Saneamento:</span>
                    <span>R$ 0,00 (100% Incluso)</span>
                  </div>
                  <div className="pt-2 border-t border-[#cbd5e1] flex justify-between font-extrabold text-sm text-[#0b1c30]">
                    <span>Previsão de Arrecadação:</span>
                    <span>R$ {((baseFee + (baseFee * reserveFundPercent) / 100) * 84).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#cbd5e1]/40 text-[11px] text-[#45464d] space-y-1">
                  <p className="font-bold text-[#0b1c30]">Canais de Envio Ativados:</p>
                  <p>✓ E-mail com PDF autenticado e código de barras</p>
                  <p>✓ Push Notification no App com QR Code PIX</p>
                  <p>✓ Atualização em tempo real na aba Financeiro</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingBoletos}
                className="w-full mt-4 py-3 bg-[#006a61] hover:bg-[#005a52] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingBoletos ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processando e Disparando 84 Boletos...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gerar e Disparar Boletos para Todos os Moradores</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PUBLICAR AVISO / COMUNICADO */}
      {currentAdminTab === 'avisos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="font-extrabold text-base text-[#0b1c30]">Publicar Novo Comunicado Oficial</h2>
              <p className="text-xs text-[#76777d]">
                O aviso aparecerá imediatamente no mural de todos os moradores
              </p>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Título do Comunicado
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Ex: Manutenção Programada das Bombas da Piscina"
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                    Categoria
                  </label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                  >
                    <option value="Urgente">🚨 Urgente</option>
                    <option value="Manutenção">🔧 Manutenção</option>
                    <option value="Regimento">📜 Regimento</option>
                    <option value="Convocação">🏛️ Convocação</option>
                    <option value="Festas">🎉 Confraternização</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                    Público-Alvo
                  </label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                  >
                    <option value="Todos os Blocos (A, B e C)">Todos os Blocos (A, B e C)</option>
                    <option value="Apenas Bloco A">Apenas Bloco A</option>
                    <option value="Apenas Bloco B">Apenas Bloco B</option>
                    <option value="Apenas Bloco C">Apenas Bloco C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Texto Completo do Comunicado
                </label>
                <textarea
                  rows={5}
                  required
                  value={noticeBody}
                  onChange={(e) => setNoticeBody(e.target.value)}
                  placeholder="Escreva os detalhes, datas, orientações regimentais e contatos de suporte..."
                  className="w-full p-3 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] resize-none"
                />
              </div>

              {/* Channels Checkboxes */}
              <div className="flex items-center gap-4 text-xs font-semibold text-[#45464d]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticePush}
                    onChange={(e) => setNoticePush(e.target.checked)}
                    className="rounded text-[#006a61]"
                  />
                  <span>Push no App</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticeEmail}
                    onChange={(e) => setNoticeEmail(e.target.checked)}
                    className="rounded text-[#006a61]"
                  />
                  <span>E-mail Geral</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticeMural}
                    onChange={(e) => setNoticeMural(e.target.checked)}
                    className="rounded text-[#006a61]"
                  />
                  <span>Fixar no Mural</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#006a61] hover:bg-[#005a52] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publicar Comunicado Imediatamente</span>
              </button>
            </form>
          </div>

          {/* Active Notices List */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <h3 className="font-bold text-sm text-[#0b1c30]">Comunicados Publicados Ativos</h3>
              <span className="text-xs text-[#76777d]">{notices.length} avisos no mural</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredNotices.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#cbd5e1]/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#006a61] text-white">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-[#76777d]">{n.time}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#0b1c30]">{n.title}</h4>
                  <p className="text-[11px] text-[#45464d] line-clamp-2">{n.body}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#76777d]">
                    <span>{n.targetAudience}</span>
                    <span className="font-bold text-[#006a61]">{n.readPercentage}% leram</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURAÇÕES DE REGRAS DO CONDOMÍNIO */}
      {currentAdminTab === 'regras' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 shadow-xs space-y-5">
          <div>
            <h2 className="font-extrabold text-base text-[#0b1c30]">
              Parâmetros Operacionais & Regimento Interno
            </h2>
            <p className="text-xs text-[#76777d]">
              Ajuste limites regimentais, horários de silêncio e taxas de reservas de áreas comuns
            </p>
          </div>

          <form onSubmit={handleSaveRules} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Início do Horário de Silêncio
                </label>
                <input
                  type="text"
                  value={editableRules.silenceStart}
                  onChange={(e) => setEditableRules({ ...editableRules, silenceStart: e.target.value })}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Término do Horário de Silêncio
                </label>
                <input
                  type="text"
                  value={editableRules.silenceEnd}
                  onChange={(e) => setEditableRules({ ...editableRules, silenceEnd: e.target.value })}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Taxa de Salão de Festas (&gt;15 Convidados)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#76777d]">R$</span>
                  <input
                    type="number"
                    value={editableRules.ballroomFee}
                    onChange={(e) => setEditableRules({ ...editableRules, ballroomFee: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Capacidade Máxima do Salão de Festas
                </label>
                <input
                  type="number"
                  value={editableRules.ballroomMaxGuests}
                  onChange={(e) => setEditableRules({ ...editableRules, ballroomMaxGuests: parseInt(e.target.value, 10) || 50 })}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Horário de Obras & Reformas (Seg a Sex)
                </label>
                <input
                  type="text"
                  value={editableRules.worksWeekdayHours}
                  onChange={(e) => setEditableRules({ ...editableRules, worksWeekdayHours: e.target.value })}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">
                  Regra para Vagas de Visitantes
                </label>
                <input
                  type="text"
                  value={editableRules.visitorParkingMaxHours}
                  onChange={(e) => setEditableRules({ ...editableRules, visitorParkingMaxHours: e.target.value })}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="py-3 px-6 bg-[#006a61] hover:bg-[#005a52] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar e Aplicar Alterações no Regimento</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Cadastrar Novo Morador */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]">
            <div className="bg-[#0b1c30] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#86f2e4]" />
                <h3 className="font-bold text-sm">Cadastrar Novo Morador</h3>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Ex: Ana Carolina Silva"
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Bloco</label>
                  <select
                    value={newUserForm.block}
                    onChange={(e) => setNewUserForm({ ...newUserForm, block: e.target.value as any })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  >
                    <option value="A">Bloco A</option>
                    <option value="B">Bloco B</option>
                    <option value="C">Bloco C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Apartamento</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.apartment}
                    onChange={(e) => setNewUserForm({ ...newUserForm, apartment: e.target.value })}
                    placeholder="Ex: 304"
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Telefone / Celular</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="(11) 98888-7777"
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Vínculo</label>
                  <select
                    value={newUserForm.residentType}
                    onChange={(e) => setNewUserForm({ ...newUserForm, residentType: e.target.value as any })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  >
                    <option value="Proprietário">Proprietário</option>
                    <option value="Inquilino">Inquilino</option>
                    <option value="Proprietário Não Residente">Não Residente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Veículo (Modelo)</label>
                  <input
                    type="text"
                    value={newUserForm.carModel}
                    onChange={(e) => setNewUserForm({ ...newUserForm, carModel: e.target.value })}
                    placeholder="Ex: Renegade Cinza"
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Placa do Carro</label>
                  <input
                    type="text"
                    value={newUserForm.carPlate}
                    onChange={(e) => setNewUserForm({ ...newUserForm, carPlate: e.target.value })}
                    placeholder="ABC-1234"
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#cbd5e1] rounded-xl text-xs font-bold text-[#45464d]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006a61] hover:bg-[#005a52] text-white rounded-xl text-xs font-bold"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Morador Existente */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]">
            <div className="bg-[#0b1c30] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#86f2e4]" />
                <h3 className="font-bold text-sm">Editar Cadastro • {editingUser.name}</h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Telefone</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">E-mail</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Veículo</label>
                  <input
                    type="text"
                    value={editingUser.carModel || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, carModel: e.target.value })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Placa</label>
                  <input
                    type="text"
                    value={editingUser.carPlate || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, carPlate: e.target.value })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">TAG de Acesso</label>
                  <input
                    type="text"
                    value={editingUser.tagCode}
                    onChange={(e) => setEditingUser({ ...editingUser, tagCode: e.target.value })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wide">Situação Financeira</label>
                  <select
                    value={editingUser.financialStatus}
                    onChange={(e) => setEditingUser({ ...editingUser, financialStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#cbd5e1]/50 rounded-xl text-xs text-[#0b1c30]"
                  >
                    <option value="Adimplente">Adimplente</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 border border-[#cbd5e1] rounded-xl text-xs font-bold text-[#45464d]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006a61] hover:bg-[#005a52] text-white rounded-xl text-xs font-bold"
                >
                  Atualizar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
