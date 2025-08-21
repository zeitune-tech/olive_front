import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import {
  EndorsementSuccessionService,
  SuccessionConfig,
  SuccessionRules,
  SuccessionRanks,
  Nature,
  ALL_NATURES
} from '@core/services/settings/endorsement/endorsement-succession.service';

interface NatureItem { value: Nature; labelKey: string; }

const NATURES: NatureItem[] = [
  { value: 'NEW_BUSINESS',               labelKey: 'entities.endorsment.options.nature.NEW_BUSINESS' },
  { value: 'MODIFICATION',               labelKey: 'entities.endorsment.options.nature.MODIFICATION' },
  { value: 'INCORPORATION',              labelKey: 'entities.endorsment.options.nature.INCORPORATION' },
  { value: 'RETRACT',                    labelKey: 'entities.endorsment.options.nature.RETRACT' },
  { value: 'SUSPENSION',                 labelKey: 'entities.endorsment.options.nature.SUSPENSION' },
  { value: 'REINSTATEMENT_WITH_DISCOUNT',labelKey: 'entities.endorsment.options.nature.REINSTATEMENT_WITH_DISCOUNT' },
  { value: 'REINSTATEMENT',              labelKey: 'entities.endorsment.options.nature.REINSTATEMENT' },
  { value: 'RENEWAL',                    labelKey: 'entities.endorsment.options.nature.RENEWAL' },
  { value: 'CANCELLATION',               labelKey: 'entities.endorsment.options.nature.CANCELLATION' },
];

@Component({
  selector: 'app-endorsement-succession',
  templateUrl: './endorsement-succession.component.html'
})
export class EndorsementSuccessionComponent implements OnInit {
  private _destroy$ = new Subject<void>();

  // état
  rules!: SuccessionRules;
  ranks!: SuccessionRanks;

  // ordre affiché (lié aux rangs)
  orderedNatures: NatureItem[] = [...NATURES];

  // colonnes du tableau
  get displayedColumns(): (Nature | 'from')[] {
    return ['from', ...this.orderedNatures.map(n => n.value)];
  }

  constructor(private service: EndorsementSuccessionService) {}

  ngOnInit(): void {
    this.service.load().pipe(takeUntil(this._destroy$)).subscribe();
    this.service.config$.pipe(takeUntil(this._destroy$)).subscribe((cfg: SuccessionConfig) => {
      this.rules = cfg.rules;
      this.ranks = cfg.ranks;
      this.applyOrderFromRanks();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next(); this._destroy$.complete();
  }

  /* ============ Drag & Drop (rangs) ============ */
  dropOrder(event: CdkDragDrop<NatureItem[]>): void {
    moveItemInArray(this.orderedNatures, event.previousIndex, event.currentIndex);
    // Recalcule des rangs consécutifs: NEW_BUSINESS doit rester 1 si tu veux le verrouiller, sinon laisse tel quel.
    this.orderedNatures.forEach((n, idx) => {
      this.ranks[n.value] = idx + 1; // 1..N
    });
  }

  private applyOrderFromRanks(): void {
    this.orderedNatures = [...NATURES].sort((a, b) => (this.ranks[a.value] ?? 999) - (this.ranks[b.value] ?? 999));
  }

  /* ============ Règles ============ */
  isAllowed(from: Nature, to: Nature): boolean {
    return this.rules[from]?.includes(to) ?? false;
  }

  toggle(from: Nature, to: Nature): void {
    const set = new Set(this.rules[from] ?? []);
    set.has(to) ? set.delete(to) : set.add(to);
    this.rules = { ...this.rules, [from]: Array.from(set) as Nature[] };
  }

  allowAll(from: Nature): void {
    this.rules = { ...this.rules, [from]: ALL_NATURES as Nature[] };
  }

  clearRow(from: Nature): void {
    this.rules = { ...this.rules, [from]: [] };
  }

  /* ============ Actions globales ============ */
  resetToDefaults(): void {
    this.service.loadDefaults().pipe(takeUntil(this._destroy$)).subscribe((cfg: SuccessionConfig) => {
      this.rules = cfg.rules;
      this.ranks = cfg.ranks;
      this.applyOrderFromRanks();
    });
  }

  save(): void {
    this.service.save({ rules: this.rules, ranks: this.ranks }).pipe(takeUntil(this._destroy$)).subscribe();
  }
}
