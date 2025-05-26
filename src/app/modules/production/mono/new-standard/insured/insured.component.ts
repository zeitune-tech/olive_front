import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { Gender, MaritalStatus, LicenseCategory, EmploymentStatus } from '@core/enums';

@Component({
  selector: 'app-insured-step',
  templateUrl: './insured.component.html'
})
export class InsuredStepComponent implements OnInit {
  form!: UntypedFormGroup;
  insuredForm!: UntypedFormGroup;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  genders = [
      { value: Gender.MALE, label: 'Homme' },
      { value: Gender.FEMALE, label: 'Femme' }
    ];
  
    maritalStatuses = [
      { value: MaritalStatus.SINGLE, label: 'Célibataire' },
      { value: MaritalStatus.MARRIED, label: 'Marié(e)' },
      { value: MaritalStatus.DIVORCED, label: 'Divorcé(e)' },
      { value: MaritalStatus.WIDOWED, label: 'Veuf(ve)' },
      { value: MaritalStatus.OTHER, label: 'Autre' }
    ];
  
    licenseCategories = [
      { value: LicenseCategory.A, label: 'A' },
      { value: LicenseCategory.B, label: 'B' },
      { value: LicenseCategory.C, label: 'C' },
      { value: LicenseCategory.D, label: 'D' },
      { value: LicenseCategory.E, label: 'E' }
    ];
  
    employmentStatuses = [
      { value: EmploymentStatus.SALARIED, label: 'Salarié' },
      { value: EmploymentStatus.SELF_EMPLOYED, label: 'Indépendant' },
      { value: EmploymentStatus.UNEMPLOYED, label: 'Sans emploi' },
      { value: EmploymentStatus.RETIRED, label: 'Retraité' },
      { value: EmploymentStatus.STUDENT, label: 'Étudiant' },
      { value: EmploymentStatus.OTHER, label: 'Autre' }
    ];
  


  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      insuredMode: ['existing', Validators.required],
      insuredId: [null] // Utilisé uniquement si un assuré existant est sélectionné
    });

    this.insuredForm = this._formBuilder.group({
      lastName: [null, Validators.required],
      firstName: [null, Validators.required],
      birthDate: [null, Validators.required],
      gender: [null, Validators.required],
      maritalStatus: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      postalCode: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      licenseNumber: [null, Validators.required],
      licenseIssueDate: [null, Validators.required],
      licenseCategory: [null, Validators.required],
      registrationDate: [null, Validators.required],
      profession: [null, Validators.required],
      employmentStatus: [null, Validators.required]
      // ajoute d'autres champs si besoin
    });

    this.formReady.emit(this.form);
  }

  onInsuredSelected(insured: any): void {
    this.form.patchValue({ insuredId: insured.id });
  }

  get isExisting(): boolean {
    return this.form.get('insuredMode')?.value === 'existing';
  }

  get isNew(): boolean {
    return this.form.get('insuredMode')?.value === 'new';
  }

  get insuredData(): any {
    return this.isNew ? this.insuredForm.value : { insuredId: this.form.value.insuredId };
  }
}
