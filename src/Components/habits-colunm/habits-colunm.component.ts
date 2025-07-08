import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import { IHabits } from '../../mocks/dumbHabits';
import { CommonModule } from '@angular/common';
import { HabitActionsService } from '../../services/habit-actions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-habits-colunm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habits-colunm.component.html',
  styleUrls: ['./habits-colunm.component.scss'],
})
export class HabitsColunmComponent implements OnInit, OnDestroy {
  habitos: IHabits[] = [];
  private sub!: Subscription;

  @Output() habitoFeito = new EventEmitter<void>();

  constructor(public habitActionsService: HabitActionsService) {}

  ngOnInit() {
    this.sub = this.habitActionsService.habitos$.subscribe((h) => {
      console.log('Hábitos atualizados:', h);
      this.habitos = h;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  excluirHabito(habito: IHabits): void {
    this.habitActionsService.remove(habito);
  }

  marcarFeito(habito: IHabits): void {
    const hoje = new Date();
    const dia = hoje.toISOString().split('T')[0];

    if (!habito.id) return;

    this.habitActionsService.marcarComoFeito(habito.id, dia).subscribe({
      next: () => {
        alert('Hábito marcado como feito!');
        this.habitoFeito.emit();
        this.habitActionsService.fetchHabits();
      },
      error: (err) => {
        console.error('Erro ao marcar como feito:', err);
        alert('Erro ao marcar hábito como feito.');
      },
    });
  }

  getDiaSemanaNome(index: number): string {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[index];
  }

  getCorDoDia(habito: IHabits, diaSemana: number): string {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // domingo

    const dataDoDia = new Date(inicioSemana);
    dataDoDia.setDate(inicioSemana.getDate() + diaSemana);
    const dataStr = dataDoDia.toISOString().split('T')[0];

    const selecionado = habito.dias_semana?.includes(this.getDiaSemanaNome(diaSemana));
    const feito = habito.done_dates?.includes(dataStr);

    if (feito) return 'feito';
    if (!selecionado) return 'nao-selecionado';
    return 'selecionado';
  }
}
