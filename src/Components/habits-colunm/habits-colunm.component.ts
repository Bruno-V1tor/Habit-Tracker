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

      
      h.forEach(habito => {
        console.log(`Habito: ${habito.nome}, done_dates:`, habito.done_dates);
      });
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
    const diaSemanaNome = this.getDiaSemanaNome(hoje.getDay()); // Ex: 'Quarta'

    // 🔍 Normalize para comparar corretamente
    const diaSemanaFormatado = diaSemanaNome.toLowerCase();
    const diasHabitoFormatados = habito.dias_semana?.map(d => d.toLowerCase());

    if (!diasHabitoFormatados?.includes(diaSemanaFormatado)) {
      alert(`Esse hábito não está programado para ${diaSemanaNome}.`);
      return;
    }

    const dia = hoje.toISOString().split('T')[0]; // 'yyyy-mm-dd'

    if (!habito.id) return;

    this.habitActionsService.marcarComoFeito(habito.id, dia).subscribe({
      next: () => {
        alert('Hábito marcado como feito!');
        this.habitoFeito.emit();
        this.habitActionsService.fetchHabits(); // Atualiza a lista após marcar
      },
      error: (err) => {
        console.error('Erro ao marcar como feito:', err);
        alert('Erro ao marcar hábito como feito.');
      },
    });
  }



  getDiaSemanaNome(index: number): string {
    const diasAbreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return diasAbreviados[index];
  }


  getCorDoDia(habito: IHabits, diaSemana: number): string {
    const hoje = new Date();
    const data = new Date(hoje);
    const diaAtualSemana = hoje.getDay();
    const diferenca = diaSemana - diaAtualSemana;
    data.setDate(hoje.getDate() + diferenca);

    const dataStr = data.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const nomeDia = this.getDiaSemanaNome(diaSemana);

    const selecionado = habito.dias_semana?.includes(nomeDia);
    const feito = habito.done_dates?.includes(dataStr);  // importante: data em string exata

    if (feito) return 'verde';
    if (!selecionado) return 'branco';
    return 'vermelho';
  }


}
