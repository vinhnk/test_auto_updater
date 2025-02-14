import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { vi_VN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

const Size = Quill.import('attributors/style/size');
const Font = Quill.import('attributors/style/font');

registerLocaleData(vi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(),
    provideNzI18n(vi_VN),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('13046485732-bqdffu560dlse5j6067om2gjiagap38t.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig
    },
    importProvidersFrom(
      QuillModule.forRoot({
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'size': ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '36px'] }],
            [{ 'font': [
              'Arial',
              'Roboto',
              'Open Sans',
              'Montserrat',
              'Lato',
              'Raleway',
              'Poppins',
              'Dancing Script',
              'Playfair Display'
            ]}],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            // ['clean']
          ],
          clipboard: true,
          imageUpload: true
        },
        customModules: [
          {
            implementation: Size,
            path: 'modules/size'
          },
          {
            implementation: Font,
            path: 'modules/font'
          }
        ]
      })
    )
  ],
};
