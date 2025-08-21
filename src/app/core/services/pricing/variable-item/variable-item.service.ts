import { environment } from "@env/environment";
import { ReplaySubject, Observable, catchError, of } from "rxjs";
import { tap } from "rxjs/operators";
import { RequestMetadata } from "@core/services/common.interface";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";

@Injectable()
export class VariableItemService {
    baseUrl = environment.pricing_url + '/variable-items';
    private _variableItem: ReplaySubject<VariableItem> = new ReplaySubject<VariableItem>(1);
    private _variableItems: ReplaySubject<VariableItem[]> = new ReplaySubject<VariableItem[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);

    set variableItem(value: VariableItem) {
        this._variableItem.next(value);
    }

    get variableItem$() {
        return this._variableItem.asObservable();
    }

    set variableItems(value: VariableItem[]) {
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

    getAll(): Observable<VariableItem[]> {
        return this._httpClient.get<any>(`${this.baseUrl}/all`)
        .pipe(
            tap((response: any) => {
                const items = response?.content || response || [];
                this.variableItems = Array.isArray(items) ? items.map((item: VariableItem) => item) : [];
                this.metadata = response;
                return items;
            }),
            catchError((error) => {
                console.error('VariableItemService error:', error);
                return of([] as VariableItem[]);
            })
        );
    }
}
