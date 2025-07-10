import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { arrayDays } from '../../mocks/days';
import { HabitActionsService } from '../../services/habit-actions.service';
import { IHabits } from '../../mocks/dumbHabits';
import { ElementRef, HostListener, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-tabela-semanas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-semanas.component.html',
  styleUrl: './tabela-semanas.component.scss',
  
})
export class TabelaSemanasComponent implements OnInit, OnChanges {
  @Input() habitsDoneThisWeek: any[] = [];
  @Output() atualizarHabitosFeitos = new EventEmitter<void>();

  habitos: IHabits[] = [];
  diasSemana: string[] = arrayDays.map((i) => i.dia);
  mensagemSucesso: string = '';
  menuAbertoId: number | null = null;

  private feitosNaSemanaSet = new Set<string>();

  constructor(public habitActionsService: HabitActionsService,
              private elRef: ElementRef,
              private renderer: Renderer2) {}

  ngOnInit() {
    this.habitActionsService.habitos$.subscribe((habitos) => {
      this.habitos = habitos;
      this.processaFeitosNaSemana();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['habitsDoneThisWeek']) {
      this.processaFeitosNaSemana();
    }
  }

  private processaFeitosNaSemana(): void {
    this.feitosNaSemanaSet.clear();
    this.habitsDoneThisWeek.forEach(registro => {
      this.feitosNaSemanaSet.add(`${registro.habito}-${registro.data}`);
    });
  }

  habitoFoiFeitoNoDia(habito: IHabits, diaSemanaAbreviado: string): boolean {
    const diasSemanaMapa: { [key: string]: number } = {
      'Dom': 0, 'Seg': 1, 'Ter': 2, 'Qua': 3, 'Qui': 4, 'Sex': 5, 'Sáb': 6
    };

    const hoje = new Date();
    const diaAtualSemana = hoje.getDay();
    const diaAlvoIndice = diasSemanaMapa[diaSemanaAbreviado];

    // Calcula a data correspondente ao dia da semana atual
    const dataAlvo = new Date(hoje);
    dataAlvo.setDate(hoje.getDate() - diaAtualSemana + diaAlvoIndice);
    dataAlvo.setHours(0, 0, 0, 0); // Remove horas para comparar data pura

    const dataFormatada = dataAlvo.toISOString().split('T')[0];

    // Verifica se foi feito exatamente naquele dia
    return this.feitosNaSemanaSet.has(`${habito.id}-${dataFormatada}`);
  }

  excluirHabito(habito: IHabits): void {
    this.habitActionsService.remove(habito);
    this.mensagemSucesso = '🗑️ Hábito excluído com sucesso!';
    setTimeout(() => this.mensagemSucesso = '', 3000);
    this.fecharMenu();
    this.atualizarHabitosFeitos.emit(); // Atualiza a lista após exclusão
  }


  marcarFeito(habito: IHabits): void {
    const hoje = new Date();
    const diaAtualSemana = hoje.getDay(); // 0 (Dom) a 6 (Sáb)

    // Mapa de índice para string (Dom, Seg, Ter...)
    const indiceParaDia: { [key: number]: string } = {
      0: 'Dom',
      1: 'Seg',
      2: 'Ter',
      3: 'Qua',
      4: 'Qui',
      5: 'Sex',
      6: 'Sáb'
    };

    const diaHojeStr = indiceParaDia[diaAtualSemana];

    // ❌ Se o hábito não estiver configurado para o dia atual, não permite marcar
    if (!habito.dias_semana.includes(diaHojeStr)) {
      this.mensagemSucesso = '⚠️ Este hábito não está configurado para hoje.';
      setTimeout(() => this.mensagemSucesso = '', 3000);
      this.fecharMenu();
      return;
    }

    const dataFormatada = hoje.toISOString().split('T')[0];

    this.habitActionsService.marcarComoFeito(habito.id, dataFormatada).subscribe({
      next: () => {
        this.mensagemSucesso = '✅ Hábito marcado como feito!';
        setTimeout(() => this.mensagemSucesso = '', 3000);
        this.fecharMenu();
        this.atualizarHabitosFeitos.emit(); // avisa o pai
      },
      error: (err) => console.error('Erro ao marcar hábito como feito:', err),
    });
  }

  alternarMenu(id: number): void {
    this.menuAbertoId = this.menuAbertoId === id ? null : id;
  }

  fecharMenu(): void {
    this.menuAbertoId = null;
  }
  @HostListener('document:click', ['$event'])
  onClickFora(event: MouseEvent) {
    const clicouDentro = this.elRef.nativeElement.contains(event.target);
    if (!clicouDentro) {
      this.menuAbertoId = null;
    }
  }

}
