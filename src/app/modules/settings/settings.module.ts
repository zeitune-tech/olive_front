import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./settings.routing";

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [],
    exports: [],
})
export class SettingsModule { }