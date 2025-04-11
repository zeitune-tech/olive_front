import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Company } from "./company.interface";
import { RequestMetadata } from "../../common.interface";

@Injectable()
export class CompanyService {

    baseUrl = environment.administration_url + '/companies';
    private _myCompany: ReplaySubject<Company> = new ReplaySubject<Company>(1);
    private _company: ReplaySubject<Company> = new ReplaySubject<Company>(1);
    private _companies: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
    private _companiesLinked: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        
    set myCompany(value: Company) {
        this._myCompany.next(value);
    }

    get myCompany$() {
        return this._myCompany.asObservable();
    }

    set company(value: Company) {
        this._company.next(value);
    }

    get company$() {
        return this._company.asObservable();
    }

    set companies(value: Company[]) {
        this._companies.next(value);
    }

    get companies$() {
        return this._companies.asObservable();
    }

    set companiesLinked(value: Company[]) {
        this._companiesLinked.next(value);
    }

    get companiesLinked$() {
        return this._companiesLinked.asObservable();
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

    create(company: Company): Observable<Company> {
        return this._httpClient.post<Company>(`${this.baseUrl}/companies`, company)
        .pipe(
            tap((company) => {
                this.company = company;
                return (company);
            }),
            catchError(() => of({} as Company))
        );
    }


    get(id: string): Observable<Company> {
        return this._httpClient.get<Company>(`${this.baseUrl}${id}`)
        .pipe(
            tap((company) => {
                this.company = company;
                return (company);
            }),
            catchError(() => of({} as Company))
        );
    }


    getAll(): Observable<Company[]> {
        return this._httpClient.get<Company[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.companies = response?.content.map((company: Company) => {
                    return company;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as Company[]))
        );
    }   

    getLinked(): Observable<Company[]> {
        return this._httpClient.get<Company[]>(`${this.baseUrl}/linked`)
        .pipe(
            tap((response : any) => {
                this.companiesLinked = response?.content.map((company: Company) => {
                    return company;
                });
                return response;
            }),
            catchError(() => of([] as Company[]))
        );
    }
}