import { ChangeDetectorRef, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { UserService } from "@core/services/auth/user/user.service";
import { ChangePointOfSaleDialogComponent } from "../change-point-of-sale-dialog/change-point-of-sale-dialog.component";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { PointOfSaleService } from "@core/services/administration/point-of-sale/point-of-sale.service";


@Component({
    selector: "app-users-layout",
    templateUrl: "./layout.component.html",
})
export class UsersLayoutComponent {

    
    selectedEntity!: ManagementEntity;
    mainEntity!: ManagementEntity;

    entities: ManagementEntity[] = [];

    constructor(
        private _userService: UserService,
        private _managementEntityService: ManagementEntityService,
        private _pointOfSaleService: PointOfSaleService,
        private _matDialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) { 
        this._userService.user$.subscribe((user) => {
            if (user) {
            }
        })
        this._managementEntityService.entity$.subscribe((entity) => {
            if (entity) {
                this.mainEntity = entity;
                this.selectedEntity = entity;
                this._userService.getUsersByManagementEntity(this.selectedEntity.id).subscribe();
                this.entities.push(entity);
            }
        });
        this._pointOfSaleService.pointsOfSale$.subscribe((entities) => {
            if (entities) {
                this.entities.push(...entities);
                this._changeDetectorRef.markForCheck();
            }
            
        });


    }

    openEntitySelection() {
        const dialogRef = this._matDialog.open(ChangePointOfSaleDialogComponent, {
            data: {
                list: this.entities,
                selectedEntity: this.selectedEntity,
                // addEntity: true
            },
            width: '600px'
        });

        dialogRef.afterClosed().subscribe((entity: ManagementEntity) => {
            if (entity) {
                this.selectedEntity = entity;
                this._userService.getUsersByManagementEntity(this.selectedEntity.id).subscribe();
            }
        });
    }

    ngOnInit(): void {
        // Initialization logic here
    }
}