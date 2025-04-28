import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CoverageReference } from "@core/services/settings/coverage-reference/coverage-reference.interface";
import { CoverageReferenceService } from "@core/services/settings/coverage-reference/coverage-reference.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-product-new-step-two",
    templateUrl: "./step-two.component.html",
    animations: animations
})
export class ProductNewStepTwoComponent implements OnInit {

    @Input() level: string = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<CoverageReference> = {
        title: '',
        columns: [
            { label: 'entities.coverage_reference.table.columns.designation', property: 'designation', visible: true, type: 'text' },
            { label: 'entities.coverage_reference.table.columns.family', property: 'family', visible: true, type: 'text' },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: CoverageReference, property: keyof CoverageReference) => {
            return element[property];
        },
    };
    data: CoverageReference[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CoverageReference> = new MatTableDataSource();
    selection = new SelectionModel<CoverageReference>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _coverageReferenceService: CoverageReferenceService,
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            coverages: [[], Validators.required],
        });
    }

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._coverageReferenceService.coverageReferences$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: CoverageReference[]) => {
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

    preview() {
        console.log('preview');
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('checkbox');
        return columns;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        // add or remove all elements from the selection
        this.formGroup.get('coverages')?.setValue(this.selection.selected);
    }

    toggleSelection(row: CoverageReference) {
        this.selection.toggle(row);
        // add or remove the element from the selection
        this.formGroup.get('coverages')?.setValue(this.selection.selected);
    }


    trackByProperty(index: number, column: TableColumn<CoverageReference>) {
        return column.property;
    }


    onNext(): void {
        this.formReady.emit(this.formGroup);
    }
}