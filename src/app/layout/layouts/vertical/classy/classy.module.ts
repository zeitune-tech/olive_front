import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../../../../shared/shared.module';
import { FullscreenModule } from '../../../../../@lhacksrt/components/fullscreen/fullscreen.module';
import { LoadingBarModule } from '../../../../../@lhacksrt/components/loading-bar/loading-bar.module';
import { NavigationModule } from '../../../../../@lhacksrt/components/navigation/navigation.module';
import { UserModule } from '../../../common/user/user.module';
import { ClassyLayoutComponent } from './classy.component';
import { HeaderModule } from '../../../common/header/header.module';


@NgModule({
    declarations: [
        ClassyLayoutComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        FullscreenModule,
        LoadingBarModule,
        NavigationModule,
        HeaderModule,
        UserModule,
        SharedModule
    ],
    exports     : [
        ClassyLayoutComponent
    ]
})
export class ClassyLayoutModule
{
}
