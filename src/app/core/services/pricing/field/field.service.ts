import { catchError, Observable, of, ReplaySubject, tap, forkJoin, map } from "rxjs";
import {Field} from "./field.model";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class FieldService {

    selectBaseUrl = environment.pricing_url + '/select-fields';
    numericBaseUrl = environment.pricing_url + '/numeric-fields';

    private _field: ReplaySubject<Field> = new ReplaySubject<Field>(1);
    private _fields: ReplaySubject<Field[]> = new ReplaySubject<Field[]>(1);

    set field(value: Field) {
        this._field.next(value);
    }

    get field$() {
        return this._field.asObservable();
    }

    set fields(value: Field[]) {
        this._fields.next(value);
    }

    get fields$() {
        return this._fields.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) {}
}
