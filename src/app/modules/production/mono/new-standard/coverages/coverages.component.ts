import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { Product } from "@core/services/settings/product/product.interface";
import { Coverage } from "@core/services/settings/coverage/coverage.interface";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";

@Component({
    selector: "app-coverages-step",
    templateUrl: "./coverages.component.html",
})
export class CoveragesStepComponent {

    form!: UntypedFormGroup;
    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    @Input() product!: string;

    selectedCoverages: Coverage[] = [];
    coverages: Coverage[] = [];
    allCoverages: Coverage[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _coverageService: CoverageService,
    ) {

        this.form = this._formBuilder.group({
            coverages: [null],
        });

        this.formReady.emit(this.form);

        this._coverageService.coverages$.subscribe((coverages: Coverage[]) => {
            this.allCoverages = coverages;
            this.coverages = coverages; // Initialize with all coverages
            // if (this.product) {
            //     this.filterCoveragesByProduct();
            // } else {
            //     this.coverages = [];
            // }
        });

    }

    filterCoveragesByProduct() {
        this.coverages = this.allCoverages.filter((coverage: Coverage) => {
            return coverage.product.id === this.product;
        });
    }
}