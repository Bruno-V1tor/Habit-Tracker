import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { arrayDays } from '../../mocks/days';
import { HabitActionsService } from '../../services/habit-actions.service';
import { IHabits, IRegistroHabito } from '../../mocks/dumbHabits';

@Component({
  selector: 'app-tabela-semanas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-semanas.component.html',
  styleUrl: './tabela-semanas.component.scss',
})
export class TabelaSemanasComponent implements OnInit {
  habitos: IHabits[] = [];
  diasSemana: string[] = arrayDays.map((i) => i.dia);

  constructor(public habitActionsService: HabitActionsService) {}

  ngOnInit() {
    this.habitActionsService.habitos$.subscribe((habitos) => {
      this.habitos = habitos;
    });
  }

  habitoFoiFeitoNoDia(habito: IHabits, diaSemana: string): boolean {
    if (!habito.registros) return false;

    const hoje = new Date();
    const indiceDia = this.diasSemana.findIndex((d) => d === diaSemana);
    const data = new Date(hoje);
    const diferenca = indiceDia - hoje.getDay();
    data.setDate(hoje.getDate() + diferenca);
    const dataFormatada = data.toISOString().split('T')[0]; // 'yyyy-mm-dd'

    return habito.registros.some((registro) => registro.dia === dataFormatada);
  }
}
