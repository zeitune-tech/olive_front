import {Component, Inject, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {Product} from "@core/services/settings/product/product.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Branch} from "@core/services/settings/branch/branch.interface";
import { ConstantService } from "@core/services/pricing/constant/constant.service";
import { ConstantFormComponent } from "../../constants/form/form.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {VariableConditionFormComponent} from "../../variable-condition/form/form.component";
import {Formula} from "@core/services/pricing/formula/formula.interface";
import {FormulaService} from "@core/services/pricing/formula/formula.service";
import {TranslocoService} from "@jsverse/transloco";
import {ManagementEntity} from "@core/services/administration/management-entity/management-entity.interface";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {VariableConditionService} from "@core/services/pricing/variable-condition/variable-condition.service";
import {Constant} from "@core/services/pricing/constant/constant.model";
import {VariableCondition} from "@core/services/pricing/variable-condition/variable-condition.model";
import {TypeOfVariable} from "@core/services/pricing/variable-item/variable-item.model";
import {SelectionService} from "../../shared/services/selection.service";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";
import {NumericFieldService} from "@core/services/pricing/field/numeric-field/numeric-field.service";
import {SelectFieldService} from "@core/services/pricing/field/select-field/select-field.service";
import {NumericField} from "@core/services/pricing/field/numeric-field/numeric-field.model";
import {DeclarationFieldFormComponent} from "../../field/declaration-form/form.component";
import {SelectField} from "@core/services/pricing/field/select-field/select-field.model";
import {DeclarationField} from "@core/services/pricing/field/declaration-field/declaration-field.model";

type Variable = {
  name: string,
  description: string,
  coverage: string,
  formula: string,
  variables: string[]
}

@Component({
    selector: 'app-formula-new',
    templateUrl: './new.component.html',
})
export class FormulaNewComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  formGroup!: UntypedFormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Formula>([]); // Ajoute les données réelles ici

  selectedBranch: Branch | undefined;
  selectedProduct: Product | undefined;
  coverages: Coverage[] = []
  selectedCoverage: Coverage | undefined;
  selectedPricingType: PricingType | undefined;
  managementEntity: ManagementEntity = new ManagementEntity({});

  constructor(
      private _formBuilder: FormBuilder,
      private _dialog: MatDialog,
      private _selectionService: SelectionService,
      private _constantService: ConstantService,
      private _variableConditionService: VariableConditionService,
      private _formulaService: FormulaService,
      private _snackBar: MatSnackBar,
      private translocoService: TranslocoService,
      private snackBar: MatSnackBar,
      private _coverageService: CoverageService,
      private _numericFieldService: NumericFieldService,
      private _selectFieldService: SelectFieldService,
      private dialogRef: MatDialogRef<FormulaNewComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Variable,
  ) {
  }

  loadVariables(): void {
    // Recharger les constantes, champs numériques et de séléction, conditions variables et formules
    forkJoin([
      this._constantService.getAll(),
      this._numericFieldService.getAll(),
      this._selectFieldService.getAll(),
      this._variableConditionService.getAll(),
      this._formulaService.getAll()
    ])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(([constants, numericFields, selectFields, variableConditions, formulas]) => {
        this.constantList = constants;
        this.numericFieldList = numericFields;
        this.selectFieldList = selectFields;
        this.variableConditionList = variableConditions;
        this.formulaList = formulas;
        // Combiner toutes les variables
        this.variables = [
          ...this.constantList,
          ...this.numericFieldList,
          ...this.selectFieldList,
          ...this.variableConditionList,
          ...this.formulaList
        ];
        console.log(this.variables);
      });
  }

  setupSelection() {
    // S'abonner aux changements de sélection
    this._selectionService.selectedBranch$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(branch => {
        this.selectedBranch = branch;
      });

    this._selectionService.selectedProduct$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(product => {
        this.selectedProduct = product;
        if (product) {
          this._coverageService.getByProduct(product.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((coverages: Coverage[]) => {
              this.coverages = coverages || [];
            });
        }
      });

    this._selectionService.selectedPricingType$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(pricingType => {
        this.selectedPricingType = pricingType;
      });
  }

  ngOnInit() {

    this.setupSelection();

    this.loadVariables();

    this.formGroup = this._formBuilder.group({
      name: [this.data.name || '', []],
      description: [this.data.description || '', []],
      coverage: [this.data.coverage || '', []],
      formula: [this.data.formula || '', []],
      variables: [this.data.variables || '', []],
    });

    this.formula = this.data.formula || '';
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  formula = '';
  searchTerm = '';

  constantList: Constant[] = [];
  numericFieldList: NumericField[] = [];
  selectFieldList: SelectField[] = [];
  variableConditionList: VariableCondition[] = [];
  formulaList: Formula[] = [];
  variables: (Constant | NumericField | SelectField | VariableCondition | Formula)[] = [];

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

  removeLast() {

    if (this.formula.length === 0) {
      return;
    }
    // Supprimer le dernier est une variable
    const lastVariableMatch = this.formula.match(/{{\w+}}$/);
    if (lastVariableMatch) {
      const lastVariable = lastVariableMatch[0];
      this.formula = this.formula.slice(0, -lastVariable.length);
      this.formGroup.get('formula')?.setValue(this.formula);
      return;
    }

    this.formula = this.formula.slice(0, -1);
    this.formGroup.get('formula')?.setValue(this.formula);

  }

  filteredVariables(): any[] {
    if (!this.searchTerm) {
      return this.variables;
    }

    return this.variables.filter(v =>
      v.label.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      v.variableName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getVariablesByType(type: TypeOfVariable) {
    return this.filteredVariables().filter(variable => variable?.type === type);
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
        this._dialog.open(DeclarationFieldFormComponent, {
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

  resetForm() {
    this.formGroup.reset();
    this.formula = '';
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
      pricingType: this.selectedPricingType!.id,
      coverage: this.formGroup.get('coverage')?.value,
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


  onCancel() {
    this.dialogRef.close(false);

  }

  protected readonly TypeOfVariable = TypeOfVariable;

}
