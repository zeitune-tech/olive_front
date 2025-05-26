import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { ProductionRegistry } from "./production-registry.interface";

@Injectable({
    providedIn: 'root'
})
export class ProductionRegistryService {

    baseUrl = environment.settings_url + '/production-registries';
    private _productionRegistry: ReplaySubject<ProductionRegistry> = new ReplaySubject<ProductionRegistry>(1);
    private _productionRegistries: ReplaySubject<ProductionRegistry[]> = new ReplaySubject<ProductionRegistry[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set productionRegistry(value: ProductionRegistry) {
        this._productionRegistry.next(value);
    }

    get productionRegistry$() {
        return this._productionRegistry.asObservable();
    }

    set productionRegistries(value: ProductionRegistry[]) {
        this._productionRegistries.next(value);
    }

    get productionRegistries$() {
        return this._productionRegistries.asObservable();
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

    create(productionRegistry: ProductionRegistry): Observable<ProductionRegistry> {
        return this._httpClient.post<ProductionRegistry>(`${this.baseUrl}`, productionRegistry)
        .pipe(
            tap((productionRegistry) => {
                this.productionRegistry = productionRegistry;
                return (productionRegistry);
            }),
            catchError(() => of({} as ProductionRegistry))
        );
    }


    get(id: string): Observable<ProductionRegistry> {
        return this._httpClient.get<ProductionRegistry>(`${this.baseUrl}${id}`)
        .pipe(
            tap((productionRegistry) => {
                this.productionRegistry = productionRegistry;
                return (productionRegistry);
            }),
            catchError(() => of({} as ProductionRegistry))
        );
    }


    getAll(): Observable<ProductionRegistry[]> {
        return this._httpClient.get<ProductionRegistry[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : ProductionRegistry[]) => {
                this.productionRegistries = response;
                return response;
            }),
            catchError(() => of([] as ProductionRegistry[]))
        );
    }
}