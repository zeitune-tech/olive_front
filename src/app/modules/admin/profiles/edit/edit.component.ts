import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '@core/services/auth/profile/profile.service';

@Component({
    selector: 'app-profiles-edit',
    templateUrl: './edit.component.html'
})
export class ProfilesEditComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ProfilesEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string; description: string },
        private profileService: ProfileService
    ) {}

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            name: [this.data.name || '', Validators.required],
            description: [this.data.description || '', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updatedProfile = {
            id: this.data.id,
            ...this.formGroup.value
        };

        this.profileService.update(updatedProfile).subscribe({
            next: () => {
                this.message = 'message.success';
                this.dialogRef.close(true);
            },
            error: () => {
                this.message = 'message.error';
                this.formGroup.enable();
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
