import { environment } from "@env/environment";
import { ReplaySubject, Observable, catchError, of } from "rxjs";
import { tap } from "rxjs/operators";
import { VariableItem } from "./variable-item.interface";
import { RequestMetadata } from "@core/services/common.interface";
import { HttpClient } from "@angular/common/http";

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

    create(variableItem: VariableItem): Observable<VariableItem> {
        return this._httpClient.post<VariableItem>(`${this.baseUrl}`, variableItem)
        .pipe(
            tap((response: VariableItem) => {
                this.variableItem = response;
                return response;
            }),
            catchError(() => of({} as VariableItem))
        );
    }

    getAll(): Observable<VariableItem[]> {
        return this._httpClient.get<VariableItem[]>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                this.variableItems = response?.content.map((item: VariableItem) => item);
                this.metadata = response;
                return response
            }),
            catchError(() => of([] as VariableItem[]))
        );
    }
}

