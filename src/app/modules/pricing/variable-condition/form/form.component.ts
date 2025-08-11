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
import { ConditionService } from '@core/services/pricing/variable-condition/conditions/condition.service';
import {Field, FieldType} from '@core/services/pricing/field/field.interface';
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
          'SELECT_FIELD': ['EQUALS', 'NOT_EQUALS'],
          'NUMERIC_FIELD': ['EQUALS', 'NOT_EQUALS', 'LESS_THAN', 'GREATER_THAN', 'LESS_OR_EQUAL', 'GREATER_OR_EQUAL']
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
          private _managementEntityService: ManagementEntityService
      ) {}

    ngOnInit(): void {
        this.mode = (this.data as any).mode;
        this.dialogRef.updateSize('800px', 'auto');

        this._managementEntityService.entity$.subscribe((entity) => {
            this.managementEntity = entity;
        });

        // Charger les champs disponibles
        this._fieldService.getAll().subscribe((fields) => {
            this.fields = fields;
        });

        // Initialisation du formulaire
        const initialRules = this.data.rules?.length
            ? this.data.rules.map((rule, index) => this.createRuleFormGroup(rule, index))
            : [this.createRuleFormGroup(undefined, 0)];

        this.formGroup = this.fb.group({
            // Section VariableItem
            label: [this.data.label || '', Validators.required],
            description: [this.data.description || '', Validators.required],
            variableName: [this.data.variableName || '', Validators.required],
            toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
            branch: [this.data.branch || '', Validators.required],
            // Section Rules
            rules: this.fb.array(initialRules)
        });

        // Surveiller les changements de valeur du champ label
        this.formGroup.get('label')?.valueChanges.subscribe(value => {
            if (!value) return;

            const variableName = value
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');

            const descriptionPrefix = `Une condition variable (${variableName}) pour`;
            const description = `${descriptionPrefix} ${(this.formGroup.get('description')?.value as string).replace(/Une condition variable \([^)]+\) pour /g, "")}`;

            this.formGroup.patchValue({
                variableName: variableName,
                description: description
            });

            this.formGroup.get('variableName')?.markAsTouched();
            this.formGroup.get('description')?.markAsTouched();
        });

        // Initialiser les validateurs pour les conditions existantes en mode édition
        if (this.mode === 'edit' && this.data.rules?.length) {
            setTimeout(() => {
                this.initializeExistingConditionsValidators();
            });
        }

        // Désactiver le formulaire en mode view
        if (this.mode === 'view') {
            this.formGroup.disable();
        }

    }

    /**
     * Initialise les validateurs pour les conditions existantes lors de l'édition
     */
    private initializeExistingConditionsValidators(): void {
        this.rulesFormArray.controls.forEach((ruleControl, ruleIndex) => {
            const conditionsArray = this.getConditionsFormArray(ruleIndex);
            conditionsArray.controls.forEach((conditionControl, conditionIndex) => {
                const fieldId = conditionControl.get('field')?.value;
                if (fieldId) {
                    const field = this.fields.find(f => f.id === fieldId);
                    if (field) {
                        this.applyValidatorsForFieldType(ruleIndex, conditionIndex, field);
                    }
                }
            });
        });
    }

    /**
     * Applique les validateurs appropriés selon le type de champ
     */
    private applyValidatorsForFieldType(ruleIndex: number, conditionIndex: number, field: any): void {
        const conditionGroup = this.getConditionsFormArray(ruleIndex).at(conditionIndex) as FormGroup;

        if (field.type === 'SELECT') {
            conditionGroup.get('value')?.setValidators([Validators.required]);
            conditionGroup.get('minValue')?.clearValidators();
            conditionGroup.get('maxValue')?.clearValidators();
            conditionGroup.clearValidators();
        } else if (field.type === FieldType.NUMBER) {
            conditionGroup.get('value')?.clearValidators();
            conditionGroup.get('minValue')?.clearValidators();
            conditionGroup.get('maxValue')?.clearValidators();
            conditionGroup.setValidators(this.numericFieldValidator);
        }

        conditionGroup.get('value')?.updateValueAndValidity();
        conditionGroup.get('minValue')?.updateValueAndValidity();
        conditionGroup.get('maxValue')?.updateValueAndValidity();
        conditionGroup.updateValueAndValidity();
    }

    /**
     * Génère le libellé d'une règle en fonction de ses conditions et de sa valeur
     */
    private generateRuleLabel(rule: any): string {
        const conditions = rule.get('conditions')?.value || [];
        const ruleValue = rule.get('value')?.value;

        if (!conditions.length) {
            return `Rule (${ruleValue})`;
        }

        const conditionDescriptions = conditions.map((condition: any) => {
            const field = this.fields.find(f => f.id === condition.field);
            if (!field) return '';

            const operatorKey = condition.operator;
            let valueStr = '';

            if (field.type === FieldType.SELECT) {
                const option = field.options?.possibilities?.find((opt: any) => opt.id === condition.value);
                valueStr = option ? option.label : condition.value;
            } else if (field.type === FieldType.NUMBER) {
                if (condition.value) {
                    valueStr = condition.value;
                } else if (condition.minValue && condition.maxValue) {
                    valueStr = `${condition.minValue}-${condition.maxValue}`;
                } else if (condition.minValue) {
                    valueStr = `>=${condition.minValue}`;
                } else if (condition.maxValue) {
                    valueStr = `<=${condition.maxValue}`;
                }
            }

            return `${field.variableName} ${operatorKey} ${valueStr}`;
        });

        return `If (${conditionDescriptions.join(' AND ')}) then ${ruleValue}`;
    }

    /**
     * Génère le nom technique d'une règle
     */
    private generateRuleName(rule: any): string {
        const conditions = rule.get('conditions')?.value || [];
        const ruleValue = rule.get('value')?.value;

        if (!conditions.length) {
            return `RULE_DEFAULT_${ruleValue}`;
        }

        const conditionParts = conditions.map((condition: any) => {
            const field = this.fields.find(f => f.id === condition.field);
            if (!field) return '';

            let valueStr = '';
            if (field.type === FieldType.SELECT) {
                valueStr = condition.value;
            } else if (field.type === FieldType.NUMBER) {
                if (condition.value) {
                    valueStr = condition.value;
                } else if (condition.minValue && condition.maxValue) {
                    valueStr = `${condition.minValue}_${condition.maxValue}`;
                } else if (condition.minValue) {
                    valueStr = `MIN_${condition.minValue}`;
                } else if (condition.maxValue) {
                    valueStr = `MAX_${condition.maxValue}`;
                }
            }

            // Utilisation du variableName au lieu du label
            const fieldVariableName = field.variableName || field.label.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
            return `${fieldVariableName}_${condition.operator}_${valueStr}`;
        });

        return `RULE_${conditionParts.join('_AND_')}_${ruleValue}`;
    }

    /**
     * Met à jour les libellés et noms des règles
     */
    private updateRuleLabelsAndNames(): void {
        this.rulesFormArray.controls.forEach(ruleControl => {
            const newLabel = this.generateRuleLabel(ruleControl);
            const newName = this.generateRuleName(ruleControl);

            ruleControl.patchValue({
                label: newLabel,
                name: newName
            }, { emitEvent: false });
        });
    }

    createRuleFormGroup(rule?: Rule, index?: number): FormGroup {
        const group = this.fb.group({
            id: [rule?.id || ''],
            label: [{
                value: rule?.label || 'New Rule',
                disabled: true
            }],
            name: [{
                value: rule?.name || 'NEW_RULE',
                disabled: true
            }],
            value: [rule?.value || 0, [Validators.required, Validators.min(-1)]],
            conditions: this.fb.array(rule?.conditions?.length
                ? rule.conditions.map(condition => this.createConditionFormGroup(condition))
                : [this.createConditionFormGroup()])
        });

        // Observer les changements des conditions et de la valeur
        const conditionsArray = group.get('conditions') as FormArray;
        conditionsArray.valueChanges.subscribe(() => {
            this.updateRuleLabelsAndNames();
        });

        group.get('value')?.valueChanges.subscribe(() => {
            this.updateRuleLabelsAndNames();
        });

        return group;
    }

    createConditionFormGroup(condition?: any): FormGroup {
        // Pour les champs SELECT, la valeur peut être un objet SelectFieldOptionValue ou un ID string
        let valueToSet = '';
        if (condition?.value) {
            // Si c'est un objet avec un ID (SelectFieldOptionValue), extraire l'ID
            if (typeof condition.value === 'object' && condition.value.id) {
                valueToSet = condition.value.id;
            } else if (typeof condition.value === 'string') {
                // Si c'est déjà un string ID
                valueToSet = condition.value;
            } else {
                // Pour les valeurs numériques
                valueToSet = condition.value;
            }
        }

        return this.fb.group({
            field: [condition?.field?.id || '', Validators.required],
            operator: [condition?.operator || '', Validators.required],
            value: [valueToSet],
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
        const newRule = this.createRuleFormGroup();
        this.rulesFormArray.push(newRule);
        this.updateRuleLabelsAndNames();
    }

    removeRule(index: number): void {
        if (this.rulesFormArray?.length > 1) {
            this.rulesFormArray.removeAt(index);
            this.updateRuleLabelsAndNames();
        }
    }

    addCondition(ruleIndex: number): void {
        this.getConditionsFormArray(ruleIndex).push(this.createConditionFormGroup());
    }

    removeCondition(ruleIndex: number, conditionIndex: number): void {
        const conditionsArray = this.getConditionsFormArray(ruleIndex);

        // Ne pas permettre la suppression s'il n'y a qu'une seule condition
        if (conditionsArray.length <= 1) {
            this.snackBar.open(
                this.translocoService.translate('form.errors.lastCondition'),
                undefined,
                { duration: 3000, panelClass: 'snackbar-warning' }
            );
            return;
        }

        // Supprimer la condition du FormArray
        conditionsArray.removeAt(conditionIndex);

        // Marquer le formulaire comme modifié pour déclencher la validation
        this.formGroup.markAsDirty();
    }

    onFieldSelectionChange(ruleIndex: number, conditionIndex: number, fieldId: string): void {
        const field = this.fields.find(f => f.id === fieldId);
        const conditionGroup = this.getConditionsFormArray(ruleIndex).at(conditionIndex) as FormGroup;

        if (field) {
            // Sauvegarder les valeurs actuelles si elles existent
            const currentValues = {
                operator: conditionGroup.get('operator')?.value,
                value: conditionGroup.get('value')?.value,
                minValue: conditionGroup.get('minValue')?.value,
                maxValue: conditionGroup.get('maxValue')?.value
            };

            // Réinitialiser seulement si le type de champ change
            const needsReset = this.shouldResetConditionValues(field, currentValues);

            if (needsReset) {
                conditionGroup.patchValue({
                    operator: '',
                    value: '',
                    minValue: '',
                    maxValue: ''
                });
            }

            // Appliquer les validateurs appropriés
            this.applyValidatorsForFieldType(ruleIndex, conditionIndex, field);
        }
    }

    /**
     * Détermine si les valeurs de condition doivent être réinitialisées
     */
    private shouldResetConditionValues(field: any, currentValues: any): boolean {
        // Si c'est un nouveau champ SELECT et qu'il n'y a pas de valeur actuelle, ne pas réinitialiser
        if (field.type === FieldType.SELECT && !currentValues.value) {
            return false;
        }

        // Si c'est un champ NUMBER et qu'il n'y a pas de valeurs actuelles, ne pas réinitialiser
        if (field.type === FieldType.NUMBER && !currentValues.value && !currentValues.minValue && !currentValues.maxValue) {
            return false;
        }

        // Pour un changement de type de champ, réinitialiser
        return true;
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

    getAvailableOperators(fieldId: string): string[] {
        if (this.isReadOnly()) return [];
        const field = this.fields.find(f => f.id === fieldId);
        if (!field) return [];
        return this.availableOperators[field.type] || [];
    }

    getFieldType(fieldId: string): FieldType {
        const field = this.fields.find(f => f.id === fieldId);
        return field ? field.type : FieldType.NUMBER;
    }

    getSelectFieldOptions(fieldId: string): any[] {
        if (this.isReadOnly()) return [];
        const field = this.fields.find(f => f.id === fieldId);
        if (field?.type === FieldType.SELECT && field.options) {
            return field.options.possibilities || [];
        }
        return [];
    }

    isReadOnly(): boolean {
        return this.mode === 'view';
    }

    onSubmit(): void {
        if (this.formGroup.invalid || this.mode === 'view') return;

        console.log("Starting form submission");
        const formData = {
            ...this.formGroup.getRawValue(),
            managementEntity: this.managementEntity?.id,
            product: this.data.product,
        };

        console.log("Form data before submission:", formData);
        this.formGroup.disable();

        if (this.mode === 'edit') {
            console.log("Starting update workflow: Conditions -> Rules -> Variable Condition");
            this.updateAllConditions();
        } else {
            console.log("Starting creation workflow: Conditions -> Rules -> Variable Condition");
            this.createAllConditions();
        }
    }

    /**
     * ========== LOGIQUE D'UPDATE ==========
     */

    /**
     * Étape 1: Mettre à jour toutes les conditions de toutes les règles
     */
    private updateAllConditions(): void {
        const formData = this.formGroup.getRawValue();
        const rules = formData.rules;
        if (!rules || !Array.isArray(rules)) {
            console.error('No rules found in form data');
            this.handleSubmissionError('form.errors.submission');
            return;
        }

        const allConditions: any[] = [];
        const conditionIndexMap: { ruleIndex: number, conditionIndex: number }[] = [];

        // Collecter toutes les conditions de toutes les règles avec leur mapping
        rules.forEach((ruleData: any, ruleIndex: number) => {
            if (ruleData.conditions) {
                ruleData.conditions.forEach((conditionData: any, conditionIndex: number) => {
                    allConditions.push(conditionData);
                    conditionIndexMap.push({ ruleIndex, conditionIndex });
                });
            }
        });

      console.log("All conditions to update:", allConditions);

        if (allConditions.length === 0) {
            this.updateAllRules([]);
            return;
        }

        const updatedConditionIds: string[] = [];
        let completedConditions = 0;

        allConditions.forEach((conditionData: any, index: number) => {
            const conditionToUpdate = this.buildConditionPayload(conditionData);
            const field = this.fields.find(f => f.id === conditionData.field);
            const conditionType = field?.type || FieldType.NUMBER;

            // Obtenir les conditions existantes pour trouver les IDs
            const originalRule = this.data.rules?.[conditionIndexMap[index].ruleIndex];
            const originalCondition = originalRule?.conditions?.[conditionIndexMap[index].conditionIndex];

            if (originalCondition?.id && this.isExistingCondition(originalCondition.id)) {
                // Mettre à jour une condition existante
                console.log(`Updating condition ${index + 1}:`, conditionToUpdate);

                const updateConditionObservable = conditionType === FieldType.NUMBER
                    ? this._conditionService.updateNumericalCondition(originalCondition.id, conditionToUpdate)
                    : this._conditionService.updateSelectFieldCondition(originalCondition.id, conditionToUpdate);

                updateConditionObservable.subscribe({
                    next: (updatedCondition: any) => {
                        console.log(`Condition ${index + 1} updated:`, updatedCondition);
                        // Si la mise à jour retourne null, on garde l'ID original
                        if (!updatedCondition && originalCondition?.id) {
                            updatedConditionIds[index] = originalCondition.id;
                        } else if (updatedCondition?.id) {
                            updatedConditionIds[index] = updatedCondition.id;
                        } else {
                            console.error(`No valid ID found for condition ${index + 1}`);
                            this.handleSubmissionError('form.errors.submission');
                            return;
                        }

                        completedConditions++;
                        if (completedConditions === allConditions.length) {
                            this.updateAllRules(updatedConditionIds, conditionIndexMap);
                        }
                    },
                    error: (error: any) => {
                        console.error(`Error updating condition ${index + 1}:`, error);
                        this.handleSubmissionError('form.errors.submission');
                    }
                });
            } else {
                // Créer une nouvelle condition
                console.log(`Creating new condition ${index + 1}:`, conditionToUpdate);

                const createConditionObservable = conditionType === FieldType.NUMBER
                    ? this._conditionService.createNumericalCondition(conditionToUpdate)
                    : this._conditionService.createSelectFieldCondition(conditionToUpdate);

                createConditionObservable.subscribe({
                    next: (createdCondition: any) => {
                        console.log(`New condition ${index + 1} created:`, createdCondition);
                        updatedConditionIds[index] = createdCondition.id;
                        completedConditions++;

                        if (completedConditions === allConditions.length) {
                            this.updateAllRules(updatedConditionIds, conditionIndexMap);
                        }
                    },
                    error: (error: any) => {
                        console.error(`Error creating new condition ${index + 1}:`, error);
                        this.handleSubmissionError('form.errors.submission');
                    }
                });
            }
        });
    }

    /**
     * Vérifie si une condition existe déjà
     */
    private isExistingCondition(conditionId: string): boolean {
        if (!this.data.rules) return false;

        for (const rule of this.data.rules) {
            if (rule.conditions) {
                for (const condition of rule.conditions) {
                    if (condition.id === conditionId) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Étape 2: Mettre à jour toutes les règles avec les IDs des conditions
     */
    private updateAllRules(conditionIds: string[], conditionIndexMap?: { ruleIndex: number, conditionIndex: number }[]): void {
        const formData = this.formGroup.getRawValue();
        const rules = formData.rules;
        if (!rules || !Array.isArray(rules)) {
            console.error('No rules found in form data');
            this.handleSubmissionError('form.errors.submission');
            return;
        }

        const updatedRuleIds: string[] = [];
        let completedRules = 0;

        if (rules.length === 0) {
            this.updateVariableCondition([]);
            return;
        }

        rules.forEach((ruleData: any, ruleIndex: number) => {
            const ruleToUpdate = this.buildRulePayload(ruleData, ruleIndex, conditionIds, conditionIndexMap);
            const originalRule = this.data.rules?.[ruleIndex];

            if (originalRule?.id && this.isExistingRule(originalRule.id)) {
                // Mettre à jour une règle existante
                console.log(`Updating rule ${ruleIndex + 1}:`, ruleToUpdate);

                this._ruleService.update(originalRule.id, ruleToUpdate as any).subscribe({
                    next: (updatedRule: Rule) => {
                        console.log(`Rule ${ruleIndex + 1} updated:`, updatedRule);
                        updatedRuleIds[ruleIndex] = updatedRule.id || originalRule.id;
                        completedRules++;

                        if (completedRules === rules.length) {
                            this.updateVariableCondition(updatedRuleIds);
                        }
                    },
                    error: (error: any) => {
                        console.error(`Error updating rule ${ruleIndex + 1}:`, error);
                        this.handleSubmissionError('form.errors.submission');
                    }
                });
            } else {
                // Créer une nouvelle règle
                console.log(`Creating new rule ${ruleIndex + 1}:`, ruleToUpdate);

                this._ruleService.create(ruleToUpdate as any).subscribe({
                    next: (createdRule: Rule) => {
                        console.log(`New rule ${ruleIndex + 1} created:`, createdRule);
                        updatedRuleIds[ruleIndex] = createdRule.id;
                        completedRules++;

                        if (completedRules === rules.length) {
                            this.updateVariableCondition(updatedRuleIds);
                        }
                    },
                    error: (error: any) => {
                        console.error(`Error creating new rule ${ruleIndex + 1}:`, error);
                        this.handleSubmissionError('form.errors.submission');
                    }
                });
            }
        });
    }

    /**
     * Vérifie si une règle existe déjà
     */
    private isExistingRule(ruleId: string): boolean {
        if (!this.data.rules) return false;

        return this.data.rules.some(rule => rule.id === ruleId);
    }

    /**
     * Étape 3: Mettre à jour la variable condition avec les IDs des règles
     */
    private updateVariableCondition(ruleIds: string[]): void {
        const variableConditionData = this.buildVariableConditionUpdatePayload(ruleIds);

        console.log("Updating variable condition:", variableConditionData);

        this._variableConditionService.update(this.data.id, variableConditionData as any).subscribe({
            next: (updatedVariableCondition: VariableCondition) => {
                console.log("Variable condition updated:", updatedVariableCondition);
                this.onSubmissionSuccess();
            },
            error: (error: any) => {
                console.error("Error updating variable condition:", error);
                this.handleSubmissionError('form.errors.submission');
            }
        });
    }

    /**
     * Construit le payload pour la mise à jour de la variable condition
     */
    private buildVariableConditionUpdatePayload(ruleIds: string[]): any {
        const formData = this.formGroup.getRawValue();
        return {
            id: this.data.id,
            label: formData.label,
            description: formData.description,
            variableName: formData.variableName,
            toReturn: formData.toReturn,
            branch: formData.branch,
            managementEntity: this.managementEntity?.id,
            product: this.data.product,
            ruleIds: ruleIds
        };
    }

    /**
     * ========== LOGIQUE DE CRÉATION ==========
     */

    /**
     * Étape 1: Créer toutes les conditions de toutes les règles
     * Les conditions sont créées en premier car les règles ont besoin de leurs IDs
     */

    /**
     * Étape 1: Créer toutes les conditions de toutes les règles
     * Les conditions sont créées en premier car les règles ont besoin de leurs IDs
     */
    private createAllConditions(): void {
        const formData = this.formGroup.getRawValue();
        const rules = formData.rules;
        if (!rules || !Array.isArray(rules)) {
            console.error('No rules found in form data');
            this.handleSubmissionError('form.errors.submission');
            return;
        }

        const allConditions: any[] = [];
        const conditionIndexMap: { ruleIndex: number, conditionIndex: number }[] = [];

        // Collecter toutes les conditions de toutes les règles avec leur mapping
        rules.forEach((ruleData: any, ruleIndex: number) => {
            if (ruleData.conditions) {
                ruleData.conditions.forEach((conditionData: any, conditionIndex: number) => {
                    allConditions.push(conditionData);
                    conditionIndexMap.push({ ruleIndex, conditionIndex });
                });
            }
        });

        if (allConditions.length === 0) {
            this.createAllRules([]);
            return;
        }

        const createdConditionIds: string[] = [];
        let completedConditions = 0;

        allConditions.forEach((conditionData: any, index: number) => {
            const conditionToCreate = this.buildConditionPayload(conditionData);
            const field = this.fields.find(f => f.id === conditionData.field);
            const conditionType = field?.type || FieldType.NUMBER;

            console.log(`Creating condition ${index + 1}:`, conditionToCreate);

            // Utiliser les méthodes du service selon le type de condition
            const createConditionObservable = conditionType === FieldType.NUMBER
                ? this._conditionService.createNumericalCondition(conditionToCreate)
                : this._conditionService.createSelectFieldCondition(conditionToCreate);

            createConditionObservable.subscribe({
                next: (createdCondition: any) => {
                    console.log(`Condition ${index + 1} created:`, createdCondition);
                    createdConditionIds[index] = createdCondition.id;
                    completedConditions++;

                    if (completedConditions === allConditions.length) {
                        // Toutes les conditions sont créées, passer à l'étape 2
                        this.createAllRules(createdConditionIds, conditionIndexMap);
                    }
                },
                error: (error: any) => {
                    console.error(`Error creating condition ${index + 1}:`, error);
                    this.handleSubmissionError('form.errors.submission');
                }
            });
        });
    }

    /**
     * Construit le payload pour la création d'une condition selon son type
     */
    private buildConditionPayload(conditionData: any): any {
        const field = this.fields.find(f => f.id === conditionData.field);
        const conditionType = field?.type || FieldType.NUMBER;

        if (conditionType === FieldType.SELECT) {
            return {
                value: conditionData.value,
                fieldId: conditionData.field,
                operator: conditionData.operator
            };
        } else if (conditionType === FieldType.NUMBER) {
            return {
                fieldId: conditionData.field,
                numericOperator: conditionData.operator,
                value: conditionData.value,
                minValue: conditionData.minValue,
                maxValue: conditionData.maxValue
            };
        } else {
            // Fallback pour autres types
            return {
                fieldId: conditionData.field,
                operator: conditionData.operator,
                value: conditionData.value,
                minValue: conditionData.minValue,
                maxValue: conditionData.maxValue
            };
        }
    }

    /**
     * Étape 2: Créer toutes les règles avec les IDs des conditions
     */

    /**
     * Étape 2: Créer toutes les règles avec les IDs des conditions
     */
    private createAllRules(conditionIds: string[], conditionIndexMap?: { ruleIndex: number, conditionIndex: number }[]): void {
        const formData = this.formGroup.getRawValue();
        const rules = formData.rules;
        if (!rules || !Array.isArray(rules)) {
            console.error('No rules found in form data');
            this.handleSubmissionError('form.errors.submission');
            return;
        }

        const createdRuleIds: string[] = [];
        let completedRules = 0;

        if (rules.length === 0) {
            this.createVariableCondition([]);
            return;
        }

        rules.forEach((ruleData: any, ruleIndex: number) => {
            const ruleToCreate = this.buildRulePayload(ruleData, ruleIndex, conditionIds, conditionIndexMap);

            console.log(`Creating rule ${ruleIndex + 1}:`, ruleToCreate);

            this._ruleService.create(ruleToCreate as any).subscribe({
                next: (createdRule: Rule) => {
                    console.log(`Rule ${ruleIndex + 1} created:`, createdRule);
                    createdRuleIds[ruleIndex] = createdRule.id;
                    completedRules++;

                    if (completedRules === rules.length) {
                        // Toutes les règles sont créées, passer à l'étape 3
                        this.createVariableCondition(createdRuleIds);
                    }
                },
                error: (error: any) => {
                    console.error(`Error creating rule ${ruleIndex + 1}:`, error);
                    this.handleSubmissionError('form.errors.submission');
                }
            });
        });
    }

    /**
     * Construit le payload pour la création d'une règle
     */
    private buildRulePayload(
        ruleData: any,
        ruleIndex: number,
        conditionIds: string[],
        conditionIndexMap?: { ruleIndex: number, conditionIndex: number }[]
    ): any {
        // Collecter les IDs des conditions pour cette règle
        const ruleConditionIds: string[] = [];
        if (conditionIndexMap) {
            conditionIndexMap.forEach((mapping, conditionGlobalIndex) => {
                if (mapping.ruleIndex === ruleIndex) {
                    ruleConditionIds.push(conditionIds[conditionGlobalIndex]);
                }
            });
        }

        const rawFormData = this.formGroup.getRawValue();
        return {
            label: ruleData.label,
            name: ruleData.name,
            value: ruleData.value,
            conditions: ruleConditionIds,
            managementEntity: this.managementEntity?.id,
            branch: rawFormData.branch
        };
    }

    /**
     * Étape 3: Créer la variable condition avec les IDs des règles
     */

    /**
     * Étape 3: Créer la variable condition avec les IDs des règles
     */
    private createVariableCondition(ruleIds: string[]): void {
        const variableConditionData = this.buildVariableConditionPayload(ruleIds);

        console.log("Creating variable condition:", variableConditionData);

        this._variableConditionService.create(variableConditionData as any).subscribe({
            next: (createdVariableCondition: VariableCondition) => {
                console.log("Variable condition created:", createdVariableCondition);
                this.onSubmissionSuccess();
            },
            error: (error: any) => {
                console.error("Error creating variable condition:", error);
                this.handleSubmissionError('form.errors.submission');
            }
        });
    }

    /**
     * Construit le payload pour la création de la variable condition
     */
    private buildVariableConditionPayload(ruleIds: string[]): any {
        const formData = this.formGroup.getRawValue();
        return {
            label: formData.label,
            description: formData.description,
            variableName: formData.variableName,
            toReturn: formData.toReturn,
            branch: formData.branch,
            managementEntity: this.managementEntity?.id,
            product: this.data.product,
            ruleIds: ruleIds
        };
    }

    /**
     * Gère les erreurs de soumission et réactive le formulaire
     */
    private handleSubmissionError(errorMessage: string): void {
        this.snackBar.open(
            this.translocoService.translate(errorMessage),
            undefined,
            { duration: 3000, panelClass: 'snackbar-error' }
        );
        this.formGroup.enable();
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

  protected readonly FieldType = FieldType;
}
