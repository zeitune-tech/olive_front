// layout.service.ts
import { Injectable } from '@angular/core';
import { Accessory } from '@core/services/settings/accessory/accessory.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LayoutService {
  private selectedAccessorySubject = new BehaviorSubject<Accessory | null>(null);
  selectedAccessory$ = this.selectedAccessorySubject.asObservable();

  setSelectedAccessory(accessory: Accessory | null) {
    this.selectedAccessorySubject.next(accessory);
  }

  clearSelectedAccessory() {
    this.selectedAccessorySubject.next(null);
  }
}
