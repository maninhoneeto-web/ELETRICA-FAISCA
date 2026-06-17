import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Rota de Diagnóstico Inteligente com Gemini
  app.post("/api/diagnostic", async (req, res) => {
    try {
      const { symptoms, carInfo } = req.body;

      if (!symptoms || symptoms.trim() === "") {
        return res.status(400).json({ error: "Sintomas não fornecidos." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback estático e amigável caso a chave API não esteja configurada
        return res.json({
          possibleCauses: [
            "Bateria automotiva fraca ou esgotada",
            "Fusível queimado ou relé de partida danificado",
            "Falha no alternador (bateria não carrega)",
            "Problema oculto no cabo terra ou conectores"
          ],
          urgency: "Média",
          recommendations: [
            "Evite forçar demais a chave na ignição para não danificar o motor de arranque.",
            "Evite usar aparelhos elétricos com o motor do carro desligado.",
            "Verifique visualmente se há sinais de oxidação ('zinabre') nos polos da bateria."
          ],
          voltsServices: [
            "Diagnóstico Computadorizado OBD de Injeção Eletrônica",
            "Revisão Eletro-Mecânica Expressa",
            "Teste de Alternador e Substituição de Baterias homologadas"
          ],
          professionalAdvice: "Nota da Volts: Chave API indisponível, mas com base no sintoma relatado, recomendamos fazer um teste de carga de bateria. Venha fazer um teste gratuito conosco na oficina!"
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const carDetail = carInfo 
        ? `${carInfo.make || ''} ${carInfo.model || ''} ${carInfo.year || ''} ${carInfo.engine || ''}`.trim() 
        : "Veículo não especificado";

      const prompt = `Você é o mecânico chefe especialista em tecnologia, eletricidade automotiva e diagnósticos avançados da oficina 'Elétrica Automotiva Volts'.
Um cliente está relatando problemas no carro dele. Analise as informações e forneça um parecer técnico detalhado e acolhedor em português do Brasil.

Veículo: ${carDetail}
Sintomas informados pelo cliente: "${symptoms}"

Responda restritamente no formato do esquema JSON configurado, sem tags extras de markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é o mecânico chefe especialista em tecnologia, eletricidade automotiva e diagnósticos avançados da oficina 'Elétrica Automotiva Volts'. Seja profissional, acolhedor e direto ao ponto. Explique os termos técnicos de modo que um leigo entenda, reforçando que somos a melhor oficina física ('Elétrica Automotiva Volts') para realizar os testes com scanners e ferramentas apropriadas. Foco de atuação: elétrica automotiva, diagnósticos eletrônicos, freios, suspensão e pequenos reparos de mecânica.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              possibleCauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista com 3 ou 4 possíveis causas técnicas do problema"
              },
              urgency: {
                type: Type.STRING,
                description: "Nível de urgência do reparo. Escolha exatamente um: 'Baixa', 'Média', ou 'Alta'"
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista com 2 a 3 conselhos ou procedimentos de segurança para o motorista no curto prazo"
              },
              voltsServices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 2 ou 3 serviços da nossa oficina Volts indicados para resolver o problema apresentado"
              },
              professionalAdvice: {
                type: Type.STRING,
                description: "Um parecer ou recado profissional curto, de 3 ou 4 frases, consolando ou explicando o caso e convidando o cliente a nos visitar amigavelmente."
              }
            },
            required: ["possibleCauses", "urgency", "recommendations", "voltsServices", "professionalAdvice"]
          }
        }
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("A IA respondeu sem conteúdo.");
      }

      const parsedResult = JSON.parse(textOutput);
      return res.json(parsedResult);

    } catch (error: any) {
      console.error("Erro no diagnóstico de IA:", error);
      return res.status(500).json({ 
        error: "Não conseguimos processar o diagnóstico com a inteligência neste momento.",
        details: error.message 
      });
    }
  });

  // Armazenamento em memória dos agendamentos simulados
  const appointments: any[] = [
    {
      id: "VOLTS-7182",
      name: "Roberta Cavalcante",
      phone: "(11) 98765-4321",
      carModel: "Hyundai HB20 1.0",
      carYear: "2019",
      serviceType: "Eletricidade Geral",
      date: "2026-06-11",
      time: "09:30",
      notes: "Ar condicionado parou de esfriar e sinto cheiro de queimado leve na fiação.",
      status: "Confirmado",
      createdAt: new Date().toISOString()
    },
    {
      id: "VOLTS-3918",
      name: "Marcos Souza",
      phone: "(11) 91234-5678",
      carModel: "GM Chevrolet Onix 1.4",
      carYear: "2018",
      serviceType: "Diagnóstico por Scanner OBD",
      date: "2026-06-10",
      time: "14:00",
      notes: "Luz da injeção pisca quando acelera acima de 80km/h.",
      status: "Confirmado",
      createdAt: new Date().toISOString()
    }
  ];

  app.post("/api/appointments", (req, res) => {
    try {
      const { name, phone, carModel, carYear, serviceType, date, time, notes } = req.body;
      if (!name || !phone || !carModel || !serviceType || !date || !time) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios básicos para agendar." });
      }

      const newAppointment = {
        id: "VOLTS-" + Math.floor(1000 + Math.random() * 9000),
        name,
        phone,
        carModel,
        carYear: carYear || "N/Dev",
        serviceType,
        date,
        time,
        notes: notes || "",
        status: "Pendente de Confirmação",
        createdAt: new Date().toISOString()
      };

      appointments.push(newAppointment);
      return res.status(201).json(newAppointment);
    } catch (err: any) {
      return res.status(500).json({ error: "Erro interno ao processar agendamento." });
    }
  });

  app.get("/api/appointments", (req, res) => {
    // Retorna todos os agendamentos, classificando por data
    return res.json(appointments.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  });

  // Armazenamento em memória das Ordens de Serviço (Orçamentos, Check-In e Check-Out)
  const workOrders: any[] = [
    {
      id: "OS-5002",
      clientName: "Roberta Cavalcante",
      clientPhone: "(11) 98765-4321",
      carModel: "Hyundai HB20 1.0",
      carYear: "2019",
      licensePlate: "BRA-3H20",
      status: "Orçamento Pendente",
      parts: [
        { id: "P1", name: "Bateria Moura 60Ah M60G", price: 480 },
        { id: "P2", name: "Jogo de Cabos de Vela Bosch", price: 150 }
      ],
      labor: [
        { id: "L1", name: "Diagnóstico Computadorizado OBD-II", price: 130 },
        { id: "L2", name: "Troca e Configuração de Bateria", price: 80 }
      ],
      discount: 20,
      totalPrice: 820,
      checkInDate: "2026-06-09",
      checkInKm: "45.220 km",
      checkInFuelLevel: "1/2",
      checkInNotes: "Cliente queixa de cheiro de queimado leve. Sem indícios de vazamentos graves.",
      checkInChecklist: {
        stepe: true,
        extintor: true,
        macaco: true,
        som: true,
        riscos: false
      },
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
    },
    {
      id: "OS-8134",
      clientName: "Marcos Souza",
      clientPhone: "(11) 91234-5678",
      carModel: "GM Chevrolet Onix 1.4",
      carYear: "2018",
      licensePlate: "NIX-1A40",
      status: "Check-In Realizado",
      parts: [
        { id: "P1", name: "Pastilha de Freio Cobreq Dianteira", price: 180 },
        { id: "P2", name: "Fluido de Freio Pentosin DOT 4", price: 60 }
      ],
      labor: [
        { id: "L1", name: "Troca de Pastilhas e Sangria de Sistema", price: 150 }
      ],
      discount: 0,
      totalPrice: 390,
      checkInDate: "2026-06-09",
      checkInKm: "68.910 km",
      checkInFuelLevel: "3/4",
      checkInNotes: "Luz de injeção acesa constante em movimento. Detalhes repassados pelo cliente.",
      checkInChecklist: {
        stepe: true,
        extintor: true,
        macaco: true,
        som: true,
        riscos: true
      },
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // yesterday
    }
  ];

  app.get("/api/work-orders", (req, res) => {
    return res.json(workOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  });

  app.post("/api/work-orders", (req, res) => {
    try {
      const {
        clientName,
        clientPhone,
        carModel,
        carYear,
        licensePlate,
        status,
        parts,
        labor,
        discount,
        totalPrice,
        checkInDate,
        checkInKm,
        checkInFuelLevel,
        checkInNotes,
        checkInChecklist,
        checkOutDate,
        checkOutTestedBy,
        checkOutNotes,
        warrantyDays
      } = req.body;

      if (!clientName || !clientPhone || !carModel) {
        return res.status(400).json({ error: "Nome do cliente, telefone e modelo do veículo são obrigatórios." });
      }

      const newWO = {
        id: "OS-" + Math.floor(1000 + Math.random() * 9000),
        clientName,
        clientPhone,
        carModel,
        carYear: carYear || "N/D",
        licensePlate: licensePlate || "S/Placa",
        status: status || "Orçamento Rascunho",
        parts: parts || [],
        labor: labor || [],
        discount: Number(discount) || 0,
        totalPrice: Number(totalPrice) || 0,
        checkInDate: checkInDate || "",
        checkInKm: checkInKm || "",
        checkInFuelLevel: checkInFuelLevel || "Vazio",
        checkInNotes: checkInNotes || "",
        checkInChecklist: checkInChecklist || { stepe: false, extintor: false, macaco: false, som: false, riscos: false },
        checkOutDate: checkOutDate || "",
        checkOutTestedBy: checkOutTestedBy || "",
        checkOutNotes: checkOutNotes || "",
        warrantyDays: Number(warrantyDays) || 90,
        createdAt: new Date().toISOString()
      };

      workOrders.push(newWO);
      return res.status(201).json(newWO);
    } catch (err: any) {
      return res.status(500).json({ error: "Erro interno ao cadastrar ordem de serviço." });
    }
  });

  app.put("/api/work-orders/:id", (req, res) => {
    try {
      const { id } = req.params;
      const index = workOrders.findIndex(wo => wo.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Ordem de serviço não localizada." });
      }

      const updatedData = req.body;
      
      // Update fields
      workOrders[index] = {
        ...workOrders[index],
        ...updatedData,
        // Make sure id and createdAt are immutable
        id: workOrders[index].id,
        createdAt: workOrders[index].createdAt
      };

      return res.json(workOrders[index]);
    } catch (err: any) {
      return res.status(500).json({ error: "Erro interno ao atualizar ordem de serviço." });
    }
  });


  // Configuração dos middlewares do Vite para desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server rodando com sucesso no endereço http://localhost:${PORT}`);
  });
}

startServer();
