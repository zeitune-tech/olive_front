import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Accessory } from './accessory.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class AccessoryService {

  baseUrl = environment.settings_url + '/app/accessories';
  private _accessory = new ReplaySubject<Accessory>(1);
  private _accessories = new ReplaySubject<Accessory[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set accessory(value: Accessory) {
    this._accessory.next(value);
  }

  get accessory$() {
    return this._accessory.asObservable();
  }

  set accessories(value: Accessory[]) {
    this._accessories.next(value);
  }

  get accessories$() {
    return this._accessories.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(accessory: Accessory): Observable<Accessory> {
    return this._httpClient.post<Accessory>(`${this.baseUrl}`, accessory).pipe(
      tap((res) => this.accessory = res),
      catchError(() => of({} as Accessory))
    );
  }

  get(id: string): Observable<Accessory> {
    return this._httpClient.get<Accessory>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.accessory = res),
      catchError(() => of({} as Accessory))
    );
  }

  getAll(): Observable<Accessory[]> {
    return this._httpClient.get<Accessory[]>(this.baseUrl).pipe(
      tap((response: Accessory[]) => {
        this.accessories = response;
        return response;
      }),
      catchError(() => of([] as Accessory[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<Accessory[]> {
    return this._httpClient.get<Accessory[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as Accessory[]))
    );
  }

  update(id: string, accessory: any): Observable<Accessory> {
    return this._httpClient.put<Accessory>(`${this.baseUrl}/${id}`, accessory).pipe(
      tap((res) => {
        this.accessory = res;
        return (res);
      }),
      catchError(() => of({} as Accessory))
    );
  }

}
