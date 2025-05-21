import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { BaseTax } from './base-tax.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class BaseTaxService {

  baseUrl = environment.settings_url + '/base-taxes';
  private _baseTax = new ReplaySubject<BaseTax>(1);
  private _baseTaxes = new ReplaySubject<BaseTax[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set baseTax(value: BaseTax) {
    this._baseTax.next(value);
  }

  get baseTax$() {
    return this._baseTax.asObservable();
  }

  set baseTaxes(value: BaseTax[]) {
    this._baseTaxes.next(value);
  }

  get baseTaxes$() {
    return this._baseTaxes.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(baseTax: BaseTax): Observable<BaseTax> {
    return this._httpClient.post<BaseTax>(this.baseUrl, baseTax).pipe(
      tap((res) => this.baseTax = res),
      catchError(() => of({} as BaseTax))
    );
  }

  get(id: string): Observable<BaseTax> {
    return this._httpClient.get<BaseTax>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.baseTax = res),
      catchError(() => of({} as BaseTax))
    );
  }

  getAll(): Observable<BaseTax[]> {
    return this._httpClient.get<BaseTax[]>(this.baseUrl).pipe(
      tap((response: any) => {
        this.baseTaxes = response?.content || [];
        this.metadata = response;
        return response;
      }),
      catchError(() => of([] as BaseTax[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<BaseTax[]> {
    return this._httpClient.get<BaseTax[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as BaseTax[]))
    );
  }
}
