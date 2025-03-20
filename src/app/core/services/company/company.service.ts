import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Company } from "./company.interface";

@Injectable()
export class CompanyService {

    baseUrl = environment.base_url;
    private _myCompany: ReplaySubject<Company> = new ReplaySubject<Company>(1);
    private _company: ReplaySubject<Company> = new ReplaySubject<Company>(1);
    private _companies: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
    private _companiesLinked: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
        
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

    get(): Observable<Company> {
        return this._httpClient.get<Company>(`${this.baseUrl}/companies/me`)
        .pipe(
            tap((company) => {
                this.myCompany = company;
                return (company);
            }),
            catchError(() => of({} as Company))
        );
    }

    getCompany(id: string): Observable<Company> {
        return this._httpClient.get<Company>(`${this.baseUrl}/companies/${id}`)
        .pipe(
            tap((company) => {
                this.company = company;
                return (company);
            }),
            catchError(() => of({} as Company))
        );
    }

    getCompanies(): Observable<Company[]> {
        return this._httpClient.get<Company[]>(`${this.baseUrl}/companies`)
        .pipe(
            tap((companies) => {
                this.companiesLinked = companies;
                return (companies);
            }),
            catchError(() => of([] as Company[]))
        );
    }


    getCompaniesAll(): Observable<Company[]> {
        return this._httpClient.get<Company[]>(`${this.baseUrl}/companies/all`)
        .pipe(
            tap((companies) => {
                this.companies = companies;
                return (companies);
            }),
            catchError(() => of([] as Company[]))
        );
    }
}