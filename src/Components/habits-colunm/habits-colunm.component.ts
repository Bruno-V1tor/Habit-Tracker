import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHabits } from '../../mocks/dumbHabits';
import { CommonModule } from '@angular/common';
import { HabitActionsService } from '../../services/habit-actions.service';
import { Subscription } from 'rxjs';
import { format } from 'date-fns'; 

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

  constructor(public habitActionsService: HabitActionsService) {}

  ngOnInit() {
    this.sub = this.habitActionsService.habitos$.subscribe((h) => {
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
    const dia = hoje.toISOString().split('T')[0]; // yyyy-mm-dd

    if (!habito.id) return; // ou lance erro se for obrigatório

this.habitActionsService.marcarComoFeito(habito.id, dia).subscribe({
      next: () => {
        alert('Hábito marcado como feito!');
        this.habitActionsService.fetchHabits(); // Atualiza lista
      },
      error: (err) => {
        console.error('Erro ao marcar como feito:', err);
        alert('Erro ao marcar hábito como feito.');
      },
    });
  }
}

