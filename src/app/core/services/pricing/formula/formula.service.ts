import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { Formula } from "./formula.interface";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class FormulaService {

    baseUrl = environment.pricing_url + '/formulas';
    private _formula: ReplaySubject<Formula> = new ReplaySubject<Formula>(1);
    private _formulas: ReplaySubject<Formula[]> = new ReplaySubject<Formula[]>(1);

    set formula(value: Formula) {
        this._formula.next(value);
    }

    get formula$() {
        return this._formula.asObservable();
    }

    set formulas(value: Formula[]) {
        this._formulas.next(value);
    }

    get formulas$() {
        return this._formulas.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) {}

    create(formula: Formula): Observable<Formula> {
        return this._httpClient.post<Formula>(`${this.baseUrl}`, formula)
        .pipe(
            tap((response: Formula) => {
                this.formula = response;
                return response;
            }),
            catchError(() => of({} as Formula))
        );
    }

    getAll(): Observable<Formula[]> {
        return this._httpClient.get<Formula[]>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                this.formulas = response?.content.map((item: Formula) => item);
                return response;
            }),
            catchError(() => of([]))
        );
    }

}
