import {  LOCALE_ID, APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { httInterceptor } from './core/interceptor/htt.interceptor';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { AuthService } from './core/auth/auth.service';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
registerLocaleData(ptBr)

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([httInterceptor])),
    provideAnimations(),
    MessageService,
    ConfirmationService,
    JwtHelperService,
    NgxScannerQrcodeModule,
    importProvidersFrom(
      [
        JwtModule.forRoot({
          config: {
            tokenGetter: () => localStorage.getItem('token')
          }
        })
      ]
    ),

    {provide: LOCALE_ID, useValue: 'pt' },
    // usado para o apache reconhecer a navegacao por link
    { provide: LocationStrategy, useClass: HashLocationStrategy},
    // para usar o refresh token
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializerFactory,
    //   multi: true,
    //   deps: [AuthService]
    // },
    // para usar o refresh token

  ]
};

export function initializerFactory(authService: AuthService) {
  return () => authService.refreshToken();
}
