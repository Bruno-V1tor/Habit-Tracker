import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-menssage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-menssage.component.html',
  styleUrl: './error-menssage.component.scss',
})
export class ErrorMenssageComponent {
  @Input() control!:
    | AbstractControl<string>
    | FormGroup<{
        nome: FormControl<string | null>;
        email: FormControl<string | null>;
        senha: FormControl<string | null>;
      }>;
  @Input() submited = false;
}
