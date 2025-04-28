
import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CompanyAttestations } from "@core/services/attestations/company-attestations/company-attestations.interface";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-revoked-companies-attestations",
    templateUrl: "revoked.component.html",
    animations: animations
})
export class RevokedCompaniesAttestationsComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<CompanyAttestations> = {
        title: '',
        columns: [
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
        ],
        imageOptions: {
            label: 'entities.compCompanyAttestations.table.columns.logo',
            property: 'logo',
            cssClasses: ['w-24 h-24']
        },
        renderItem: (element: CompanyAttestations, property: keyof CompanyAttestations) => {
            
            return element[property];
        },
    };
    data: CompanyAttestations[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CompanyAttestations> = new MatTableDataSource();
    selection = new SelectionModel<CompanyAttestations>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    metadata: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
       
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

    attribute(item: CompanyAttestations | null): void {
       
    }

    /**
        * Edit CompanyAttestations CompanyAttestations
        */
    editItem(item: CompanyAttestations | null): void {
        
    }

    /**
        * Delete CompanyAttestations CompanyAttestations
        */
    deleteItem(item: CompanyAttestations): void {
        
    }

    get visibleColumns() {
        let columns: string[] = [];
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<CompanyAttestations>) {
        return column.property;
    }
}