import React from 'react';
import { Star, MessageSquareCode, Quote } from 'lucide-react';

interface TestimonialItem {
  id: number;
  name: string;
  vehicle: string;
  service: string;
  comment: string;
  rating: number;
  date: string;
}

const REVIEWS: TestimonialItem[] = [
  {
    id: 1,
    name: "Rodrigo Santana de Souza",
    vehicle: "Chevrolet Prisma 1.4 LTPS",
    service: "Diagnóstico OBD e Troca de Alternador",
    comment: "O carro estava morrendo do nada e acendia várias luzes. Passei em duas oficinas e queriam trocar a central eletrônica inteira! Levei na Volts, passaram o scanner avançado e acharam apenas um curto de chicote e escovas gastas no alternador. Resolvido rápido e preço honesto. Extremamente recomendados!",
    rating: 5,
    date: "14 Mai 2026"
  },
  {
    id: 2,
    name: "Gabriela F. Mendes",
    vehicle: "Ford Ka 1.0 SE 3C",
    service: "Suspensão completa e Buchas",
    comment: "Minha suspensão dianteira estava cheia de estalos terríveis em paralelepípedos. Fizeram a vistoria de folgas mecânicas na bandeja e trocaram coxins e bieletas e amortecedores dianteiros homologados da Cofap. O carro voltou macio, alinhado e sem barulho nenhum de metal. Excelente trabalho e recepção nota 10.",
    rating: 5,
    date: "03 Jun 2026"
  },
  {
    id: 3,
    name: "Cláudio Albuquerque",
    vehicle: "VW Golf 2.0 TSI",
    service: "Revisão Mecânica e Pastilhas de Freio",
    comment: "Serviço eletro-mecânico muito sério. Usei o Assistente Virtual pelo site deles, marquei hora, cheguei e fui prontamente atendido na hora agendada. Substituição limpa de fluídos de freio e pastilhas cerâmicas e limpeza eletrônica de bicos injetores no ultrassom. Trabalho meticuloso.",
    rating: 5,
    date: "28 Mai 2026"
  }
];

export default function Testimonials() {
  return (
    <div className="space-y-6" id="depoimentos-modulo">
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded">
          Avaliação de Clientes Reais
        </span>
        <h3 className="text-2xl font-bold text-zinc-100 mt-2 tracking-tight">
          Quem passou pela oficina aprova
        </h3>
        <p className="text-zinc-400 text-xs mt-1.5 max-w-sm mx-auto">
          Veja a experiência de proprietários de carros com os nossos serviços de elétrica e diagnósticos de precisão.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="p-5 md:p-6 bg-neutral-900/40 border border-zinc-800 rounded-2xl relative flex flex-col justify-between hover:border-zinc-700/80 transition-colors"
          >
            {/* Top quote indicator */}
            <Quote className="absolute top-4 right-4 h-8 w-8 text-zinc-800 opacity-20 hover:opacity-30 pointer-events-none" />

            <div className="space-y-4">
              {/* Stars row */}
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-zinc-300 text-xs leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>

            {/* Bottom info row */}
            <div className="border-t border-zinc-800/80 pt-4 mt-5 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-zinc-200">{review.name}</h5>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{review.vehicle}</p>
                <span className="text-[10px] text-amber-500 font-mono block mt-0.5">{review.service}</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-650 shrink-0 self-end opacity-75">{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
