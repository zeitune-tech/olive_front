import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Product } from "./product.interface";


@Injectable({
    providedIn: "root"
})
export class ProductService {

    baseUrl = environment.settings_url + "/products";
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

    create(product: any): Observable<Product> {
        return this._httpClient.post<Product>(`${this.baseUrl}`, product)
            .pipe(
                tap((product) => {
                    this.product = product;
                    return (product);
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }

    update(id: string, product: any): Observable<Product> {
        return this._httpClient.put<Product>(`${this.baseUrl}/${id}`, product)
            .pipe(
                tap((product) => {
                    this.product = product;
                    return (product);
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }

    addCoverages(id: string, coverages: any): Observable<Product> {
        return this._httpClient.put<Product>(`${this.baseUrl}/${id}/coverages`, coverages)
            .pipe(
                tap((product) => {
                    this.product = product;
                    return (product);
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }

    removeCoverages(id: string, coverages: any): Observable<Product> {
        return this._httpClient.put<Product>(`${this.baseUrl}/${id}/coverages/remove`, coverages)
            .pipe(
                tap((product) => {
                    this.product = product;
                    return (product);
                }),
                catchError((error) => {
                    throw error;
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
                tap((response: Product[]) => {
                    this.products = response.map((item: any) => new Product(item));
                    return response;
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    getWithFilters(filters: any): Observable<Product[]> {
        return this._httpClient.get<Product[]>(`${this.baseUrl}`, { params: filters })
            .pipe(
                tap((response: any) => {
                    return response;
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    shareProduct(id: string, companies: string[]): Observable<any> {
        return this._httpClient.patch(`${this.baseUrl}/${id}/share`, companies)
            .pipe(
                tap(() => {
                    return (id);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }
}