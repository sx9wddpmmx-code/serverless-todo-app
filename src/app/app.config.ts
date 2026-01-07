import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';

import { routes } from './app.routes';
import { ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        providePrimeNG({
            theme: {
                preset: Lara,
                options: {
                    darkModeSelector: false
                }
            }
        }),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        ConfirmationService
    ]
};
