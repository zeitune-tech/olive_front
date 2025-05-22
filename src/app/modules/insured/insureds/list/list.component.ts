import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Insured } from "@core/services/insured/insured/insured.interface";
import { InsuredService } from "@core/services/insured/insured/insured.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-insureds-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class InsuredsListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Insured> = {
        title: '',
        columns: [
            { label: 'entities.insured.fields.firstName', property: 'firstName', visible: true, type: 'text' },
            { label: 'entities.insured.fields.lastName', property: 'lastName', visible: true, type: 'text' },
            { label: 'entities.insured.fields.birthDate', property: 'birthDate', visible: true, type: 'text' },
            { label: 'entities.insured.fields.gender', property: 'gender', visible: true, type: 'text' },
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
        renderItem: (element: Insured, property: keyof Insured) => {


            return element[property];
        },
    };
    data: Insured[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Insured> = new MatTableDataSource();
    selection = new SelectionModel<Insured>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _insuredService: InsuredService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._insuredService.insureds$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Insured[]) => {
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
        * Edit Insured Insured
        */
    onDemand(item: Insured | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Insured>) {
        return column.property;
    }
}