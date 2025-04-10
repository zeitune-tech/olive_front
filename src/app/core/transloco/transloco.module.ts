import { provideTransloco, TranslocoModule, provideTranslocoScope, TranslocoScope } from '@jsverse/transloco';
import { isDevMode, NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco.http-loader';
import { provideHttpClient } from '@angular/common/http';

const scopes: TranslocoScope[] = [
  { scope: 'fr', alias: 'entities' },
  { scope: 'fr', alias: 'auth' },
  { scope: 'fr', alias: 'home' }, 
]

@NgModule({
    exports  : [ TranslocoModule ],
    providers: [
        provideHttpClient(),
        provideTransloco({
          config: {
            availableLangs: ['en', 'fr', 'sn', 'ar'],
            defaultLang: 'fr',
            reRenderOnLangChange: true,
            prodMode: !isDevMode(),
            missingHandler: {
              useFallbackTranslation: true, // Falls back to default if key is missing
              logMissingKey: true // Logs missing translation keys
            }
          },
          loader: TranslocoHttpLoader,
        }),
        // provideTranslocoScope(...scopes),
    ],
})
export class TranslocoCoreModule { }
