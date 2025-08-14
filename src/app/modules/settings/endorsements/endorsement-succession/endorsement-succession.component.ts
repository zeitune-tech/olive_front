import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EndorsementService, SuccessionRules, Nature } from '@core/services/settings/endorsement/endorsement.service';

interface NatureItem { value: Nature; labelKey: string; }

const NATURES: NatureItem[] = [
  { value: 'MODIFICATION',                labelKey: 'entities.endorsment.options.nature.MODIFICATION' },
  { value: 'INCORPORATION',               labelKey: 'entities.endorsment.options.nature.INCORPORATION' },
  { value: 'RETRACT',                     labelKey: 'entities.endorsment.options.nature.RETRACT' },
  { value: 'SUSPENSION',                  labelKey: 'entities.endorsment.options.nature.SUSPENSION' },
  { value: 'REINSTATEMENT_WITH_DISCOUNT', labelKey: 'entities.endorsment.options.nature.REINSTATEMENT_WITH_DISCOUNT' },
  { value: 'REINSTATEMENT',               labelKey: 'entities.endorsment.options.nature.REINSTATEMENT' },
  { value: 'RENEWAL',                     labelKey: 'entities.endorsment.options.nature.RENEWAL' },
  { value: 'CANCELLATION',                labelKey: 'entities.endorsment.options.nature.CANCELLATION' },
];

// Règles par défaut (validées avec toi)
const DEFAULT_ALLOWED_NEXT: Record<Nature, Nature[]> = {
  MODIFICATION: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  INCORPORATION: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  RETRACT: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  SUSPENSION: ['REINSTATEMENT_WITH_DISCOUNT','REINSTATEMENT','CANCELLATION'],
  REINSTATEMENT_WITH_DISCOUNT: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  REINSTATEMENT: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  RENEWAL: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','CANCELLATION'],
  CANCELLATION: [],
};

@Component({
  selector: 'app-endorsement-succession',
  templateUrl: './endorsement-succession.component.html'
})
export class EndorsementSuccessionComponent implements OnInit, OnDestroy {

  @Output() rulesChange = new EventEmitter<Record<Nature, Nature[]>>();

  natures = NATURES;
  displayedColumns: (Nature | 'from')[] = ['from', ...NATURES.map(n => n.value)];
  form!: FormGroup;

  /** stockage interne: Set pour toggles rapides */
  rules: Record<Nature, Set<Nature>> = {} as any;

  private _destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private endorsementService: EndorsementService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({});

    // Charger depuis l’API et initialiser la matrice
    this.endorsementService.loadSuccessionRules().pipe(takeUntil(this._destroy$)).subscribe();
    this.endorsementService.rules$
      .pipe(takeUntil(this._destroy$))
      .subscribe((serverRules) => {
        const rules = this.isEmpty(serverRules) ? DEFAULT_ALLOWED_NEXT : serverRules;
        this.applyRules(rules);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Réinitialiser aux règles par défaut (locales) */
  resetToDefaults(): void {
    this.applyRules(DEFAULT_ALLOWED_NEXT);
  }

  /** Applique un objet de règles simple dans la structure Set interne */
  private applyRules(r: Record<Nature, Nature[]>): void {
    const next: Record<Nature, Set<Nature>> = {} as any;
    for (const n of this.natures) {
      next[n.value] = new Set(r[n.value] ?? []);
    }
    this.rules = next;
  }

  /** true si l’objet de règles est vide ou non initialisé */
  private isEmpty(r: Partial<SuccessionRules> | undefined | null): boolean {
    if (!r) return true;
    return this.natures.every(n => !Array.isArray((r as any)[n.value]) || (r as any)[n.value].length === 0);
  }

  isAllowed(from: Nature, to: Nature): boolean {
    return this.rules[from]?.has(to) ?? false;
  }

  toggle(from: Nature, to: Nature): void {
    const set = this.rules[from];
    if (set.has(to)) set.delete(to);
    else set.add(to);
  }

  allowAll(from: Nature): void {
    const all = this.natures.map(n => n.value) as Nature[];
    this.rules[from] = new Set(all);
  }

  clearRow(from: Nature): void {
    this.rules[from] = new Set();
  }

  /** Récupère l’objet simple { nature: Nature[] } pour l’API */
  private getRules(): Record<Nature, Nature[]> {
    const out: Record<Nature, Nature[]> = {} as any;
    for (const n of this.natures) {
      out[n.value] = Array.from(this.rules[n.value] ?? []);
    }
    return out;
  }

  /** Sauvegarde côté serveur + émet l’event sortant (si utilisé par le parent) */
  save(): void {
    const toSave = this.getRules();
    this.endorsementService.saveSuccessionRules(toSave)
      .pipe(takeUntil(this._destroy$))
      .subscribe((saved) => {
        // ré-appliquer ce que le serveur a renvoyé (normalisé)
        this.applyRules(saved);
        this.rulesChange.emit(saved);
      });
  }
}
