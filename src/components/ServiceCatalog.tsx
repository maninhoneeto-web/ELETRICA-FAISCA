import React, { useState } from 'react';
import { Zap, Cpu, Disc, ShieldAlert, Settings, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceDetail } from '../types';

// Catalog of core automotive services based on User Focus
export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'eletrica',
    title: 'Elétrica de Automóveis',
    shortDesc: 'Revisão completa do sistema de carga, partida dos motores e fiação estrutural do seu veículo.',
    longDesc: 'O sistema elétrico é o coração do veículo moderno. Nossa equipe é especialista em identificar curtos-circuitos, restaurar chicotes danificados e testar o funcionamento de baterias e motores de arranque com equipamentos de alta fidelidade.',
    priceEstimate: 'A partir de R$ 90',
    iconName: 'Zap',
    items: [
      'Manutenção e troca estrutural de alternadores',
      'Substituição de baterias com testes de carga e pico',
      'Testes rigorosos e restauração do motor de partida (arranque)',
      'Substituição de relés, lâmpadas, fusíveis e chicotes elétricos',
      'Reparos em vidros elétricos, travas elétricas e alarmes originais'
    ]
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico por Computador (Scanner OBD)',
    shortDesc: 'A detecção computadorizada mais precisa de erros em sensores de injeção, eletrônica e painel.',
    longDesc: 'Por meio de scanners automotivos atualizados e osciloscópios digitais, nós nos conectamos à central eletrônica (ECU) para ler parâmetros em tempo real, identificar falhas ocultas em sensores e reconfigurar sistemas após trocas preventivas.',
    priceEstimate: 'A partir de R$ 130',
    iconName: 'Cpu',
    items: [
      'Leitura de códigos de erros e apagamento de alertas no painel',
      'Análise em tempo real de sensores de injeção eletrônica',
      'Diagnóstico de sistemas de freios digitais (ABS / ESC) e controle de estabilidade',
      'Diagnóstico e desbloqueio de sistemas de Airbag e imobilizadores',
      'Análise de gases de escape, queima e oscilação de bobinas'
    ]
  },
  {
    id: 'freios',
    title: 'Manutenção de Freios',
    shortDesc: 'Segurança absoluta com substituição de pastilhas, discos retificados e fluído sob pressão.',
    longDesc: 'Não brinque com sua segurança. Fazemos a checagem detalhada das pinças, espessura restante dos discos e pastilhas, além da sangria mecânica e troca do fluído hidráulico do sistema de freios obedecendo a norma DOT indicada pelo fabricante.',
    priceEstimate: 'A partir de R$ 100',
    iconName: 'Disc',
    items: [
      'Substituição profissional de pastilhas e sapatas de freio',
      'Troca de discos de freio ventilados e checagem de folgas',
      'Substituição do cilindro mestre, servo-freio e mangueiras',
      'Troca completa do fluído de freio com máquina de vácuo hidropneumática',
      'Regulagem fina do freio de estacionamento mecânico ou eletrônico'
    ]
  },
  {
    id: 'suspensao',
    title: 'Suspensão e Amortecimento',
    shortDesc: 'Correção de ruídos em bandejas, troca de amortecedores e buchas de estabilidade.',
    longDesc: 'Uma suspensão desgastada compromete a aderência e desgasta pneu prematuramente. Oferecemos diagnósticos completos de folgas e estalos em pivôs, buchas e bandejas, com substituição precisa de amortecedores pressurizados.',
    priceEstimate: 'A partir de R$ 120',
    iconName: 'ShieldAlert',
    items: [
      'Troca de amortecedores traseiros/dianteiros e coxins',
      'Substituição de articulações, pivôs e terminais de direção',
      'Troca e lubrificação de bieletas e buchas da barra estabilizadora',
      'Restauração completa de bandejas de suspensão amassadas ou com folga',
      'Substituição preventiva de homocinéticas e coifas de proteção'
    ]
  },
  {
    id: 'mecanica',
    title: 'Pequenos Serviços de Mecânica',
    shortDesc: 'Reparos rápidos: troca de fluídos, correias, bombas e soluções expressas de motor.',
    longDesc: 'Unimos a eletrônica ao serviço mecânico básico prático. Cuidamos do desgaste mecânico do dia a dia, executando revisões de nível, troca de filtros de ar, combustível e cabine, além de trocas estruturais de correias dentadas e acessórios secundários.',
    priceEstimate: 'A partir de R$ 80',
    iconName: 'Settings',
    items: [
      'Troca rápida de óleo de motor homologado e filtros (ar, óleo e combustível)',
      'Substituição preventiva de correia dentada e tensor de distribuição',
      'Substituição de bombas d\'água, válvulas termostáticas e aditivo do radiador',
      'Limpeza quimio-eletrônica de bicos injetores no ultrassom',
      'Higienização de ar-condicionado automotivo e troca do filtro de cabine'
    ]
  }
];

interface ServiceCatalogProps {
  onSelectServiceForBooking: (serviceName: string) => void;
}

export default function ServiceCatalog({ onSelectServiceForBooking }: ServiceCatalogProps) {
  const [selectedTab, setSelectedTab] = useState<string>('eletrica');

  // Helper inside the component to render the appropriate Lucide Icon dynamically
  const renderIcon = (name: string, sizeClass = "h-6 w-6 text-amber-500") => {
    switch (name) {
      case 'Zap':
        return <Zap className={sizeClass} id={`icon-${name}`} />;
      case 'Cpu':
        return <Cpu className={sizeClass} id={`icon-${name}`} />;
      case 'Disc':
        return <Disc className={sizeClass} id={`icon-${name}`} />;
      case 'ShieldAlert':
        return <ShieldAlert className={sizeClass} id={`icon-${name}`} />;
      case 'Settings':
        return <Settings className={sizeClass} id={`icon-${name}`} />;
      default:
        return <Zap className={sizeClass} id={`icon-${name}`} />;
    }
  };

  const currentService = SERVICES_DATA.find((s) => s.id === selectedTab) || SERVICES_DATA[0];

  return (
    <div className="bg-neutral-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl" id="servicos-catalogo-container">
      <div className="text-center md:text-left mb-8">
        <h3 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Serviços de Especialidade
        </h3>
        <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
          Navegue pelas nossas áreas de atuação focadas no cuidado técnico eletro-mecânico automotivo. Garantia de diagnóstico preciso e peças homologadas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs - LEFT */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          {SERVICES_DATA.map((service) => {
            const isActive = service.id === selectedTab;
            return (
              <button
                key={service.id}
                id={`tab-${service.id}`}
                onClick={() => setSelectedTab(service.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group justify-between ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/50 text-zinc-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                    : 'bg-neutral-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-amber-500/20' : 'bg-neutral-800 group-hover:bg-neutral-700'}`}>
                    {renderIcon(service.iconName, `h-5 w-5 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm tracking-wide">{service.title}</h4>
                    <span className="text-[11px] font-mono opacity-80 block mt-0.5">{service.priceEstimate}</span>
                  </div>
                </div>
                <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'translate-x-1 text-amber-500' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Service Panel - RIGHT */}
        <div className="lg:col-span-7 bg-neutral-950/50 border border-zinc-800/80 rounded-xl p-6 flex flex-col justify-between" id="service-detail-panel">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  {renderIcon(currentService.iconName, 'h-6 w-6 text-amber-500')}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-100 tracking-tight">{currentService.title}</h3>
                  <p className="text-xs font-mono text-amber-400 font-semibold">{currentService.priceEstimate} (Base sugerida de mão-de-obra)</p>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              {currentService.longDesc}
            </p>

            <h4 className="text-zinc-200 text-xs font-semibold uppercase tracking-wider mb-3 font-mono">
              Principais Reparos & Cobertura:
            </h4>
            
            <ul className="space-y-2.5 mb-6">
              {currentService.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-zinc-400 text-xs leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-zinc-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Equipamentos originais e certificados
            </span>
            <button
              id={`select-booking-${currentService.id}`}
              onClick={() => onSelectServiceForBooking(currentService.title)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              Agendar {currentService.title}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
