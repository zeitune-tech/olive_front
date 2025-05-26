import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TaxRegime } from "@core/services/settings/tax-regime/tax-regime.interface";
import { TaxRegimeService } from "@core/services/settings/tax-regime/tax-regime.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-closures-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class TaxRegimesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<TaxRegime> = {
        title: '',
        columns: [
            { label: 'entities.tax_regime.fields.designation', property: 'designation', type: 'text', visible: true },
            { label: 'entities.tax_regime.fields.nature', property: 'nature', type: 'text', visible: true },
            { label: 'entities.tax_regime.fields.stampExemption', property: 'stampExemption', type: 'text', visible: true },
            { label: 'entities.tax_regime.fields.exemptedTaxes', property: 'exemptedTaxes', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'closure.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: TaxRegime, property: keyof TaxRegime) => {

            if (property === 'exemptedTaxes') {
                return element.exemptedTaxes?.map(t => t.designation).join(', ');
            }

            if (property === 'stampExemption') {
                return element.stampExemption ? 'Oui' : 'Non';
            }

            if (property === 'nature') {
                return this._translateService.translate(`entities.tax_regime.options.nature.${element.nature}`);
            }

            return element[property];
        },
    };
    data: TaxRegime[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxRegime> = new MatTableDataSource();
    selection = new SelectionModel<TaxRegime>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _taxRegime: TaxRegimeService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._taxRegime.taxRegimes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxRegime[]) => {
                this.data = data;
                this.dataSource.data = data;
                this._changeDetectorRef.detectChanges();
            });
    }

    ngAfterViewInit() {
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
        * Edit TaxRegime TaxRegime
        */
    onDemand(item: TaxRegime | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<TaxRegime>) {
        return column.property;
    }
}