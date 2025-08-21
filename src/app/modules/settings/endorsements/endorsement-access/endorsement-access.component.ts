import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { EndorsementService } from '@core/services/settings/endorsement/endorsement.service';
import { Endorsment } from '@core/services/settings/endorsement/endorsement.interface';
import {
  EndorsementAccessService,
  AccessAction,
  AccessObject,
  EndorsementAccessRules
} from '@core/services/settings/endorsement/endorsement-access.service';

@Component({
  selector: 'app-endorsement-access',
  templateUrl: './endorsement-access.component.html'
})
export class EndorsementAccessComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  endorsements: Endorsment[] = [];
  rules: EndorsementAccessRules = {};

  // listes affichées
  objects: { key: AccessObject; labelKey: string }[] = [
    { key: 'POLICY',      labelKey: 'entities.access.objects.POLICY' },
    { key: 'RISK',        labelKey: 'entities.access.objects.RISK' },
    { key: 'ATTESTATION', labelKey: 'entities.access.objects.ATTESTATION' },
    { key: 'CLAIM',       labelKey: 'entities.access.objects.CLAIM' },
    { key: 'PRICING',     labelKey: 'entities.access.objects.PRICING' },
    { key: 'CUSTOMER',    labelKey: 'entities.access.objects.CUSTOMER' },
  ];

  actions: { key: AccessAction; labelKey: string }[] = [
    { key: 'VIEW',   labelKey: 'entities.access.actions.VIEW' },
    { key: 'CREATE', labelKey: 'entities.access.actions.CREATE' },
    { key: 'UPDATE', labelKey: 'entities.access.actions.UPDATE' },
    { key: 'DELETE', labelKey: 'entities.access.actions.DELETE' },
    { key: 'EXPORT', labelKey: 'entities.access.actions.EXPORT' },
  ];

  private _destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private endorsementService: EndorsementService,
    private accessService: EndorsementAccessService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      endorsementId: [null],
      objectKey: [null],
      selectedActions: [[] as AccessAction[]],
    });

    // charger les avenants
    this.endorsementService.getAll().pipe(takeUntil(this._destroy$)).subscribe();
    this.endorsementService.endorsements$
      .pipe(takeUntil(this._destroy$))
      .subscribe(list => this.endorsements = list ?? []);

    // charger les règles (front-only pour l’instant)
    this.accessService.load().pipe(takeUntil(this._destroy$)).subscribe();
    this.accessService.rules$
      .pipe(takeUntil(this._destroy$))
      .subscribe(r => {
        this.rules = r ?? {};
        // si un avenant & objet sont déjà sélectionnés, recharger les actions correspondantes
        const eid = this.form.value.endorsementId as string;
        const obj = this.form.value.objectKey as AccessObject;
        if (eid && obj) {
          const current = this.rules[eid]?.[obj] ?? [];
          this.form.patchValue({ selectedActions: [...current] }, { emitEvent: false });
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onEndorsementChange(eid: string): void {
    this.form.patchValue({ endorsementId: eid });
    this.reloadSelection();
  }

  onObjectChange(obj: AccessObject): void {
    this.form.patchValue({ objectKey: obj });
    this.reloadSelection();
  }

  /** Recharge la case à cocher selon rules */
  private reloadSelection(): void {
    const eid = this.form.value.endorsementId as string;
    const obj = this.form.value.objectKey as AccessObject;
    const current = eid && obj ? (this.rules[eid]?.[obj] ?? []) : [];
    this.form.patchValue({ selectedActions: [...current] }, { emitEvent: false });
  }

  /** toggle d’une action via checkbox */
  toggleAction(action: AccessAction, checked: boolean): void {
    const current: AccessAction[] = [...(this.form.value.selectedActions ?? [])];
    const idx = current.indexOf(action);
    if (checked && idx === -1) current.push(action);
    if (!checked && idx !== -1) current.splice(idx, 1);
    this.form.patchValue({ selectedActions: current });
  }

  /** Enregistre dans le stockage local (service) */
  saveOne(): void {
    const eid = this.form.value.endorsementId as string | null;
    const obj = this.form.value.objectKey as AccessObject | null;
    const acts = this.form.value.selectedActions as AccessAction[];

    if (!eid || !obj) {
      console.warn('Veuillez sélectionner un avenant et un objet.');
      return;
    }
    this.accessService.upsertEntry(eid, obj, acts);
  }

  /** Sauvegarde globale (prêt pour PUT/API) */
  saveAll(): void {
    this.accessService.save(this.rules).subscribe();
  }

  /** Helpers UI */
  isActionChecked(action: AccessAction): boolean {
    const acts: AccessAction[] = this.form.value.selectedActions ?? [];
    return acts.includes(action);
  }

  get currentMatrix(): Partial<Record<AccessObject, AccessAction[]>> {
    const eid = this.form.value.endorsementId as string;
    return this.rules[eid] ?? {};
}

}
