import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ConstantService } from '@core/services/pricing/constant/constant.service';
import { FieldService } from '@core/services/pricing/field/field.service';
import { FormulaService } from '@core/services/pricing/formula/formula.service';
import { VariableItemService } from '@core/services/pricing/variable-item/variable-item.service';
import { SelectFieldOptionsService } from '@core/services/pricing/field/select-field/select-field-options/select-field-options.service';
import { SelectFieldOptionValueService } from '@core/services/pricing/field/select-field/select-field-option-value/select-field-option-value.service';

@Injectable({
    providedIn: 'root'
})
export class PricingResolver implements Resolve<any> {

    /**
     * Constructor
     */
    constructor(
        private _constantService: ConstantService,
        private _fieldService: FieldService,
        private _formulaService: FormulaService,
        private _variableItemService: VariableItemService,
        private _selectFieldOptionsService: SelectFieldOptionsService,
        private _selectFieldOptionValueService: SelectFieldOptionValueService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial data for the pricing module
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        console.log('PricingResolver: Starting to load initial data...');
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            // Constants
            this._constantService.getAll(),
            // Fields
            // Formulas
            this._formulaService.getAll(),
            // Variable Items
            this._variableItemService.getAll(),
            // Select Field Options
            this._selectFieldOptionsService.getAll(),
            // Select Field Option Values
            this._selectFieldOptionValueService.getAll()
        ]);
    }
}
