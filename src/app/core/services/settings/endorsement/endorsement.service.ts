import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "@core/services/common.interface";
import { environment } from "@env/environment";
import { catchError, forkJoin, Observable, of, ReplaySubject, tap } from "rxjs";
import { Endorsment } from "./endorsement.interface";
import { Injectable } from "@angular/core";


/* --------------------- Types pour la succession --------------------- */
export type Nature =
  | 'MODIFICATION'
  | 'RENEWAL'
  | 'SUSPENSION'
  | 'REINSTATEMENT_WITH_DISCOUNT'
  | 'REINSTATEMENT'
  | 'CANCELLATION'
  | 'RETRACT'
  | 'INCORPORATION';

export type SuccessionRules = Record<Nature, Nature[]>;


@Injectable({ providedIn: 'root' })
export class EndorsementService {
    baseUrl = environment.settings_url + '/endorsements';
    private _endorsement = new ReplaySubject<Endorsment>(1);
    private _endorsements = new ReplaySubject<Endorsment[]>(1);
    private _metadata = new ReplaySubject<RequestMetadata>(1);
    
    // ---- Succession Rules state ----
    private _rules = new ReplaySubject<SuccessionRules>(1);
    get rules$(): Observable<SuccessionRules> { return this._rules.asObservable(); }

    set endorsement(value: Endorsment) {
        this._endorsement.next(value);
    }
    
    get endorsement$() {
        return this._endorsement.asObservable();
    }
    
    set endorsements(value: Endorsment[]) {
        this._endorsements.next(value);
    }
    
    get endorsements$() {
        return this._endorsements.asObservable();
    }
    
    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
    }
    
    get metadata$() {
        return this._metadata.asObservable();
    }
    
    constructor(private _httpClient: HttpClient) {}

    create(endorsement: Endorsment): Observable<Endorsment> {
        return this._httpClient.post<Endorsment>(`${this.baseUrl}`, endorsement).pipe(
            tap((res) => this.endorsement = res),
            catchError(() => of({} as Endorsment))
        );
    }
    get(id: string): Observable<Endorsment> {
        return this._httpClient.get<Endorsment>(`${this.baseUrl}/${id}`).pipe(
            tap((res) => this.endorsement = res),
            catchError(() => of({} as Endorsment))
        );
    }

    getAll(): Observable<Endorsment[]> {
        return this._httpClient.get<Endorsment[]>(this.baseUrl).pipe(
            tap((response: Endorsment[]) => {
                this.endorsements = response;
                return response;
            }),
            catchError(() => of([] as Endorsment[]))
        );
    }

    update(id: string, endorsement: any): Observable<Endorsment> {
        return this._httpClient.put<Endorsment>(`${this.baseUrl}/${id}`, endorsement).pipe(
            tap((res) => {
                this.endorsement = res;
                return (res);
            }),
            catchError(() => of({} as Endorsment))
        );        
    }

    assignProducts(endorsementId: string, productIds: string[]): Observable<any[]> {
        const requests = productIds.map(productId =>
            this._httpClient.put(`${this.baseUrl}/${endorsementId}/add-product/${productId}`, {})
        );
        return forkJoin(requests);
    }

    removeProducts(endorsementId: string, productIds: string[]): Observable<any[]> {
        const requests = productIds.map(productId =>
            this._httpClient.put(`${this.baseUrl}/${endorsementId}/remove-product/${productId}`, {})
        );
        return forkJoin(requests);
    }

    /* ==================== Succession Rules ==================== */

    /** Charge les règles depuis l’API (pousse dans rules$) */
    loadSuccessionRules(): Observable<SuccessionRules> {
        const url = `${this.baseUrl}/succession-rules`;
        return this._httpClient.get<SuccessionRules>(url).pipe(
            tap((rules) => this._rules.next(this.normalizeRules(rules))),
            catchError((err) => {
                console.error('[EndorsementService] loadSuccessionRules error:', err);
                const empty = {} as SuccessionRules;
                this._rules.next(empty);
                return of(empty);
            })
        );
    }

    /** Sauvegarde les règles (PUT idempotent) et met à jour le cache local */
    saveSuccessionRules(rules: SuccessionRules): Observable<SuccessionRules> {
        const url = `${this.baseUrl}/succession-rules`;
        return this._httpClient.put<SuccessionRules>(url, rules).pipe(
            tap((saved) => this._rules.next(this.normalizeRules(saved))),
            catchError((err) => {
                console.error('[EndorsementService] saveSuccessionRules error:', err);
                // On renvoie ce que l’UI avait, pour ne pas casser le flux
                return of(rules);
            })
        );
    }

    /** (Optionnel) Charger des règles par défaut côté serveur */
    loadDefaultSuccessionRules(): Observable<SuccessionRules> {
        const url = `${this.baseUrl}/succession-rules/defaults`;
        return this._httpClient.get<SuccessionRules>(url).pipe(
            tap((rules) => this._rules.next(this.normalizeRules(rules))),
            catchError((err) => {
                console.error('[EndorsementService] loadDefaultSuccessionRules error:', err);
                const empty = {} as SuccessionRules;
                this._rules.next(empty);
                return of(empty);
            })
        );
    }

    /** Harmonise la réponse pour ne garder que les valeurs autorisées */
    private normalizeRules(input: any): SuccessionRules {
        const allowed: Nature[] = [
            'MODIFICATION',
            'RENEWAL',
            'SUSPENSION',
            'REINSTATEMENT_WITH_DISCOUNT',
            'REINSTATEMENT',
            'CANCELLATION',
            'RETRACT',
            'INCORPORATION'
        ];
        const out = {} as SuccessionRules;
        for (const key of allowed) {
            const arr = Array.isArray(input?.[key]) ? input[key] : [];
            out[key] = arr.filter((v: any): v is Nature => allowed.includes(v));
        }
        return out;
    }
}
