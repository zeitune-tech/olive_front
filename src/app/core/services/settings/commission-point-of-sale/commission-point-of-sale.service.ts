import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';
import { CommissionPointOfSale } from './commission-point-of-sale.interface';

@Injectable({ providedIn: 'root' })
export class CommissionPointOfSaleService {
  

  baseUrl = environment.settings_url + '/commissions-points-of-sale';
  private _commissionPointOfSale = new ReplaySubject<CommissionPointOfSale>(1);
  private _commissionsPointOfSale = new ReplaySubject<CommissionPointOfSale[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  private _commissionsPointsOfSalePrimes = new ReplaySubject<CommissionPointOfSale[]>(1);
  private _commissionsPointsOfSaleAccessories = new ReplaySubject<CommissionPointOfSale[]>(1);

  set commissionPointOfSale(value: CommissionPointOfSale) {
    this._commissionPointOfSale.next(value);
  }

  get commissionPointOfSale$() {
    return this._commissionPointOfSale.asObservable();
  }

  set commissionsPointOfSale(value: CommissionPointOfSale[]) {
    this._commissionsPointOfSale.next(value);
  }

  get commissionsPointOfSale$() {
    return this._commissionsPointOfSale.asObservable();
  }

  get commissionsPointsOfSalePrimes$() {
    return this._commissionsPointsOfSalePrimes.asObservable();
  }

  get commissionsPointsOfSaleAccessories$() {
    return this._commissionsPointsOfSaleAccessories.asObservable();
  }

  set commissionsPointsOfSalePrimes(value: CommissionPointOfSale[]) {
    this._commissionsPointsOfSalePrimes.next(value);
  }

  set commissionsPointsOfSaleAccessories(value: CommissionPointOfSale[]) {
    this._commissionsPointsOfSaleAccessories.next(value);
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(item: CommissionPointOfSale): Observable<CommissionPointOfSale> {
    return this._httpClient.post<CommissionPointOfSale>(this.baseUrl, item).pipe(
      tap((res) => this.commissionPointOfSale = res),
      catchError(() => of({} as CommissionPointOfSale))
    );
  }

  get(id: string): Observable<CommissionPointOfSale> {
    return this._httpClient.get<CommissionPointOfSale>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.commissionPointOfSale = res),
      catchError(() => of({} as CommissionPointOfSale))
    );
  }

  getAll(): Observable<CommissionPointOfSale[]> {
    return this._httpClient.get<CommissionPointOfSale[]>(this.baseUrl).pipe(
      tap((response: CommissionPointOfSale[]) => {
        this.commissionsPointOfSale = response;
        return response;
      }),
      catchError(() => of([] as CommissionPointOfSale[]))
    );
  }

  getAllPrimes(): Observable<CommissionPointOfSale[]> {
    return this._httpClient.get<CommissionPointOfSale[]>(`${this.baseUrl}/primes`).pipe(
      tap((res) => this.commissionsPointsOfSalePrimes = res),
      catchError(() => of([] as CommissionPointOfSale[]))
    );
  }

  getAllAccessories(): Observable<CommissionPointOfSale[]> {
    return this._httpClient.get<CommissionPointOfSale[]>(`${this.baseUrl}/accessories`).pipe(
      tap((res) => this.commissionsPointsOfSaleAccessories = res),
      catchError(() => of([] as CommissionPointOfSale[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<CommissionPointOfSale[]> {
    return this._httpClient.get<CommissionPointOfSale[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as CommissionPointOfSale[]))
    );
  }

  update(id: string, item: CommissionPointOfSale): Observable<CommissionPointOfSale> {
    return this._httpClient.put<CommissionPointOfSale>(`${this.baseUrl}/${id}`, item).pipe(
      tap((res) => this.commissionPointOfSale = res),
      catchError(() => of({} as CommissionPointOfSale))
    );
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        // const currentCommissions = this._commissionsPointOfSale.getValue();
        // this.commissionsPointOfSale = currentCommissions.filter(item => item.id !== id);
      }),
      catchError(() => of())
    );
  }
}
