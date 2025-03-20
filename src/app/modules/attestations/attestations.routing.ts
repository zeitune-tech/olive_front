import { Routes } from "@angular/router";
import { AttestationsListComponent } from "./list/list.component";
import { AttestationNewComponent } from "./new/new.component";
import { AttestationAttributeComponent } from "./attribute/attribute.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: AttestationsListComponent },
    { path: 'new', component: AttestationNewComponent },
    { path: 'attribute', component: AttestationAttributeComponent },
]
