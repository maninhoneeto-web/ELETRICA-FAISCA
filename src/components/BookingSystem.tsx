import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, Phone, User, Wrench, ShieldCheck, CheckCircle2, ListFilter, AlertCircle, RefreshCw } from 'lucide-react';
import { Appointment } from '../types';

interface BookingSystemProps {
  preFilledService: string;
  preFilledNotes: string;
  onClearPreFill: () => void;
}

const SERVICE_CATEGORIES = [
  { value: 'Elétrica de Automóveis', basePrice: 90 },
  { value: 'Diagnóstico por Computador (Scanner OBD)', basePrice: 130 },
  { value: 'Manutenção de Freios', basePrice: 100 },
  { value: 'Suspensão e Amortecimento', basePrice: 120 },
  { value: 'Pequenos Serviços de Mecânica', basePrice: 80 }
];

export default function BookingSystem({
  preFilledService,
  preFilledNotes,
  onClearPreFill
}: BookingSystemProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [serviceType, setServiceType] = useState('Elétrica de Automóveis');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentSuccess, setAppointmentSuccess] = useState<Appointment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load bookings from server-side memory
  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Sync pre-filled items from outside (e.g. from the AI diagnostic tab or service grid clicking)
  useEffect(() => {
    if (preFilledService) {
      // Find matches or matches substring
      const matched = SERVICE_CATEGORIES.find(cat => 
        cat.value.toLowerCase().includes(preFilledService.toLowerCase()) ||
        preFilledService.toLowerCase().includes(cat.value.toLowerCase())
      );
      if (matched) {
        setServiceType(matched.value);
      } else {
        // Fallback or custom
        setServiceType('Elétrica de Automóveis');
      }
    }
    if (preFilledNotes) {
      setNotes(preFilledNotes);
    }
  }, [preFilledService, preFilledNotes]);

  // Calculate dynamic labor pricing based on selection
  const currentCategory = SERVICE_CATEGORIES.find(c => c.value === serviceType) || SERVICE_CATEGORIES[0];
  const calculatedBase = currentCategory.basePrice;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !carModel || !date || !time) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          carModel,
          carYear,
          serviceType,
          date,
          time,
          notes
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar agendamento no servidor.');
      }

      const newBooking: Appointment = await response.json();
      setAppointmentSuccess(newBooking);

      // Reset form variables
      setName('');
      setPhone('');
      setCarModel('');
      setCarYear('');
      setNotes('');
      setDate('');
      setTime('');
      onClearPreFill();

      // Refresh list
      fetchAppointments();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Não foi possível gravar o agendamento no servidor corporativo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900/60 border border-zinc-805 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl" id="agendador-faisca-modulo">
      <div className="text-center md:text-left mb-8 border-b border-zinc-800 pb-5">
        <h3 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <Calendar className="h-5 w-5 text-amber-500 animate-pulse" />
          Agendamento Online de Serviços
        </h3>
        <p className="text-zinc-400 text-sm mt-1 max-w-xl">
          Evite filas. Reserve um horário na nossa oficina física e receba atendimento express para elétrica ou diagnósticos computadorizados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Booking Form (LEFT COLUMN) */}
        <div className="lg:col-span-7" id="agendador-formulario-bloco">
          {appointmentSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-4" id="success-receipt-card">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  Agendamento Recebido!
                </span>
                <h4 className="text-lg font-bold text-zinc-100 mt-1">Código: {appointmentSuccess.id}</h4>
                <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
                  Olá <strong className="text-zinc-200">{appointmentSuccess.name}</strong>, seu horário de atendimento foi pré-registrado na base da Faísca com sucesso!
                </p>
              </div>

              <div className="p-4 bg-neutral-950/80 border border-zinc-800 rounded-lg text-left text-xs space-y-2 font-sans">
                <p className="text-zinc-400"><strong className="text-zinc-200">Veículo:</strong> {appointmentSuccess.carModel} ({appointmentSuccess.carYear})</p>
                <p className="text-zinc-400"><strong className="text-zinc-200">Serviço:</strong> {appointmentSuccess.serviceType}</p>
                <p className="text-zinc-400"><strong className="text-zinc-200">Data e Hora:</strong> {appointmentSuccess.date} às {appointmentSuccess.time}h</p>
                <p className="text-zinc-400 font-mono text-amber-400 text-[10px]">Preço Sugerido Mão de Obra: R$ {calculatedBase}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAppointmentSuccess(null)}
                  className="w-full py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  Novo Agendamento
                </button>
                <a
                  href={`https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1%20Fa%C3%ADsca!%20Gostaria%20de%20confirmar%20meu%20agendamento%20c%C3%B3digo%20${appointmentSuccess.id}%20para%20${appointmentSuccess.date}%20%C3%A0s%20${appointmentSuccess.time}%20para%20o%20carro%20${appointmentSuccess.carModel}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                >
                  Confirmar no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-name">
                    Seu Nome Completo *
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      id="booking-name"
                      placeholder="Ex: Alberto Oliveira"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm pl-10 pr-3.5 py-3 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-600 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-phone">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="tel"
                      id="booking-phone"
                      placeholder="Ex: (11) 99999-8888"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-sm pl-10 pr-3.5 py-3 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-600 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Form Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehicle Model */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-car-model">
                    Veículo (Modelo e Motorização) *
                  </label>
                  <div className="relative flex items-center">
                    <Car className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      id="booking-car-model"
                      placeholder="Ex: Ford Fiesta 1.6 Rocam"
                      required
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full text-sm pl-10 pr-3.5 py-3 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-600 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Vehicle Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-car-year">
                    Ano de Fabricação (Opcional)
                  </label>
                  <div className="relative flex items-center">
                    <Car className="absolute left-3.5 h-4 w-4 text-zinc-500 opacity-60" />
                    <input
                      type="text"
                      id="booking-car-year"
                      placeholder="Ex: 2015"
                      maxLength={4}
                      value={carYear}
                      onChange={(e) => setCarYear(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full text-sm pl-10 pr-3.5 py-3 bg-neutral-950/70 border border-zinc-850 rounded-xl text-zinc-100 outline-none placeholder-zinc-700"
                    />
                  </div>
                </div>
              </div>

              {/* Form Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category selectors */}
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-service">
                    Serviço Especializado *
                  </label>
                  <div className="relative flex items-center">
                    <Wrench className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <select
                      id="booking-service"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none appearance-none cursor-pointer"
                    >
                      {SERVICE_CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat.value}>{cat.value}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-date">
                    Data de Agendamento *
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="date"
                      id="booking-date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none"
                    />
                  </div>
                </div>

                {/* Preferred Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-time">
                    Horário Preferido *
                  </label>
                  <div className="relative flex items-center">
                    <Clock className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="time"
                      id="booking-time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Long Notes / Symptom Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block" htmlFor="booking-notes">
                  Mencione detalhes, sintomas ou observações
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  placeholder="Ex: Barulho agudo intermitente ao virar para o lado direito. Luz ABS liga junto."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm p-3.5 bg-neutral-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-700 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
                />
              </div>

              {/* Instant dynamic estimate visualizer */}
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-amber-500" />
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">Preço de Partida Estimado</span>
                    <span className="text-[10px] text-zinc-500 block">Diagnóstico de mão-de-obra inicial</span>
                  </div>
                </div>
                <span className="text-xl font-mono font-extrabold text-amber-400">
                  R$ {calculatedBase}
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  id="booking-submit-final-btn"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Gravando reserva corporativa...
                    </>
                  ) : (
                    'Pre-Agendar Minha Vaga na Oficina'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing Bookings Tracker (RIGHT COLUMN) */}
        <div className="lg:col-span-5 bg-neutral-950/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between" id="active-appointments-list">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-amber-500" />
                Vagas e Diagnósticos Ativos
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono px-2 py-0.5 rounded-full font-bold">
                {appointments.length} Agendados
              </span>
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal mb-4">
              Abaixo são listados os veículos atualmente estacionados na oficina ou com chegada confirmada para diagnóstico técnico OBD-II:
            </p>

            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1" id="appointments-tracker-scroll-container">
              {appointments.length === 0 ? (
                <div className="text-center py-10 text-zinc-600 font-mono text-xs">
                  Nenhuma vaga ativa listada.
                </div>
              ) : (
                appointments.map((applet) => (
                  <div
                    key={applet.id}
                    className="p-3 bg-neutral-950/80 border border-zinc-850 rounded-xl space-y-2 hover:border-zinc-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="leading-tight">
                        <span className="text-[10px] font-mono text-zinc-600">ID: {applet.id}</span>
                        <h4 className="font-bold text-xs text-zinc-200 mt-0.5">{applet.carModel}</h4>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        applet.status === 'Confirmado'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {applet.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-zinc-600" /> {applet.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-zinc-600" /> {applet.time}h
                      </span>
                    </div>

                    <div className="text-[11px] bg-neutral-900/60 p-2 border border-zinc-850 rounded text-zinc-400 leading-relaxed font-sans line-clamp-1">
                      <strong className="text-zinc-500">Cli:</strong> {applet.name} | <strong className="text-zinc-500">Serv:</strong> {applet.serviceType}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-4 mt-4 text-center">
            <span className="text-[10px] text-zinc-600 font-mono flex items-center justify-center gap-1.5 leading-none">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Sincronizado em tempo real com a frotas Faísca
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
