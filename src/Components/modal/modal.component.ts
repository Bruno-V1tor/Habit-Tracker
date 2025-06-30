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

    status: new FormGroup(
      Object.fromEntries(
        this.dias.map((day) => [day.id, new FormControl(false, { nonNullable: true })])
      )
    ),
  });

  constructor(public habitActionsService: HabitActionsService) {}

  closeModal(): void {
    this.close.emit();
  }

  mensagemSucesso = '';

onFormSubmit() {
  const formValue = this.form.value;
  if (formValue.nome && typeof formValue.nome === 'string') {
    const jaExiste = this.habitActionsService.getHabitos()
     .some((hab: IHabits) => hab.nome.toLowerCase() === formValue.nome!.toLowerCase())


    if (jaExiste) {
      this.mensagemSucesso = 'Já existe um hábito com esse nome.';
      return;
    }

    this.habitActionsService.add({
      nome: formValue.nome,
      status: this.dias.map(
        (day) => (formValue.status as { [x: string]: boolean })[day.id]
      ),
    });

    this.mensagemSucesso = 'Hábito adicionado com sucesso!';
    this.form.reset(); // limpa o form após envio
  }
}

}
