import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DurationRate } from './duration-rate.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class DurationRateService {

  baseUrl = environment.settings_url + '/app/duration-rates';
  private _durationRate = new ReplaySubject<DurationRate>(1);
  private _durationRates = new ReplaySubject<DurationRate[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set durationRate(value: DurationRate) {
    this._durationRate.next(value);
  }

  get durationRate$() {
    return this._durationRate.asObservable();
  }

  set durationRates(value: DurationRate[]) {
    this._durationRates.next(value);
  }

  get durationRates$() {
    return this._durationRates.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(item: DurationRate): Observable<DurationRate> {
    return this._httpClient.post<DurationRate>(this.baseUrl, item).pipe(
      tap((res) => this.durationRate = res),
      catchError(() => of({} as DurationRate))
    );
  }

  get(id: string): Observable<DurationRate> {
    return this._httpClient.get<DurationRate>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.durationRate = res),
      catchError(() => of({} as DurationRate))
    );
  }

  getAll(): Observable<DurationRate[]> {
    return this._httpClient.get<DurationRate[]>(this.baseUrl).pipe(
      tap((response: DurationRate[]) => {
        this.durationRates = response;
        return response;
      }),
      catchError(() => of([] as DurationRate[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<DurationRate[]> {
    return this._httpClient.get<DurationRate[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as DurationRate[]))
    );
  }
}
