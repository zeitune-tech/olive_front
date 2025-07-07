// layout.service.ts
import { Injectable } from '@angular/core';
import { Profile } from '@core/services/auth/profile/profile.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LayoutService {
  private selectedProfileSubject = new BehaviorSubject<Profile | null>(null);
  selectedProfile$ = this.selectedProfileSubject.asObservable();

  setSelectedProfile(product: Profile | null) {
    this.selectedProfileSubject.next(product);
  }

  clearSelectedProfile() {
    this.selectedProfileSubject.next(null);
  }
}
