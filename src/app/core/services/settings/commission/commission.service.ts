import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Commission } from './commission.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class CommissionService {

  baseUrl = environment.settings_url + '/app/commissions';
  private _commission = new ReplaySubject<Commission>(1);
  private _commissions = new ReplaySubject<Commission[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set commission(value: Commission) {
    this._commission.next(value);
  }

  get commission$() {
    return this._commission.asObservable();
  }

  set commissions(value: Commission[]) {
    this._commissions.next(value);
  }

  get commissions$() {
    return this._commissions.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(commission: Commission): Observable<Commission> {
    return this._httpClient.post<Commission>(this.baseUrl, commission).pipe(
      tap((res) => this.commission = res),
      catchError(() => of({} as Commission))
    );
  }

  get(id: string): Observable<Commission> {
    return this._httpClient.get<Commission>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.commission = res),
      catchError(() => of({} as Commission))
    );
  }

  getAll(): Observable<Commission[]> {
    return this._httpClient.get<Commission[]>(this.baseUrl).pipe(
      tap((response: Commission[]) => {
        this.commissions = response;
        return response;
      }),
      catchError(() => of([] as Commission[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<Commission[]> {
    return this._httpClient.get<Commission[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as Commission[]))
    );
  }
}
