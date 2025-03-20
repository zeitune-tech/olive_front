import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { PointOfSale } from "./point-of-sale.interface";


@Injectable()
export class PointOfSaleService {

    baseUrl = environment.base_url;
    private _myPointOfSale: ReplaySubject<PointOfSale> = new ReplaySubject<PointOfSale>(1);
    private _pointOfSale: ReplaySubject<PointOfSale> = new ReplaySubject<PointOfSale>(1);
    private _pointsOfSale: ReplaySubject<PointOfSale[]> = new ReplaySubject<PointOfSale[]>(1);
    private _pointsOfSaleLinked: ReplaySubject<PointOfSale[]> = new ReplaySubject<PointOfSale[]>(1);
    private _pointsOfSaleUnlinked: ReplaySubject<PointOfSale[]> = new ReplaySubject<PointOfSale[]>(1);

    set myPointOfSale(value: PointOfSale) {
        this._myPointOfSale.next(value);
    }

    get myPointOfSale$() {
        return this._myPointOfSale.asObservable();
    }

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

    set pointsOfSaleLinked(value: PointOfSale[]) {
        this._pointsOfSaleLinked.next(value);
    }

    get pointsOfSaleLinked$() {
        return this._pointsOfSaleLinked.asObservable();
    }

    set pointsOfSaleUnlinked(value: PointOfSale[]) {
        this._pointsOfSaleUnlinked.next(value);
    }

    get pointsOfSaleUnlinked$() {
        return this._pointsOfSaleUnlinked.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    create(pointOfSale: PointOfSale): Observable<PointOfSale> {
        return this._httpClient.post<PointOfSale>(`${this.baseUrl}/points-of-sale`, pointOfSale)
        .pipe(
            tap((pointOfSale) => {
                this.pointOfSale = pointOfSale;
                return (pointOfSale);
            }),
            catchError(() => of({} as PointOfSale))
        );
    }

    get(): Observable<PointOfSale> {
        return this._httpClient.get<PointOfSale>(`${this.baseUrl}/points-of-sale/me`)
        .pipe(
            tap((pointOfSale) => {
                this.pointOfSale = pointOfSale;
                return pointOfSale;
            }),
            catchError(() => of({} as PointOfSale))
        );
    }

    getAll(): Observable<PointOfSale[]> {
        return this._httpClient.get<PointOfSale[]>(`${this.baseUrl}/points-of-sale/all`)
        .pipe(
            tap((pointsOfSale) => {
                this.pointsOfSale = pointsOfSale;
                return pointsOfSale;
            }),
            catchError(() => of([] as PointOfSale[]))
        );
    }

    getAllLinked(): Observable<PointOfSale[]> {
        return this._httpClient.get<PointOfSale[]>(`${this.baseUrl}/points-of-sale/linked`)
        .pipe(
            tap((pointsOfSale) => {
                this.pointsOfSaleLinked = pointsOfSale;
                return (pointsOfSale);
            }),
            catchError(() => of([] as PointOfSale[]))
        );
    }

    getAllUnlinked(): Observable<PointOfSale[]> {
        return this._httpClient.get<PointOfSale[]>(`${this.baseUrl}/points-of-sale/unlinked`)
        .pipe(
            tap((pointsOfSale) => {
                this.pointsOfSaleUnlinked = pointsOfSale;
                return (pointsOfSale);
            }),
            catchError(() => of([] as PointOfSale[]))
        );
    }

    update(pointOfSale: PointOfSale): Observable<PointOfSale> {
        return this._httpClient.put<PointOfSale>(`${this.baseUrl}/points-of-sale/${pointOfSale.id}`, pointOfSale)
        .pipe(
            tap((pointOfSale) => {
                return (pointOfSale);
            }),
            catchError(() => of({} as PointOfSale))
        );
    }
}