import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VariableCondition } from "./variable-condition.interface";

@Injectable()
export class VariableConditionService {

    baseUrl = environment.pricing_url + '/variable-conditions';
    private _variableCondition: ReplaySubject<VariableCondition> = new ReplaySubject<VariableCondition>(1);
    private _variableConditions: ReplaySubject<VariableCondition[]> = new ReplaySubject<VariableCondition[]>(1);

    set variableCondition(value: VariableCondition) {
        this._variableCondition.next(value);
    }

    get variableCondition$() {
        return this._variableCondition.asObservable();
    }

    set variableConditions(value: VariableCondition[]) {
        this._variableConditions.next(value);
    }

    get variableConditions$() {
        return this._variableConditions.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) {}

    create(variableCondition: VariableCondition): Observable<VariableCondition> {
        return this._httpClient.post<VariableCondition>(`${this.baseUrl}`, variableCondition)
        .pipe(
            tap((response: VariableCondition) => {
                this.variableCondition = response;
                return response;
            }),
            catchError(() => of({} as VariableCondition))
        );
    }

    getAll(): Observable<VariableCondition[]> {
        return this._httpClient.get<VariableCondition[]>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                this.variableConditions = response?.content.map((item: VariableCondition) => item);
                return response;
            }),
            catchError(() => of([]))
        );
    }

    update(id: string, variableCondition: VariableCondition): Observable<VariableCondition> {
        return this._httpClient.put<VariableCondition>(`${this.baseUrl}/${id}`, variableCondition)
        .pipe(
            tap((response: VariableCondition) => {
                this.variableCondition = response;
                return response;
            }),
            catchError(() => of({} as VariableCondition))
        );
    }

}
