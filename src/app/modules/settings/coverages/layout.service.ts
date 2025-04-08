import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "@core/services/administration/product/product.interface";
import { ProductService } from "@core/services/administration/product/product.service";
import { RequestMetadata } from "@core/services/common.interface";
import { Coverage } from "@core/services/settings/coverage/coverage.interface";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";
import { IncompatibleCoverage } from "@core/services/settings/incompatible-coverage/incompatible-coverage.interface";
import { IncompatibleCoverageService } from "@core/services/settings/incompatible-coverage/incompatible-coverage.service";
import { ReplaySubject } from "rxjs";

@Injectable()
export class LayoutService {

    private _selectedProduct: ReplaySubject<Product> = new ReplaySubject<Product>(1);
    private _products: ReplaySubject<Product[]> = new ReplaySubject<Product[]>(1);
    private _searchCtrl: string = '';
    private _isLoading: boolean = false;

    private _productMetadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
    private _coverageMetadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
    private _incompatibleCoverageMetadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);

    private _coverages: ReplaySubject<Coverage[]> = new ReplaySubject<Coverage[]>(1);
    private _incompatibleCoverages: ReplaySubject<IncompatibleCoverage[]> = new ReplaySubject<IncompatibleCoverage[]>(1);

    get coverages$() {
        return this._coverages.asObservable();
    }

    set coverages(coverages: Coverage[]) {
        this._coverages.next(coverages);
    }

    get incompatibleCoverages$() {
        return this._incompatibleCoverages.asObservable();
    }

    set incompatibleCoverages(incompatibleCoverages: IncompatibleCoverage[]) {
        this._incompatibleCoverages.next(incompatibleCoverages);
    }

    get selectedProduct$() {
        return this._selectedProduct.asObservable();
    }

    set selectedProduct(product: Product) {
        this._selectedProduct.next(product);
    }

    get products$() {
        return this._products.asObservable();
    }

    set products(products: Product[]) {
        this._products.next(products);
    }

    get searchCtrl(): string {
        return this._searchCtrl;
    }

    set searchCtrl(value: string) {
        this._searchCtrl = value;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        this._isLoading = value;
    }

    get productMetadata$() {
        return this._productMetadata.asObservable();
    }

    set productMetadata (metadata: RequestMetadata) {
        this._productMetadata.next(metadata);
    }

    get coverageMetadata$() {
        return this._coverageMetadata.asObservable();
    }

    set coverageMetadata (metadata: RequestMetadata) {
        this._coverageMetadata.next(metadata);
    }

    get incompatibleCoverageMetadata$ () {
        return this._incompatibleCoverageMetadata.asObservable();
    }

    set incompatibleCoverageMetadata (metadata: RequestMetadata) {
        this._incompatibleCoverageMetadata.next(metadata);
    }

    constructor(
        private _productService: ProductService,
        private _coverageService: CoverageService,
        private _incompatibleCoverageService: IncompatibleCoverageService,
    ) {
        this._productService.products$.subscribe((products: Product[]) => {
            if (products.length > 0) {
                this.selectedProduct = products[0];
            }
        });
    }



    fetchProducts(page: number, pageSize: number) {
        this.isLoading = true;
        this._productService.getWithFilters({
            page: page,
            size: pageSize,
            search: this.searchCtrl
        }).subscribe({
            next: (response: any) => {
                this.products = response?.content.map((product: Product) => {
                    return new Product(product);
                })
                this.productMetadata = response.metadata;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        })
    }

    fetchCoverages(page: number, pageSize: number) {
        this.isLoading = true;
        let httpParams = new HttpParams();
        httpParams = httpParams.append('page', page.toString());
        httpParams = httpParams.append('size', pageSize.toString());
        if (this.searchCtrl) {
            httpParams = httpParams.append('search', this.searchCtrl);
        }
        if (this.selectedProduct?.id) {
            httpParams = httpParams.append('productUuid', this.selectedProduct.id.toString());
        }
        this._coverageService.getWithFilters(httpParams).subscribe({
            next: (response: any) => {
                this.coverages = response?.content.map((coverage: Coverage) => {
                    return new Coverage(coverage);
                })
                this.coverageMetadata = response.metadata;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        })
    }

    fetchIncompatibleCoverages(page: number, pageSize: number) {
        this.isLoading = true;
        let httpParams = new HttpParams();
        httpParams = httpParams.append('page', page.toString());
        httpParams = httpParams.append('size', pageSize.toString());
        if (this.searchCtrl) {
            httpParams = httpParams.append('search', this.searchCtrl);
        }
        if (this.selectedProduct?.id) {
            httpParams = httpParams.append('productUuid', this.selectedProduct.id.toString());
        }
        this._incompatibleCoverageService.getWithFilters(httpParams).subscribe({
            next: (response: any) => {
                this.incompatibleCoverages = response?.content.map((coverage: Coverage) => {
                    return new IncompatibleCoverage(coverage);
                })
                this.incompatibleCoverageMetadata = response.metadata;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        })
    }
}