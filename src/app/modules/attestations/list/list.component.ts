import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Attestation } from "@core/services/attestation/attestation.interface";
import { AttestationService } from "@core/services/attestation/attestation.service";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { AttestationNewComponent } from "../new/new.component";
import { Router } from "@angular/router";
import { PermissionsService } from "@core/permissions/permissions.service";
import { UserService } from "@core/services/user/user.service";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { animations } from "@lhacksrt/animations";

@Component({
    selector: "app-attestations-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class AttestationsListComponent {
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _permissions = {
        generate: false
    }
    
    get canGenerate() {
        return this._permissions.generate;
    }

    tableOptions: TableOptions<Attestation> = {
        title: '',
        columns: [
            { label: 'attestation.columns.prefix', property: 'prefix', type: 'text', visible: true },
            { label: 'attestation.columns.quantity', property: 'quantity', type: 'text', visible: true },
            { label: 'attestation.columns.startDate', property: 'startDate', type: 'text', visible: true },
            { label: 'attestation.columns.endDate', property: 'endDate', type: 'text', visible: true },
            { label: 'attestation.columns.deliverer', property: 'deliverer', type: 'text', visible: true }
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'company.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'company.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) }
        ],
        renderItem: (element: Attestation, property: keyof Attestation) => {
            
            return element[property];
        },
    };
    data: Attestation[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Attestation> = new MatTableDataSource();
    selection = new SelectionModel<Attestation>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _attestationService: AttestationService,
        private _userService: UserService,
        private _permissionsService: PermissionsService,
        private _dialog: MatDialog,
        private _router: Router
    ) {
        this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(user => {
            this._permissions.generate = this._permissionsService.hasPermission(user, PERMISSIONS.GENERATE_ATTESTATION);
        });
    }

    ngOnInit(): void {
        this._attestationService.myAttestations$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Attestation[]) => {
            this.data = data;
            this.dataSource.data = data;
            this._changeDetectorRef.markForCheck();
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
    * Edit Attestation Attestation
    */
    editItem(item: Attestation | null): void {
        this._dialog.open(AttestationNewComponent, {
            panelClass: 'attestation-new-dialog',
            data: item,
        }).afterClosed().subscribe((result: Attestation | null) => {
            if (result) {}
        });
    }

    generate() {
        // navigate to attestations/new
        this._router.navigate(['/attestations/new']);
    }

    /**
    * Delete Attestation Attestation
    */
    deleteItem(item: Attestation): void {
        
    }

    get visibleColumns() {
        return this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
    }

    trackByProperty(index: number, column: TableColumn<Attestation>) {
        return column.property;
    }
}