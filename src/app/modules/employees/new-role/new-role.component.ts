import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Permission } from "@core/permissions/permissions.model";
import { Operation } from "@core/services/employee/employee.inteface";
import { EmployeeService } from "@core/services/employee/employee.service";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-new-role",
    templateUrl: "./new-role.component.html",
})
export class NewRoleComponent {

    permissions: Operation[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
        private _employeeService: EmployeeService
    ) {
        this._employeeService.operations$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((permissions) => {
            this.permissions = permissions;
        });
    }

    close(): void {
        this._dialogRef.close();
    }
}