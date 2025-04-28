import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StepperDataService {
  private levelSubject = new BehaviorSubject<string | null>(null);
  level$ = this.levelSubject.asObservable();

  setLevel(level: string) {
    this.levelSubject.next(level);
  }
}
