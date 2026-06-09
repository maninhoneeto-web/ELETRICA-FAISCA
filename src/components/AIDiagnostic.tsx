import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, Activity, AlertTriangle, CheckSquare, Wrench, RefreshCw, ClipboardCheck, ArrowRight } from 'lucide-react';
import { DiagnosticResult, CarInfo } from '../types';

const COMMON_SYMPTOMS = [
  { id: 'bateria', label: 'Bateria descarrega sozinha de um dia para o outro', service: 'Elétrica de Automóveis' },
  { id: 'injecao', label: 'Luz da injeção eletrônica acesa e motor falhando', service: 'Diagnóstico por Computador (Scanner OBD)' },
  { id: 'partida', label: 'Carro demora para ligar ou apenas faz barulho de estalo', service: 'Elétrica de Automóveis' },
  { id: 'freio', label: 'Ruído de ferro com ferro (chiado) ao frear', service: 'Manutenção de Freios' },
  { id: 'suspensao', label: 'Patinadas, estalos ou sensação de instabilidade em lombadas', service: 'Suspensão e Amortecimento' }
];

interface AIDiagnosticProps {
  onPreFillBooking: (serviceName: string, notes: string) => void;
}

export default function AIDiagnostic({ onPreFillBooking }: AIDiagnosticProps) {
  const [symptoms, setSymptoms] = useState('');
  const [carInfo, setCarInfo] = useState<CarInfo>({ make: '', model: '', year: '', engine: '' });
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [copied, setCopied] = useState(false);

  const loadingPhrases = [
    'Conectando osciloscópio virtual...',
    'Varrendo barramento CAN do veículo...',
    'Consultando mapeamento de sensores OBD-II...',
    'Mapeando diagrama fiação elétrica...',
    'Sincronizando com a base de engenharia Faísca...',
    'Gerando parecer técnico com Inteligência Artificial...'
  ];

  // Rotate loading phrases for high fidelity simulation
  useEffect(() => {
    let intervalId: any;
    if (loading) {
      let currentIndex = 0;
      setLoadingPhrase(loadingPhrases[0]);
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % loadingPhrases.length;
        setLoadingPhrase(loadingPhrases[currentIndex]);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [loading]);

  const handleSelectQuickSymptom = (label: string) => {
    setSymptoms(label);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorCode(null);

    try {
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, carInfo })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorCode('Não conseguimos conectar à IA de diagnóstico. Exibindo diagnóstico preventivo padrão.');
      // Fallback local robusto para não quebrar a usabilidade sem chave
      setResult({
        possibleCauses: [
          "Bateria do carro desgastada ou no fim da vida útil",
          "Problema de alternador que não recarrega a bateria devidamente",
          "Mau contato ou fiação aterrada incorretamente",
          "Injeção eletrônica desregulada ou bico injetor sujo"
        ],
        urgency: "Média",
        recommendations: [
          "Evite dar partidas forçadas sucessivas.",
          "Verifique se o terminal da bateria está solto ou oxidado com zinabre.",
          "Procure a oficina mais próxima se sentir um cheiro metálico quente."
        ],
        faiscaServices: [
          "Diagnóstico Computadorizado com Scanner OBD-II",
          "Teste Completo Elétrico de Alternador e Bateria",
          "Reparo de Injeção Eletrônica"
        ],
        professionalAdvice: "Olá! Devido à indisponibilidade momentânea do canal satélite de IA, preparamos essa triagem expressa. Sintomas elétricos ou de injeção necessitam de leitura precisa via scanner para evitar falhas maiores na central. Venha até a Faísca e faremos a leitura gratuita do seu carro!"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `=== RELATÓRIO DE PRÉ-DIAGNÓSTICO AUTOMOTIVO FAÍSCA ===
Veículo: ${carInfo.make || ''} ${carInfo.model || ''} (${carInfo.year || 'N/I'})
Sintomas descritos: ${symptoms}
Urgência recomendada: ${result.urgency}

Principais Causas Possíveis:
${result.possibleCauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Recomendações imediatas:
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Serviços Indicados (Faísca):
${result.faiscaServices.join(', ')}

Parecer Profissional:
${result.professionalAdvice}
======================================================`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl" id="assistente-ia-secao">
      {/* Title & Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles className="h-6 w-6 text-zinc-950 animate-bounce" id="ai-glowing-magic-sparkles" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
              Tecnologia Exclusiva
            </span>
            <h3 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2 mt-1">
              Assistente de Pré-Diagnóstico IA
            </h3>
          </div>
        </div>
        <p className="text-xs text-zinc-400 max-w-sm md:text-right font-mono">
          Descreva problemas elétricos, mecânicos ou de painel e nossa IA gera um parecer na hora.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Symptom Input Column - LEFT */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Quick selectors */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
                Escolha rápida de sintomas frequentes:
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SYMPTOMS.map((cs) => (
                  <button
                    key={cs.id}
                    type="button"
                    id={`quick-symptom-${cs.id}`}
                    onClick={() => handleSelectQuickSymptom(cs.label)}
                    className="text-[11px] text-left px-3 py-2 rounded-lg bg-neutral-950/70 border border-zinc-800/80 hover:border-amber-500/40 hover:text-amber-400 text-zinc-300 transition-colors cursor-pointer"
                  >
                    {cs.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Description Textarea */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2" htmlFor="custom-symptoms-input">
                Descreva com suas palavras (Ex: barulhos, falha elétrica, luzes acesas):
              </label>
              <textarea
                id="custom-symptoms-input"
                rows={3}
                placeholder="Exemplo: Minha buzina parou de funcionar e quando ligo o pisca a luz do painel pisca muito rápido..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                maxLength={450}
                required
                className="w-full text-sm p-3.5 bg-neutral-950/80 border border-zinc-800 focus:border-amber-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-600 focus:ring-1 focus:ring-amber-500 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Optional Car Details Grid */}
            <div>
              <span className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Dados do Veículo (Opcional):
              </span>
              <div className="grid grid-cols-2 gap-3.5">
                <input
                  type="text"
                  placeholder="Marca (Ex: Fiat)"
                  value={carInfo.make}
                  onChange={(e) => setCarInfo({ ...carInfo, make: e.target.value })}
                  className="text-xs p-3 bg-neutral-950/80 border border-zinc-800 focus:border-amber-500 rounded-lg text-zinc-100 outline-none"
                />
                <input
                  type="text"
                  placeholder="Modelo (Ex: Argo)"
                  value={carInfo.model}
                  onChange={(e) => setCarInfo({ ...carInfo, model: e.target.value })}
                  className="text-xs p-3 bg-neutral-950/80 border border-zinc-800 focus:border-amber-500 rounded-lg text-zinc-100 outline-none"
                />
                <input
                  type="text"
                  placeholder="Ano (Ex: 2021)"
                  maxLength={4}
                  value={carInfo.year}
                  onChange={(e) => setCarInfo({ ...carInfo, year: e.target.value.replace(/[^0-9]/g, '') })}
                  className="text-xs p-3 bg-neutral-950/80 border border-zinc-850 rounded-lg text-zinc-100 outline-none"
                />
                <input
                  type="text"
                  placeholder="Motor (Ex: 1.3 Turbo)"
                  value={carInfo.engine}
                  onChange={(e) => setCarInfo({ ...carInfo, engine: e.target.value })}
                  className="text-xs p-3 bg-neutral-950/80 border border-zinc-850 rounded-lg text-zinc-100 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !symptoms.trim()}
              id="submit-ai-analysis-btn"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analisando Elétrica...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  Gerar Pré-Diagnóstico Técnico
                </>
              )}
            </button>
          </form>
        </div>

        {/* Diagnostic Results Display Column - RIGHT */}
        <div className="lg:col-span-7 bg-neutral-950/60 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-center relative min-h-[320px]" id="diagnostic-results-column">
          {loading && (
            <div className="flex flex-col items-center justify-center text-center py-8" id="ai-loading-panel">
              <div className="h-14 w-14 rounded-full border-2 border-dashed border-amber-500 animate-spin flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-amber-500 animate-pulse" />
              </div>
              <h4 className="text-zinc-200 font-bold tracking-tight text-sm">Escaneando Veículo Virtualmente</h4>
              <p className="text-amber-500 font-mono text-[11px] mt-2 h-4 animate-pulse">
                {loadingPhrase}
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="text-center py-12 px-4" id="ai-empty-state">
              <HelpCircle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <h4 className="text-zinc-300 font-bold text-sm tracking-tight">Estamos Prontos para Triagem</h4>
              <p className="text-zinc-500 text-xs mt-2 max-w-sm mx-auto">
                Selecione um sintoma acima ou digite detalhadamente nos campos à esquerda. Nosso motor inteligente indicará a gravidade e apontará falhas elétricas primárias automaticamente.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4" id="ai-result-panel">
              {/* Header with Urgency Rating */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-mono font-bold text-zinc-300">Triagem Técnica Emitida</span>
                </div>
                
                {/* Urgency Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-zinc-400">Gravidade:</span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                    result.urgency.toLowerCase().includes('alta') || result.urgency.toLowerCase().includes('alto')
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                      : result.urgency.toLowerCase().includes('baixa') || result.urgency.toLowerCase().includes('baixo')
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    {result.urgency}
                  </span>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Causes */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" /> Possíveis Causas
                  </span>
                  <ul className="space-y-1">
                    {result.possibleCauses.map((cause, i) => (
                      <li key={i} className="text-xs text-zinc-300 line-clamp-2 leading-relaxed flex items-start gap-1.5">
                        <span className="font-mono text-[9px] text-zinc-600 bg-neutral-900 px-1 py-0.2 rounded shrink-0 mt-0.5">#{i+1}</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <CheckSquare className="h-3 w-3 text-emerald-500" /> Cuidados Imediatos
                  </span>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-zinc-300 line-clamp-2 leading-relaxed flex items-start gap-1.5">
                        <span className="font-mono text-emerald-500 shrink-0 select-none">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Professional Statement Callout */}
              <div className="mt-2.5 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-[11px] font-mono text-amber-500 uppercase tracking-widest block font-extrabold mb-1">
                  Parecer Técnico Oficial Faísca:
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{result.professionalAdvice}"
                </p>
              </div>

              {/* Recommended Services list */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 py-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mr-1.5">Serviços Indicados:</span>
                {result.faiscaServices.map((serv, idx) => (
                  <span key={idx} className="text-[10px] py-0.5 px-2 rounded-lg bg-neutral-900 text-amber-400 border border-zinc-800">
                    {serv}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-zinc-800/80 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                <button
                  type="button"
                  id="copy-diagnostic-report-btn"
                  onClick={handleCopyReport}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:text-zinc-100 text-zinc-400 text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" /> Relatório Copiado!
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="h-3.5 w-3.5" /> Copiar Diagnóstico
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="fill-appointment-with-diagnostic-btn"
                  onClick={() => {
                    // Pre-fill booking utilizing first recommended service or standard description
                    const mainServ = result.faiscaServices[0] || 'Diagnóstico de Injeção Eletrônica';
                    const preNotes = `Relatório gerado via Triagem de IA. Sintomas: ${symptoms}. Possíveis causas: ${result.possibleCauses.join(', ')}`;
                    onPreFillBooking(mainServ, preNotes);
                  }}
                  className="w-full sm:w-auto px-4.5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Agendar Solução via Diagnóstico
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
