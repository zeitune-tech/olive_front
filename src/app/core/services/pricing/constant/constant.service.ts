import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { Constant } from "./constant.interface";
import { environment } from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ConstantService {

    baseUrl = environment.pricing_url + '/constants';
    private _constant: ReplaySubject<Constant> = new ReplaySubject<Constant>(1);
    private _constants: ReplaySubject<Constant[]> = new ReplaySubject<Constant[]>(1);

    set constant(value: Constant) {
        this._constant.next(value);
    }

    get constant$() {
        return this._constant.asObservable();
    }

    set constants(value: Constant[]) {
        this._constants.next(value);
    }

    get constants$() {
        return this._constants.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) {}

    create(constant: Constant): Observable<Constant> {
        return this._httpClient.post<Constant>(`${this.baseUrl}`, constant)
        .pipe(
            tap((response: Constant) => {
                this.constant = response;
                return response;
            }),
            catchError(() => of({} as Constant))
        );
    }

    getAll(): Observable<Constant[]> {
        return this._httpClient.get<Constant[]>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                this.constants = response?.content.map((item: Constant) => item);
                return response;
            }),
            catchError(() => of([]))
        );
    }

    update(constant: Constant, uuid:string): Observable<Constant> {
        return this._httpClient.put<Constant>(`${this.baseUrl}/${uuid}`, constant)
        .pipe(
            tap((response: Constant) => {
                this.constant = response;
                return response;
            }),
            catchError(() => of({} as Constant))
        );
    }

    delete(id: string): Observable<String> {
        return this._httpClient.delete<String>(`${this.baseUrl}/${id}`)
          .pipe(
            catchError((error: HttpErrorResponse) =>
              error.message
            )
          );
    }

}
