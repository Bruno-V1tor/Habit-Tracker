import { Injectable } from '@angular/core';
import { IHabits, habitos } from '../mocks/dumbHabits';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HabitActionsService {
  private _habitos = new BehaviorSubject<IHabits[]>(habitos);
  habitos$ = this._habitos.asObservable();


  add(tarefa: IHabits) {
    const current = this._habitos.getValue();
    this._habitos.next([...current, tarefa]);
  }

  getHabitos(): IHabits[] {
  return this._habitos.getValue();
  }

  remove(habito: IHabits) {
  const atual = this._habitos.getValue();
  const filtrado = atual.filter((h) => h !== habito);
  this._habitos.next(filtrado);
}


}
