import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'vehicle-attributes-form',
  templateUrl: './extra.component.html',
})
export class VehicleAttributesComponent implements OnInit {
  form!: FormGroup;

  @Output() next = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      attributes: this.fb.array([])
    });

    // Optionnel : ajouter une paire vide par défaut
    this.addAttribute();
  }

  get attributes(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  addAttribute(): void {
    this.attributes.push(
      this.fb.group({
        key: [''],
        value: ['']
      })
    );
  }

  removeAttribute(index: number): void {
    this.attributes.removeAt(index);
  }

  goNext(): void {
    this.next.emit(this.form);
  }
}
