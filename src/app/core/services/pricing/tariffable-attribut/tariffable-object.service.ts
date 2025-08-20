import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import {TariffableObject} from "@core/services/pricing/tariffable-attribut/tariffable-object.model";

@Injectable({
    providedIn: 'root'
})
export class TariffableObjectService {

    baseUrl = environment.pricing_url + '/tariffable-attributs';
    private _tariffableObject: ReplaySubject<TariffableObject> = new ReplaySubject<TariffableObject>(1);
    private _tariffableObjects: ReplaySubject<TariffableObject[]> = new ReplaySubject<TariffableObject[]>(1);

    set tariffableObject(value: TariffableObject) {
        this._tariffableObject.next(value);
    }

    get tariffableObject$() {
        return this._tariffableObject.asObservable();
    }

    set tariffableObjects(value: TariffableObject[]) {
        this._tariffableObjects.next(value);
    }

    get tariffableObjects$() {
        return this._tariffableObjects.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    getAll(): Observable<TariffableObject[]> {
        return this._httpClient.get<TariffableObject[]>(`${this.baseUrl}?all=true`)
        .pipe(
            tap((response : any) => {
                this.tariffableObjects = response.map((item: TariffableObject) => {
                    return item;
                });
                return response;
            }),
            catchError(() => of([] as TariffableObject[]))
        );
    }
}
