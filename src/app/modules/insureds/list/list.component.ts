import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Insured } from "@core/services/insured/insured.interface";
import { InsuredService } from "@core/services/insured/insured.service";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-insured-list",
    templateUrl: "./list.component.html",
})
export class InsuredListComponent {

  
   private _unsubscribeAll: Subject<any> = new Subject<any>();
     
   tableOptions: TableOptions<Insured> = {
       title: '',
       columns: [
       ],
       pageSize: 8,
       pageSizeOptions: [5, 6, 8],
       actions: [
           { label: 'company.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
           { label: 'company.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) }
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
   ) {}

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
   editItem(item: Insured | null): void {
       
   }

   /**
    * Delete Insured Insured
    */
   deleteItem(item: Insured): void {
       
   }

    get visibleColumns() {
        return this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
    }

    trackByProperty(index: number, column: TableColumn<Insured>) {
        return column.property;
    }
}