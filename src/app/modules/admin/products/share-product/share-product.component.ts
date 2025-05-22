import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Company } from "@core/services/administration/company/company.interface";
import { CompanyService } from "@core/services/administration/company/company.service";
import { Product } from "@core/services/administration/product/product.interface";
import { ProductService } from "@core/services/administration/product/product.service";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";


@Component({
    selector: "app-share-product",
    templateUrl: "./share-product.component.html",
    animations: animations
})
export class ShareProductComponent {

    tableOptions: TableOptions<Company> = {
        title: 'Share Product',
        columns: [
            { label: 'entities.company.fields.logo', property: 'logo', type: 'image', visible: true },
            { label: 'entities.company.fields.name', property: 'name', type: 'text', visible: true },
        ],
        pageSizeOptions: [5, 6, 8],
        pageSize: 8,
        actions: [],
        imageOptions: {
            label: 'entities.company.fields.logo',
            property: 'logo',
            cssClasses: ['w-12 h-12']
        },
        renderItem: (element: Company, property: keyof Company) => {

            return element[property];
        },
    };
    dataSource: MatTableDataSource<Company> = new MatTableDataSource<Company>([]);
    selection: SelectionModel<any> = new SelectionModel<any>(true, []);
    searchInputControl: any = null;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            product: Product,
            companies: string[];
        },
        private _companyService: CompanyService,
        private _productService: ProductService,
    ) {
        this._companyService.companiesLinked$.subscribe((companies: Company[]) => {
            this.dataSource.data = companies;
            this.selection = new SelectionModel<Company>(true, (
                companies.filter((company: Company) => this.data.companies.includes(company.id))
            ));
        })
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
    }

    toggleSelection(row: Company) {
        this.selection.toggle(row);
    }


    trackByProperty(index: number, column: TableColumn<Company>) {
        return column.property;
    }

    onShare() {
        console.log(this.selection.selected.map((company: Company) => company.id));
        this._productService.shareProduct(this.data.product.id, this.selection.selected.map((company: Company) => company.id)).subscribe(() => {
            this._productService.getAll().subscribe();
        });
    }
}