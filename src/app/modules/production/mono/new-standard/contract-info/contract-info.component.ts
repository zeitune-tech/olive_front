import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { DurationRate } from '@core/services/settings/duration-rate/duration-rate.interface';
import { DurationRateService } from '@core/services/settings/duration-rate/duration-rate.service';
import { ProductionRegistry } from '@core/services/settings/production-registry/production-registry.interface';
import { ProductionRegistryService } from '@core/services/settings/production-registry/production-registry.service';

@Component({
  selector: 'contract-info',
  templateUrl: './contract-info.component.html'
})
export class ContractInfoComponent implements OnInit {
  form!: UntypedFormGroup;

  pointsOfSale: PointOfSale[] = [];
  products: Product[] = [];
  allDurationRates: DurationRate[] = [];
  allProductionRegistries: ProductionRegistry[] = [];

  durationRates: DurationRate[] = [];
  productionRegistries: ProductionRegistry[] = [];
  company!: ManagementEntity;


  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _managementEntityService: ManagementEntityService,
    private _productionRegistryService: ProductionRegistryService,
    private _productService: ProductService,
    private _durationRateService: DurationRateService,
    private _pointOfSaleService: PointOfSaleService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      productionRegistry: [null, Validators.required],
      pointOfSale: [null, Validators.required],
      product: [null, Validators.required],
      durationRate: [null, Validators.required],
      startDate: [null, Validators.required],
    });

    this._managementEntityService.entity$.subscribe((entity) => {
      if (entity) {
        if (entity.type === 'COMPANY') {
          this.company = entity;
        } else if (entity.type === 'POINT_OF_SALE') {
          this.company = entity.superiorEntity || new ManagementEntity({});
          this.form.patchValue({
            pointOfSale: entity.id
          });
        }
      }
    })

    this._pointOfSaleService.pointsOfSale$.subscribe((pointsOfSale) => {
      this.pointsOfSale = pointsOfSale;
      if (pointsOfSale && pointsOfSale.length > 0) {
        this.form.patchValue({
          pointOfSale: pointsOfSale[0].id
        });
      }
    });

    this._productService.products$.subscribe((products) => {
      this.products = products;
      if (products && products.length > 0) {
        this.form.patchValue({
          product: products[0].id
        });
      }
    });

    
    this._productionRegistryService.productionRegistries$.subscribe((registries) => {
      this.allProductionRegistries = registries;
      console.log('All Production Registries:', this.allProductionRegistries);
      this.filterProductionRegistries();
    })

    this._durationRateService.durationRates$.subscribe((rates) => {
      this.allDurationRates = rates;
      if (rates && rates.length > 0) {
        this.filterDurationRates(); // Filtre les taux de durée en fonction du produit sélectionné
      }
    });

    this.form.get('product')?.valueChanges.subscribe(() => {
      this.filterDurationRates();
      this.filterProductionRegistries();
      this.form.patchValue({ durationRate: null, productionRegistry: null });
    });


    this.formReady.emit(this.form);
  }

  filterDurationRates(): void {
    const selectedProductId = this.form.get('product')?.value;
    console.log('Selected Product ID:', selectedProductId);
    this.durationRates = this.allDurationRates?.filter(rate => rate.product.id == selectedProductId) || [];

    if (this.durationRates.length === 0) {
      this.form.get('durationRate')?.disable();
    } else {
      this.form.get('durationRate')?.enable();
    }
  }

  filterProductionRegistries(): void {
    const selectedProductId = this.form.get('product')?.value;
    this.productionRegistries = this.allProductionRegistries?.filter(registry => registry.product.id == selectedProductId) || [];
    if (this.productionRegistries.length === 0) {
      this.form.get('productionRegistry')?.disable();
    } else {
      this.form.get('productionRegistry')?.enable();
    }

  }


}
