import React, { useState, useEffect } from 'react';
import {
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Send,
  Plus,
  Trash2,
  DollarSign,
  Gauge,
  Fuel,
  User,
  Phone,
  Car,
  Wrench,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  Printer,
  ChevronRight
} from 'lucide-react';
import { WorkOrder, Appointment, WorkOrderItem } from '../types';

export default function WorkOrderSystem() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active view states
  const [activeWoId, setActiveWoId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New & Editing WorkOrder Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [woStatus, setWoStatus] = useState<WorkOrder['status']>('Orçamento Rascunho');
  const [discount, setDiscount] = useState<number>(0);

  // Parts / Labor lists
  const [partsList, setPartsList] = useState<WorkOrderItem[]>([]);
  const [laborList, setLaborList] = useState<WorkOrderItem[]>([]);

  // Individual Part Input
  const [newPartName, setNewPartName] = useState('');
  const [newPartPrice, setNewPartPrice] = useState('');

  // Individual Labor Input
  const [newLaborName, setNewLaborName] = useState('');
  const [newLaborPrice, setNewLaborPrice] = useState('');

  // CheckIn variables
  const [checkInKm, setCheckInKm] = useState('');
  const [checkInFuel, setCheckInFuel] = useState<'Vazio' | '1/4' | '1/2' | '3/4' | 'Cheio'>('1/2');
  const [checkInNotes, setCheckInNotes] = useState('');
  const [checklistStepe, setChecklistStepe] = useState(true);
  const [checklistExtintor, setChecklistExtintor] = useState(true);
  const [checklistMacaco, setChecklistMacaco] = useState(true);
  const [checklistSom, setChecklistSom] = useState(true);
  const [checklistRiscos, setChecklistRiscos] = useState(false);

  // CheckOut variables
  const [checkOutTestedBy, setCheckOutTestedBy] = useState('');
  const [checkOutNotes, setCheckOutNotes] = useState('');
  const [warrantyDays, setWarrantyDays] = useState<number>(90);

  // Load clients and work orders from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptsRes, woRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/work-orders')
      ]);

      if (apptsRes.ok) {
        const apptsData = await apptsRes.json();
        setAppointments(apptsData);
      }
      if (woRes.ok) {
        const woData = await woRes.json();
        setWorkOrders(woData);
        // Default select first work order if exists and none is selected
        if (woData.length > 0 && !activeWoId) {
          setActiveWoId(woData[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Falha ao sincronizar dados com o servidor de banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync edit mode fields when active activeWoId changes
  useEffect(() => {
    if (activeWoId) {
      const wo = workOrders.find(w => w.id === activeWoId);
      if (wo) {
        setClientName(wo.clientName);
        setClientPhone(wo.clientPhone);
        setCarModel(wo.carModel);
        setCarYear(wo.carYear);
        setLicensePlate(wo.licensePlate);
        setWoStatus(wo.status);
        setDiscount(wo.discount || 0);
        setPartsList(wo.parts || []);
        setLaborList(wo.labor || []);

        setCheckInKm(wo.checkInKm || '');
        setCheckInFuel((wo.checkInFuelLevel as any) || '1/2');
        setCheckInNotes(wo.checkInNotes || '');
        setChecklistStepe(wo.checkInChecklist?.stepe !== false);
        setChecklistExtintor(wo.checkInChecklist?.extintor !== false);
        setChecklistMacaco(wo.checkInChecklist?.macaco !== false);
        setChecklistSom(wo.checkInChecklist?.som !== false);
        setChecklistRiscos(wo.checkInChecklist?.riscos === true);

        setCheckOutTestedBy(wo.checkOutTestedBy || '');
        setCheckOutNotes(wo.checkOutNotes || '');
        setWarrantyDays(wo.warrantyDays || 90);
        setIsCreatingNew(false);
      }
    }
  }, [activeWoId, workOrders]);

  // Import registered appointment info to pre-fill the form
  const handleImportAppointment = (appt: Appointment) => {
    setClientName(appt.name);
    setClientPhone(appt.phone);
    setCarModel(appt.carModel);
    setCarYear(appt.carYear);
    setLicensePlate('');
    setSuccessMsg(`Dados do cliente "${appt.name}" importados com sucesso!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Add Item actions
  const handleAddPart = () => {
    if (!newPartName || !newPartPrice) return;
    const item: WorkOrderItem = {
      id: 'PT-' + Math.floor(Math.random() * 10000),
      name: newPartName,
      price: parseFloat(newPartPrice) || 0
    };
    setPartsList([...partsList, item]);
    setNewPartName('');
    setNewPartPrice('');
  };

  const handleRemovePart = (id: string) => {
    setPartsList(partsList.filter(p => p.id !== id));
  };

  const handleAddLabor = () => {
    if (!newLaborName || !newLaborPrice) return;
    const item: WorkOrderItem = {
      id: 'LB-' + Math.floor(Math.random() * 10000),
      name: newLaborName,
      price: parseFloat(newLaborPrice) || 0
    };
    setLaborList([...laborList, item]);
    setNewLaborName('');
    setNewLaborPrice('');
  };

  const handleRemoveLabor = (id: string) => {
    setLaborList(laborList.filter(l => l.id !== id));
  };

  // Calculate dynamic pricing
  const partsSum = partsList.reduce((acc, curr) => acc + curr.price, 0);
  const laborSum = laborList.reduce((acc, curr) => acc + curr.price, 0);
  const rawTotal = partsSum + laborSum;
  const grandTotal = Math.max(0, rawTotal - discount);

  // Trigger Create/Reset state
  const handleTriggerNewForm = () => {
    setIsCreatingNew(true);
    setActiveWoId(null);
    setClientName('');
    setClientPhone('');
    setCarModel('');
    setCarYear('');
    setLicensePlate('');
    setWoStatus('Orçamento Rascunho');
    setPartsList([]);
    setLaborList([]);
    setDiscount(0);
    setCheckInKm('');
    setCheckInFuel('1/2');
    setCheckInNotes('');
    setChecklistStepe(true);
    setChecklistExtintor(true);
    setChecklistMacaco(true);
    setChecklistSom(true);
    setChecklistRiscos(false);
    setCheckOutTestedBy('');
    setCheckOutNotes('');
    setWarrantyDays(90);
  };

  // Save changes to API (POST or PUT)
  const handleSaveOrUpdateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !carModel) {
      setErrorMsg('Nome do cliente, celular e marca/modelo do veículo são obrigatórios.');
      return;
    }

    const payload = {
      clientName,
      clientPhone,
      carModel,
      carYear,
      licensePlate,
      status: woStatus,
      parts: partsList,
      labor: laborList,
      discount,
      totalPrice: grandTotal,
      checkInDate: (woStatus !== 'Orçamento Rascunho' && woStatus !== 'Orçamento Pendente') ? new Date().toISOString().split('T')[0] : undefined,
      checkInKm,
      checkInFuelLevel: checkInFuel,
      checkInNotes,
      checkInChecklist: {
        stepe: checklistStepe,
        extintor: checklistExtintor,
        macaco: checklistMacaco,
        som: checklistSom,
        riscos: checklistRiscos
      },
      checkOutDate: (woStatus === 'Pronto para Retirada' || woStatus === 'Entregue') ? new Date().toISOString().split('T')[0] : undefined,
      checkOutTestedBy,
      checkOutNotes,
      warrantyDays
    };

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let response;
      if (isCreatingNew) {
        response = await fetch('/api/work-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`/api/work-orders/${activeWoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        const savedWO = await response.json();
        setSuccessMsg(isCreatingNew ? 'Nova ordem de serviço cadastrada com êxito!' : 'Ordem de serviço atualizada com sucesso!');
        setIsCreatingNew(false);
        await fetchData();
        setActiveWoId(savedWO.id);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Erro na requisição.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Não foi possível registrar as alterações de ordem de serviço no servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Helper code to format phone cleanly for WhatsApp (sanitizing digits)
  const sanitizePhoneForWa = (rawPhone: string) => {
    let digits = rawPhone.replace(/\D/g, '');
    // If lacks country code, default Brazil's prefix "55"
    if (digits.length <= 11) {
      digits = '55' + digits;
    }
    return digits;
  };

  // WHATSAPP GENERATION PLUGINS
  const handleSendWhatsApp = (type: 'budget' | 'checkin' | 'checkout') => {
    const selectedWO = workOrders.find(w => w.id === (isCreatingNew ? null : activeWoId));
    
    // Fallback context if client is editing but hasn't saved yet
    const name = clientName;
    const phone = clientPhone;
    const carDetails = `${carModel} ${carYear ? '(' + carYear + ')' : ''}`;
    const plate = licensePlate || 'S/Placa';
    const idCode = selectedWO ? selectedWO.id : 'NOVA-OS';

    if (!name || !phone) {
      alert('Preencha pelo menos o Nome e Telefone do cliente para prosseguir!');
      return;
    }

    let messageText = '';

    if (type === 'budget') {
      const partsStr = partsList.map(p => `•   ${p.name}: R$ ${p.price.toFixed(2)}`).join('\n') || 'Nenhuma peça cadastrada';
      const laborStr = laborList.map(l => `•   ${l.name}: R$ ${l.price.toFixed(2)}`).join('\n') || 'Nenhuma mão-de-obra cadastrada';
      
      messageText = `⚡ *ORÇAMENTO DA OFICINA AUTOMOTIVA FAÍSCA* ⚡
      
Olá, *${name}*! Segue o detalhamento técnico do orçamento para o seu veículo *${carDetails}* (${plate}):

🛠️ *Serviços & Mão de Obra:*
${laborStr}

📦 *Peças & Componentes:*
${partsStr}

----------------------------------------
🔹 *Valor Bruto:* R$ ${rawTotal.toFixed(2)}
🎁 *Desconto Concedido:* R$ ${discount.toFixed(2)}
💰 *VALOR FINAL LÍQUIDO:* R$ ${grandTotal.toFixed(2)}

Gostaria de aprovar a realização deste serviço? Respondendo sim, nossa equipe já inicia o reparo express!
_Elétrica e Diagnósticos Avançados Faísca_ 🏍️🚗`;
    } 
    
    else if (type === 'checkin') {
      messageText = `📝 *CONFIRMAÇÃO DE CHECK-IN - OFICINA FAÍSCA* 📝

Olá, *${name}*! Confirmamos a entrada oficial do seu veículo *${carDetails}* (${plate}) na nossa oficina para análise eletromecânica:

🕒 *Data da entrada:* ${new Date().toLocaleDateString('pt-BR')}
📊 *Km registrado:* ${checkInKm || 'Não registrado'}
⛽ *Nível de combustível:* ${checkInFuel}
🗒️ *Observações de Entrada:* ${checkInNotes || 'Sem observações adicionais'}

🛠️ *Checklist de Segurança & Estado:*
•   Estepe: ${checklistStepe ? '✅ OK' : '❌ Não' }
•   Extintor de Incêndio: ${checklistExtintor ? '✅ OK' : '❌ Não' }
•   Macaco & Ferramentas: ${checklistMacaco ? '✅ OK' : '❌ Não' }
•   Aparelho de Som: ${checklistSom ? '✅ OK' : '❌ Não' }
•   Detalhes de Escoriação/Riscos: ${checklistRiscos ? '⚠️ Sim (Registrado)' : '✅ Sem riscos visíveis' }

Sua Ordem de Serviço foi aberta sob o código: *${idCode}*. Você receberá atualizações do andamento diretamente por aqui!`;
    } 
    
    else if (type === 'checkout') {
      messageText = `🏁 *CONFIRMAÇÃO DE CHECK-OUT & ENTREGA - OFICINA FAÍSCA* 🏁

Olá, *${name}*! Comunicamos que o seu veículo *${carDetails}* (${plate}) está pronto e revisado!

👨‍🔧 *Status:* Pronto para entrega / Entregue
🚀 *Sistemas Verificados:* Sistemas Elétricos, Alternador e Sensores OBD.
🏎️ *Testado na via por:* ${checkOutTestedBy || 'Nosso Engenheiro Chefe'}
🗒️ *Laudo Final:* ${checkOutNotes || 'Veículo entregue em perfeito estado de funcionamento'}
🛠️ *Garantia Concedida:* ${warrantyDays} dias em peças e mão-de-obra.

💰 *Total do Serviço Realizado:* R$ ${grandTotal.toFixed(2)}

Nossa equipe agradece imensamente a confiança! Estamos prontos para a próxima partida! ⚡🚗`;
    }

    const waPhone = sanitizePhoneForWa(phone);
    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodedText}`;

    // Target link execution
    window.open(waUrl, '_blank');
  };

  const filteredOrders = workOrders.filter(wo => {
    const matchesSearch = 
      wo.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.clientPhone.includes(searchTerm);

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && wo.status === filterStatus;
  });

  return (
    <div className="bg-neutral-900/60 border border-zinc-800 rounded-3xl p-5 md:p-8 backdrop-blur-xl shadow-xl space-y-6" id="workorder-billing-module">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-805 pb-5 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Módulo Administrativo & Controle Interno
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 mt-2">
            Orçamentos, Check-In & Check-Out
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Gere, aprove e envie documentações de vistorias técnicas direto para o WhatsApp do cliente cadastrado.
          </p>
        </div>

        <button
          onClick={handleTriggerNewForm}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 text-xs font-bold font-mono tracking-wider uppercase rounded-xl flex items-center gap-1.5 cursor-pointer hover:opacity-95 transition-all w-full md:w-auto text-center justify-center font-black"
        >
          <Plus className="h-4 w-4" />
          Gerar Novo Orçamento / OS
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="workorder-workspace-grid">
        
        {/* LIST / SELECTOR LEFT RAIL */}
        <div className="lg:col-span-4 space-y-4" id="workorder-sidebar-rail">
          {/* Diagnostic filters & seek bar */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Pesquisar cliente, OS ou carro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-200 placeholder-zinc-650 tracking-wider"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-[10px] p-2 bg-neutral-950/70 border border-zinc-800 rounded-lg text-zinc-400 outline-none cursor-pointer"
              >
                <option value="all">Sitos / Status (Todos)</option>
                <option value="Orçamento Rascunho">Orçamento Rascunho</option>
                <option value="Orçamento Pendente">Orçamento Pendente</option>
                <option value="Orçamento Aprovado">Orçamento Aprovado</option>
                <option value="Check-In Realizado">Check-In Realizado</option>
                <option value="Em Serviço">Em Serviço</option>
                <option value="Pronto para Retirada">Pronto para Retirada</option>
                <option value="Entregue">Entregue</option>
                <option value="Rejeitado">Rejeitado</option>
              </select>
              
              <button
                type="button"
                onClick={fetchData}
                title="Sincronizar"
                className="p-2 border border-zinc-800 hover:border-zinc-705 bg-neutral-950 rounded-lg text-zinc-400 hover:text-amber-500 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick List of Ordens de Serviço */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1" id="orders-rail-scroll-box">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 bg-neutral-950/40 rounded-xl border border-zinc-850/60 text-zinc-500 text-xs font-mono">
                Nenhum orçamento / OS encontrado.
              </div>
            ) : (
              filteredOrders.map((wo) => {
                const isActive = wo.id === activeWoId;
                const statusColors: Record<string, string> = {
                  'Orçamento Rascunho': 'bg-zinc-800/40 text-zinc-400',
                  'Orçamento Pendente': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                  'Orçamento Aprovado': 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
                  'Check-In Realizado': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                  'Em Serviço': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
                  'Pronto para Retirada': 'bg-teal-500/10 text-teal-400 border border-teal-500/10',
                  'Entregue': 'bg-zinc-700/10 text-zinc-300 border border-zinc-700/20',
                  'Rejeitado': 'bg-red-500/10 text-red-500 border border-red-500/20'
                };
                return (
                  <button
                    key={wo.id}
                    onClick={() => {
                      setActiveWoId(wo.id);
                      setIsCreatingNew(false);
                    }}
                    type="button"
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-amber-500/10 border-amber-500/70 shadow-[0_4px_12px_-4px_rgba(245,158,11,0.25)]' 
                        : 'bg-neutral-950 border-zinc-850 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-500">{wo.id}</span>
                      <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded font-bold uppercase ${statusColors[wo.status] || 'bg-zinc-800 text-zinc-200'}`}>
                        {wo.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-zinc-200 mt-2 truncate font-sans">{wo.clientName}</h4>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-sans">🚗 {wo.carModel}</p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-900/60 text-[10px] font-mono text-zinc-500">
                      <span>Placa: <strong className="text-zinc-300">{wo.licensePlate || 'S/Placa'}</strong></span>
                      <span className="text-amber-500 font-extrabold text-xs">R$ {wo.totalPrice?.toFixed(2)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* REGISTERED SITE CLIENTS LIST WIDGET */}
          <div className="bg-neutral-950/80 border border-zinc-850 rounded-2xl p-4 space-y-3" id="registered-site-users-panel">
            <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Importar Clientes Cadastrados
            </h4>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Selecione um cliente que agendou vaga no site para carregar seus dados cadastrais instantaneamente e iniciar o Orçamento:
            </p>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 select-none">
              {appointments.length === 0 ? (
                <div className="text-center py-4 text-[10px] text-zinc-600 font-mono">
                  Lista de cadastros vazia no momento.
                </div>
              ) : (
                appointments.map((appt) => (
                  <button
                    key={appt.id}
                    onClick={() => handleImportAppointment(appt)}
                    type="button"
                    className="w-full text-left p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-zinc-850 hover:border-zinc-750 flex items-center justify-between text-[11px] font-medium transition-colors cursor-pointer group"
                  >
                    <div className="truncate pr-1">
                      <span className="text-zinc-300 font-bold block truncate">{appt.name}</span>
                      <span className="text-zinc-500 text-[10px] font-mono block mt-0.5 truncate">{appt.carModel} • {appt.phone}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-650 group-hover:text-amber-500 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* DETAILS WORKSPACE / EDIT OR NEW COMPONENT FORM (RIGHT) */}
        <div className="lg:col-span-8 bg-neutral-950 p-5 md:p-6 rounded-2xl border border-zinc-800" id="workorder-form-block">
          
          <form onSubmit={handleSaveOrUpdateWorkOrder} className="space-y-6">
            
            {/* Upper state details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-zinc-900 gap-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  {isCreatingNew ? 'Modo de Criação Automática' : `Visualizando Ordem: ${activeWoId}`}
                </span>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-1.5 mt-0.5">
                  <FileText className="h-4 w-4 text-amber-500" />
                  {isCreatingNew ? 'Nova Ordem de Serviço Eletromecânica' : `Editar Registro ${activeWoId}`}
                </h3>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">Situação:</span>
                <select
                  value={woStatus}
                  onChange={(e) => setWoStatus(e.target.value as any)}
                  className="p-1 px-2.5 bg-neutral-900 border border-zinc-750 rounded text-xs text-amber-400 font-bold outline-none cursor-pointer focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Orçamento Rascunho">Orçamento Rascunho</option>
                  <option value="Orçamento Pendente">Orçamento Pendente</option>
                  <option value="Orçamento Aprovado">Orçamento Aprovado</option>
                  <option value="Check-In Realizado">Check-In Realizado</option>
                  <option value="Em Serviço">Em Serviço</option>
                  <option value="Pronto para Retirada">Pronto para Retirada</option>
                  <option value="Entregue">Entregue</option>
                  <option value="Rejeitado">Rejeitado</option>
                </select>
              </div>
            </div>

            {/* SEPARATE TABS OF INTERACTION: 1. DADOS & ORÇAMENTO, 2. CHECK-IN, 3. CHECK-OUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="client-vehicle-card-group">
              
              {/* Box A: Cli details */}
              <div className="space-y-3 p-4 bg-neutral-900/40 rounded-xl border border-zinc-850">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <User className="h-3.5 w-3.5" />
                  Cadastro do Proprietário
                </h4>
                
                <div className="space-y-3">
                  {/* Name field */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Nome do Cliente *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberta Cavalcante"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-750 focus:border-amber-500 rounded-lg text-zinc-100 outline-none"
                    />
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">WhatsApp / Telefone *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: (11) 98765-4321"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-750 focus:border-amber-500 rounded-lg text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Box B: Vehicle Details */}
              <div className="space-y-3 p-4 bg-neutral-900/40 rounded-xl border border-zinc-850">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Car className="h-3.5 w-3.5" />
                  Identificação do Veículo
                </h4>

                <div className="grid grid-cols-2 gap-2.5 text-left">
                  <div className="col-span-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Modelo & Motorização *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Hyundai HB20 1.0"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full text-xs p-3 bg-neutral-950 border border-zinc-750 focus:border-amber-500 rounded-lg text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Ano Fabricação</label>
                    <input
                      type="text"
                      placeholder="Ex: 2019"
                      maxLength={4}
                      value={carYear}
                      onChange={(e) => setCarYear(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-750 rounded-lg text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Placa Mercosul</label>
                    <input
                      type="text"
                      placeholder="Ex: BRA-3H20"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                      className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-750 rounded-lg text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* SEPARATE SECTIONS */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-neutral-950/40">
              
              <div className="bg-neutral-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono font-black text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-amber-500" />
                  1. ITENS DO ORÇAMENTO (MÃO DE OBRA & PEÇAS)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">
                  Soma: R$ {rawTotal.toFixed(2)}
                </span>
              </div>

              <div className="p-4 space-y-4 text-left">
                {/* Add Services & Mão de obra inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Servicos */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">Mão de Obra / Serviços</span>
                    
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Ex: Reparo de fiação / Scanner"
                        value={newLaborName}
                        onChange={(e) => setNewLaborName(e.target.value)}
                        className="w-full text-xs p-2 bg-neutral-950 border border-zinc-800 rounded outline-none text-zinc-200"
                      />
                      <input
                        type="number"
                        placeholder="R$"
                        value={newLaborPrice}
                        onChange={(e) => setNewLaborPrice(e.target.value)}
                        className="w-20 text-xs p-2 bg-neutral-950 border border-zinc-800 rounded outline-none text-zinc-200 placeholder-zinc-700"
                      />
                      <button
                        type="button"
                        onClick={handleAddLabor}
                        className="px-3 bg-amber-500 text-neutral-950 rounded text-xs font-bold hover:bg-amber-600 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Labor list render */}
                    <div className="space-y-1.5">
                      {laborList.length === 0 ? (
                        <p className="text-[10px] text-zinc-500 font-mono italic">Sem serviços cadastrados.</p>
                      ) : (
                        laborList.map((labor) => (
                          <div key={labor.id} className="flex items-center justify-between bg-neutral-950 p-2 border border-zinc-850 rounded text-xs">
                            <span className="text-zinc-300 truncate font-semibold">🔧 {labor.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-amber-500 font-black">R$ {labor.price.toFixed(2)}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLabor(labor.id)}
                                className="text-zinc-650 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Pecas */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">Peças / Componentes</span>

                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Ex: Bateria Moura 60A / Fusível"
                        value={newPartName}
                        onChange={(e) => setNewPartName(e.target.value)}
                        className="w-full text-xs p-2 bg-neutral-950 border border-zinc-800 rounded outline-none text-zinc-200"
                      />
                      <input
                        type="number"
                        placeholder="R$"
                        value={newPartPrice}
                        onChange={(e) => setNewPartPrice(e.target.value)}
                        className="w-20 text-xs p-2 bg-neutral-950 border border-zinc-800 rounded outline-none text-zinc-200 placeholder-zinc-700"
                      />
                      <button
                        type="button"
                        onClick={handleAddPart}
                        className="px-3 bg-amber-500 text-neutral-950 rounded text-xs font-bold hover:bg-amber-600 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Parts list render */}
                    <div className="space-y-1.5">
                      {partsList.length === 0 ? (
                        <p className="text-[10px] text-zinc-500 font-mono italic">Sem peças cadastradas.</p>
                      ) : (
                        partsList.map((part) => (
                          <div key={part.id} className="flex items-center justify-between bg-neutral-950 p-2 border border-zinc-850 rounded text-xs">
                            <span className="text-zinc-300 truncate font-semibold">📦 {part.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-amber-500 font-black">R$ {part.price.toFixed(2)}</span>
                              <button
                                type="button"
                                onClick={() => handleRemovePart(part.id)}
                                className="text-zinc-650 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Discount and Calculations Row */}
                <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase block tracking-wider">Desconto Especial (R$):</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={discount || ''}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-24 text-xs font-mono p-1 bg-neutral-950 border border-zinc-800 rounded text-amber-500 font-bold outline-none pl-2.5"
                    />
                  </div>

                  {/* Calculations visual container */}
                  <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-center gap-4 text-right justify-self-end">
                    <div className="text-[10px] font-mono text-zinc-500">
                      <span>Soma: R$ {rawTotal.toFixed(2)}</span>
                      <span className="block text-[9px] text-neutral-500">Desc: - R$ {discount.toFixed(2)}</span>
                    </div>
                    <div className="border-l border-zinc-800 pl-4">
                      <span className="text-xs text-zinc-400 block font-sans">Total Líquido:</span>
                      <span className="text-lg font-mono font-extrabold text-amber-400">R$ {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Whatsapp button A */}
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp('budget')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-[11px] font-mono uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Enviar Orçamento Detalhado via WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION Check-In */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-neutral-950/40" id="card-checkin-module">
              <div className="bg-neutral-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono font-black text-zinc-305 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardCheck className="h-4 w-4 text-amber-500" />
                  2. CONTROLE VISTORIA DE ENTRADA (CHECK-IN)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                  Status Entrada
                </span>
              </div>

              <div className="p-4 space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Milage Km Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block">Quilometragem (Km) de Entrada</label>
                    <div className="relative flex items-center">
                      <Gauge className="absolute left-3 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Ex: 45.321 km"
                        value={checkInKm}
                        onChange={(e) => setCheckInKm(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-lg outline-none text-zinc-100"
                      />
                    </div>
                  </div>

                  {/* Fuel Tank Level gauge */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block">Nível de Combustível</label>
                    <div className="relative flex items-center">
                      <Fuel className="absolute left-3 h-4 w-4 text-zinc-500" />
                      <select
                        value={checkInFuel}
                        onChange={(e) => setCheckInFuel(e.target.value as any)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-950 border border-zinc-800 rounded-lg outline-none text-zinc-100 appearance-none cursor-pointer"
                      >
                        <option value="Vazio">Vazio (Reserva)</option>
                        <option value="1/4">1/4 Tanque</option>
                        <option value="1/2">1/2 (Meio Tanque)</option>
                        <option value="3/4">3/4 Tanque</option>
                        <option value="Cheio">Cheio (Completo)</option>
                      </select>
                    </div>
                  </div>

                  {/* Checklist options */}
                  <div className="space-y-2 bg-neutral-950 p-3 rounded-lg border border-zinc-850">
                    <span className="text-[9.5px] font-mono font-bold text-zinc-400 block uppercase leading-none mb-1">Checklist de Itens</span>
                    
                    <div className="text-[10px] text-zinc-400 space-y-1 font-sans">
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={checklistStepe}
                          onChange={(e) => setChecklistStepe(e.target.checked)}
                          className="rounded border-zinc-800 text-amber-500 focus:ring-transparent h-3 w-3 bg-neutral-900"
                        />
                        <span>Pneu Estepe Presente</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={checklistExtintor}
                          onChange={(e) => setChecklistExtintor(e.target.checked)}
                          className="rounded border-zinc-800 text-amber-500 focus:ring-transparent h-3 w-3 bg-neutral-900"
                        />
                        <span>Extintor Válido</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={checklistSom}
                          onChange={(e) => setChecklistSom(e.target.checked)}
                          className="rounded border-zinc-800 text-amber-500 focus:ring-transparent h-3 w-3 bg-neutral-900"
                        />
                        <span>Aparelho de Rádio/Som</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={checklistRiscos}
                          onChange={(e) => setChecklistRiscos(e.target.checked)}
                          className="rounded border-zinc-800 text-amber-500 focus:ring-transparent h-3 w-3 bg-neutral-900"
                        />
                        <span className="text-red-400">Escoriações/Riscos na lataria?</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notes Input */}
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Mapeamento de Danos Opcional ou Notas</label>
                  <textarea
                    rows={1}
                    value={checkInNotes}
                    onChange={(e) => setCheckInNotes(e.target.value)}
                    placeholder="Ex: Sinais visíveis de batida leve na carcaça do filtro de ar..."
                    className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none placeholder-zinc-700"
                  />
                </div>

                {/* Direct Whatsapp button B */}
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp('checkin')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-[11px] font-mono uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Enviar Comprovante Check-In (WhatsApp)
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION Check-Out */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-neutral-950/40" id="card-checkout-module">
              <div className="bg-neutral-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono font-black text-zinc-305 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  3. CONTROLE VISTORIA DE SAÍDA (CHECK-OUT)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  Entrega Pronta
                </span>
              </div>

              <div className="p-4 space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Verified by */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block">Técnico/Testador Responsável</label>
                    <input
                      type="text"
                      placeholder="Ex: Eng. Mário Faísca"
                      value={checkOutTestedBy}
                      onChange={(e) => setCheckOutTestedBy(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-800 focus:border-emerald-500 rounded-lg outline-none text-zinc-100 placeholder-zinc-700"
                    />
                  </div>

                  {/* Warranty days */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block">Garantia (Dias)</label>
                    <input
                      type="number"
                      placeholder="Ex: 90"
                      value={warrantyDays}
                      onChange={(e) => setWarrantyDays(parseInt(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-800 focus:border-emerald-500 rounded-lg outline-none text-zinc-100 text-amber-500 font-extrabold"
                    />
                  </div>

                  {/* Final Notes */}
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block">Parecer de Saída (Status Geral)</label>
                    <input
                      type="text"
                      value={checkOutNotes}
                      onChange={(e) => setCheckOutNotes(e.target.value)}
                      placeholder="Ex: 100% testado, fiação isolada, pronto"
                      className="w-full text-xs p-2.5 bg-neutral-950 border border-zinc-805 rounded-lg outline-none text-zinc-100 placeholder-zinc-700"
                    />
                  </div>
                </div>

                {/* Direct Whatsapp button C */}
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp('checkout')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-[11px] font-mono uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Enviar Notificação de Retirada / Check-Out
                  </button>
                </div>
              </div>
            </div>

            {/* CONTROL BAR WITH CONFIRM / CANCEL BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-zinc-900">
              <span className="text-[10.5px] text-zinc-500 font-mono flex items-center gap-1.5 leading-none">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Os dados de orçamento e vistorias são salvos permanentemente
              </span>

              <div className="flex gap-3 w-full sm:w-auto">
                {isCreatingNew && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNew(false);
                      if (workOrders.length > 0) setActiveWoId(workOrders[0].id);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border border-transparent shadow-[0_4px_16px_-5px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_22px_-2px_rgba(245,158,11,0.45)]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Salvando na nuvem...
                    </>
                  ) : (
                    isCreatingNew ? 'Gravar Ordem de Serviço' : 'Salvar Alterações Gerais'
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
