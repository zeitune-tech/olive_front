import { catchError, Observable, of, ReplaySubject, tap, forkJoin, map } from "rxjs";
import {Field, NumericField, SelectField} from "./field.interface";
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

    create(field: Field): Observable<Field> {
        const baseUrl = field.type === 'NUMBER' ? this.numericBaseUrl : this.selectBaseUrl;
        return this._httpClient.post<Field>(`${baseUrl}`, field)
        .pipe(
            tap((response: Field) => {
                this.field = response;
                return response;
            }),
            catchError(() => of({} as Field))
        );
    }

    /**
     * Récupère tous les champs depuis les deux endpoints
     * Combine les numeric-fields et select-fields en une seule liste
     */
    getAll(): Observable<Field[]> {
        // Faire des requêtes parallèles sur les deux endpoints
        const numericFields$ = this._httpClient.get<{content: NumericField[]}>(`${this.numericBaseUrl}`)
            .pipe(
                map(response => response?.content || []),
                catchError(() => of([]))
            );

        const selectFields$ = this._httpClient.get<{content: SelectField[]}>(`${this.selectBaseUrl}`)
            .pipe(
                map(response => response?.content || []),
                catchError(() => of([]))
            );

        return forkJoin({
            numericFields: numericFields$,
            selectFields: selectFields$
        }).pipe(
            map(({ numericFields, selectFields }) => {
                // Mapper les champs numériques
                const mappedNumericFields = numericFields.map(numericField =>
                    new Field({
                        ...numericField,
                        type: 'NUMBER',
                        options: null
                    })
                );

                // Mapper les champs de sélection
                const mappedSelectFields = selectFields.map(selectField =>
                    new Field({
                        ...selectField,
                        type: 'SELECT',
                        options: selectField.options
                    })
                );

                // Combiner les deux listes
                const allFields = [...mappedNumericFields, ...mappedSelectFields];

                // Mettre à jour le subject
                this.fields = allFields;

                return allFields;
            }),
            catchError(() => {
                console.error('Erreur lors de la récupération des champs');
                return of([]);
            })
        );
    }

    /**
     * Récupère uniquement les champs numériques
     */
    getNumericFields(): Observable<Field[]> {
        return this._httpClient.get<{content: NumericField[]}>(`${this.numericBaseUrl}`)
        .pipe(
            map(response => {
                const fields = (response?.content || []).map(numericField =>
                    new Field({
                        ...numericField,
                        type: 'NUMBER',
                        options: null
                    })
                );
                return fields;
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Récupère uniquement les champs de sélection
     */
    getSelectFields(): Observable<Field[]> {
        return this._httpClient.get<{content: SelectField[]}>(`${this.selectBaseUrl}`)
        .pipe(
            map(response => {
                const fields = (response?.content || []).map(selectField =>
                    new Field({
                        ...selectField,
                        type: 'SELECT',
                        options: selectField.options
                    })
                );
                return fields;
            }),
            catchError(() => of([]))
        );
    }
}
