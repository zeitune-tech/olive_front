import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { PointOfSale, BrokerPointOfSale } from "./point-of-sale.interface";
import { RequestMetadata } from "../../common.interface";


@Injectable()
export class PointOfSaleService {

    private baseUrl = environment.administration_url + '/points-of-sale';
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
    private _brokersMetadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);

    private _pointOfSale: ReplaySubject<PointOfSale> = new ReplaySubject<PointOfSale>(1);
    private _pointsOfSale: ReplaySubject<PointOfSale[]> = new ReplaySubject<PointOfSale[]>(1);
    private _brokers: ReplaySubject<BrokerPointOfSale[]> = new ReplaySubject<BrokerPointOfSale[]>(1);
    private _linkedBrokers: ReplaySubject<BrokerPointOfSale[]> = new ReplaySubject<BrokerPointOfSale[]>(1);

    set pointOfSale(value: PointOfSale) {
        this._pointOfSale.next(value);
    }

    get pointOfSale$() {
        return this._pointOfSale.asObservable();
    }

    set pointsOfSale(value: PointOfSale[]) {
        this._pointsOfSale.next(value);
    }

    get pointsOfSale$() {
        return this._pointsOfSale.asObservable();
    }

    set brokers(value: BrokerPointOfSale[]) {
        this._brokers.next(value);
    }

    get brokers$() {
        return this._brokers.asObservable();
    }

    set linkedBrokers(value: BrokerPointOfSale[]) {
        this._linkedBrokers.next(value);
    }

    get linkedBrokers$() {
        return this._linkedBrokers.asObservable();
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
    }

    get brokersMetadata$() {
        return this._brokersMetadata.asObservable();
    }

    set brokersMetadata(value: RequestMetadata) {
        this._brokersMetadata.next(value);
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    create(pointOfSale: PointOfSale): Observable<PointOfSale> {
        return this._httpClient.post<PointOfSale>(`${this.baseUrl}`, pointOfSale)
        .pipe(
            tap((pointOfSale) => {
                this.pointOfSale = pointOfSale;
                return (pointOfSale);
            }),
            catchError((error) => {
                return of(error.error);
            })
        );
    }

    get(): Observable<PointOfSale> {
        return this._httpClient.get<PointOfSale>(`${this.baseUrl}/me`)
        .pipe(
            tap((pointOfSale) => {
                this.pointOfSale = pointOfSale;
                return pointOfSale;
            }),
            catchError(() => of({} as PointOfSale))
        );
    }

    getAll(): Observable<PointOfSale[]> {
        return this._httpClient.get<PointOfSale[]>(`${this.baseUrl}`)
        .pipe(
            tap((response: any) => {
                this.pointsOfSale = response.content?.map((pointOfSale: PointOfSale) => {
                    return pointOfSale;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as PointOfSale[]))
        );
    }

    getBrokers(): Observable<BrokerPointOfSale[]> {
        return this._httpClient.get<BrokerPointOfSale[]>(`${this.baseUrl}/brokers`)
        .pipe(
            tap((response: any) => {
                this.brokers = response.content?.map((broker: BrokerPointOfSale) => {
                    return broker;
                });
                this.brokersMetadata = response;
                return response;
            }),
            catchError(() => of([] as BrokerPointOfSale[]))
        );
    }

    getLinkedBrokers(): Observable<BrokerPointOfSale[]> {
        return this._httpClient.get<BrokerPointOfSale[]>(`${this.baseUrl}/linked-brokers`)
        .pipe(
            tap((response: BrokerPointOfSale[]) => {
                this.linkedBrokers = response;
                return response;
            }),
            catchError(() => of([] as BrokerPointOfSale[]))
        );
    }

    update(pointOfSale: PointOfSale): Observable<PointOfSale> {
        return this._httpClient.put<PointOfSale>(`${this.baseUrl}/${pointOfSale.id}`, pointOfSale)
        .pipe(
            tap((pointOfSale) => {
                return (pointOfSale);
            }),
            catchError(() => of({} as PointOfSale))
        );
    }

    delete (id: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
            .pipe(
                tap(() => {
                }),
                catchError((error) => {
                    return of(error.error);
                })
            );
    }
}
