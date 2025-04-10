import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Branch } from "@core/services/administration/branch/branch.interface";
import { BranchService } from "@core/services/administration/branch/branch.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { ProductService } from "@core/services/administration/product/product.service";
import { LayoutService } from "../layout.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
    selector: "app-products-new",
    templateUrl: "./new.component.html",
})
export class ProductsNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    branches: Branch[] = [];
    owner: ManagementEntity | null = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _productService: ProductService,
        private _branchService: BranchService,
        private _managementService: ManagementEntityService,
        private _layoutService: LayoutService,
        private _snackBar: MatSnackBar,
        private _router: Router,
    ) {}

    isEditMode: boolean = false;
    productId: string = '';

    initForm(): void {
        this.formGroup = this._formBuilder.group({
          name: ['', Validators.required],
          branchUuid: ['', Validators.required],
          ownerUuid: ['', Validators.required],
          minRisk: [1, [Validators.required, Validators.min(1)]],
          maxRisk: [1, [Validators.required, Validators.min(1)]],
          minimumGuaranteeNumber: [1, [Validators.required, Validators.min(1)]],
          fleet: [null, Validators.required],
          hasReduction: [false]
        });
    }


    ngOnInit(): void {
        this.initForm();

        this._branchService.branches$.subscribe(branches => {
            this.branches = branches;
        });
    
        this._layoutService.selectedProduct$.subscribe(product => {
          if (product) {
            this.isEditMode = true;
            this.productId = product.id;
            this.formGroup.patchValue({
                name: product.name,
                branchUuid: product.branch.id,
                ownerUuid: product.ownerId,
                minRisk: product.minRisk,
                maxRisk: product.maxRisk,
                minimumGuaranteeNumber: product.minimumGuaranteeNumber,
                fleet: product.fleet,
                hasReduction: product.hasReduction
            });
          }
        });

    
        this._managementService.entity$.subscribe(owner => {
          this.owner = owner;
          if (this.owner && !this.isEditMode) {
            this.formGroup.get('ownerUuid')?.setValue(this.owner.id);
          }
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            if (this.isEditMode) {
              this._productService.update(this.productId, this.formGroup.value).subscribe({
                next: () => {
                  this._snackBar.open('Produit mis à jour avec succès', 'Fermer', { duration: 3000 });
                  this._layoutService.setSelectedProduct(null);
                  this._productService.getAll().subscribe();
                  this._router.navigate(['/administration/products']);
                },
                error: () => this._snackBar.open('Erreur lors de la mise à jour du produit', 'Fermer', { duration: 3000 })
              });

            } else {
              this._productService.create(this.formGroup.value).subscribe({
                next: () => {
                  this._snackBar.open('Produit créé avec succès', 'Fermer', { duration: 3000 })
                  this._router.navigate(['/administration/products']);
                },
                error: () => this._snackBar.open('Erreur lors de la création du produit', 'Fermer', { duration: 3000 })
              });
              
            }
        }
    }
}