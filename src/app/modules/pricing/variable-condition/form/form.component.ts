import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslocoService} from '@jsverse/transloco';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ManagementEntityService} from '@core/services/administration/management-entity/management-entity.service';
import {VariableCondition} from '@core/services/pricing/variable-condition/variable-condition.model';
import {VariableConditionService} from '@core/services/pricing/variable-condition/variable-condition.service';
import {Rule} from '@core/services/pricing/variable-condition/rule/rule.interface';
import {RuleService} from '@core/services/pricing/variable-condition/rule/rule.service';
import {ConditionService} from '@core/services/pricing/variable-condition/conditions/condition.service';
import {FieldType} from '@core/services/pricing/enum/field-type.enum';
import {NumericFieldService} from "@core/services/pricing/field/numeric-field/numeric-field.service";
import {SelectFieldService} from "@core/services/pricing/field/select-field/select-field.service";
import {NumericField} from "@core/services/pricing/field/numeric-field/numeric-field.model";
import {SelectField} from "@core/services/pricing/field/select-field/select-field.model";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";

@Component({
  selector: 'app-variable-condition-edit',
  templateUrl: './form.component.html'
})
export class VariableConditionFormComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  formGroup!: FormGroup;
  message = '';
  numericFields: NumericField[] = [];
  selectFields: SelectField[] = [];
  fields: (NumericField | SelectField)[] = [];
  coverages: Coverage[] = [];

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
    private _translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService,
    private _numericFieldService: NumericFieldService,
    private _selectFieldService: SelectFieldService,
    private _coverageService: CoverageService,
  ) {
  }



  ngOnInit(): void {

    this.mode = (this.data as any).mode;
    this.dialogRef.updateSize('800px', 'auto');

    // Récupérer les couvertures
    this._coverageService.getByProduct(this.data.product)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((coverages: Coverage[]) => {
        this.coverages = coverages || [];
        console.log("Coverages loaded:", this.coverages);
      });

    // Récupérer les champs
    forkJoin([
      this._numericFieldService.getAll(),
      this._selectFieldService.getAll()
    ])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(([numericFields, selectFields]) => {
        this.numericFields = numericFields || [];
        this.selectFields = selectFields || [];
        this.fields = [...this.numericFields, ...this.selectFields];
        console.log("Fields loaded:", this.fields);
      });



    // Initialisation du formulaire
    const initialRules = this.data.rules?.length
      ? this.data.rules.map((rule, index) => this.createRuleFormGroup(rule, index))
      : [this.createRuleFormGroup(undefined, 0)];

    this.formGroup = this.fb.group({
      // Section VariableItem
      coverage: [{value: this.data.coverage || '', disabled: false}, Validators.required],
      label: [this.data.label || '', Validators.required],
      description: [this.data.description || '', Validators.required],
      variableName: [{value: this.data.variableName || '', disabled: true}, Validators.required],
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

      if (field.fieldType === FieldType.SELECT) {
        const option = (field as SelectField).options?.possibilities?.find((opt: any) => opt.id === condition.value);
        valueStr = option ? option.label : condition.value;
      } else if (field.fieldType === FieldType.NUMBER) {
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

    const if_name = this._translocoService.translate("form.variableCondition.if");
    const and_name = this._translocoService.translate("form.variableCondition.and");
    const then_name = this._translocoService.translate("form.variableCondition.then");
    return `${if_name} (${conditionDescriptions.join(` ${and_name} `)}) ${and_name} ${ruleValue}`;
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
      const conditionGroup = rule.get('conditions').controls.find((c: any) =>
        c.get('field').value === condition.field
      );
      const field = this.fields.find(f => f.id === condition.field);
      if (!field) return '';

      let valueStr = '';
      if (field.fieldType === FieldType.SELECT) {
        valueStr = condition.value;
      } else if (field.fieldType === FieldType.NUMBER) {
        const rawValue = conditionGroup.get('value').value;
        const rawMinValue = conditionGroup.get('minValue').getRawValue();
        const rawMaxValue = conditionGroup.get('maxValue').getRawValue();

        if (rawValue) {
          valueStr = rawValue;
        } else if (rawMinValue && rawMaxValue) {
          valueStr = `${rawMinValue}_${rawMaxValue}`;
        } else if (rawMinValue) {
          valueStr = `MIN_${rawMinValue}`;
        } else if (rawMaxValue) {
          valueStr = `MAX_${rawMaxValue}`;
        }
      }
      return `${field.variableName}_${valueStr}`;
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
      }, {emitEvent: false});
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
      value: [rule?.value || 0, [Validators.required]],
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

  onNumericValueChange(ruleIndex: number, conditionIndex: number): void {
    const conditionGroup = this.getConditionsFormArray(ruleIndex).at(conditionIndex) as FormGroup;
    const value = conditionGroup.get('value')?.value;

    if (value !== null && value !== '') {
      // Si une valeur est renseignée, désactiver min/max
      conditionGroup.get('minValue')?.disable();
      conditionGroup.get('maxValue')?.disable();
      // Réinitialiser les valeurs
      conditionGroup.patchValue({
        minValue: '',
        maxValue: ''
      });
    } else {
      // Si la valeur est vide, activer min/max
      conditionGroup.get('minValue')?.enable();
      conditionGroup.get('maxValue')?.enable();
    }
  }

  onMinMaxValueChange(ruleIndex: number, conditionIndex: number): void {
    const conditionGroup = this.getConditionsFormArray(ruleIndex).at(conditionIndex) as FormGroup;
    const minValue = conditionGroup.get('minValue')?.value;
    const maxValue = conditionGroup.get('maxValue')?.value;

    if ((minValue !== null && minValue !== '') || (maxValue !== null && maxValue !== '')) {
      // Si min ou max est renseigné, désactiver value
      conditionGroup.get('value')?.disable();
      // Réinitialiser la valeur
      conditionGroup.patchValue({
        value: ''
      });
    } else {
      // Si min et max sont vides, activer value
      conditionGroup.get('value')?.enable();
    }
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

    const group = this.fb.group({
      field: [condition?.field?.id || '', Validators.required],
      operator: [condition?.operator || '', Validators.required],
      value: [valueToSet],
      minValue: [condition?.minValue || ''],
      maxValue: [condition?.maxValue || '']
    });

    // Si une valeur initiale est définie, désactiver min/max
    if (valueToSet) {
      group.get('minValue')?.disable();
      group.get('maxValue')?.disable();
    }
    // Si min ou max est défini, désactiver value
    else if (condition?.minValue || condition?.maxValue) {
      group.get('value')?.disable();
    }

    return group;
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
        this._translocoService.translate('form.errors.lastCondition'),
        undefined,
        {duration: 3000, panelClass: 'snackbar-warning'}
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
      return {numericFieldRequired: true};
    }

    return null;
  }

  getAvailableOperators(fieldId: string): string[] {
    if (this.isReadOnly()) return [];
    const field = this.fields.find(f => f.id === fieldId);
    if (!field) return [];
    return this.availableOperators[field.fieldType] || [];
  }

  getFieldType(fieldId: string): FieldType {
    const field = this.fields.find(f => f.id === fieldId);
    return field ? field.fieldType : FieldType.NUMBER;
  }

  getSelectFieldOptions(fieldId: string): any[] {
    if (this.isReadOnly()) return [];
    const field = this.fields.find(f => f.id === fieldId);
    if (field?.fieldType === FieldType.SELECT && (field as SelectField).options) {
      return (field as SelectField).options.possibilities || [];
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
      product: this.data.product,
      branch: this.data.branch,
      coverage: this.data.coverage,
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
          conditionIndexMap.push({ruleIndex, conditionIndex});
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
  private updateAllRules(conditionIds: string[], conditionIndexMap?: {
    ruleIndex: number,
    conditionIndex: number
  }[]): void {
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
      ruleIds: ruleIds,
      product: this.data.product,
      pricingType: this.data.pricingType,
      coverage: this.data.coverage,
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
          conditionIndexMap.push({ruleIndex, conditionIndex});
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
    const conditionType = field?.fieldType || FieldType.NUMBER;

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
  private createAllRules(conditionIds: string[], conditionIndexMap?: {
    ruleIndex: number,
    conditionIndex: number
  }[]): void {
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
      product: this.data.product,
      pricingType: this.data.pricingType,
      ruleIds: ruleIds,
      coverage: formData.coverage
    };
  }

  /**
   * Gère les erreurs de soumission et réactive le formulaire
   */
  private handleSubmissionError(errorMessage: string): void {
    this.snackBar.open(
      this._translocoService.translate(errorMessage),
      undefined,
      {duration: 3000, panelClass: 'snackbar-error'}
    );
    this.formGroup.enable();
  }

  private onSubmissionSuccess(): void {
    const successMessage = this.mode === 'edit'
      ? 'form.success.update'
      : 'form.success.creation';

    this.snackBar.open(
      this._translocoService.translate(successMessage),
      undefined,
      {duration: 3000, panelClass: 'snackbar-success'}
    );
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  protected readonly FieldType = FieldType;
}
