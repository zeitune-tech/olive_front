import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NewDemandComponent } from './components/new-demand/new-demand.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { SelectDialogComponent } from './components/select-dialog/select-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";

@NgModule({
    declarations: [
        NewDemandComponent,
        ConfirmDialogComponent,
        ConfirmDeleteComponent,
        SelectDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule,
        DialogModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatListModule,
        MatIcon,
        MatInput
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule
    ]
})
export class SharedModule
{
}
