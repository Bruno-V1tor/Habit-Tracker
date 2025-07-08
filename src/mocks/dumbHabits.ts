export interface IRegistroHabito {
  id: number;
  habito: number;
  dia: string;
 
}

export interface IHabits {
  id: number;
  nome: string;
  descricao?: string;
  frequencia?: string;
  hora_sugerida?: string;
  dias_semana?: string[];
  registros?: IRegistroHabito[];
  done_dates?: string[];
}
