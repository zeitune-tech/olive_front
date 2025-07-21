import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { CommissionContributor } from './commission-contributor.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class CommissionContributorService {

  baseUrl = environment.settings_url + '/commission-contributors';
  private _commissionContributor = new ReplaySubject<CommissionContributor>(1);
  private _commissionContributors = new ReplaySubject<CommissionContributor[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set commissionContributor(value: CommissionContributor) {
    this._commissionContributor.next(value);
  }

  get commissionContributor$() {
    return this._commissionContributor.asObservable();
  }

  set commissionContributors(value: CommissionContributor[]) {
    this._commissionContributors.next(value);
  }

  get commissionContributors$() {
    return this._commissionContributors.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(item: CommissionContributor): Observable<CommissionContributor> {
    return this._httpClient.post<CommissionContributor>(this.baseUrl, item).pipe(
      tap((res) => this.commissionContributor = res),
      catchError(() => of({} as CommissionContributor))
    );
  }

  get(id: string): Observable<CommissionContributor> {
    return this._httpClient.get<CommissionContributor>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.commissionContributor = res),
      catchError(() => of({} as CommissionContributor))
    );
  }

  getAll(): Observable<CommissionContributor[]> {
    return this._httpClient.get<CommissionContributor[]>(this.baseUrl).pipe(
      tap((response: CommissionContributor[]) => {
        this.commissionContributors = response;
        return response;
      }),
      catchError(() => of([] as CommissionContributor[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<CommissionContributor[]> {
    return this._httpClient.get<CommissionContributor[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as CommissionContributor[]))
    );
  }
}
