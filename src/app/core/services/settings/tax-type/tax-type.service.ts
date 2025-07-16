import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TaxType } from './tax-type.interface';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class TaxTypeService {

  baseUrl = environment.settings_url + '/app/tax-types';
  private _taxType = new ReplaySubject<TaxType>(1);
  private _taxTypes = new ReplaySubject<TaxType[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set taxType(value: TaxType) {
    this._taxType.next(value);
  }

  get taxType$() {
    return this._taxType.asObservable();
  }

  set taxTypes(value: TaxType[]) {
    this._taxTypes.next(value);
  }

  get taxTypes$() {
    return this._taxTypes.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(taxType: TaxType): Observable<TaxType> {
    return this._httpClient.post<TaxType>(`${this.baseUrl}`, taxType).pipe(
      tap((res) => this.taxType = res),
      catchError(() => of({} as TaxType))
    );
  }

  get(id: string): Observable<TaxType> {
    return this._httpClient.get<TaxType>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.taxType = res),
      catchError(() => of({} as TaxType))
    );
  }

  getAll(): Observable<TaxType[]> {
    return this._httpClient.get<TaxType[]>(this.baseUrl).pipe(
      tap((response: TaxType[]) => {
        this.taxTypes = response;
        return response;
      }),
      catchError(() => of([] as TaxType[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<TaxType[]> {
    return this._httpClient.get<TaxType[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as TaxType[]))
    );
  }

  update(id: string, taxType: Partial<TaxType>): Observable<TaxType> {
    return this._httpClient.put<TaxType>(`${this.baseUrl}/${id}`, taxType).pipe(
      tap((res) => {
        this.taxType = res;
        return res;
      }),
      catchError(() => of({} as TaxType))
    );
  }
}
