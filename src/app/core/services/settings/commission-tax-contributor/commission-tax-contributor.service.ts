import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { TaxCommissionsContributor } from './commission-tax-contributor.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class TaxCommissionsContributorService {


	baseUrl = environment.settings_url + '/commission-taxes';

	private _commissionTax = new ReplaySubject<TaxCommissionsContributor>(1);
	private _commissionTaxes = new ReplaySubject<TaxCommissionsContributor[]>(1);
	private _metadata = new ReplaySubject<RequestMetadata>(1);

	set commissionTax(value: TaxCommissionsContributor) {
		this._commissionTax.next(value);
	}

	get commissionTax$() {
		return this._commissionTax.asObservable();
	}

	set commissionTaxes(value: TaxCommissionsContributor[]) {
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

	create(tax: TaxCommissionsContributor): Observable<TaxCommissionsContributor> {
		return this._httpClient.post<TaxCommissionsContributor>(`${this.baseUrl}`, tax).pipe(
			tap((res) => this.commissionTax = res),
			catchError(() => of({} as TaxCommissionsContributor))
		);
	}

	get(id: string): Observable<TaxCommissionsContributor> {
		return this._httpClient.get<TaxCommissionsContributor>(`${this.baseUrl}/${id}`).pipe(
			tap((res) => this.commissionTax = res),
			catchError(() => of({} as TaxCommissionsContributor))
		);
	}

	getAll(): Observable<TaxCommissionsContributor[]> {
		return this._httpClient.get<TaxCommissionsContributor[]>(this.baseUrl).pipe(
			tap((response: TaxCommissionsContributor[]) => {
				this.commissionTaxes = response;
				return response;
			}),
			catchError(() => of([] as TaxCommissionsContributor[]))
		);
	}

	getWithFilters(filters: HttpParams): Observable<TaxCommissionsContributor[]> {
		return this._httpClient.get<TaxCommissionsContributor[]>(this.baseUrl, { params: filters }).pipe(
			catchError(() => of([] as TaxCommissionsContributor[]))
		);
	}

	update(id: string, updated: any) {
		return this._httpClient.put<TaxCommissionsContributor>(`${this.baseUrl}/${id}`, updated).pipe(
			tap((res) => this.commissionTax = res),
			catchError(() => of({} as TaxCommissionsContributor))
		);
	}
}

