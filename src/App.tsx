import React, { useState, useEffect } from 'react';
import {
  Zap,
  Cpu,
  Disc,
  Shield,
  Activity,
  Phone,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  Award,
  Menu,
  X,
  Calendar,
  Star,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom component imports
import Logo from './components/Logo';
import ServiceCatalog, { SERVICES_DATA } from './components/ServiceCatalog';
import AIDiagnostic from './components/AIDiagnostic';
import BookingSystem from './components/BookingSystem';
import ShopDetails from './components/ShopDetails';
import Testimonials from './components/Testimonials';
import WorkOrderSystem from './components/WorkOrderSystem';

// @ts-ignore
import storefrontImg from './assets/images/volts_storefront_audi_rs6_1781707115524.jpg';

// FAQ list
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "Quais são os principais sinais de que a bateria está chegando ao fim?",
    answer: "Os principais sintomas incluem dificuldade para dar a partida pela manhã (o motor de arranque gira de forma lenta ou 'pesada'), luzes do painel que fraquejam visivelmente ao dar partida, o rádio que perde as configurações salvas com frequência e os vidros elétricos subindo com visível oscilação de velocidade."
  },
  {
    id: 2,
    question: "O diagnóstico via Scanner automotivo OBD-II é obrigatório?",
    answer: "Para veículos modernos com injeção eletrônica de combustível, sim. O Scanner OBD acessa o cérebro eletrônico do automóvel (ECU), resgatando códigos de falha (DTC) gravados por centenas de sensores. Isso evita que mecânicos fiquem trocando " +
            "peças por tentativa e erro, garantindo o reparo exato."
  },
  {
    id: 3,
    question: "Como notar problemas graves na suspensão ou direção?",
    answer: "Sempre que notar barulhos metálicos secos (ruídos de pancadas ou rangidos) ao passar sobre bueiros e lombadas, ou se sentir o volante com folga de reação, veículo puxando para um dos lados ou excesso de oscilação do carro após frenagens rápidas."
  },
  {
    id: 4,
    question: "O pré-diagnóstico com Inteligência Artificial substitui a visita mecânica física?",
    answer: "Não. Nosso assistente de inteligência artificial realiza uma triagem inicial inteligente baseada nas estatísticas elétricas mais frequentes. O diagnóstico definitivo depende da medição real com osciloscópios e scanners aplicados fisicamente na oficina."
  }
];

type TabType = 'dashboard' | 'servicos' | 'diagnostico' | 'agendamento' | 'orcamentos_checks' | 'depoimentos' | 'sobre';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Booking prefill states derived from other interactive components
  const [preFilledService, setPreFilledService] = useState('');
  const [preFilledNotes, setPreFilledNotes] = useState('');
  
  // Accordion active tracker
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Spark simulator state
  const [carVoltage, setCarVoltage] = useState(12.6);
  const [alternatorStatus, setAlternatorStatus] = useState<'Inativo' | 'Carregando' | 'Ausente'>('Carregando');

  // Trigger auto generator to simulate voltage fluctuations dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setCarVoltage((prev) => {
        const change = (Math.random() - 0.5) * 0.15;
        const target = parseFloat((prev + change).toFixed(2));
        return target < 12.0 ? 12.2 : target > 14.5 ? 14.3 : target;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePreFillBooking = (serviceName: string, notes: string) => {
    setPreFilledService(serviceName);
    setPreFilledNotes(notes);
    // Switch to booking Tab dynamically
    setActiveTab('agendamento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const clearPreFill = () => {
    setPreFilledService('');
    setPreFilledNotes('');
  };

  const toggleFaq = (id: number) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  // Sidebar navigation menu options
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Painel Geral', icon: Activity, desc: 'Visão geral & Status' },
    { id: 'servicos' as TabType, label: 'Especialidades', icon: Zap, desc: 'Nossos Serviços elétricos' },
    { id: 'diagnostico' as TabType, label: 'Triagem com IA', icon: Sparkles, desc: 'Checkup Inteligente' },
    { id: 'agendamento' as TabType, label: 'Agendar Vaga', icon: Calendar, desc: 'Reservar atendimento' },
    { id: 'orcamentos_checks' as TabType, label: 'Orçamentos & OS', icon: FileText, desc: 'Gerenciar orçamentos e vistorias' },
    { id: 'depoimentos' as TabType, label: 'Avaliações', icon: ThumbsUp, desc: 'Opiniões reais dos clientes' },
    { id: 'sobre' as TabType, label: 'Canais e Contato', icon: LogoIcon, desc: 'Nossos locais & Telefones' }
  ];

  // Custom visual icon representing local store
  function LogoIcon({ className = 'h-4 w-4 text-amber-500' }: { className?: string }) {
    return <MapPin className={className} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950 overflow-x-hidden relative flex flex-col md:flex-row" id="app-faisca-root">
      
      {/* Background neon grids & atmosphere halos */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 to-orange-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-0 w-[400px] h-[400px] bg-gradient-to-br from-red-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-5 right-0 w-[450px] h-[450px] bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />

      {/* MOBILE HEADER (Locks at top when viewport is small) */}
      <div className="md:hidden w-full bg-neutral-950/95 border-b border-zinc-900 px-4 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md" id="mobile-top-bar">
        <Logo size="sm" />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-neutral-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-amber-500 hover:border-zinc-700 transition-colors cursor-pointer"
          id="mobile-hamburger-btn"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* RESPONSIVE NAVIGATION SIDEBAR (Left Column) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-neutral-950/95 border-r border-zinc-900 backdrop-blur-2xl transition-transform duration-300 transform md:sticky md:translate-x-0 flex flex-col justify-between
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${'h-screen top-0'}
      `} id="interactive-nav-sidebar">
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-zinc-905 flex items-center justify-between">
            <Logo size="md" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 hover:bg-neutral-905 rounded-lg text-zinc-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Slogan Banner */}
          <div className="px-6 py-3.5 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-b border-zinc-900/40 text-left">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 font-bold leading-none">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              Oficina Especializada
            </p>
            <span className="text-[10px] font-sans text-zinc-400 mt-1 block font-medium">Volts © Autodiagnósticos</span>
          </div>

          {/* Navigation Links list */}
          <nav className="p-4 space-y-1" id="sidebar-nav-container">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-btn-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 font-bold border-l-2 border-amber-500 shadow-[inset_1px_0_0_rgba(245,158,11,0.2)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive ? 'bg-amber-500/15' : 'bg-neutral-900 group-hover:bg-neutral-800'
                    }`}>
                      <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold tracking-wide block">{item.label}</span>
                      <span className="text-[9px] text-zinc-500 group-hover:text-zinc-400 block font-mono">{item.desc}</span>
                    </div>
                  </div>
                  <ArrowRight className={`h-3 w-3 transition-transform ${isActive ? 'translate-x-0.5 text-amber-500 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Contacts Widget (Sidebar Bottom) */}
        <div className="p-4 border-t border-zinc-900/80 bg-neutral-950/80 space-y-3">
          <div className="bg-neutral-900 p-3 rounded-xl border border-zinc-850">
            <span className="text-[8px] font-mono text-zinc-500 block uppercase font-bold tracking-wider">Ligar para Orçamentos:</span>
            <a href="tel:551155554321" className="text-zinc-200 hover:text-amber-400 text-xs font-bold font-mono transition-colors block mt-0.5">
              (11) 5555-4321
            </a>
            <span className="text-[9px] text-zinc-500 block mt-1 leading-none font-sans">Av. Volts, 1050</span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-600 font-mono">
            <span>Diagnósticos OBD-II</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Freios & Suspensão</span>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA (Right Column) */}
      <main className="flex-1 min-h-screen p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col justify-between" id="sidebar-main-content-area">
        
        {/* UPPER STATUS CHASSIS - Ambient information blocks */}
        <div className="hidden lg:flex items-center justify-between bg-neutral-900/40 border border-zinc-900/80 rounded-2xl px-6 py-4 backdrop-blur-xl mb-8" id="upper-status-chassis">
          
          <div className="flex items-center gap-6">
            {/* Realtime clock status */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-zinc-400 font-mono">
                Sede Aberta • Seg-Sáb 08h-18h
              </span>
            </div>

            {/* Alternator current volt check */}
            <div className="flex items-center gap-2 font-mono border-l border-zinc-800 pl-6">
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span className="text-xs text-zinc-400">Voltímetro Simulador:</span>
              <span className="text-xs text-amber-500 font-bold">{carVoltage} V</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-400 font-mono">Brasília, DF & Regiões</span>
            <a
              href="https://api.whatsapp.com/send?phone=5561984520410&text=Ol%C3%A1%20Fa%C3%ADsca!%20Encontrei%20voc%C3%AAs%20no%20site%20e%20gostaria%20de%20esclarecer%20detalhes."
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold font-mono uppercase tracking-wider rounded-lg transition-colors border border-emerald-500/20"
            >
              Suporte Direto
            </a>
          </div>

        </div>

        {/* TAB VIEWS PRESENTATION LOGIC */}
        <div className="flex-1" id="tab-views-root">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-8"
            >
              
              {/* VIEW 1: DUST DYNAMIC PANEL / HOME BANNER */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in" id="panel-dashboard">
                  {/* Majestic Banner of requested items */}
                  <div className="p-8 md:p-12 border border-zinc-800 rounded-3xl relative overflow-hidden bg-neutral-950">
                    {/* Storefront background with Audi RS6, with high contrast dark overlay to guarantee readability */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={storefrontImg} 
                        alt="Volts Oficina Audi RS6 Storefront" 
                        className="w-full h-full object-cover opacity-35 scale-105 hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
                    </div>

                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="max-w-2xl space-y-6 relative z-10 text-left">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-xs text-amber-500 font-mono font-bold tracking-widest uppercase">
                          Elétrica Automotiva Volts
                        </span>
                      </div>

                      <h2 className="text-3xl sm:text-5xl font-black italic tracking-tight leading-none uppercase text-zinc-100">
                        TECNOLOGIA DE PONTA<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                          PARA O SEU VEÍCULO
                        </span>
                      </h2>

                      <p className="text-zinc-300 text-sm leading-relaxed antialiased">
                        Somos especialistas certificados em <strong>elétrica de alta tensão, diagnósticos computadorizados através de Scanner avançado</strong>, freios, suspensão e reparos de mecânica leve. Fornecemos um relatório de triagem completo do motor às luzes do seu painel com precisão máxima.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setActiveTab('diagnostico')}
                          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
                        >
                          <Sparkles className="h-4 w-4" />
                          Experimentar Analisador de IA
                        </button>

                        <button
                          onClick={() => setActiveTab('servicos')}
                          className="px-5 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-neutral-900/60 text-zinc-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider animate-pulse"
                        >
                          Catálogo de Serviços
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bento Box Layout Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Item 1 */}
                    <div className="bg-neutral-900/40 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl h-fit w-fit">
                          <Zap className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-zinc-100 tracking-tight">Elétrica de Automóveis</h4>
                          <p className="text-xs text-zinc-500 mt-1 lines-clamp-2 leading-relaxed">
                            Substituição de bateria, motores de partida, chicote elétrico estrutural, reles e iluminação automotiva.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePreFillBooking('Elétrica de Automóveis', 'Solicito checagem geral na fiação elétrica.')}
                        className="text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1.5 mt-5 tracking-wide pt-2 border-t border-zinc-800/40 text-left w-full cursor-pointer"
                      >
                        Agendar Elétrica <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-neutral-900/40 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl h-fit w-fit">
                          <Cpu className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-zinc-100 tracking-tight">Diagnósticos de Precisão</h4>
                          <p className="text-xs text-zinc-500 mt-1 lines-clamp-2 leading-relaxed">
                            Mapeamento OBD de parâmetros da ECU do motor. Resolução definitiva de panes elétricas de painel e sensores de injeção.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePreFillBooking('Diagnóstico por Computador (Scanner OBD)', 'Solicito escaneamento preventivo OBD.')}
                        className="text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1.5 mt-5 tracking-wide pt-2 border-t border-zinc-800/40 text-left w-full cursor-pointer"
                      >
                        Agendar Diagnóstico <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-neutral-900/40 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl h-fit w-fit">
                          <Disc className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-zinc-100 tracking-tight">Freio & Suspensão</h4>
                          <p className="text-xs text-zinc-500 mt-1 lines-clamp-2 leading-relaxed">
                            Pastilhas, discos, amortecedores, bieletas e bandeja. Cuidado com barulhos de metal e estabilidade em curvas.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePreFillBooking('Manutenção de Freios', 'Problema ou chiado no freio/suspensão.')}
                        className="text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1.5 mt-5 tracking-wide pt-2 border-t border-zinc-800/40 text-left w-full cursor-pointer"
                      >
                        Agendar Freios & Suspensão <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Trust details and numbers */}
                  <div className="bg-neutral-905 border border-zinc-800/80 p-6 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
                      <div className="p-3 bg-neutral-950/60 rounded-xl border border-zinc-850">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">Atendimentos Registrados</span>
                        <span className="text-2xl font-bold font-mono mt-1 text-zinc-100 block">4.8k +</span>
                      </div>
                      <div className="p-3 bg-neutral-950/60 rounded-xl border border-zinc-850">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">Baterias Testadas</span>
                        <span className="text-2xl font-bold font-mono mt-1 text-zinc-100 block">1.2k +</span>
                      </div>
                      <div className="p-3 bg-neutral-950/60 rounded-xl border border-zinc-850">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">Análise de Scanners</span>
                        <span className="text-2xl font-bold font-mono mt-1 text-zinc-100 block">100% Exato</span>
                      </div>
                      <div className="p-3 bg-neutral-950/60 rounded-xl border border-zinc-850">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">Equipe de Especialistas</span>
                        <span className="text-2xl font-bold font-mono mt-1 text-zinc-100 block">SENAI Certificados</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: SPECIALIZED SERVICE CATALOG */}
              {activeTab === 'servicos' && (
                <div className="space-y-4 animate-fade-in" id="panel-servicos">
                  <div className="bg-neutral-900/20 p-6 border border-zinc-850 rounded-2xl max-w-3xl mb-4 text-left">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                      Especialidades Oficiais
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-100 mt-2">Catálogo Estrutural Avançado</h3>
                    <p className="text-zinc-400 text-xs mt-1">
                      Nossa equipe resolve tanto problemas sutis de bocal de fusível e aterramento como reinstalação completa de módulos, substituição e pressurização de coxins de suspensão.
                    </p>
                  </div>
                  <ServiceCatalog onSelectServiceForBooking={(service) => handlePreFillBooking(service, `Cliente selecionou catálogo profissional: ${service}.`)} />
                </div>
              )}

              {/* VIEW 3: GEOMETRIC AI DIAGNOSTIC EXPERT SYSTEM */}
              {activeTab === 'diagnostico' && (
                <div className="space-y-4 animate-fade-in" id="panel-diagnostico">
                  <div className="bg-neutral-900/20 p-6 border border-zinc-850 rounded-2xl max-w-3xl mb-4 text-left">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">
                      Análise via Inteligência Artificial
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-100 mt-2">Parecer Técnico Instantâneo</h3>
                    <p className="text-zinc-400 text-xs mt-1">
                      Digite os ruídos ou sinais de luz de injeção que seu veículo está apresentando. Nosso modelo Gemini analisa os sintomas e sugere caminhos elétricos ou mecânicos imediatamente.
                    </p>
                  </div>
                  <AIDiagnostic onPreFillBooking={handlePreFillBooking} />
                </div>
              )}

              {/* VIEW 4: APPOINTMENTS AND SERVICE SLOTS */}
              {activeTab === 'agendamento' && (
                <div className="space-y-4 animate-fade-in" id="panel-agendamento">
                  <BookingSystem
                    preFilledService={preFilledService}
                    preFilledNotes={preFilledNotes}
                    onClearPreFill={clearPreFill}
                  />
                </div>
              )}

              {/* VIEW: ORÇAMENTOS, CHECK-IN & CHECK-OUT MANAGEMENT */}
              {activeTab === 'orcamentos_checks' && (
                <div className="space-y-4 animate-fade-in" id="panel-orcamentos-checks">
                  <WorkOrderSystem />
                </div>
              )}

              {/* VIEW 5: CUSTOMER REVIEWS */}
              {activeTab === 'depoimentos' && (
                <div className="space-y-6 animate-fade-in" id="panel-depoimentos">
                  <Testimonials />
                </div>
              )}

              {/* VIEW 6: ABOUT SHOP DETAILS AND OPENING HOURS */}
              {activeTab === 'sobre' && (
                <div className="space-y-6 animate-fade-in" id="panel-sobre">
                  <ShopDetails />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ACCORDION FAQ BLOCK - Persists at the bottom of the active tab for maximum trust building */}
        <section className="bg-neutral-900/40 border border-zinc-900/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl mt-12" id="bottom-faq-block">
          <div className="text-center md:text-left mb-6">
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight flex items-center justify-center md:justify-start gap-2">
              <HelpCircle className="h-4 w-4 text-amber-500 animate-pulse" />
              Manual Volts — Tire Dúvidas Técnicas Frequentes
            </h3>
            <p className="text-zinc-400 text-xs mt-1">
              Esclarecimentos resumidos elaborados pelos nossos especialistas automotivos.
            </p>
          </div>

          <div className="space-y-3" id="faq-accordion-group">
            {FAQ_DATA.map((item) => {
              const isOpen = activeFaq === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-neutral-950/70 border border-zinc-850 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 text-xs font-semibold tracking-wide text-zinc-300 hover:text-zinc-100 cursor-pointer"
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4.5 w-4.5 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="p-4 pt-0 border-t border-zinc-900/60 text-xs text-zinc-400 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* RESPONSIVE BRAND FOOTER */}
        <footer className="bg-neutral-950 border-t border-zinc-900/80 pt-8 mt-16 pb-4" id="view-bottom-footer">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black italic">
              VOLTS - ELÉTRICA - MECÂNICA
            </span>
            <p className="text-zinc-650 text-[10px] font-mono text-center md:text-right">
              Brasília, DF • Av. Volts, 1050 • Telefones Fixo & WhatsApp
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-zinc-500 font-mono">
            <div className="flex gap-4">
              <span>* Atendimento elétrico e mecânico certificado multimarcas</span>
              <span>* Chars & logs simulados para fins ilustrativos</span>
            </div>
            <span>© 2026 Elétrica Automotiva Volts</span>
          </div>
        </footer>

      </main>

      {/* WHATSAPP FLOATING BUTTON (PULSATILE TARGET) */}
      {/* Target Number: 61984520410 -> format: 5561984520410 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="floating-whatsapp-container">
        {/* Animated Speech Notification Bubble tooltip */}
        <div className="bg-zinc-900/90 text-zinc-100 text-[10px] font-mono font-bold py-1 px-2.5 rounded-lg border border-zinc-800 shadow-xl mb-2 flex items-center gap-1.5 animate-bounce select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Fale Conosco (61) 98452-0410
        </div>

        <a
          href="https://api.whatsapp.com/send?phone=5561984520410&text=Ol%C3%A1%20Oficina%20Fa%C3%ADsca!%20Enviei%20essa%20mensagem%20atrav%C3%A9s%20do%20site.%20Gostaria%20de%20esclarecer%20ou%20solicitar%20um%20diagn%C3%B3stico%20eletromec%C3%A2nico."
          target="_blank"
          rel="noreferrer"
          className="relative bg-emerald-500 hover:bg-emerald-600 h-14 w-14 rounded-full flex items-center justify-center text-neutral-950 shadow-[0_4px_16px_rgba(16,185,129,0.4)] group transition-transform duration-300 hover:scale-110 cursor-pointer"
          id="floating-whatsapp-trigger"
        >
          {/* Pulsating back glow rings */}
          <span className="absolute inset-x-0 inset-y-0 bg-emerald-500/30 rounded-full animate-ping pointer-events-none" />

          {/* Clean High Quality Vector WhatsApp Logo representation */}
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-neutral-950"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.455 4.7 1.455 5.483 0 9.943-4.468 9.947-9.948.002-2.654-1.02-5.15-2.88-7.016C16.55 1.782 14.06 .755 11.4 .755 6.225.755 2.016 4.968 2.012 10.15c0 1.7.45 3.25 1.35 4.7l-.95 3.5 3.6-.944z" />
            <path d="M16.9 14.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.1-.3.2-.5 0-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.4-1.3-1.6-.2-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.2-.2.2-.3s0-.3-.1-.5c-.1-.2-.5-1.2-.7-1.7-.2-.4-.3-.4-.5-.4h-.4c-.1 0-.3.1-.5.3-.2.2-.8.8-.8 2 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 0-1.1-.1 0-.3-.2-.5-.3z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
