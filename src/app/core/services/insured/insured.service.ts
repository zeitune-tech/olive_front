import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Insured } from "./insured.interface";

@Injectable()
export class InsuredService {

    baseUrl = environment.base_url;
    private _insured: ReplaySubject<Insured> = new ReplaySubject<Insured>(1);
    private _insureds: ReplaySubject<Insured[]> = new ReplaySubject<Insured[]>(1);

    set insured(value: Insured) {
        this._insured.next(value);
    }

    get insured$() {
        return this._insured.asObservable();
    }

    set insureds(value: Insured[]) {
        this._insureds.next(value);
    }

    get insureds$() {
        return this._insureds.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    create(insured: Insured): Observable<Insured> {
        return this._httpClient.post<Insured>(`${this.baseUrl}/insureds`, insured)
        .pipe(
            tap((insured) => {
                this.insured = insured;
                return (insured);
            }),
            catchError(() => of({} as Insured))
        );
    }

    getAll(): Observable<Insured[]> {
        return this._httpClient.get<Insured[]>(`${this.baseUrl}/insureds`)
        .pipe(
            tap((insureds) => {
                this.insureds = insureds;
                return insureds;
            }),
            catchError(() => of([]))
        );
    }

    get(id: string): Observable<Insured> {
        return this._httpClient.get<Insured>(`${this.baseUrl}/insureds/${id}`)
        .pipe(
            tap((insured) => {
                this.insured = insured;
                return insured;
            }),
            catchError(() => of({} as Insured))
        );
    }
}