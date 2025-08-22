import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@env/environment';

/* -------- Types -------- */
export type Nature =
  | 'NEW_BUSINESS'
  | 'MODIFICATION'
  | 'RENEWAL'
  | 'SUSPENSION'
  | 'REINSTATEMENT_WITH_DISCOUNT'
  | 'REINSTATEMENT'
  | 'CANCELLATION'
  | 'RETRACT'
  | 'INCORPORATION';

export type SuccessionRules = Record<Nature, Nature[]>;
export type SuccessionRanks = Record<Nature, number>;

export interface SuccessionConfig {
  rules: SuccessionRules;
  ranks: SuccessionRanks; // 1 = avant tout
}

/* -------- Domaine -------- */
export const ALL_NATURES: Nature[] = [
  'NEW_BUSINESS',
  'MODIFICATION',
  'INCORPORATION',
  'RETRACT',
  'SUSPENSION',
  'REINSTATEMENT_WITH_DISCOUNT',
  'REINSTATEMENT',
  'RENEWAL',
  'CANCELLATION',
];

/* -------- Fallbacks locaux (utilisés seulement en cas d’erreur backend) -------- */
const DEFAULT_RULES: SuccessionRules = {
  NEW_BUSINESS: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  MODIFICATION: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  INCORPORATION: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  RETRACT:      ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  SUSPENSION:   ['REINSTATEMENT_WITH_DISCOUNT','REINSTATEMENT','CANCELLATION'],
  REINSTATEMENT_WITH_DISCOUNT: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  REINSTATEMENT: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','RENEWAL','CANCELLATION'],
  RENEWAL: ['MODIFICATION','INCORPORATION','RETRACT','SUSPENSION','CANCELLATION'],
  CANCELLATION: [],
};

const DEFAULT_RANKS: SuccessionRanks = {
  NEW_BUSINESS: 1,
  MODIFICATION: 2,
  INCORPORATION: 3,
  RETRACT: 4,
  SUSPENSION: 5,
  REINSTATEMENT_WITH_DISCOUNT: 6,
  REINSTATEMENT: 7,
  RENEWAL: 8,
  CANCELLATION: 9,
};

@Injectable({ providedIn: 'root' })
export class EndorsementSuccessionService {
  /**
   * ⚠️ Adapte la route à ton gateway si besoin.
   * Exemple via APIGateway (rewrite /settings/** → /api/v1/**) :
   * environment.settings_url = '/settings/api/v1';
   */
  private baseUrl = `${environment.settings_url}/endorsements/succession-rules`;

  private _config$ = new ReplaySubject<SuccessionConfig>(1);
  get config$(): Observable<SuccessionConfig> {
    return this._config$.asObservable();
  }

  constructor(private http: HttpClient) {}

  /** Charge la configuration depuis le backend */
  load(): Observable<SuccessionConfig> {
    return this.http.get<Partial<SuccessionConfig>>(this.baseUrl).pipe(
      map(cfg => this.normalize(cfg)),
      tap(cfg => this._config$.next(cfg)),
      catchError(err => {
        console.error('[Succession] load error:', err);
        const fallback = this.normalize({ rules: DEFAULT_RULES, ranks: DEFAULT_RANKS });
        this._config$.next(fallback);
        return of(fallback);
      })
    );
  }

  /**
   * Sauvegarde la configuration complète (rules + ranks).
   * On envoie l’objet tel quel (le backend doit le valider).
   */
  save(cfg: SuccessionConfig): Observable<SuccessionConfig> {
    const toSend = this.normalize(cfg); // on s’assure d’envoyer un objet propre
    return this.http.put<Partial<SuccessionConfig>>(this.baseUrl, toSend).pipe(
      map(saved => this.normalize(saved)),
      tap(saved => this._config$.next(saved)),
      catchError(err => {
        console.error('[Succession] save error:', err);
        // On renvoie ce que l’UI a voulu sauvegarder (normalisé) pour ne pas casser le flux
        const fallback = this.normalize(cfg);
        return of(fallback);
      })
    );
  }

  /**
   * Optionnel : charger des defaults côté backend (si endpoint existant).
   * Sinon, fallback local.
   */
  loadDefaults(): Observable<SuccessionConfig> {
    const url = `${this.baseUrl}/defaults`;
    return this.http.get<Partial<SuccessionConfig>>(url).pipe(
      map(d => this.normalize(d)),
      tap(d => this._config$.next(d)),
      catchError(err => {
        console.error('[Succession] loadDefaults error:', err);
        const fallback = this.normalize({ rules: DEFAULT_RULES, ranks: DEFAULT_RANKS });
        this._config$.next(fallback);
        return of(fallback);
      })
    );
  }

  /**
   * Reset local (si tu préfères ne pas appeler le backend).
   * Sinon crée un POST/PUT /reset côté serveur et appelle-le ici.
   */
  resetToDefaults(): void {
    const def = this.normalize({ rules: DEFAULT_RULES, ranks: DEFAULT_RANKS });
    this._config$.next(def);
  }

  /* ---------------------- Helpers ---------------------- */

  /** Normalise et sécurise l’objet (complète les natures manquantes, nettoie les valeurs) */
  private normalize(input: Partial<SuccessionConfig> | undefined | null): SuccessionConfig {
    const rulesIn = input?.rules ?? {};
    const ranksIn = input?.ranks ?? {};

    // règles : on force toutes les clés de nature et on purge les valeurs non reconnues
    const rules = {} as SuccessionRules;
    for (const n of ALL_NATURES) {
      const arr = Array.isArray((rulesIn as any)[n]) ? (rulesIn as any)[n] : [];
      rules[n] = arr.filter((x: any): x is Nature => ALL_NATURES.includes(x as Nature));
    }

    // rangs : entier >=1 ; unicité simple si collision
    const ranks = {} as SuccessionRanks;
    let next = 1;
    for (const n of ALL_NATURES) {
      const raw = (ranksIn as any)[n];
      const val = Number(raw);
      ranks[n] = Number.isInteger(val) && val > 0 ? val : next++;
    }
    const used = new Set<number>();
    for (const n of ALL_NATURES) {
      let r = ranks[n];
      while (used.has(r)) r++;
      ranks[n] = r;
      used.add(r);
    }

    return { rules, ranks };
  }
}
