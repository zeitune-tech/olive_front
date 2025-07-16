import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { CommissionTax } from './commission-tax.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class CommissionTaxService {

  baseUrl = environment.settings_url + '/commission-taxes';

  private _commissionTax = new ReplaySubject<CommissionTax>(1);
  private _commissionTaxes = new ReplaySubject<CommissionTax[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set commissionTax(value: CommissionTax) {
    this._commissionTax.next(value);
  }

  get commissionTax$() {
    return this._commissionTax.asObservable();
  }

  set commissionTaxes(value: CommissionTax[]) {
    this._commissionTaxes.next(value);
  }

  get commissionTaxes$() {
    return this._commissionTaxes.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(tax: CommissionTax): Observable<CommissionTax> {
    return this._httpClient.post<CommissionTax>(`${this.baseUrl}`, tax).pipe(
      tap((res) => this.commissionTax = res),
      catchError(() => of({} as CommissionTax))
    );
  }

  get(id: string): Observable<CommissionTax> {
    return this._httpClient.get<CommissionTax>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.commissionTax = res),
      catchError(() => of({} as CommissionTax))
    );
  }

  getAll(): Observable<CommissionTax[]> {
    return this._httpClient.get<CommissionTax[]>(this.baseUrl).pipe(
      tap((response: CommissionTax[]) => {
        this.commissionTaxes = response;
        return response;
      }),
      catchError(() => of([] as CommissionTax[]))
    );
  }

  getWithFilters(filters: HttpParams): Observable<CommissionTax[]> {
    return this._httpClient.get<CommissionTax[]>(this.baseUrl, { params: filters }).pipe(
      catchError(() => of([] as CommissionTax[]))
    );
  }
}
