import { Component, signal } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CadastroComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  telaAtual = signal<'login' | 'cadastro'>('login');
}
