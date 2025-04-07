import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SelectModuleDialogComponent } from './select-module-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [
        SelectModuleDialogComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        CommonModule,
        MatDialogModule,
        MatDividerModule,
        TranslocoModule
    ],
    exports     : [
        SelectModuleDialogComponent
    ],

})
export class SelectModuleDialogModule
{
}
