import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { InsuredRegistry } from "./insured-registry.interface";

@Injectable({
    providedIn: 'root'
})
export class InsuredRegistryService {

    baseUrl = environment.settings_url + '/insured-registries';
    private _insuredRegistry: ReplaySubject<InsuredRegistry> = new ReplaySubject<InsuredRegistry>(1);
    private _insuredRegistries: ReplaySubject<InsuredRegistry[]> = new ReplaySubject<InsuredRegistry[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);


    set insuredRegistry(value: InsuredRegistry) {
        this._insuredRegistry.next(value);
    }

    get insuredRegistry$() {
        return this._insuredRegistry.asObservable();
    }

    set insuredRegistries(value: InsuredRegistry[]) {
        this._insuredRegistries.next(value);
    }

    get insuredRegistries$() {
        return this._insuredRegistries.asObservable();
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

    create(insuredRegistry: InsuredRegistry): Observable<InsuredRegistry> {
        return this._httpClient.post<InsuredRegistry>(`${this.baseUrl}`, insuredRegistry)
        .pipe(
            tap((insuredRegistry) => {
                this.insuredRegistry = insuredRegistry;
                return (insuredRegistry);
            }),
            catchError(() => of({} as InsuredRegistry))
        );
    }


    get(id: string): Observable<InsuredRegistry> {
        return this._httpClient.get<InsuredRegistry>(`${this.baseUrl}${id}`)
        .pipe(
            tap((insuredRegistry) => {
                this.insuredRegistry = insuredRegistry;
                return (insuredRegistry);
            }),
            catchError(() => of({} as InsuredRegistry))
        );
    }


    getAll(): Observable<InsuredRegistry[]> {
        return this._httpClient.get<InsuredRegistry[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.insuredRegistries = response?.content.map((insuredRegistry: InsuredRegistry) => {
                    return insuredRegistry;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as InsuredRegistry[]))
        );
    }
}
