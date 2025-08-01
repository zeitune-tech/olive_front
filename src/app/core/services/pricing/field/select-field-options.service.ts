import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { Field } from "./field.interface";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SelectFieldOptions } from "./select-field-options.interface";

@Injectable()
export class SelectFieldOptionsService {

    baseUrl = environment.pricing_url + '/select-field-options';
    private _selectFieldOptions: ReplaySubject<SelectFieldOptions> = new ReplaySubject<SelectFieldOptions>(1);
    private _selectFieldOptionsList: ReplaySubject<SelectFieldOptions[]> = new ReplaySubject<SelectFieldOptions[]>(1);


    set selectFieldOptions(value: SelectFieldOptions) {
        this._selectFieldOptions.next(value);
    }

    get selectFieldOptions$() {
        return this._selectFieldOptions.asObservable();
    }

    set selectFieldOptionsList(value: SelectFieldOptions[]) {
        this._selectFieldOptionsList.next(value);
    }

    get selectFieldOptionsList$() {
        return this._selectFieldOptionsList.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) {}

    create(selectFieldOptions: SelectFieldOptions): Observable<SelectFieldOptions> {
        return this._httpClient.post<SelectFieldOptions>(`${this.baseUrl}`, selectFieldOptions)
        .pipe(
            tap((response: SelectFieldOptions) => {
                this.selectFieldOptions = response;
                return response;
            }),
            catchError(() => of({} as SelectFieldOptions))
        );
    }

    getAll(): Observable<SelectFieldOptions[]> {
        return this._httpClient.get<{content: SelectFieldOptions[]}>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                const options = (response?.content || []).map((item: any) => new SelectFieldOptions(item));
                this.selectFieldOptionsList = options;
                return response;
            }),
            catchError(() => of([]))
        );
    }

}
