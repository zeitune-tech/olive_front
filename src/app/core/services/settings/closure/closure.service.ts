import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { Closure } from "./closure.interface";

@Injectable()
export class ClosureService {

    baseUrl = environment.administration_url + '/closures';
    private _closure: ReplaySubject<Closure> = new ReplaySubject<Closure>(1);
    private _closures: ReplaySubject<Closure[]> = new ReplaySubject<Closure[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set closure(value: Closure) {
        this._closure.next(value);
    }

    get closure$() {
        return this._closure.asObservable();
    }

    set closures(value: Closure[]) {
        this._closures.next(value);
    }

    get closures$() {
        return this._closures.asObservable();
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

    create(closure: Closure): Observable<Closure> {
        return this._httpClient.post<Closure>(`${this.baseUrl}/closures`, closure)
        .pipe(
            tap((closure) => {
                this.closure = closure;
                return (closure);
            }),
            catchError(() => of({} as Closure))
        );
    }


    get(id: string): Observable<Closure> {
        return this._httpClient.get<Closure>(`${this.baseUrl}${id}`)
        .pipe(
            tap((closure) => {
                this.closure = closure;
                return (closure);
            }),
            catchError(() => of({} as Closure))
        );
    }


    getAll(): Observable<Closure[]> {
        return this._httpClient.get<Closure[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.closures = response?.content.map((closure: Closure) => {
                    return closure;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as Closure[]))
        );
    }
}