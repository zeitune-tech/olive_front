import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { CompanyLevelOrganization } from "./company-level-organization.interface";

@Injectable({
    providedIn: 'root'
})
export class CompanyLevelOrganizationService {

    baseUrl = environment.base_url;
    private _companyLevelOrganization: ReplaySubject<CompanyLevelOrganization> = new ReplaySubject<CompanyLevelOrganization>(1);
    private _companyLevelOrganizations: ReplaySubject<CompanyLevelOrganization[]> = new ReplaySubject<CompanyLevelOrganization[]>(1);

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

    constructor(
        private _httpClient: HttpClient
    ) { }

}