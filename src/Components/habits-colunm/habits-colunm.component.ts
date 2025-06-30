import { Component, OnInit, OnDestroy } from '@angular/core';
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


}
