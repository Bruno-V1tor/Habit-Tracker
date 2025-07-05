import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IDays, arrayDays } from '../../mocks/days';
import { HabitActionsService } from '../../services/habit-actions.service';
import { AuthService } from '../../app/services/auth.service'; // 👈 importar o AuthService
import { IHabits } from '../../mocks/dumbHabits';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  dias: IDays[] = arrayDays;

  form = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    dias_semana: new FormControl<string[]>([], [Validators.required])
  });

  mensagemSucesso = '';
  mensagemErro = '';

  // 👇 injetar AuthService também
  constructor(
    public habitActionsService: HabitActionsService,
    private authService: AuthService
  ) {}

  closeModal(): void {
    this.close.emit();
  }

  onDiaSelecionado(event: Event) {
    const input = event.target as HTMLInputElement;
    const dia = input.value;
    let dias = this.form.get('dias_semana')?.value || [];

    if (input.checked) {
      dias = [...dias, dia];
    } else {
      dias = dias.filter((d: string) => d !== dia);
    }

    this.form.get('dias_semana')?.setValue(dias);
  }

  onFormSubmit() {
    const formValue = this.form.value;

    if (!formValue.nome) {
      this.mensagemErro = 'Nome é obrigatório';
      return;
    }

    const userId = this.authService.getUserIdFromToken(); // 👈 pega o ID do usuário

    if (!userId) {
      this.mensagemErro = 'Você precisa estar logado para criar hábitos.';
      return;
    }

    const diasSelecionados = formValue.dias_semana || [];

    const payload = {
      usuario: userId,
      nome: formValue.nome,
      descricao: '',
      frequencia: 'D',
      hora_sugerida: '08:00:00',
      dias_semana: diasSelecionados,
    };

    this.habitActionsService.createHabit(payload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Hábito criado com sucesso!';
        this.form.reset({ dias_semana: [] });
        this.mensagemErro = '';
        this.habitActionsService.fetchHabits();
      },
      error: (err: any) => {
        console.error('Erro completo ao criar hábito:', err);
        this.mensagemErro = 'Erro ao criar hábito. Verifique se está logado.';    
      } 
    });
  }
}
