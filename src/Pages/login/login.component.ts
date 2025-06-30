import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], 
})
export class LoginComponent {
  @Output() trocarTela = new EventEmitter<void>();
  errorMsg = '';

  constructor(private router: Router, private auth: AuthService) {}

 profileForm = new FormGroup({
  usuario: new FormControl('', [Validators.required]),
  senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
});


  onFormSubmit() {
    if (this.profileForm.invalid) {
      this.errorMsg = 'Preencha os campos corretamente.';
      return;
    }

    const username = this.profileForm.value.usuario!;
    const senha = this.profileForm.value.senha!;

    // Django REST Auth espera "username" e "password"
    this.auth.login({ username: username, password: senha }).subscribe({
      next: (res: any) => {
        const token = res.access;
        localStorage.setItem('token', token);
        console.log('Login bem-sucedido! Token:', token);
        this.router.navigate(['/dashboard']); // redireciona após login
      },
     error: (err: any) => {
      console.error('Erro ao fazer login:', err);
      this.errorMsg = 'Usuário ou senha incorretos.';
      }

    });
  }
}
