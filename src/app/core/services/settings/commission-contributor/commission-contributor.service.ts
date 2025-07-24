import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { CommissionContributor } from './commission-contributor.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class CommissionContributorService {


  baseUrl = environment.settings_url + '/commissions-contributors';
  private _commissionContributor = new ReplaySubject<CommissionContributor>(1);
  private _commissionContributorPrimes = new ReplaySubject<CommissionContributor[]>(1);
  private _commissionContributorAccessories = new ReplaySubject<CommissionContributor[]>(1);

  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set commissionContributor(value: CommissionContributor) {
    this._commissionContributor.next(value);
  }

  get commissionContributor$() {
    return this._commissionContributor.asObservable();
  }

  set commissionContributorPrimes(value: CommissionContributor[]) {
    this._commissionContributorPrimes.next(value);
  }

  get commissionContributorPrimes$() {
    return this._commissionContributorPrimes.asObservable();
  }

  set commissionContributorAccessories(value: CommissionContributor[]) {
    this._commissionContributorAccessories.next(value);
  }

  get commissionContributorAccessories$() {
    return this._commissionContributorAccessories.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(item: any): Observable<CommissionContributor> {
    return this._httpClient.post<CommissionContributor>(this.baseUrl, item).pipe(
      tap((res) => this.commissionContributor = res),
      catchError(() => of({} as CommissionContributor))
    );
  }

  update(id: string, updated: any) : Observable<CommissionContributor> {
    return this._httpClient.put<CommissionContributor>(`${this.baseUrl}/${id}`, updated).pipe(
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

  getAllPrimes(): Observable<CommissionContributor[]> {
    return this._httpClient.get<CommissionContributor[]>(`${this.baseUrl}/primes`).pipe(
      tap((res) => this.commissionContributorPrimes = res),
      catchError(() => of([] as CommissionContributor[]))
    );
  }

  getAllAccessories(): Observable<CommissionContributor[]> {
    return this._httpClient.get<CommissionContributor[]>(`${this.baseUrl}/accessories`).pipe(
      tap((res) => this.commissionContributorAccessories = res),
      catchError(() => of([] as CommissionContributor[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<CommissionContributor[]> {
    return this._httpClient.get<CommissionContributor[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as CommissionContributor[]))
    );
  }
}
