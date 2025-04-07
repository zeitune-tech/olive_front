import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, tap } from "rxjs";
import { ManagementEntity } from "./management-entity.interface";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ManagementEntityService {

    baseUrl = environment.administration_url + '/management-entities';
    private _entity: ReplaySubject<ManagementEntity> = new ReplaySubject<ManagementEntity>(1);
    
    constructor(
        private _httpClient: HttpClient
    ) { }

    set entity(value: ManagementEntity) {
        this._entity.next(value);
    }

    get entity$() {
        return this._entity.asObservable();
    }

    get(id: string): Observable<ManagementEntity> {
        return this._httpClient.get<ManagementEntity>(`${this.baseUrl}/${id}`)
        .pipe(
            tap((entity) => {
                this.entity = entity;
            })
        );
    }

    updateLogo(formData: FormData): Observable<ManagementEntity> {
        return this._httpClient.put<ManagementEntity>(`${this.baseUrl}/logo`, formData)
        .pipe(
            tap((entity) => {
                this.entity = entity;
            })
        );
    }
}