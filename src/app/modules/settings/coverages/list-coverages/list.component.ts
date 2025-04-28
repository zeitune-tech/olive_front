import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/administration/product/product.interface";
import { Coverage } from "@core/services/settings/coverage/coverage.interface";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-coverages-list",
    templateUrl: "./list.component.html",
    styles: `
        /* Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Firefox */
        input[type=number] {
            -moz-appearance: textfield;
        }
        
        /* width */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        /* Track */
        ::-webkit-scrollbar-track {
            @apply bg-default;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            @apply bg-primary-500; 
        }
        
        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            @apply bg-primary;
        }
    `,
    animations: animations
})
export class CoveragesListComponent {
    openSelection() {
        throw new Error('Method not implemented.');
    }

    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Coverage> = {
        title: '',
        columns: [
            { label: 'entities.coverage.table.columns.reference', property: 'reference', type: 'text', visible: true, cssClasses: ["min-w-64"] },
            { label: 'entities.coverage.table.columns.nature', property: 'nature', type: 'text', visible: true,  },
            { label: 'entities.coverage.table.columns.isFixed', property: 'isFixed', type: 'select', visible: true, options: [
                { label: 'form.fields.yes', value: true },
                { label: 'form.fields.no', value: false }
            ] },
            { label: 'entities.coverage.form.fields.calculationMode.label', property: 'calculationMode', type: 'select', visible: true, options: [
                { label: 'entities.coverage.form.fields.calculationMode.options.FIXED', value: 'FIXE' },
                { label: 'entities.coverage.form.fields.calculationMode.options.VARIABLE', value: 'VARIABLE' },

            ] },
            { label: 'entities.coverage.table.columns.fixedCapital', property: 'fixedCapital', type: 'input', visible: true,},
            { label: 'entities.coverage.table.columns.minCapital', property: 'minCapital', type: 'input', visible: true },
            { label: 'entities.coverage.table.columns.maxCapital', property: 'maxCapital', type: 'input', visible: true },
            { label: 'entities.coverage.table.columns.order', property: 'order', type: 'input', visible: true },
            { label: 'entities.coverage.table.columns.prorata', property: 'prorata', type: 'input', visible: true },
            { label: 'entities.coverage.table.columns.displayPrime', property: 'displayPrime', type: 'select', visible: true, options: [
                { label: 'form.fields.yes', value: true },
                { label: 'form.fields.no', value: false }
            ] },
            { label: 'entities.coverage.table.columns.generatesCharacteristic', property: 'generatesCharacteristic', type: 'select', visible: true, options: [
                { label: 'form.fields.yes', value: true },
                { label: 'form.fields.no', value: false }
            ] },
            { label: 'entities.coverage.table.columns.isFree', property: 'isFree', type: 'select', visible: true, options: [
                { label: 'form.fields.yes', value: true },
                { label: 'form.fields.no', value: false }
            ] },
        ],
        imageOptions: {
            label: 'coverage.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: Coverage, property: keyof Coverage) => {
            if (property === 'reference') {
                return element.reference?.designation || " - ";
            }

            if (element[property] === null || element[property] === undefined) {
                return " - ";
            }

            return element[property];
        },
    };
    data: Coverage[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Coverage> = new MatTableDataSource();
    selection = new SelectionModel<Coverage>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _coverageService: CoverageService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._coverageService.coverages$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Coverage[]) => {
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
        * Edit Coverage Coverage
        */
    onDemand(item: Coverage | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Coverage>) {
        return column.property;
    }
}