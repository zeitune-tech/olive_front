import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {Product} from "@core/services/settings/product/product.interface";
import {SelectDialogComponent} from "@shared/components/select-dialog/select-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {
  CommissionPointOfSale
} from "@core/services/settings/commission-point-of-sale/commission-point-of-sale.interface";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {BranchService} from "@core/services/settings/branch/branch.service";
import { ConstantService } from "@core/services/pricing/constant/constant.service";
import { ConstantFormComponent } from "../../constants/form/form.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VariableItemResponse, VariableItemService } from "@core/services/pricing/variable-item/variable-item.service";
import { ProductService } from "@core/services/settings/product/product.service";
import { Subject, takeUntil } from "rxjs";
import { NumericFieldFormComponent } from "../../field/numeric-form/form.component";
import {VariableConditionFormComponent} from "../../variable-condition/form/form.component";
import {Formula} from "@core/services/pricing/formula/formula.interface";
import {FormulaService} from "@core/services/pricing/formula/formula.service";
import {FormMode} from "@shared/enum/form.enum";
import {TranslocoService} from "@jsverse/transloco";
import {ManagementEntityService} from "@core/services/administration/management-entity/management-entity.service";
import {ManagementEntity} from "@core/services/administration/management-entity/management-entity.interface";

export interface Variable {
    id: number;
    name: string;
    label: string;
}

@Component({
    selector: 'pricing-new',
    templateUrl: './new.component.html',
})
export class PricingNewComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  formGroup!: UntypedFormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<CommissionPointOfSale>([]); // Ajoute les données réelles ici

  selectedBranch: Branch | undefined;
  branches: Branch[] = [];

  selectedProduct: Product | undefined;
  products: Product[] = [];
  managementEntity: ManagementEntity = new ManagementEntity({});


  constructor(
      private _formBuilder: FormBuilder,
      private _dialog: MatDialog,
      private _branchService: BranchService,
      private _constantService: ConstantService,
      private _variableItemService: VariableItemService,
      private _productService: ProductService,
      private _snackBar: MatSnackBar,
      private _formulaService: FormulaService,
      private translocoService: TranslocoService,
      private snackBar: MatSnackBar,
      private _managementEntityService: ManagementEntityService,

      // private dialogRef: MatDialogRef<PricingNewComponent>,

  ) {

  }

  ngOnInit() {
    console.log('Checking resolver data availability...');
    
    // Les données sont déjà chargées par le resolver, on peut directement s'abonner aux observables
    this._branchService.branches$.subscribe(branches => {
      this.branches = branches;
      console.log('Branches loaded from resolver:', branches);
    });

    this._productService.products$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Product[]) => {
        this.products = data;
        console.log('Products loaded from resolver:', data);
      });

    this._managementEntityService.entity$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: ManagementEntity) => {
        this.managementEntity = data;
        console.log('Management entity loaded from resolver:', data);
      });

    this._variableItemService.variableItems$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data: VariableItemResponse[]) => {
          this.variables = data;
          console.log('Variable items loaded from resolver:', data);
        },
        error: (error) => {
          console.error('Error in variableItems$ subscription:', error);
        }
      });


    this.formGroup = this._formBuilder.group({
        name: [''],
        description: [''],
        formula: ['']
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  formula = '';

  searchTerm = '';

  variables: VariableItemResponse[] = [];

  append(value: string) {
    this.formula += value;
    this.formGroup.get('formula')?.setValue(this.formula);
  }

  add(varName: string) {
    this.formula += `{{${varName}}}`;
    this.formGroup.get('formula')?.setValue(this.formula);
  }

  clear() {
    this.formula = '';
    this.formGroup.get('formula')?.setValue(this.formula);
  }


  filteredVariables() {
    if (!this.searchTerm) {
      return this.variables;
    }

    return this.variables.filter(v =>
      v.label.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      v.variableName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSubmit() {
    this.checkIfBranchAndProductSelected();
    this._formulaService.create({
      id: '', // Laisser vide pour une nouvelle formule
      label: this.formGroup.get('name')?.value,
      description: this.formGroup.get('description')?.value,
      variableName: this.formGroup.get('name')?.value, // Utiliser le nom comme variableName
      toReturn: true, // Par défaut, on considère que la formule retourne une valeur
      managementEntity: this.managementEntity.id,
      product: this.selectedProduct!.id ,
      branch: this.selectedBranch!.id,
      expression: this.formula,
      variables: this.variables.filter(v => this.formula.includes(v.variableName) ).map(v => v.id) // Filtrer les variables qui doivent être retournées
    })
      .subscribe({
        next: () => {
          const successMessage = 'form.success.creation';

          this.snackBar.open(
            this.translocoService.translate(successMessage),
            undefined,
            { duration: 3000, panelClass: 'snackbar-success' }
          );

          this.resetForm();
          this.loadVariables();
        },
        error: () => {
          this.snackBar.open(
            this.translocoService.translate('form.errors.submission'),
            undefined,
            { duration: 3000, panelClass: 'snackbar-error' }
          );
          this.formGroup.enable();
        }
      });
  }

  openProductSelection() {
    this._dialog.open(SelectDialogComponent, {
      width: '700px',
      data: {
        displayField: "name",
        items: this.products,
        title:"product-selection.title"
      }
    }).afterClosed().subscribe((product: Product) => {
      if (product) {
        this.selectedProduct = product;
        // Recharger les variables pour le produit sélectionné
        this.loadVariables();
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  openBranchSelection() {
    this._dialog.open(SelectDialogComponent, {
      width: '700px',
      data: {
        displayField: "name",
        items: this.branches,
        title: "branch-selection.title"
      }
    }).afterClosed().subscribe((branch: Branch) => {
      if (branch) {
        this.selectedBranch = branch;
        // Filtrer les produits par branche sélectionnée
        this._productService.getByBranchOrAll(branch.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((products: Product[]) => {
            this.products = products || [];
            // Réinitialiser la sélection de produit si elle n'existe plus dans la nouvelle liste
            if (this.selectedProduct && !this.products.find(p => p.id === this.selectedProduct?.id)) {
              this.selectedProduct = undefined;
            }
            // Recharger les variables si on a une branche et un produit sélectionnés
            this.loadVariables();
          });
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  loadVariables(): void {
    // Recharger les variables selon la sélection actuelle
    this._variableItemService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data: VariableItemResponse[]) => {
          this.variables = data || [];
        },
        error: (error) => {
          console.error('Error reloading variables:', error);
        }
      });
  }

  onAddNewVariable(variable: "CONSTANT" | "FIELD" | "VARIABLE_CONDITION"): void {

    this.checkIfBranchAndProductSelected();
    if (variable === "CONSTANT") {
        this._dialog.open(ConstantFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'create',
                product: this.selectedProduct!.id,
                branch: this.selectedBranch!.id
            }

        }).afterClosed().subscribe((result) => {
            if (result) {
                this._constantService.getAll().subscribe();
                // Recharger les variables après ajout d'une constante
                this.loadVariables();
            }
        });
    }
    else if (variable === "FIELD") {
        this._dialog.open(NumericFieldFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'create',
                product: this.selectedProduct!.id,
                branch: this.selectedBranch!.id
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                // Recharger les variables après ajout d'un champ
                this.loadVariables();
            }
        });
    }
    else if (variable === "VARIABLE_CONDITION") {
        this._dialog.open(VariableConditionFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'create',
                product: this.selectedProduct!.id,
                branch: this.selectedBranch!.id
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                // Recharger les variables après ajout d'une condition variable
                this.loadVariables();
            }
        });
    }
  }

  checkIfBranchAndProductSelected() {
    if (!this.selectedBranch) {
      this._snackBar.open("entities.branch-selection.not-select-error-title", "close", { duration: 3000 });
      return;
    }

    if (!this.selectedProduct) {
      this._snackBar.open("entities.product-selection.not-select-error-title", "", { duration: 3000 });
      return;
    }
  }

  private resetForm() {
    this.formGroup.reset();
    this.formula = '';
  }
}
