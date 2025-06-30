import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  @Output() trocarTela = new EventEmitter<void>();
  errorMsg = '';
  successMsg = '';

  constructor(private router: Router, private auth: AuthService) {}

  profileForm = new FormGroup({
    // Alterado 'nome' para 'username' aqui
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    reSenha: new FormControl('', [Validators.required]),
  });

  onFormSubmit() {
    if (this.profileForm.invalid) {
      this.errorMsg = 'Preencha todos os campos corretamente.';
      return;
    }

    
    const { username, email, senha, reSenha } = this.profileForm.value;

    if (senha !== reSenha) {
      this.errorMsg = 'As senhas não coincidem.';
      return;
    }

    const payload = {
      username: username!, 
      email: email!,
      password: senha!,
      re_password: reSenha!,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.successMsg = 'Usuário cadastrado com sucesso!';
        this.errorMsg = '';
        this.trocarTela.emit(); // Voltar para login
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        if (err.status === 400 && err.error) {
          this.errorMsg = JSON.stringify(err.error);
        } else if (err.status === 500) {
          this.errorMsg = 'Erro interno no servidor. Verifique os dados e tente novamente.';
        } else {
          this.errorMsg = 'Erro ao cadastrar usuário.';
        }
        this.successMsg = '';
      },
    });
  }
}