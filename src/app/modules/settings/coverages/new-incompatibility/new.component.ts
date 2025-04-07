import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { IncompatibleCoverageService } from "@core/services/settings/incompatible-coverage/incompatible-coverage.service";

@Component({
    selector: "app-incompatible-coverages-new",
    templateUrl: "./new.component.html",
})
export class IncompatibleCoveragesNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _incompatibleCoverageService: IncompatibleCoverageService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            incompatibles: this._formBuilder.array([this.createIncompatibleGroup()])
          });
          
    }

    createIncompatibleGroup(): FormGroup {
        return this._formBuilder.group({
          coverageUuid: [null, Validators.required],
          incompatibleCoverageUuid: [null, Validators.required],
          managementEntity: [null, Validators.required]
        });
      }
      
      get incompatibles(): FormArray {
        return this.formGroup.get('incompatibles') as FormArray;
      }
      
      addIncompatible(): void {
        this.incompatibles.push(this.createIncompatibleGroup());
      }
      
      removeIncompatible(index: number): void {
        this.incompatibles.removeAt(index);
      }
      

    onSubmit(): void {
        if (this.formGroup.valid) {
            // this._incompatible-coverageService.create(this.form.value).subscribe();
        }
    }

}