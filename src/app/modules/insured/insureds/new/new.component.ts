import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Gender, MaritalStatus, LicenseCategory, EmploymentStatus } from '@core/enums';
import { InsuredService } from '@core/services/insured/insured/insured.service';

@Component({
  selector: 'app-insured-new',
  templateUrl: './new.component.html'
})
export class InsuredNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

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

  constructor(
    private _formBuilder: FormBuilder,
    private _insuredService: InsuredService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
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
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this._insuredService.create(data).subscribe(() => {
        this.message = 'form.success.created';
      });
    }
  }
}
