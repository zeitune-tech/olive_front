import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TaxAccessory } from './tax-accessory.interface';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class TaxAccessoryService {

  baseUrl = environment.settings_url + '/tax-accessories';
  private _taxAccessory = new ReplaySubject<TaxAccessory>(1);
  private _taxAccessories = new ReplaySubject<TaxAccessory[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set taxAccessory(value: TaxAccessory) {
    this._taxAccessory.next(value);
  }

  get taxAccessory$() {
    return this._taxAccessory.asObservable();
  }

  set taxAccessories(value: TaxAccessory[]) {
    this._taxAccessories.next(value);
  }

  get taxAccessories$() {
    return this._taxAccessories.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(taxAccessory: TaxAccessory): Observable<TaxAccessory> {
    return this._httpClient.post<TaxAccessory>(`${this.baseUrl}`, taxAccessory).pipe(
      tap((res) => this.taxAccessory = res),
      catchError(() => of({} as TaxAccessory))
    );
  }

  get(id: string): Observable<TaxAccessory> {
    return this._httpClient.get<TaxAccessory>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.taxAccessory = res),
      catchError(() => of({} as TaxAccessory))
    );
  }

  getAll(): Observable<TaxAccessory[]> {
    return this._httpClient.get<TaxAccessory[]>(this.baseUrl).pipe(
      tap((response: TaxAccessory[]) => {
        this.taxAccessories = response;
        return response;
      }),
      catchError(() => of([] as TaxAccessory[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<TaxAccessory[]> {
    return this._httpClient.get<TaxAccessory[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as TaxAccessory[]))
    );
  }

  update(id: string, taxAccessory: Partial<TaxAccessory>): Observable<TaxAccessory> {
    return this._httpClient.put<TaxAccessory>(`${this.baseUrl}/${id}`, taxAccessory).pipe(
      tap((res) => {
        this.taxAccessory = res;
        return res;
      }),
      catchError(() => of({} as TaxAccessory))
    );
  }
}
