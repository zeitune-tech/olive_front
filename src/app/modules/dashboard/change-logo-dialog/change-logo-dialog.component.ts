import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ManagementEntityService } from "@core/services/management-entity/management-entity.service";


@Component({
    selector: "app-change-logo-dialog",
    templateUrl: "./change-logo-dialog.component.html",
})
export class ChangeLogoDialogComponent {
    logoFile: File | null = null;
    logoPreview: string | ArrayBuffer | null = null;
    fileError: string | null = null;

    constructor(
        public dialogRef: MatDialogRef<ChangeLogoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { logo: string | ArrayBuffer | null },
        private _managementEntityService: ManagementEntityService,
    ) {
        this.logoPreview = data.logo;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            if (!file.type.startsWith('image/')) {
                this.fileError = 'Le fichier doit être une image.';
                this.logoFile = null;
                this.logoPreview = null;
                return;
            }

            this.fileError = null;
            this.logoFile = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.logoPreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (!this.logoFile) {
            this.fileError = 'Veuillez sélectionner un logo.';
            return;
        }

        const formData = new FormData();
        formData.append('file', this.logoFile, this.logoFile.name);

        this._managementEntityService.updateLogo(formData).subscribe({
            next: (response) => {
                this.dialogRef.close(response);
            },
            error: (error) => {
                console.error('Erreur lors de la mise à jour du logo:', error);
                this.fileError = 'Erreur lors de la mise à jour du logo.';
            }
        });

    }

    onClose(): void {
        // Fermer la dialog
    }
}

