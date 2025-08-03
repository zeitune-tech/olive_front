import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { VariableCondition } from '@core/services/pricing/variable-condition/variable-condition.interface';
import { VariableConditionService } from '@core/services/pricing/variable-condition/variable-condition.service';
import { Rule } from '@core/services/pricing/variable-condition/rule/rule.interface';
import { RuleService } from '@core/services/pricing/variable-condition/rule/rule.service';
import { Condition } from '@core/services/pricing/variable-condition/conditions/condition.interface';
import { ConditionService } from '@core/services/pricing/variable-condition/conditions/condition.service';
import { Field } from '@core/services/pricing/field/field.interface';
import { FieldService } from '@core/services/pricing/field/field.service';

@Component({
    selector: 'app-variable-condition-edit',
    templateUrl: './form.component.html'
})
export class VariableConditionFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
      managementEntity: ManagementEntity | undefined;
      fields: Field[] = [];
      availableOperators: { [key: string]: string[] } = {
          'SELECT': ['equal', 'different'],
          'NUMBER': ['equal', 'different', 'less_than', 'greater_than', 'less_or_equal', 'greater_or_equal']
      };

      mode: 'create' | 'edit' = 'create';

      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<VariableConditionFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: VariableCondition,
          private _variableConditionService: VariableConditionService,
          private _ruleService: RuleService,
          private _conditionService: ConditionService,
          private _fieldService: FieldService,
          private translocoService: TranslocoService,
          private snackBar: MatSnackBar,
          private _managementEntityService: ManagementEntityService
      ) {}

    ngOnInit(): void {

        this.mode = (this.data as any).mode;
        if (this.mode == 'edit') {
            this.dialogRef.updateSize('800px', 'auto');
        } else {
            this.dialogRef.updateSize('800px', 'auto');
        }

        this._managementEntityService.entity$.subscribe((entity) => {
            this.managementEntity = entity;
        });

        // Charger les champs disponibles
        this._fieldService.getAll().subscribe((fields) => {
            this.fields = fields;
        });

        this.formGroup = this.fb.group({
            // Section VariableItem
            label: [this.data.label || '', Validators.required],
            description: [this.data.description || '', Validators.required],
            variableName: [this.data.variableName || '', Validators.required],
            toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
            branch: [this.data.branch || '', Validators.required],
            
            // Section Rules
            rules: this.fb.array(this.data.rules?.length ? this.data.rules.map(rule => this.createRuleFormGroup(rule)) : [this.createRuleFormGroup()])
        });

    }

    createRuleFormGroup(rule?: Rule): FormGroup {
        return this.fb.group({
            id: [rule?.id || ''],
            label: [rule?.label || '', Validators.required],
            name: [rule?.name || '', Validators.required],
            value: [rule?.value || 0, [Validators.required, Validators.min(0)]],
            conditions: this.fb.array(rule?.conditions?.length ? rule.conditions.map(condition => this.createConditionFormGroup(condition)) : [this.createConditionFormGroup()])
        });
    }

    createConditionFormGroup(condition?: any): FormGroup {
        return this.fb.group({
            field: [condition?.field?.id || '', Validators.required],
            operator: [condition?.operator || '', Validators.required],
            value: [condition?.value || ''],
            minValue: [condition?.minValue || ''],
            maxValue: [condition?.maxValue || '']
        });
    }

    get rulesFormArray(): FormArray {
        return this.formGroup.get('rules') as FormArray;
    }

    getConditionsFormArray(ruleIndex: number): FormArray {
        return this.rulesFormArray.at(ruleIndex).get('conditions') as FormArray;
    }

    addRule(): void {
        this.rulesFormArray.push(this.createRuleFormGroup());
    }

    removeRule(index: number): void {
        if (this.rulesFormArray.length > 1) {
            this.rulesFormArray.removeAt(index);
        }
    }

    addCondition(ruleIndex: number): void {
        this.getConditionsFormArray(ruleIndex).push(this.createConditionFormGroup());
    }

    removeCondition(ruleIndex: number, conditionIndex: number): void {
        const conditionsArray = this.getConditionsFormArray(ruleIndex);
        if (conditionsArray.length > 1) {
            conditionsArray.removeAt(conditionIndex);
        }
    }

    onFieldSelectionChange(ruleIndex: number, conditionIndex: number, fieldId: string): void {
        const field = this.fields.find(f => f.id === fieldId);
        const conditionGroup = this.getConditionsFormArray(ruleIndex).at(conditionIndex) as FormGroup;
        
        if (field) {
            // Réinitialiser les champs selon le type de field
            conditionGroup.patchValue({
                operator: '',
                value: '',
                minValue: '',
                maxValue: ''
            });

            // Configurer les validateurs selon le type de field
            if (field.type === 'SELECT') {
                // Pour les SelectField, seuls 'equal' et 'different' sont permis
                conditionGroup.get('value')?.setValidators([Validators.required]);
                conditionGroup.get('minValue')?.clearValidators();
                conditionGroup.get('maxValue')?.clearValidators();
            } else if (field.type === 'NUMBER') {
                // Pour les NumericField, configurer selon les besoins
                conditionGroup.get('value')?.clearValidators();
                conditionGroup.get('minValue')?.clearValidators();
                conditionGroup.get('maxValue')?.clearValidators();
                
                // Ajouter validation personnalisée pour s'assurer qu'au moins une valeur est renseignée
                conditionGroup.setValidators(this.numericFieldValidator);
            }

            conditionGroup.get('value')?.updateValueAndValidity();
            conditionGroup.get('minValue')?.updateValueAndValidity();
            conditionGroup.get('maxValue')?.updateValueAndValidity();
            conditionGroup.updateValueAndValidity();
        }
    }

    numericFieldValidator(control: any) {
        if (!control || !control.get) return null;
        
        const value = control.get('value')?.value;
        const minValue = control.get('minValue')?.value;
        const maxValue = control.get('maxValue')?.value;

        // Si c'est un champ numérique et qu'aucune valeur n'est renseignée
        if (!value && !minValue && !maxValue) {
            return { numericFieldRequired: true };
        }

        return null;
    }

    updateNumericFieldValidators(conditionGroup: FormGroup): void {
        // Cette méthode n'est plus nécessaire car la validation est gérée par numericFieldValidator
    }

    getAvailableOperators(fieldId: string): string[] {
        const field = this.fields.find(f => f.id === fieldId);
        if (!field) return [];
        return this.availableOperators[field.type] || [];
    }

    getFieldType(fieldId: string): string {
        const field = this.fields.find(f => f.id === fieldId);
        return field?.type || '';
    }

    getSelectFieldOptions(fieldId: string): any[] {
        const field = this.fields.find(f => f.id === fieldId);
        if (field?.type === 'SELECT' && field.options) {
            return field.options.possibilities || [];
        }
        return [];
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const formData = {
            ...this.formGroup.value,
            managementEntity: this.managementEntity?.id,
            product: this.data.product,
        };

        console.log("Submitting form data:", formData);

        this._variableConditionService.create(formData).subscribe({
            next: () => {
                const successMessage = this.mode === 'edit'
                    ? 'form.success.update'
                    : 'form.success.creation';

                this.snackBar.open(
                    this.translocoService.translate(successMessage),
                    undefined,
                    { duration: 3000, panelClass: 'snackbar-success' }
                );
                this.dialogRef.close(true);
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

      onCancel(): void {
          this.dialogRef.close(false);
      }
  }
