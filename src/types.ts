export interface CarInfo {
  make: string;
  model: string;
  year: string;
  engine?: string;
}

export interface DiagnosticResult {
  possibleCauses: string[];
  urgency: 'Baixa' | 'Média' | 'Alta' | string;
  recommendations: string[];
  faiscaServices: string[];
  professionalAdvice: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  carModel: string;
  carYear: string;
  serviceType: string;
  date: string;
  time: string;
  notes?: string;
  status: 'Pendente de Confirmação' | 'Confirmado' | 'Concluído';
  createdAt: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  priceEstimate: string; // Base price or range, e.g. "A partir de R$ 80"
  iconName: string;
  items: string[];
}

export interface WorkOrderItem {
  id: string;
  name: string;
  price: number;
}

export interface WorkOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  carModel: string;
  carYear: string;
  licensePlate: string;
  
  // Status flags
  status: 'Orçamento Rascunho' | 'Orçamento Pendente' | 'Orçamento Aprovado' | 'Check-In Realizado' | 'Em Serviço' | 'Pronto para Retirada' | 'Entregue' | 'Rejeitado';
  
  // Budget pricing structures
  parts: WorkOrderItem[];
  labor: WorkOrderItem[];
  discount: number;
  totalPrice: number;
  
  // Check-In Milestones
  checkInDate?: string;
  checkInKm?: string;
  checkInFuelLevel?: 'Vazio' | '1/4' | '1/2' | '3/4' | 'Cheio';
  checkInNotes?: string;
  checkInChecklist?: {
    stepe: boolean;
    extintor: boolean;
    macaco: boolean;
    som: boolean;
    riscos: boolean;
  };
  
  // Check-Out Milestones
  checkOutDate?: string;
  checkOutTestedBy?: string;
  checkOutNotes?: string;
  warrantyDays?: number; // e.g. 90
  
  createdAt: string;
}

