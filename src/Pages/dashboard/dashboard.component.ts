import { Component, OnInit } from '@angular/core';
import { TabelaSemanasComponent } from '../../Components/tabela-semanas/tabela-semanas.component';
import { ModalComponent } from '../../Components/modal/modal.component';
import { HabitsColunmComponent } from '../../Components/habits-colunm/habits-colunm.component';
import { HabitActionsService } from '../../services/habit-actions.service';
import { IHabits } from '../../mocks/dumbHabits'; 
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TabelaSemanasComponent, ModalComponent, HabitsColunmComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isModalVisible = false;
  habitos: IHabits[] = [];

  constructor(
    private habitActionsService: HabitActionsService,
    private authService: AuthService  // <<-- injetado aqui!
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.habitActionsService.fetchHabits();
    }
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }
}
