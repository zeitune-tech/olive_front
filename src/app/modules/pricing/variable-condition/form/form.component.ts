import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
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
import { environment } from '@env/environment';

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
          'SELECT': ['EQUALS', 'NOT_EQUALS'],
          'NUMBER': ['EQUALS', 'NOT_EQUALS', 'LESS_THAN', 'GREATER_THAN', 'LESS_OR_EQUAL', 'GREATER_OR_EQUAL']
      };

      mode: 'create' | 'edit' | 'view' = 'create';

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
          private _managementEntityService: ManagementEntityService,
          private _httpClient: HttpClient
      ) {}

    ngOnInit(): void {

        this.mode = (this.data as any).mode;
        if (this.mode == 'edit') {
            this.dialogRef.updateSize('800px', 'auto');
        } else if (this.mode == 'view') {
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

        // Désactiver le formulaire en mode view
        if (this.mode === 'view') {
            this.formGroup.disable();
        }

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
        return[];
    }

    isReadOnly(): boolean {
        return this.mode === 'view';
    }

    onSubmit(): void {
        if (this.formGroup.invalid || this.mode === 'view') return;

        this.formGroup.disable();

        console.log("Starting creation workflow...");

        // Suivre le nouveau workflow: 1) Conditions -> 2) Règles -> 3) Variable Condition
        this.createAllConditions();
    }

    private createAllConditions(): void {
        const rules = this.formGroup.value.rules;
        const allConditions: any[] = [];
        const conditionIndexMap: { ruleIndex: number, conditionIndex: number }[] = [];

        // Collecter toutes les conditions de toutes les règles
        rules.forEach((ruleData: any, ruleIndex: number) => {
            ruleData.conditions.forEach((conditionData: any, conditionIndex: number) => {
                allConditions.push(conditionData);
                conditionIndexMap.push({ ruleIndex, conditionIndex });
            });
        });

        if (allConditions.length === 0) {
            this.createAllRules([]);
            return;
        }

        const createdConditionIds: string[] = [];
        let completedConditions = 0;

        allConditions.forEach((conditionData: any, index: number) => {
            const field = this.fields.find(f => f.id === conditionData.field);
            const conditionType = field?.type || 'NUMBER';

            // Adapter les champs selon le type de condition et les attentes de l'API
            let conditionToCreate: any;
            
            if (conditionType === 'SELECT') {
                conditionToCreate = {
                    value: conditionData.value,
                    fieldId: conditionData.field,
                    operator: conditionData.operator
                };
            } else if (conditionType === 'NUMBER') {
                conditionToCreate = {
                    fieldId: conditionData.field,
                    numericOperator: conditionData.operator,
                    value: conditionData.value,
                    minValue: conditionData.minValue,
                    maxValue: conditionData.maxValue
                };
            } else {
                // Fallback pour autres types
                conditionToCreate = {
                    fieldId: conditionData.field,
                    operator: conditionData.operator,
                    value: conditionData.value,
                    minValue: conditionData.minValue,
                    maxValue: conditionData.maxValue
                };
            }

            console.log(`Creating condition ${index + 1}:`, conditionToCreate);

            // Utiliser directement HttpClient pour appeler les bons endpoints
            const baseUrl = conditionType === 'NUMBER' 
                ? `${environment.pricing_url}/numerical-conditions`
                : `${environment.pricing_url}/select-field-conditions`;

            this._httpClient.post<any>(baseUrl, conditionToCreate).subscribe({
                next: (createdCondition: any) => {
                    console.log(`Condition ${index + 1} created:`, createdCondition);
                    createdConditionIds[index] = createdCondition.id;
                    completedConditions++;
                    
                    if (completedConditions === allConditions.length) {
                        // Toutes les conditions sont créées, passer à la création des règles
                        this.createAllRules(createdConditionIds, conditionIndexMap);
                    }
                },
                error: (error: any) => {
                    console.error(`Error creating condition ${index + 1}:`, error);
                    this.snackBar.open(
                        this.translocoService.translate('form.errors.submission'),
                        undefined,
                        { duration: 3000, panelClass: 'snackbar-error' }
                    );
                    this.formGroup.enable();
                }
            });
        });
    }

    private createAllRules(conditionIds: string[], conditionIndexMap?: { ruleIndex: number, conditionIndex: number }[]): void {
        const rules = this.formGroup.value.rules;
        const createdRuleIds: string[] = [];
        let completedRules = 0;

        if (rules.length === 0) {
            this.createVariableCondition([]);
            return;
        }

        rules.forEach((ruleData: any, ruleIndex: number) => {
            // Collecter les IDs des conditions pour cette règle
            const ruleConditionIds: string[] = [];
            if (conditionIndexMap) {
                conditionIndexMap.forEach((mapping, conditionGlobalIndex) => {
                    if (mapping.ruleIndex === ruleIndex) {
                        ruleConditionIds.push(conditionIds[conditionGlobalIndex]);
                    }
                });
            }

            const ruleToCreate = {
                label: ruleData.label,
                name: ruleData.name,
                value: ruleData.value,
                conditions: ruleConditionIds, // IDs des conditions créées
                managementEntity: this.managementEntity?.id
            };

            console.log(`Creating rule ${ruleIndex + 1}:`, ruleToCreate);

            this._ruleService.create(ruleToCreate as any).subscribe({
                next: (createdRule: Rule) => {
                    console.log(`Rule ${ruleIndex + 1} created:`, createdRule);
                    createdRuleIds[ruleIndex] = createdRule.id;
                    completedRules++;
                    
                    if (completedRules === rules.length) {
                        // Toutes les règles sont créées, passer à la création de la variable condition
                        this.createVariableCondition(createdRuleIds);
                    }
                },
                error: (error: any) => {
                    console.error(`Error creating rule ${ruleIndex + 1}:`, error);
                    this.snackBar.open(
                        this.translocoService.translate('form.errors.submission'),
                        undefined,
                        { duration: 3000, panelClass: 'snackbar-error' }
                    );
                    this.formGroup.enable();
                }
            });
        });
    }

    private createVariableCondition(ruleIds: string[]): void {
        const variableConditionData = {
            label: this.formGroup.value.label,
            description: this.formGroup.value.description,
            variableName: this.formGroup.value.variableName,
            toReturn: this.formGroup.value.toReturn,
            branch: this.formGroup.value.branch,
            managementEntity: this.managementEntity?.id,
            product: this.data.product,
            ruleIds: ruleIds // IDs des règles créées (selon le workflow API)
        };

        console.log("Creating variable condition:", variableConditionData);

        this._variableConditionService.create(variableConditionData as any).subscribe({
            next: (createdVariableCondition: VariableCondition) => {
                console.log("Variable condition created:", createdVariableCondition);
                this.onSubmissionSuccess();
            },
            error: (error: any) => {
                console.error("Error creating variable condition:", error);
                this.snackBar.open(
                    this.translocoService.translate('form.errors.submission'),
                    undefined,
                    { duration: 3000, panelClass: 'snackbar-error' }
                );
                this.formGroup.enable();
            }
        });
    }

    private onSubmissionSuccess(): void {
        const successMessage = this.mode === 'edit'
            ? 'form.success.update'
            : 'form.success.creation';

        this.snackBar.open(
            this.translocoService.translate(successMessage),
            undefined,
            { duration: 3000, panelClass: 'snackbar-success' }
        );
        this.dialogRef.close(true);
    }

      onCancel(): void {
          this.dialogRef.close(false);
      }
  }
