import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Award, ThumbsUp } from 'lucide-react';

export default function ShopDetails() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="oficina-detalhes-modulo">
      
      {/* Informações Institucionais e Vantagens (LEFT COLUMN) */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            Por que escolher a Volts?
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-sans">
            Combinamos técnicas tradicionais de mecânica de confiança com aparelhos digitais eletrônicos avançados de última geração. Aqui o orçamento é transparente e sem rodeios.
          </p>
        </div>

        {/* Bento stats list */}
        <div className="space-y-4">
          {/* Item 1 */}
          <div className="flex gap-4 p-4 rounded-xl bg-neutral-900/40 border border-zinc-800">
            <div className="p-2.5 bg-amber-500/10 rounded-lg h-fit shrink-0">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-200">Profissionais Certificados</h4>
              <p className="text-xs text-zinc-500 mt-1">Eletricistas e mecânicos com certificação SENAI e especializações constantes.</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4 p-4 rounded-xl bg-neutral-900/40 border border-zinc-800">
            <div className="p-2.5 bg-amber-500/10 rounded-lg h-fit shrink-0">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-200">Peças com Garantia</h4>
              <p className="text-xs text-zinc-500 mt-1">Trabalhamos com marcas originais de fábrica homologadas (Bosch, Heliar, Cofap, Marelli).</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-4 p-4 rounded-xl bg-neutral-900/40 border border-zinc-800">
            <div className="p-2.5 bg-amber-500/10 rounded-lg h-fit shrink-0">
              <ThumbsUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-200">Orçamento Transparente</h4>
              <p className="text-xs text-zinc-500 mt-1">Zero surpresas na entrega do seu veículo. Mostramos as peças velhas trocadas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map, Working Hours & Phone Call (RIGHT COLUMN) */}
      <div className="lg:col-span-8 bg-neutral-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl flex flex-col justify-between gap-6" id="contato-oficina-secao">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Address & Hours Text */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-zinc-100 tracking-tight">Canais de Atendimento</h4>
            
            <div className="space-y-4">
              {/* Loc */}
              <div className="flex items-start gap-3.5">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-xs text-zinc-400 font-mono uppercase tracking-wide">Endereço Física:</h5>
                  <p className="text-zinc-300 text-sm mt-0.5 leading-relaxed">
                    Av. Volts, 1050 — Bairro Alto da Injeção, São Paulo - SP
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-xs text-zinc-400 font-mono uppercase tracking-wide">Horário de Funcionamento:</h5>
                  <p className="text-zinc-300 text-sm mt-0.5 leading-relaxed">
                    Segunda a Sexta: 08:00h às 18:00h<br />
                    Sábados: 08:00h às 12:30h (Plantão Bateria e Freio)
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-3.5 font-sans">
                <Phone className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-xs text-zinc-400 font-mono uppercase tracking-wide">Ligar no Telefone Fixo:</h5>
                  <a href="tel:551155554321" className="text-amber-400 hover:text-amber-300 font-bold text-base mt-0.5 block transition-colors">
                    (11) 5555-4321
                  </a>
                </div>
              </div>
            </div>

            {/* Quick interactive action triggers */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1%20Volts!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20servi%C3%A7o."
                target="_blank"
                rel="noreferrer"
                id="whatsapp-direct-btn"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                Iniciar Orçamento no WhatsApp
              </a>
            </div>
          </div>

          {/* Styled Glowing Vector Map placeholder */}
          <div className="relative border border-zinc-800 rounded-xl bg-neutral-950/80 p-4 h-full flex flex-col justify-between overflow-hidden" id="interactive-map-placeholder">
            {/* Ambient grid lines representing roads in a beautiful abstract futuristic style */}
            <div className="absolute inset-0 bg-radial-towards-bottom opacity-10 flex flex-col justify-between pointer-events-none p-1 text-[8px] font-mono select-none text-zinc-500">
              <div className="border-b border-zinc-500/25 w-full h-[1px]" />
              <div className="border-b border-zinc-500/25 w-full h-[1px]" />
              <div className="border-b border-zinc-500/25 w-full h-[1px]" />
              <div className="border-b border-zinc-500/25 w-full h-[1px]" />
              <div className="border-b border-zinc-500/25 w-full h-[1px]" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Radial glow representation */}
              <div className="h-28 w-28 bg-amber-500/10 rounded-full blur-xl animate-pulse" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 font-semibold block uppercase">Localização Geográfica</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs text-zinc-200 font-bold">Volts Oficina Sede</span>
              </div>
            </div>

            <div className="relative z-10 bg-neutral-950/90 border border-zinc-850 p-3 rounded-lg text-[11px] leading-relaxed select-none text-zinc-400">
              Estamos situados próximos ao Trevo da Injeção Eletrônica, com reboque (guincho) parceiro 24h para reaver veículos que sofreram curto elétrico completo.
            </div>

            {/* Simulated GPS button */}
            <a
              href="https://maps.google.com/?q=Av.+Volts,+1050+S%C3%A3o+Paulo"
              target="_blank"
              rel="noreferrer"
              className="relative z-10 mt-4 text-center py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 text-xs rounded-lg transition-colors font-mono cursor-pointer block"
            >
              Abrir Rota no Google Maps GPS
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
