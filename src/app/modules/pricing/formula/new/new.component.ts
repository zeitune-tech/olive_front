import {Component, OnInit, ViewChild} from "@angular/core";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {Product} from "@core/services/settings/product/product.interface";
import {SelectDialogComponent} from "@shared/components/select-dialog/select-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {
  CommissionPointOfSale
} from "@core/services/settings/commission-point-of-sale/commission-point-of-sale.interface";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {SelectProductComponent} from "../../../settings/coverages/select-product/select-product.component";
import {BranchService} from "@core/services/settings/branch/branch.service";
import { ConstantService } from "@core/services/pricing/constant/constant.service";
import { ConstantFormComponent } from "../../constants/form/form.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import {FieldFormComponent} from "../../field/form/form.component";

export interface Variable {
    id: number;
    name: string;
    label: string;
}

@Component({
    selector: 'pricing-new',
    templateUrl: './new.component.html',
})
export class PricingNewComponent implements OnInit {

  formGroup!: UntypedFormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<CommissionPointOfSale>([]); // Ajoute les données réelles ici

  selectedBranch: Branch | undefined;
  branches: Branch[] = [];

  selectedProduct: Product | undefined;

  products: Product[] = [
    new Product({ id: '1', name: 'Product 1', description: 'Description of Product 1' }),
    new Product({ id: '2', name: 'Product 2', description: 'Description of Product 2' }),
    new Product({ id: '3', name: 'Product 3', description: 'Description of Product 3' })
  ];

  constructor(
      private _formBuilder: FormBuilder,
      private _dialog: MatDialog,
      private _branchService: BranchService,
      private _constantService: ConstantService,
      private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    // Initialisation du service de branche
    this._branchService.branches$.subscribe(branches => {
      this.branches = branches;
    });

    this.formGroup = this._formBuilder.group({
        name: [''],
        description: [''],
        formula: ['']
    });
  }

  formula = '';

  searchTerm = '';

  variables = [
      { name: 'CA', label: "Chiffre d'affaires", value: 5000 },
      { name: 'NB_CLIENTS', label: 'Nombre de clients', value: 25 },
      { name: 'MARGE', label: 'Marge brute', value: 1200 }
  ];


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
    if (!this.searchTerm) return this.variables;
    return this.variables.filter(v =>
      v.label.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSubmit() {
    console.log(this.formGroup.value);
    // Ici, envoie vers ton API pour sauvegarder la formule
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
        // this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
        this.dataSource.paginator = this.paginator;
        // this._changeDetectorRef.detectChanges();
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
        // this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
        this.dataSource.paginator = this.paginator;
        // this._changeDetectorRef.detectChanges();
      }
    })
  }

  onAddNewVariable(variable: "CONSTANT" | "FIELD"): void {

    if (!this.selectedBranch) {
        this._snackBar.open("entities.branch-selection.not-select-error-title", "close", { duration: 3000 });
        return;
    }
    
    if (!this.selectedProduct) {
        this._snackBar.open("entities.product-selection.not-select-error-title", "", { duration: 3000 });
        return;
    }

    if (variable === "CONSTANT") {
        this._dialog.open(ConstantFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'create',
                product: this.selectedProduct?.id
            }

        }).afterClosed().subscribe((result) => {
            if (result) {
                this._constantService.getAll().subscribe();
            }
        });
    }
    else if (variable === "FIELD") {
        this._dialog.open(FieldFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'create',
                product: this.selectedProduct?.id,
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                // Handle the result if needed
            }
        });
    }
  }

}
