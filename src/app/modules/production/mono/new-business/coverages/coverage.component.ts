import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectDialogComponent } from '@shared/components/select-dialog/select-dialog.component';

@Component({
  selector: 'vehicle-coverages-form',
  templateUrl: './coverage.component.html',
})
export class VehicleCoveragesComponent implements OnInit {
  form!: FormGroup;

  @Output() next = new EventEmitter<FormGroup>();

  guarantees: any[] = [  // À remplacer par API si nécessaire
    { id: 1, name: 'Responsabilité Civile' },
    { id: 2, name: 'Vol' },
    { id: 3, name: 'Incendie' },
    { id: 4, name: 'Bris de glace' }
  ];

  pricingOptions = [
    { value: 'TPV', label: 'Tarif TPV' },
  ]

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      pricing: ['TPV'],  // Sélection par défaut
      coverages: this.fb.array([])  // chaque couverture = { id, name }
    });
  }

  get coverages(): FormArray {
    return this.form.get('coverages') as FormArray;
  }

  addCoverage(): void {
    const dialogRef = this.dialog.open<SelectDialogComponent, any, any>(SelectDialogComponent, {
      width: '600px',
      data: {
        title: 'Sélection d’une garantie',
        items: this.guarantees,
        displayField: 'name'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && !this.coverages.value.some((c: any) => c.id === result.id)) {
        this.coverages.push(this.fb.group({
          id: [result.id],
          name: [result.name]
        }));
      }
    });
  }

  removeCoverage(index: number): void {
    this.coverages.removeAt(index);
  }

  goNext(): void {
    this.next.emit(this.form);
  }
}
