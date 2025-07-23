import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';
import { TaxPrime } from './tax-primes.interface';

@Injectable({ providedIn: 'root' })
export class TaxPrimeService {

  baseUrl = environment.settings_url + '/taxes-primes';
  private _taxPrime = new ReplaySubject<TaxPrime>(1);
  private _taxPrimes = new ReplaySubject<TaxPrime[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set taxPrime(value: TaxPrime) {
    this._taxPrime.next(value);
  }

  get taxPrime$() {
    return this._taxPrime.asObservable();
  }

  set taxPrimes(value: TaxPrime[]) {
    this._taxPrimes.next(value);
  }

  get taxPrimes$() {
    return this._taxPrimes.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(taxPrime: TaxPrime): Observable<TaxPrime> {
    return this._httpClient.post<TaxPrime>(`${this.baseUrl}`, taxPrime).pipe(
      tap((res) => this.taxPrime = res),
      catchError(() => of({} as TaxPrime))
    );
  }

  get(id: string): Observable<TaxPrime> {
    return this._httpClient.get<TaxPrime>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.taxPrime = res),
      catchError(() => of({} as TaxPrime))
    );
  }

  getAll(): Observable<TaxPrime[]> {
    return this._httpClient.get<TaxPrime[]>(this.baseUrl).pipe(
      tap((response: TaxPrime[]) => {
        this.taxPrimes = response;
        return response;
      }),
      catchError(() => of([] as TaxPrime[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<TaxPrime[]> {
    return this._httpClient.get<TaxPrime[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as TaxPrime[]))
    );
  }

  update(id: string, taxPrime: Partial<TaxPrime>): Observable<TaxPrime> {
    return this._httpClient.put<TaxPrime>(`${this.baseUrl}/${id}`, taxPrime).pipe(
      tap((res) => {
        this.taxPrime = res;
        return res;
      }),
      catchError(() => of({} as TaxPrime))
    );
  }
}
