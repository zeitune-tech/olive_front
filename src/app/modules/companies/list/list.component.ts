    import { SelectionModel } from "@angular/cdk/collections";
    import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
    import { UntypedFormControl } from "@angular/forms";
    import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
    import { MatPaginator } from "@angular/material/paginator";
    import { MatSort } from "@angular/material/sort";
    import { MatTableDataSource } from "@angular/material/table";
    import { Company } from "@core/services/company/company.interface";
    import { CompanyService } from "@core/services/company/company.service";
    import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
    import { Subject, takeUntil } from "rxjs";
import { DemandFormComponent } from "../../demands/form/form.component";

    @Component({
        selector: "app-companies-list",
        templateUrl: "./list.component.html",
    })
    export class CompaniesListComponent {
        
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Company> = {
        title: '',
        columns: [
            { label: 'company.columns.logo', property: 'logo', type: 'image', visible: true },
            { label: 'company.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'company.columns.email', property: 'email', type: 'text', visible: true },
            { label: 'company.columns.phone', property: 'phone', type: 'text', visible: true },
            { label: 'company.columns.address', property: 'address', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'company.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            
        ],
        renderItem: (element: Company, property: keyof Company) => {
            
            return element[property];
        },
    };
    data: Company[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Company> = new MatTableDataSource();
    selection = new SelectionModel<Company>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _companyService: CompanyService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._companyService.companies$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Company[]) => {
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
        * Edit Company Company
        */
    onDemand(item: Company | null): void {
        this._dialog.open(DemandFormComponent, {
            data: item
        })
        .afterClosed()
        .subscribe((response: any) => {
            if (!response) {
                return;
            }
        });
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Company>) {
        return column.property;
    }
}