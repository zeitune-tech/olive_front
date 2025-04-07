import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { LanguagesModule } from "../languages/languages.module";
import { MessagesModule } from "../messages/messages.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { QuickChatModule } from "../quick-chat/quick-chat.module";
import { SearchModule } from "../search/search.module";
import { ShortcutsModule } from "../shortcuts/shortcuts.module";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FullscreenModule } from "../../../../@lhacksrt/components/fullscreen/fullscreen.module";
import { UserModule } from "../user/user.module";
import { BreadcrumbsModule } from "../breadcrumbs/breadcrumbs.module";
import { MatButtonModule } from "@angular/material/button";
import { SelectModuleDialogModule } from "../select-module-dialog/select-module-dialog.component.module";
import { TranslocoCoreModule } from "@core/transloco/transloco.module";



@NgModule({
    declarations: [
        HeaderComponent
    ],
    imports: [
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        FullscreenModule,
        LanguagesModule,
        MessagesModule,
        NotificationsModule,
        QuickChatModule,
        SearchModule,
        ShortcutsModule,
        BreadcrumbsModule,
        UserModule,
        SelectModuleDialogModule,
        TranslocoCoreModule
    ],
    exports: [
        HeaderComponent
    ]
}) 
export class HeaderModule { }