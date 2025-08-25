import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, UntypedFormGroup, Validators} from "@angular/forms";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";

@Component({
  selector: "app-coverages-new",
  templateUrl: "./edit.component.html",
})
export class CoveragesEditDialogComponent implements OnInit {

  formGroup!: UntypedFormGroup;
  message: string = '';

  calculationModes = [
    {value: 'AUTOMATIC', label: 'Automatique'},
    {value: 'FIXE', label: 'Fixe'},
    {value: 'MANUAL', label: 'Libre'}
  ];

  natures = [
    {value: 'REQUIRED', label: 'Obligatoire'},
    {value: 'OPTIONAL', label: 'Optionnelle'},
    {value: 'RECOMMENDED', label: 'Proposée'},
  ]

  constructor(
    private _formBuilder: FormBuilder,
    private _coverageService: CoverageService,
    private dialogRef: MatDialogRef<CoveragesEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      nature: [this.data?.nature || ''],
      isFree: [this.data?.isFree ?? null, Validators.required],
      calculationMode: [this.data?.calculationMode ?? null, Validators.required],
      fixedCapital: [this.data?.fixedCapital ?? null],
      minCapital: [this.data?.minCapital ?? null],
      maxCapital: [this.data?.maxCapital ?? null],
      order: [this.data?.order ?? 0, [Validators.min(0)]],
      prorata: [this.data?.prorata ?? ''],
      displayPrime: [this.data?.displayPrime ?? null, Validators.required],
      generatesCharacteristic: [this.data?.generatesCharacteristic ?? null, Validators.required],
    });

    this.handleCalculationModeChanges();

    // Initialiser l’état à l'ouverture du formulaire (utile si on édite)
    this.updateCapitalFields(this.formGroup.get('calculationMode')?.value);
  }

  handleCalculationModeChanges(): void {
    this.formGroup.get('calculationMode')?.valueChanges.subscribe(value => {
      this.updateCapitalFields(value);
    });
  }

  updateCapitalFields(mode: string): void {
    const fixed = this.formGroup.get('fixedCapital');
    const min = this.formGroup.get('minCapital');
    const max = this.formGroup.get('maxCapital');

    if (mode === 'FIXE') {
      fixed?.setValidators([Validators.required, Validators.min(0.01)]);
      min?.clearValidators();
      max?.clearValidators();
    } else {
      fixed?.clearValidators();
      min?.setValidators([Validators.required, Validators.min(0)]);
      max?.setValidators([Validators.required, Validators.min(0)]);
    }

    fixed?.updateValueAndValidity();
    min?.updateValueAndValidity();
    max?.updateValueAndValidity();
  }


  onSubmit(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value); // on retourne les données au parent
    }
  }


}
