import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Contributor } from "@core/services/administration/contributor/contributor.interface";
import { ContributorService } from "@core/services/administration/contributor/contributor.service";
import { User } from '@core/services/auth/user/user.interface';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
})

export class AccountComponent implements OnInit {

    formGroupLogin!: FormGroup;

    user!: User;
    contributor!: Contributor;

    mode: 'view' | 'edit' = 'view';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            contributor: Contributor
        },
        private _contributorService: ContributorService,
        private _formBuilder: FormBuilder
    ) {
        this.contributor = data.contributor;
        this.getAccount(this.contributor.id);
    }

    ngOnInit(): void {
        this.formGroupLogin = this._formBuilder.group({
            login: [this.user?.email || ''],
            isActive: [this.user?.isActive || true]
        });
    }

    getAccount(id: string): void {
        this._contributorService.getAccount(id).subscribe((user) => {
            this.user = user;
        });
    }

    get isEditMode(): boolean {
        return this.mode === 'edit';
    }

    get isViewMode(): boolean {
        return this.mode === 'view';
    }

    onEdit(): void {
        this.mode = 'edit';
    }

    onView(): void {
        this.mode = 'view';
    }

    onSave(): void {
        this._contributorService.updateAccount(this.user).subscribe(() => {
            this.mode = 'view';
        });
    }

    onToggleAccount(): void {
        this.user.isActive = !this.user.isActive;
        this._contributorService.updateAccount(this.user).subscribe();
    }

    onToggleActive() {
        throw new Error('Method not implemented.');
    }
}