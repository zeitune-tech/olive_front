import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./attestations.routing";

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [],
    exports: [],
})
export class AttestationsModule { }