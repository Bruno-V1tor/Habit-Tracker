import { Component, OnInit } from '@angular/core';
import { TabelaSemanasComponent } from '../../Components/tabela-semanas/tabela-semanas.component';
import { ModalComponent } from '../../Components/modal/modal.component';
import { HabitsColunmComponent } from '../../Components/habits-colunm/habits-colunm.component';
import { HabitActionsService } from '../../services/habit-actions.service';
import { IHabits } from '../../mocks/dumbHabits'; 
import { AuthService } from '../../app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,TabelaSemanasComponent, ModalComponent, HabitsColunmComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isModalVisible = false;
  habitos: IHabits[] = [];
  nomeUsuario: string = ''; 

  inicioSemana: string = '';
  fimSemana: string = '';

  habitsDoneThisWeek: any[] = [];
  progressPercent: number = 0;

  constructor(
    private habitActionsService: HabitActionsService,
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserInfo().subscribe({
        next: (user: any) => this.nomeUsuario = user.username,
        error: (err) => console.error('Erro ao buscar usuário:', err),
      });
      this.habitActionsService.fetchHabits(); 

      this.habitActionsService.habitos$.subscribe({
        next: (habitos) => {
          this.habitos = habitos;

          // Só atualiza progresso quando os hábitos estiverem carregados
          this.habitActionsService.getHabitsDoneThisWeek().subscribe({
            next: (data: any[]) => {
              this.habitsDoneThisWeek = data;
              this.calculateProgress();
            },
            error: (err) => console.error('Erro ao buscar hábitos feitos:', err),
          });
        },
        error: (err) => console.error('Erro ao buscar hábitos:', err),
      });


      this.habitActionsService.getHabitsDoneThisWeek().subscribe({
        next: (data: any[]) => {
          console.log('Hábitos feitos:', data); 
          this.habitsDoneThisWeek = data;
          this.calculateProgress();
        },
        error: (err) => console.error('Erro ao buscar hábitos feitos:', err),
      });
    }
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }

  calculateProgress(): void {
    const startOfWeek = this.getStartOfWeek(new Date());
    const endOfWeek = this.getEndOfWeek(new Date());

    const registrosSemana = this.habitsDoneThisWeek.filter(registro => {
      const dataRegistro = new Date(registro.data);
      return dataRegistro >= startOfWeek && dataRegistro <= endOfWeek;
    });

    const totalFeitos = registrosSemana.length;
    const totalPossivel = 7 * this.habitos.length;

    this.progressPercent = totalPossivel === 0 ? 0 : Math.min(100, Math.round((totalFeitos / totalPossivel) * 100));
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }

  getEndOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() + (6 - day);
    return new Date(date.setDate(diff));
  }
  atualizarProgresso(): void {
    this.habitActionsService.getHabitsDoneThisWeek().subscribe({
      next: (data: any[]) => {
        this.habitsDoneThisWeek = data;
        this.calculateProgress();
      },
      error: (err) => console.error('Erro ao atualizar hábitos feitos:', err),
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']); 
  }

}
