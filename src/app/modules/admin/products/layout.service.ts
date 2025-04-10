// layout.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '@core/services/administration/product/product.interface';

@Injectable()
export class LayoutService {
  private selectedProductSubject = new BehaviorSubject<Product | null>(null);
  selectedProduct$ = this.selectedProductSubject.asObservable();

  setSelectedProduct(product: Product | null) {
    this.selectedProductSubject.next(product);
  }

  clearSelectedProduct() {
    this.selectedProductSubject.next(null);
  }
}
