import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '@env/environment';

/** Objets/ressources cibles */
export type AccessObject = 'POLICY' | 'RISK' | 'ATTESTATION' | 'CLAIM' | 'PRICING' | 'CUSTOMER';

/** Actions possibles */
export type AccessAction = 'CREATE' | 'DELETE' | 'VIEW' | 'UPDATE' | 'EXPORT';

/** Matrice des droits pour un avenant (partielle pour la souplesse côté front) */
export type AccessMatrix = Partial<Record<AccessObject, AccessAction[]>>;

/** Règles globales : par endorsementId */
export type EndorsementAccessRules = Record<string /* endorsementId */, AccessMatrix>;

@Injectable({ providedIn: 'root' })
export class EndorsementAccessService {
  // Si tu branches le back, ce chemin sera utilisé
  private baseUrl = `${environment.settings_url}/endorsements/access-rules`;

  private _rules$ = new ReplaySubject<EndorsementAccessRules>(1);
  get rules$(): Observable<EndorsementAccessRules> {
    return this._rules$.asObservable();
  }

  constructor(private http: HttpClient) {}

  /* ====================== FRONT-ONLY (mock) ====================== */

  /** Charge les règles (mock front). Remplace par un GET quand le back sera prêt. */
  load(): Observable<EndorsementAccessRules> {
    const empty: EndorsementAccessRules = {};
    this._rules$.next(empty);
    return of(empty);

    // -- Version backend (à activer le moment venu) --
    // return this.http.get<EndorsementAccessRules>(this.baseUrl).pipe(
    //   tap(r => this._rules$.next(this.normalize(r))),
    //   catchError(err => { console.error('[AccessRules] load error:', err); this._rules$.next({}); return of({}); })
    // );
  }

  /** Sauvegarde les règles (mock front). Remplace par un PUT quand le back sera prêt. */
  save(rules: EndorsementAccessRules): Observable<EndorsementAccessRules> {
    const normalized = this.normalize(rules);
    this._rules$.next(normalized);
    return of(normalized);

    // -- Version backend (à activer le moment venu) --
    // return this.http.put<EndorsementAccessRules>(this.baseUrl, rules).pipe(
    //   tap(saved => this._rules$.next(this.normalize(saved))),
    //   catchError(err => { console.error('[AccessRules] save error:', err); return of(this.normalize(rules)); })
    // );
  }

  /** Met à jour/insère une entrée (un avenant + un objet) dans l’état local */
  upsertEntry(endorsementId: string, objectKey: AccessObject, actions: AccessAction[]) {
    // Récupère l’état courant (instantané)
    let cur: EndorsementAccessRules | undefined;
    this.rules$.subscribe(v => (cur = v)).unsubscribe();

    const next: EndorsementAccessRules = this.clone(cur ?? {});
    next[endorsementId] ??= {} as AccessMatrix;
    // dédoublonnage
    next[endorsementId][objectKey] = Array.from(new Set(actions));

    this._rules$.next(this.normalize(next));
  }

  /* ====================== Helpers & Normalisation ====================== */

  private normalize(r: any): EndorsementAccessRules {
    if (!r || typeof r !== 'object') return {};

    const out: EndorsementAccessRules = {};

    for (const endId of Object.keys(r)) {
      const matrix = r[endId] ?? {};
      const outMatrix: AccessMatrix = {};

      // on ne garde que les objets autorisés
      for (const objKey of Object.keys(matrix)) {
        const k = objKey as AccessObject;
        if (!ALLOWED_OBJECTS.includes(k)) continue;

        // cast en unknown[] puis filtrage via type guard
        const arrAny: unknown[] = Array.isArray(matrix[objKey]) ? matrix[objKey] : [];
        const cleaned: AccessAction[] = arrAny.filter(isAccessAction);

        // dédoublonnage
        outMatrix[k] = Array.from(new Set(cleaned));
      }

      out[endId] = outMatrix;
    }

    return out;
  }

  private clone<T>(x: T): T {
    return JSON.parse(JSON.stringify(x));
  }
}

/* ====================== Constantes & Type Guards ====================== */

const ALLOWED_OBJECTS: AccessObject[] = [
  'POLICY', 'RISK', 'ATTESTATION', 'CLAIM', 'PRICING', 'CUSTOMER'
];

const ALLOWED_ACTIONS: AccessAction[] = [
  'VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'
];

function isAccessAction(v: unknown): v is AccessAction {
  return typeof v === 'string' && ALLOWED_ACTIONS.includes(v as AccessAction);
}
