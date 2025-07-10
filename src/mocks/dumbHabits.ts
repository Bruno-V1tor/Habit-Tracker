export interface IRegistroHabito {
  id: number;
  habito: number;
  dia: string;
 
}

export interface IHabits {
  id: number;
  nome: string;
  descricao: string;
  frequencia: string;
  hora_sugerida: string;
  dias_semana: string[];         // ex: ['Seg', 'Qua', 'Sex']
  registros?: any[];             // registros feitos, não obrigatório
  done_dates?: string[];         // ex: ['2025-07-08', '2025-07-09']
  usuario: number;
}
