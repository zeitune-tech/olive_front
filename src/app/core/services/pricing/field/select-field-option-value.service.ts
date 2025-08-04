import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SelectFieldOptionValue } from "./select-field-option-value.interface";

/**
 * Service pour gérer les valeurs d'options des champs de sélection
 * Correspond au SelectFieldOptionValueResponseDTO du backend
 */
@Injectable()
export class SelectFieldOptionValueService {

    baseUrl = environment.pricing_url + '/select-field-option-values';
    private _selectFieldOptionValue: ReplaySubject<SelectFieldOptionValue> = new ReplaySubject<SelectFieldOptionValue>(1);
    private _selectFieldOptionValues: ReplaySubject<SelectFieldOptionValue[]> = new ReplaySubject<SelectFieldOptionValue[]>(1);

    set selectFieldOptionValue(value: SelectFieldOptionValue) {
        this._selectFieldOptionValue.next(value);
    }

    get selectFieldOptionValue$() {
        return this._selectFieldOptionValue.asObservable();
    }

    set selectFieldOptionValues(value: SelectFieldOptionValue[]) {
        this._selectFieldOptionValues.next(value);
    }

    get selectFieldOptionValues$() {
        return this._selectFieldOptionValues.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) {}

    /**
     * Crée une nouvelle valeur d'option pour un champ de sélection
     * @param selectFieldOptionValue - Les données de la valeur d'option à créer
     * @returns Observable<SelectFieldOptionValue>
     */

    /**
     * Crée une nouvelle valeur d'option pour un champ de sélection
     * @param selectFieldOptionValue - Les données de la valeur d'option à créer
     * @returns Observable<SelectFieldOptionValue>
     */
    create(selectFieldOptionValue: SelectFieldOptionValue): Observable<SelectFieldOptionValue> {
        return this._httpClient.post<SelectFieldOptionValue>(`${this.baseUrl}`, selectFieldOptionValue)
        .pipe(
            tap((response: SelectFieldOptionValue) => {
                this.selectFieldOptionValue = response;
                return response;
            }),
            catchError(() => of({} as SelectFieldOptionValue))
        );
    }

    /**
     * Récupère toutes les valeurs d'options disponibles
     * @returns Observable<SelectFieldOptionValue[]>
     */
    getAll(): Observable<SelectFieldOptionValue[]> {
        return this._httpClient.get<SelectFieldOptionValue[]>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                this.selectFieldOptionValues = response?.content?.map((item: SelectFieldOptionValue) => item) || [];
                return response;
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Récupère une valeur d'option par son ID
     * @param id - L'ID de la valeur d'option à récupérer
     * @returns Observable<SelectFieldOptionValue>
     */
    getById(id: string): Observable<SelectFieldOptionValue> {
        return this._httpClient.get<SelectFieldOptionValue>(`${this.baseUrl}/${id}`)
        .pipe(
            tap((response: SelectFieldOptionValue) => {
                this.selectFieldOptionValue = response;
                return response;
            }),
            catchError(() => of({} as SelectFieldOptionValue))
        );
    }

    /**
     * Met à jour une valeur d'option existante
     * @param id - L'ID de la valeur d'option à mettre à jour
     * @param selectFieldOptionValue - Les nouvelles données
     * @returns Observable<SelectFieldOptionValue>
     */
    update(id: string, selectFieldOptionValue: SelectFieldOptionValue): Observable<SelectFieldOptionValue> {
        return this._httpClient.put<SelectFieldOptionValue>(`${this.baseUrl}/${id}`, selectFieldOptionValue)
        .pipe(
            tap((response: SelectFieldOptionValue) => {
                this.selectFieldOptionValue = response;
                return response;
            }),
            catchError(() => of({} as SelectFieldOptionValue))
        );
    }

    /**
     * Supprime une valeur d'option
     * @param id - L'ID de la valeur d'option à supprimer
     * @returns Observable<void>
     */
    delete(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
        .pipe(
            catchError(() => of())
        );
    }
}
