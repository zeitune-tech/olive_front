import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Permission } from "@core/services/auth/profile/profile.interface";
import { ProfileService } from "@core/services/auth/profile/profile.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { StepperDataService } from "../form.service";

@Component({
    selector: "app-profiles-new-step-two",
    templateUrl: "./step-two.component.html",
    animations: animations
})
export class ProfilesNewStepTwoComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    permissions: Permission[] = [];
        
    tableOptions: TableOptions<Permission> = {
        title: '',
        columns: [
            { label: 'permissions.columns.description', property: 'description', type: 'text', visible: true },
            { label: 'permissions.columns.levels.level', property: 'level', type: 'text', visible: true },
            { label: 'permissions.columns.module', property: 'module', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Permission, property: keyof Permission) => {
            if (property === 'description') {
                return this._translateService.translate(element[property]);
            }

            if (property === 'level') {
                return this._translateService.translate('permissions.columns.levels.' + element[property].toLowerCase());
            }
            return element[property];
        },
    };
    data: Permission[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Permission> = new MatTableDataSource();
    selection = new SelectionModel<Permission>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _profileService: ProfileService,
        private _translateService: TranslocoService,
        private formBuilder: FormBuilder,
        private _stepperDataService: StepperDataService,
    ) { 
        this.formGroup = this.formBuilder.group({
            permissions: [[], Validators.required],
        });

    }

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._profileService.permissions$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Permission[]) => {
            this.data = data;
            this.dataSource.data = data;
            this.permissions = data;

            this._changeDetectorRef.detectChanges();
        });

        this._stepperDataService.level$.subscribe(level => {
            if (level) {
                console.log('level', level);
              this.dataSource.data = this.permissions.filter((permission: Permission) => permission.level === level);
            }
        });

        this.searchInputControl.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((searchText) => {
            this.dataSource.filter = searchText.trim().toLowerCase();
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
        this.formGroup.get('permissions')?.setValue(this.selection.selected);
    }

    toggleSelection(row: Permission) {
        this.selection.toggle(row);
        // add or remove the element from the selection
        this.formGroup.get('permissions')?.setValue(this.selection.selected);
    }


    trackByProperty(index: number, column: TableColumn<Permission>) {
        return column.property;
    }


    onNext(): void {
        this.formReady.emit(this.formGroup);
    }
}