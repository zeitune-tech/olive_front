import { Component, OnInit } from "@angular/core";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";

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

    constructor(
        private _formBuilder: FormBuilder
    ) { }

    ngOnInit() {
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

}