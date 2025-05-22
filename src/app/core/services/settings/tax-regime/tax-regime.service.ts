import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { TaxRegime } from './tax-regime.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class TaxRegimeService {

  baseUrl = environment.settings_url + '/tax-regimes';
  private _taxRegime = new ReplaySubject<TaxRegime>(1);
  private _taxRegimes = new ReplaySubject<TaxRegime[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set taxRegime(value: TaxRegime) {
    this._taxRegime.next(value);
  }

  get taxRegime$() {
    return this._taxRegime.asObservable();
  }

  set taxRegimes(value: TaxRegime[]) {
    this._taxRegimes.next(value);
  }

  get taxRegimes$() {
    return this._taxRegimes.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(item: TaxRegime): Observable<TaxRegime> {
    return this._httpClient.post<TaxRegime>(this.baseUrl, item).pipe(
      tap((res) => this.taxRegime = res),
      catchError(() => of({} as TaxRegime))
    );
  }

  get(id: string): Observable<TaxRegime> {
    return this._httpClient.get<TaxRegime>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.taxRegime = res),
      catchError(() => of({} as TaxRegime))
    );
  }

  getAll(): Observable<TaxRegime[]> {
    return this._httpClient.get<TaxRegime[]>(this.baseUrl).pipe(
      tap((response: TaxRegime[]) => {
        this.taxRegimes = response;
        return response;
      }),
      catchError(() => of([] as TaxRegime[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<TaxRegime[]> {
    return this._httpClient.get<TaxRegime[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as TaxRegime[]))
    );
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
