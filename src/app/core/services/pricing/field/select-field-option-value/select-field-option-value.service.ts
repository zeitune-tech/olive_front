import { catchError, Observable, of, ReplaySubject, tap, throwError } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";
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
        private _httpClient: HttpClient,
        private _translocoService: TranslocoService
    ) {}

    /**
     * Gère les erreurs HTTP
     * @param error - L'erreur HTTP
     * @param operation - Le nom de l'opération qui a échoué
     * @returns Observable qui émet une erreur
     */
    private handleError(error: HttpErrorResponse, operation: string = 'operation') {
        console.error(`${operation} failed:`, error);
        
        let errorMessage = this._translocoService.translate('errors.unexpected');
        
        if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            errorMessage = this._translocoService.translate('errors.client', { message: error.error.message });
        } else {
            // Erreur côté serveur
            switch (error.status) {
                case 400:
                    errorMessage = this._translocoService.translate('errors.badRequest');
                    break;
                case 401:
                    errorMessage = this._translocoService.translate('errors.unauthorized');
                    break;
                case 403:
                    errorMessage = this._translocoService.translate('errors.forbidden');
                    break;
                case 404:
                    errorMessage = this._translocoService.translate('errors.notFound');
                    break;
                case 409:
                    errorMessage = this._translocoService.translate('errors.conflict');
                    break;
                case 422:
                    errorMessage = this._translocoService.translate('errors.unprocessableEntity');
                    break;
                case 500:
                    errorMessage = this._translocoService.translate('errors.serverError');
                    break;
                default:
                    errorMessage = this._translocoService.translate('errors.httpError', { 
                        status: error.status, 
                        message: error.message 
                    });
            }
        }
        
        return throwError(() => new Error(errorMessage));
    }

    /**
     * Valide les données d'une valeur d'option
     * @param selectFieldOptionValue - Les données à valider
     * @returns string[] - Liste des erreurs de validation
     */
    private validateSelectFieldOptionValue(selectFieldOptionValue: SelectFieldOptionValue): string[] {
        const errors: string[] = [];

        if (!selectFieldOptionValue.name || selectFieldOptionValue.name.trim().length === 0) {
            errors.push(this._translocoService.translate('validation.nameRequired'));
        }

        if (!selectFieldOptionValue.label || selectFieldOptionValue.label.trim().length === 0) {
            errors.push(this._translocoService.translate('validation.labelRequired'));
        }

        if (selectFieldOptionValue.name && selectFieldOptionValue.name.length > 100) {
            errors.push(this._translocoService.translate('validation.nameMaxLength', { max: 100 }));
        }

        if (selectFieldOptionValue.label && selectFieldOptionValue.label.length > 255) {
            errors.push(this._translocoService.translate('validation.labelMaxLength', { max: 255 }));
        }

        return errors;
    }

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
        // Validation des données
        const validationErrors = this.validateSelectFieldOptionValue(selectFieldOptionValue);
        if (validationErrors.length > 0) {
            const errorMessage = this._translocoService.translate('validation.errors', { 
                errors: validationErrors.join(', ') 
            });
            return throwError(() => new Error(errorMessage));
        }

        return this._httpClient.post<SelectFieldOptionValue>(`${this.baseUrl}`, selectFieldOptionValue)
        .pipe(
            tap((response: SelectFieldOptionValue) => {
                this.selectFieldOptionValue = response;
                return response;
            }),
            catchError((error: HttpErrorResponse) => 
                this.handleError(error, this._translocoService.translate('operations.create'))
            )
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
            catchError((error: HttpErrorResponse) => 
                this.handleError(error, this._translocoService.translate('operations.getAll'))
            )
        );
    }

    /**
     * Récupère une valeur d'option par son ID
     * @param id - L'ID de la valeur d'option à récupérer
     * @returns Observable<SelectFieldOptionValue>
     */
    getById(id: string): Observable<SelectFieldOptionValue> {
        // Validation de l'ID
        if (!id || id.trim().length === 0) {
            const errorMessage = this._translocoService.translate('validation.idRequired');
            return throwError(() => new Error(errorMessage));
        }

        return this._httpClient.get<SelectFieldOptionValue>(`${this.baseUrl}/${id}`)
        .pipe(
            tap((response: SelectFieldOptionValue) => {
                this.selectFieldOptionValue = response;
                return response;
            }),
            catchError((error: HttpErrorResponse) => 
                this.handleError(error, this._translocoService.translate('operations.getById'))
            )
        );
    }

    /**
     * Met à jour une valeur d'option existante
     * @param id - L'ID de la valeur d'option à mettre à jour
     * @param selectFieldOptionValue - Les nouvelles données
     * @returns Observable<SelectFieldOptionValue>
     */
    update(id: string, selectFieldOptionValue: SelectFieldOptionValue): Observable<SelectFieldOptionValue> {
        // Validation des données
        const validationErrors = this.validateSelectFieldOptionValue(selectFieldOptionValue);
        if (validationErrors.length > 0) {
            const errorMessage = this._translocoService.translate('validation.errors', { 
                errors: validationErrors.join(', ') 
            });
            return throwError(() => new Error(errorMessage));
        }

        return this._httpClient.put<SelectFieldOptionValue>(`${this.baseUrl}/${id}`, selectFieldOptionValue)
        .pipe(
            tap((response: SelectFieldOptionValue) => {
                this.selectFieldOptionValue = response;
                return response;
            }),
            catchError((error: HttpErrorResponse) => 
                this.handleError(error, this._translocoService.translate('operations.update'))
            )
        );
    }

    /**
     * Supprime une valeur d'option
     * @param id - L'ID de la valeur d'option à supprimer
     * @returns Observable<void>
     */
    delete(id: string): Observable<void> {
        // Validation de l'ID
        if (!id || id.trim().length === 0) {
            const errorMessage = this._translocoService.translate('validation.idRequiredForDeletion');
            return throwError(() => new Error(errorMessage));
        }

        return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
        .pipe(
            catchError((error: HttpErrorResponse) => 
                this.handleError(error, this._translocoService.translate('operations.delete'))
            )
        );
    }
}
