import { Injectable } from "@angular/core";
import { Product } from "./product.interface";
import { environment } from "@env/environment";
import { ReplaySubject } from "rxjs";


@Injectable({
    providedIn: "root"
})
export class ProductService {

    baseUrl = environment.base_url;
    private _product: ReplaySubject<Product> = new ReplaySubject<Product>(1);
    private _products: ReplaySubject<Product[]> = new ReplaySubject<Product[]>(1);

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
            
    constructor() {
        console.log("ProductService");
    }
}