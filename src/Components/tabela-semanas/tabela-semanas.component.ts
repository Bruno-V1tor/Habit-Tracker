import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { arrayDays, IDays } from '../../mocks/days';
import { habitos, IHabits } from '../../mocks/dumbHabits';
import { HabitActionsService } from '../../services/habit-actions.service';

@Component({
  selector: 'app-tabela-semanas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-semanas.component.html',
  styleUrl: './tabela-semanas.component.scss',
})
export class TabelaSemanasComponent {
  constructor(public habitActionsService: HabitActionsService) {}
  habitos: IHabits[] = [];

  ngOnInit() {
    this.habitActionsService.habitos$.subscribe(habitos => {
      this.habitos = habitos;
    });

  }

  diasSemana: String[] = arrayDays.map((i) => i.dia);
}
