import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';
import { TaxExemption } from './tax-exemption.interface';

@Injectable({ providedIn: 'root' })
export class TaxExemptionService {

  baseUrl = environment.settings_url + '/tax-exemptions';
  private _taxExemption = new ReplaySubject<TaxExemption>(1);
  private _taxExemptions = new ReplaySubject<TaxExemption[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set TaxExemption(value: TaxExemption) {
    this._taxExemption.next(value);
  }

  get TaxExemption$() {
    return this._taxExemption.asObservable();
  }

  set taxExemptions(value: TaxExemption[]) {
    this._taxExemptions.next(value);
  }

  get taxExemptions$() {
    return this._taxExemptions.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(TaxExemption: TaxExemption): Observable<TaxExemption> {
    return this._httpClient.post<TaxExemption>(`${this.baseUrl}`, TaxExemption).pipe(
      tap((res) => this.TaxExemption = res),
      catchError(() => of({} as TaxExemption))
    );
  }

  get(id: string): Observable<TaxExemption> {
    return this._httpClient.get<TaxExemption>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.TaxExemption = res),
      catchError(() => of({} as TaxExemption))
    );
  }

  getAll(): Observable<TaxExemption[]> {
    return this._httpClient.get<TaxExemption[]>(this.baseUrl).pipe(
      tap((response: TaxExemption[]) => {
        this.taxExemptions = response;
        return response;
      }),
      catchError(() => of([] as TaxExemption[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<TaxExemption[]> {
    return this._httpClient.get<TaxExemption[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as TaxExemption[]))
    );
  }

  update(id: string, TaxExemption: Partial<TaxExemption>): Observable<TaxExemption> {
    return this._httpClient.put<TaxExemption>(`${this.baseUrl}/${id}`, TaxExemption).pipe(
      tap((res) => {
        this.TaxExemption = res;
        return res;
      }),
      catchError(() => of({} as TaxExemption))
    );
  }
}
