import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { TaxCommissionsPointOfSale } from './commission-tax-point-of-sale.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class TaxCommissionsPointOfSaleService {

	baseUrl = environment.settings_url + '/tax-commissions/point-of-sale';

	private _commissionTax = new ReplaySubject<TaxCommissionsPointOfSale>(1);
	private _commissionTaxes = new ReplaySubject<TaxCommissionsPointOfSale[]>(1);
	private _metadata = new ReplaySubject<RequestMetadata>(1);

	set commissionTax(value: TaxCommissionsPointOfSale) {
		this._commissionTax.next(value);
	}

	get commissionTax$() {
		return this._commissionTax.asObservable();
	}

	set commissionTaxes(value: TaxCommissionsPointOfSale[]) {
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

	constructor(private _httpClient: HttpClient) { }

	create(tax: TaxCommissionsPointOfSale): Observable<TaxCommissionsPointOfSale> {
		return this._httpClient.post<TaxCommissionsPointOfSale>(`${this.baseUrl}`, tax).pipe(
			tap((res) => this.commissionTax = res),
			catchError(() => of({} as TaxCommissionsPointOfSale))
		);
	}

	get(id: string): Observable<TaxCommissionsPointOfSale> {
		return this._httpClient.get<TaxCommissionsPointOfSale>(`${this.baseUrl}/${id}`).pipe(
			tap((res) => this.commissionTax = res),
			catchError(() => of({} as TaxCommissionsPointOfSale))
		);
	}

	getAll(): Observable<TaxCommissionsPointOfSale[]> {
		return this._httpClient.get<TaxCommissionsPointOfSale[]>(this.baseUrl).pipe(
			tap((response: TaxCommissionsPointOfSale[]) => {
				this.commissionTaxes = response;
				return response;
			}),
			catchError(() => of([] as TaxCommissionsPointOfSale[]))
		);
	}

	getWithFilters(filters: HttpParams): Observable<TaxCommissionsPointOfSale[]> {
		return this._httpClient.get<TaxCommissionsPointOfSale[]>(this.baseUrl, { params: filters }).pipe(
			catchError(() => of([] as TaxCommissionsPointOfSale[]))
		);
	}

	update(id: string, updated: any) {
		return this._httpClient.put<TaxCommissionsPointOfSale>(`${this.baseUrl}/${id}`, updated).pipe(
			tap((res) => this.commissionTax = res),
			catchError(() => of({} as TaxCommissionsPointOfSale))
		);
	}

}
