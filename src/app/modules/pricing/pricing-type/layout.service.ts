// layout.service.ts
import { Injectable } from '@angular/core';
import { Product } from '@core/services/settings/product/product.interface';
import { BehaviorSubject } from 'rxjs';

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
