import { environment } from "@env/environment";
import { ReplaySubject, Observable, catchError, of } from "rxjs";
import { tap, map } from "rxjs/operators";
import { RequestMetadata } from "@core/services/common.interface";
import { HttpClient } from "@angular/common/http";
import { Constant } from "../constant/constant.interface";
import { NumericField, SelectField } from "../field/field.interface";
import { Injectable } from "@angular/core";

export type VariableItemResponse = Constant | NumericField | SelectField ;

@Injectable()
export class VariableItemService {
  
    baseUrl = environment.pricing_url + '/variable-items';
    private _variableItem: ReplaySubject<VariableItemResponse> = new ReplaySubject<VariableItemResponse>(1);
    private _variableItems: ReplaySubject<VariableItemResponse[]> = new ReplaySubject<VariableItemResponse[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);

    set variableItem(value: VariableItemResponse) {
        this._variableItem.next(value);
    }

    get variableItem$() {
        return this._variableItem.asObservable();
    }

    set variableItems(value: VariableItemResponse[]) {
        this._variableItems.next(value);
    }

    get variableItems$() {
        return this._variableItems.asObservable();
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
    }

    constructor(
        private _httpClient: HttpClient
    ) {}

    getAll(): Observable<VariableItemResponse[]> {
        return this._httpClient.get<any>(`${this.baseUrl}/all`)
        .pipe(
            tap((response: any) => {
                // Extraire les variables depuis response.content ou utiliser response directement
                const items = response?.content || response || [];
                this.variableItems = Array.isArray(items) ? items.map((item: VariableItemResponse) => item) : [];
                this.metadata = response;
                return items;
            }),
            map((response: any) => {
                // Retourner le tableau d'items au lieu de la réponse complète
                const items = response?.content || response || [];
                return Array.isArray(items) ? items : [];
            }),
            catchError((error) => {
                console.error('VariableItemService error:', error);
                return of([] as VariableItemResponse[]);
            })
        );
    }
}

