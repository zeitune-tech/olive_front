// layout.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Endorsment } from '@core/services/settings/endorsement/endorsement.interface';

@Injectable()
export class LayoutService {
  private selectedEndorsementSubject = new BehaviorSubject<Endorsment | null>(null);
  selectedEndorsement$ = this.selectedEndorsementSubject.asObservable();

  setSelectedEndorsement(endorsement: Endorsment | null) {
    this.selectedEndorsementSubject.next(endorsement);
  }

  clearSelectedEndorsement() {
    this.selectedEndorsementSubject.next(null);
  }
}
