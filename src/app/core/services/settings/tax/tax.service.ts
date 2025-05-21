import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Tax } from './tax.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class TaxService {

  baseUrl = environment.settings_url + '/taxes';
  private _tax = new ReplaySubject<Tax>(1);
  private _taxes = new ReplaySubject<Tax[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set tax(value: Tax) {
    this._tax.next(value);
  }

  get tax$() {
    return this._tax.asObservable();
  }

  set taxes(value: Tax[]) {
    this._taxes.next(value);
  }

  get taxes$() {
    return this._taxes.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(item: Tax): Observable<Tax> {
    return this._httpClient.post<Tax>(this.baseUrl, item).pipe(
      tap((res) => this.tax = res),
      catchError(() => of({} as Tax))
    );
  }

  get(id: string): Observable<Tax> {
    return this._httpClient.get<Tax>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.tax = res),
      catchError(() => of({} as Tax))
    );
  }

  getAll(): Observable<Tax[]> {
    return this._httpClient.get<Tax[]>(this.baseUrl).pipe(
      tap((response: any) => {
        this.taxes = response?.content || [];
        this.metadata = response;
        return response;
      }),
      catchError(() => of([] as Tax[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<Tax[]> {
    return this._httpClient.get<Tax[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as Tax[]))
    );
  }
}
