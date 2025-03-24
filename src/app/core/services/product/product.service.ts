import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Product } from "./product.interface";


@Injectable({
    providedIn: "root"
})
export class ProductService {

    baseUrl = environment.base_url + "/products";
    private _product: ReplaySubject<Product> = new ReplaySubject<Product>(1);
    private _products: ReplaySubject<Product[]> = new ReplaySubject<Product[]>(1);

    private _metadata: ReplaySubject<any> = new ReplaySubject<any>(1);

    set product(value: Product) {
        this._product.next(value);
    }

    get product$() {
        return this._product.asObservable();
    }

    set products(value: Product[]) {
        this._products.next(value);
    }

    get products$() {
        return this._products.asObservable();
    }

    set metadata(value: any) {
        this._metadata.next(value);
    }

    get metadata$() {
        return this._metadata.asObservable();
    }
            
    constructor(
        private _httpClient: HttpClient
    ) {
    }

    create(product: Product): Observable<Product> {
        return this._httpClient.post<Product>(`${this.baseUrl}`, product)
            .pipe(
                tap((product) => {
                    this.product = product;
                    return (product);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    update(product: Product): Observable<Product> {
        return this._httpClient.put<Product>(`${this.baseUrl}/${product.id}`, product)
            .pipe(
                tap((product) => {
                    this.product = product;
                    return (product);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    delete(id: number): Observable<any> {
        return this._httpClient.delete(`${this.baseUrl}/${id}`)
            .pipe(
                tap(() => {
                    return (id);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    get(id: string): Observable<Product> {
        return this._httpClient.get<Product>(`${this.baseUrl}/${id}`)
            .pipe(
                tap((product) => {
                    this.product = product;
                    return (product);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    getAll(): Observable<Product[]> {
        return this._httpClient.get<Product[]>(`${this.baseUrl}`)
            .pipe(
                tap((response: any) => {
                    this.products = response.content?.map((product: Product) => {
                        return product;
                    });
                    this.metadata = response;
                    return response;
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }
}