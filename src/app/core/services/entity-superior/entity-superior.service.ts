import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { EntitySuperior } from "./entity-superior.interface";

@Injectable()
export class EntitySuperiorService {

    baseUrl = environment.base_url;
    private _myEntitySuperior: ReplaySubject<EntitySuperior> = new ReplaySubject<EntitySuperior>(1);
    private _entitySuperior: ReplaySubject<EntitySuperior> = new ReplaySubject<EntitySuperior>(1);
    private _entitiesSuperior: ReplaySubject<EntitySuperior[]> = new ReplaySubject<EntitySuperior[]>(1);
    private _entitiesSuperiorLinked: ReplaySubject<EntitySuperior[]> = new ReplaySubject<EntitySuperior[]>(1);

    set myEntitySuperior(value: EntitySuperior) {
        this._myEntitySuperior.next(value);
    }

    get myEntitySuperior$() {
        return this._myEntitySuperior.asObservable();
    }

    set entitySuperior(value: EntitySuperior) {
        this._entitySuperior.next(value);
    }

    get entitySuperior$() {
        return this._entitySuperior.asObservable();
    }

    set entitiesSuperior(value: EntitySuperior[]) {
        this._entitiesSuperior.next(value);
    }

    get entitiesSuperior$() {
        return this._entitiesSuperior.asObservable();
    }

    set entitiesSuperiorLinked(value: EntitySuperior[]) {
        this._entitiesSuperiorLinked.next(value);
    }

    get entitiesSuperiorLinked$() {
        return this._entitiesSuperiorLinked.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    create(entitySuperior: EntitySuperior): Observable<EntitySuperior> {
        return this._httpClient.post<EntitySuperior>(`${this.baseUrl}/entities-superior`, entitySuperior)
        .pipe(
            tap((entitySuperior) => {
                this.entitySuperior = entitySuperior;
                return (entitySuperior);
            }),
            catchError(() => of({} as EntitySuperior))
        );
    }

    getEntitiesSuperior(): Observable<EntitySuperior[]> {
        return this._httpClient.get<EntitySuperior[]>(`${this.baseUrl}/entities-superior/all`)
        .pipe(
            tap((entitiesSuperior) => {
                this.entitiesSuperior = entitiesSuperior;
                return (entitiesSuperior);
            }),
            catchError(() => of([] as EntitySuperior[]))
        );
    }

    getEntitySuperior(id: number): Observable<EntitySuperior> {
        return this._httpClient.get<EntitySuperior>(`${this.baseUrl}/entities-superior/${id}`)
        .pipe(
            tap((entitySuperior) => {
                this.entitySuperior = entitySuperior;
                return (entitySuperior);
            }),
            catchError(() => of({} as EntitySuperior))
        );
    }

    getEntitiesSuperiorLinked(): Observable<EntitySuperior[]> {
        return this._httpClient.get<EntitySuperior[]>(`${this.baseUrl}/entities-superior`)
        .pipe(
            tap((entitiesSuperior) => {
                this.entitiesSuperiorLinked = entitiesSuperior;
                return (entitiesSuperior);
            }),
            catchError(() => of([] as EntitySuperior[]))
        );
    }

    updateEntitySuperior(entitySuperior: EntitySuperior): Observable<EntitySuperior> {
        return this._httpClient.put<EntitySuperior>(`${this.baseUrl}/entities-superior/${entitySuperior.id}`, entitySuperior)
        .pipe(
            tap((entitySuperior) => {
                this.entitySuperior = entitySuperior;
                return (entitySuperior);
            }),
            catchError(() => of({} as EntitySuperior))
        );
    }
}