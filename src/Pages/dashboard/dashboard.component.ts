// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';
import { HabitActionsService } from '../../services/habit-actions.service';
import { TabelaSemanasComponent } from '../../Components/tabela-semanas/tabela-semanas.component';
import { ModalComponent } from '../../Components/modal/modal.component';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core'; // 👈 importe isso

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TabelaSemanasComponent, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
  
})
export class DashboardComponent implements OnInit {
  habitos: any[] = [];
  habitsDoneThisWeek: any[] = [];
  nomeUsuario: string = '';
  isModalVisible: boolean = false;
  progressPercent: number = 0;
  inicioSemana: string = '';
  fimSemana: string = '';

  constructor(
    private router: Router,
    public authService: AuthService,
    public habitActionsService: HabitActionsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.calcularIntervaloSemana();

    if (this.authService.isLoggedIn()) {
      this.authService.getUserInfo().subscribe({
        next: (user: any) => this.nomeUsuario = user.username,
        error: (err) => console.error('Erro ao buscar usuário:', err),
      });

      this.habitActionsService.fetchHabits();

      this.habitActionsService.habitos$.subscribe({
        next: (habitos) => {
          this.habitos = habitos;

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
          this.habitsDoneThisWeek = data;
          this.calculateProgress();
        },
        error: (err) => console.error('Erro ao buscar hábitos feitos:', err),
      });
    }
  }

  calculateProgress(): void {
    const totalDias = this.habitos.reduce((acc, hab) => acc + hab.dias_semana.length, 0);
    const feitos = this.habitsDoneThisWeek.length;
    this.progressPercent = totalDias > 0 ? Math.round((feitos / totalDias) * 100) : 0;
  }

  calcularIntervaloSemana(): void {
    const hoje = new Date();
    const diaSemana = hoje.getDay();

    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - diaSemana);
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);

    this.inicioSemana = inicio.toISOString().split('T')[0];
    this.fimSemana = fim.toISOString().split('T')[0];
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  hideModal(): void {
    this.isModalVisible = false;
  }

 

  logout() {
    // Limpa qualquer dado de autenticação, se houver
    localStorage.removeItem('token'); // exemplo

    // Redireciona para a tela de login (rota '/home')
    this.router.navigate(['/home']);
  }


  mostrarTabela: boolean = true;

  atualizarHabitosFeitos(): void {
    this.habitActionsService.getHabitsDoneThisWeek().subscribe({
      next: (data) => {
        this.habitsDoneThisWeek = [...data];
        this.calculateProgress();
        this.cdr.detectChanges(); // 👈 força a detecção da mudança
      },
      error: (err) => console.error('Erro ao atualizar hábitos feitos:', err),
    });
  }

  carregarHabitosFeitos(): void {
  this.habitActionsService.getHabitsDoneThisWeek().subscribe({
    next: (data: any[]) => {
      this.habitsDoneThisWeek = data;
      this.calculateProgress();
    },
    error: (err) => console.error('Erro ao buscar hábitos feitos:', err),
  });
}


}
