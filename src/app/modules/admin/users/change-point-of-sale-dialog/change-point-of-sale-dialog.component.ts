import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
    selector: "app-change-point-of-sale-dialog",
    templateUrl: "./change-point-of-sale-dialog.component.html"
})
export class ChangePointOfSaleDialogComponent {

    // Search
    searchControl: FormControl = new FormControl('');
    filteredEntity: ManagementEntity[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { list: ManagementEntity[], selectedEntity: ManagementEntity, addEntity: boolean },
        private _matDialogRef: MatDialogRef<ChangePointOfSaleDialogComponent>
    ) {
        this.filteredEntity = this.data.list.sort((a, b) => a.name.localeCompare(b.name));

        // Set up search with debounce
        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                this.searchEntity(value);
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    openEntityCreationDialog(): void {
        this._matDialogRef.close('create');
    }
    /**
     * Select entity
     *
     * @param entity Selected entity
     */
    selectEntity(entity: ManagementEntity): void {
        this._matDialogRef.close(entity);
    }

    /**
     * Search entities
     */
    private searchEntity(value: string): void {
        if (!value) {
            this.filteredEntity = this.data.list;
            return;
        }

        const searchValue = value.toLowerCase();
        this.filteredEntity = this.data.list.filter(entity =>
            entity.name.toLowerCase().includes(searchValue)
        );
    }

    /**
     * Track by function for ngFor loops
     */
    trackByFn(index: number, item: ManagementEntity): any {
        return item.id;
    }
}
