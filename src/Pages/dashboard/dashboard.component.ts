import { Component } from '@angular/core';
import { TabelaSemanasComponent } from '../../Components/tabela-semanas/tabela-semanas.component';
import { ModalComponent } from '../../Components/modal/modal.component';
import { HabitsColunmComponent } from '../../Components/habits-colunm/habits-colunm.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TabelaSemanasComponent, ModalComponent, HabitsColunmComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isModalVisible = false;

  openModal(): void {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }
}
