import {SelectionModel} from "@angular/cdk/collections";
import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {UntypedFormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "@core/services/settings/product/product.interface";
import {IncompatibleCoverage} from "@core/services/settings/incompatible-coverage/incompatible-coverage.interface";
import {IncompatibleCoverageService} from "@core/services/settings/incompatible-coverage/incompatible-coverage.service";
import {animations} from "@lhacksrt/animations";
import {TableOptions, TableColumn} from "@lhacksrt/components/table/table.interface";
import {Subject, takeUntil} from "rxjs";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {Router} from "@angular/router";
import {IncompatibleCoveragesNewComponent} from "../new-incompatibility/new.component";
import {SelectProductComponent} from "../select-product/select-product.component";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {CoverageReference} from "@core/services/settings/coverage-reference/coverage-reference.interface";

@Component({
  selector: "app-incompatible-coverages-list",
  templateUrl: "./list.component.html",
  animations: animations
})
export class IncompatibleCoveragesListComponent {


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchCtrl: UntypedFormControl = new UntypedFormControl('');

  tableOptions: TableOptions<IncompatibleCoverage> = {
    title: '',
    columns: [
      {label: 'entities.incompatible_coverage.fields.coverage', property: 'coverage', type: 'text', visible: true},
      {
        label: 'entities.incompatible_coverage.fields.incompatible',
        property: 'incompatibleCoverage',
        type: 'text',
        visible: true
      },
    ],
    imageOptions: {
      label: 'incompatibleCoverage.columns.logo',
      property: 'logo',
      cssClasses: ['w-16 h-16']
    },
    pageSize: 8,
    pageSizeOptions: [5, 6, 8],
    actions: [],
    renderItem: (element: IncompatibleCoverage, property: keyof IncompatibleCoverage) => {
      if (property === "coverage") {
        return element[property].designation;
      }
      if (property === "incompatibleCoverage") {
        return element[property].designation;
      }
      return element[property];
    },
  };
  data: IncompatibleCoverage[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<IncompatibleCoverage> = new MatTableDataSource();
  selection = new SelectionModel<IncompatibleCoverage>(true, []);
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedProduct: Product = new Product({}) as Product;
  products: Product[] = [];
  coverages: Coverage[] = [];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _incompatibleCoverageService: IncompatibleCoverageService,
    private _coverageService: CoverageService,
    private _dialog: MatDialog,
    private _router: Router
  ) {
  }

  ngOnInit(): void {

    this._coverageService.coverages$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Coverage[]) => {
        this.coverages = data;
        this.products = data
          .map(coverage => coverage.product)
          .filter((product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
          )
          .map(p => new Product(p));

        this.selectedProduct = new Product(this.products[0]) || new Product({}) as Product;
        // this.data = data;
        // this.dataSource.data = data;
        // this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
        this._changeDetectorRef.detectChanges();
      });


    this._incompatibleCoverageService.incompatibleCoverages$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IncompatibleCoverage[]) => {

        const selectedCoverages: Coverage[] = this.coverages
          .filter(cov => cov.product.id === this.selectedProduct.id);
        this.data = data;
        this.dataSource.data = data
          .filter(incov => selectedCoverages.map(c => c.reference.id).includes(incov.coverage.id));
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

  onEdit(element: IncompatibleCoverage): void {
  }

  onDelete(element: IncompatibleCoverage): void {
    this._dialog.open(ConfirmDeleteComponent, {
      data: {
        title: 'entities.incompatible_coverage.delete.title',
        message: 'entities.incompatible_coverage.delete.message',
        item: element,
        service: this._incompatibleCoverageService
      }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this._incompatibleCoverageService.delete(element.id).subscribe(() => {
          this._changeDetectorRef.markForCheck();
        });
      }
    });
  }

  onView(element: IncompatibleCoverage): void {
  }

  get visibleColumns() {
    let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
    columns.push('actions');
    return columns;
  }

  trackByProperty(index: number, column: TableColumn<IncompatibleCoverage>) {
    return column.property;
  }

  openAddDialog() {
    this._dialog.open(IncompatibleCoveragesNewComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {coverageDuration: this.searchCtrl.value}
    });
  }

  openSelection() {
    this._dialog.open(SelectProductComponent, {
      width: '700px',
      data: {
        selected: this.selectedProduct,
        products: this.products
      }
    }).afterClosed().subscribe((product: Product) => {
      if (product) {
        this.selectedProduct = product;
        // this.dataSource.data = this.data;
        // .filter(coverage => coverage.product.id === this.selectedProduct.id);

        this._incompatibleCoverageService.getAll()
          .subscribe((data: IncompatibleCoverage[]) => {
            const selectedCoverages: string[] = this.coverages
              .filter(cov => cov.product.id === this.selectedProduct.id)
              .map(cov => cov.reference.id);
            console.log("selectedCoverages: ", selectedCoverages)
            console.log("data", data)

            this.data = data;
            this.dataSource.data = data
              .filter(inCov => selectedCoverages.includes(inCov.coverage.id));
            this._changeDetectorRef.detectChanges();
          });

        this.dataSource.paginator = this.paginator;
        this._changeDetectorRef.detectChanges();

      }
    })
  }

}
