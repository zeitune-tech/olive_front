import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { CompanyLevelOrganization } from "./company-level-organization.interface";
import { RequestMetadata } from "../../common.interface";

@Injectable({
    providedIn: 'root'
})
export class CompanyLevelOrganizationService {


    baseUrl = environment.administration_url + '/company-level-organizations';
    private _companyLevelOrganization: ReplaySubject<CompanyLevelOrganization> = new ReplaySubject<CompanyLevelOrganization>(1);
    private _companyLevelOrganizations: ReplaySubject<CompanyLevelOrganization[]> = new ReplaySubject<CompanyLevelOrganization[]>(1);

    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
    
    set companyLevelOrganization(value: CompanyLevelOrganization) {
        this._companyLevelOrganization.next(value);
    }

    get companyLevelOrganization$() {
        return this._companyLevelOrganization.asObservable();
    }

    set companyLevelOrganizations(value: CompanyLevelOrganization[]) {
        this._companyLevelOrganizations.next(value);
    }

    get companyLevelOrganizations$() {
        return this._companyLevelOrganizations.asObservable();
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
    }

    constructor(
        private _httpClient: HttpClient
    ) { }


    getAll(): Observable<CompanyLevelOrganization[]> {
        return this._httpClient.get<CompanyLevelOrganization[]>(this.baseUrl)
            .pipe(
                tap((response: any) => {
                    this.companyLevelOrganizations = response?.content.map((companyLevelOrganization: CompanyLevelOrganization) => {
                        return companyLevelOrganization;
                    });
                    this.metadata = response.metadata;
                }),
                catchError((error) => {
                    this.companyLevelOrganizations = [];
                    return of([]);
                })
            );
    }
    create(data: { name: string; description: string; pointsOfSale: { name: string; id: string; }[]; }): Observable<CompanyLevelOrganization> {
        return this._httpClient.post<CompanyLevelOrganization>(this.baseUrl, {
            name: data.name,
            description: data.description,
            pointsOfSaleIds: data.pointsOfSale.map((pointOfSale) => pointOfSale.id)
        })
            .pipe(
                tap((companyLevelOrganization: CompanyLevelOrganization) => {
                    this.companyLevelOrganization = companyLevelOrganization;
                    return companyLevelOrganization;
                }),
                catchError((error) => {
                    return of(error.error);
                })
            );
    }

    update(data: any): Observable<CompanyLevelOrganization> {
        return this._httpClient.put<CompanyLevelOrganization>(`${this.baseUrl}/${data.id}`, data)
            .pipe(
                tap((companyLevelOrganization: CompanyLevelOrganization) => {
                    this.companyLevelOrganization = companyLevelOrganization;
                    return companyLevelOrganization;
                }),
                catchError((error) => {
                    return of(error.error);
                })
            );
    }

    delete (id: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
            .pipe(
                tap(() => {
                }),
                catchError((error) => {
                    return of(error.error);
                })
            );
    }
}