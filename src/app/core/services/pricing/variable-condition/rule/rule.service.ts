import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Rule} from "@core/services/pricing/variable-condition/rule/rule.interface";

@Injectable()
export class RuleService {

    baseUrl = environment.pricing_url + '/rules';
    private _rule: ReplaySubject<Rule> = new ReplaySubject<Rule>(1);
    private _ruleList: ReplaySubject<Rule[]> = new ReplaySubject<Rule[]>(1);

    set rule(value: Rule) {
        this._rule.next(value);
    }

    get rule$() {
        return this._rule.asObservable();
    }

    set ruleList(value: Rule[]) {
        this._ruleList.next(value);
    }

    get ruleList$() {
        return this._ruleList.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) {}

    create(rule: Rule): Observable<Rule> {
        return this._httpClient.post<Rule>(`${this.baseUrl}`, rule)
        .pipe(
            tap((response: Rule) => {
                this.rule = response;
                return response;
            }),
            catchError(() => of({} as Rule))
        );
    }

    getAll(): Observable<Rule[]> {
        return this._httpClient.get<Rule[]>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                this.ruleList = response?.content.map((item: Rule) => item);
                return response;
            }),
            catchError(() => of([]))
        );
    }

}
