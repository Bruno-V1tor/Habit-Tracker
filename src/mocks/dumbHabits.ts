export interface IHabits {
  nome: string;
  status: boolean[];
  // status: boolean[]|[]
}

export const habitos: IHabits[] = [
  { nome: 'Ler', status: [true, false, true, false, true, false, true] },
  { nome: 'Correr', status: [false, true, false, true, false, true, false] },
  {
    nome: 'Ginástica',
    status: [true, true, false, false, true, true, false],
  },
  {
    nome: 'Meta de água',
    status: [false, false, true, true, false, false, true],
  },
];
