import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Demand } from "./demand.interface";
import { environment } from '@env/environment';

@Injectable()
export class DemandService {
    
    baseUrl = environment.base_url;
    
    private _demand: ReplaySubject<Demand> = new ReplaySubject<Demand>(1);
    private _demands: ReplaySubject<Demand[]> = new ReplaySubject<Demand[]>(1);

    set demand(value: Demand) {
        this._demand.next(value);
    }

    get demand$() {
        return this._demand.asObservable();
    }

    set demands(value: Demand[]) {
        this._demands.next(value);
    }

    get demands$() {
        return this._demands.asObservable();
    }

    constructor(
        private http: HttpClient
    ) { }

    create(demand: Demand): Observable<Demand> {
        return this.http.post<Demand>(`${this.baseUrl}/demands`, demand)
        .pipe(
            tap((demand) => {
                this.demand = demand;
                return (demand);
            }),
            catchError(() => of({} as Demand))
        );
    }

    getDemands(): Observable<Demand[]> {
        return this.http.get<Demand[]>(`${this.baseUrl}/demands`)
        .pipe(
            tap((demands) => {
                this.demands = demands;
                return (demands);
            }),
            catchError(() => of([] as Demand[]))
        );
    }
}