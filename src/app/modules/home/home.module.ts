import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        RouterModule.forChild([
            {
                path: "",
                component: HomeComponent
            }
        ]),
        TranslocoModule,
        CommonModule
    ],
    providers: [],
    exports: []
})
export class HomeModule { }