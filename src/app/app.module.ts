import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';  // Import RouterModule
import { MsalModule, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { AppComponent } from './app.component';
import { authConfig } from './authentication/auth.config';
import { routes } from './app.routes';

// // Define your routes
// const routes: Routes = [
//   { path: '', component: AppComponent },  // Example route
//   // Add more routes as needed
// ];

// MSAL instance factory function
export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication(authConfig);
}

// MSAL Interceptor configuration function
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  
  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // Add RouterModule.forRoot(routes) here
    MsalModule.forRoot(
      new PublicClientApplication(authConfig),
      {
        interactionType: InteractionType.Popup,
        authRequest: {
          scopes: ['user.read']
        }
      },
      {
        interactionType: InteractionType.Popup,
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
        ])
      }
    )
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }





// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgModule } from '@angular/core';

// import { MatButtonModule } from '@angular/material/button';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatListModule } from '@angular/material/list';

// import { RouterModule } from '@angular/router'; // Import RouterModule
// import { AppComponent } from './app.component';

// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
// import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular'; // Redirect component imported from msal-angular

// export function loggerCallback(logLevel: LogLevel, message: string) {
//   console.log(message);
// }

// export function MSALInstanceFactory(): IPublicClientApplication {
//   return new PublicClientApplication({
//     auth: {
//       clientId: '4a45d2cc-c1a9-4a76-a31b-b4f5101d1b27',
//       redirectUri: 'http://localhost:4200/',
//       postLogoutRedirectUri: 'http://localhost:4200'
//     },
//     cache: {
//       cacheLocation: BrowserCacheLocation.LocalStorage
//     },
//     system: {
//       loggerOptions: {
//         loggerCallback,
//         logLevel: LogLevel.Info,
//         piiLoggingEnabled: false
//       }
//     }
//   });
// }

// export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
//   const protectedResourceMap = new Map<string, Array<string>>();
//   protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

//   return {
//     interactionType: InteractionType.Redirect,
//     protectedResourceMap
//   };
// }

// export function MSALGuardConfigFactory(): MsalGuardConfiguration {
//   return { interactionType: InteractionType.Redirect };
// }

// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     BrowserAnimationsModule,
//     RouterModule,
//     MatButtonModule,
//     MatToolbarModule,
//     MatListModule,
//     MsalModule


//     // BrowserModule,
//     // BrowserAnimationsModule,
//     // AppRoutingModule,
//     // MatButtonModule,
//     // MatToolbarModule,
//     // MatListModule,
//     // HttpClientModule,
//     // MsalModule
//   ],
//   providers: [
//     provideHttpClient(withInterceptorsFromDi()),
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: MsalInterceptor,
//       multi: true
//     },
//     {
//       provide: MSAL_INSTANCE,
//       useFactory: MSALInstanceFactory
//     },
//     {
//       provide: MSAL_GUARD_CONFIG,
//       useFactory: MSALGuardConfigFactory
//     },
//     {
//       provide: MSAL_INTERCEPTOR_CONFIG,
//       useFactory: MSALInterceptorConfigFactory
//     },
//     MsalService,
//     MsalGuard,
//     MsalBroadcastService
//   ],
//   bootstrap: [AppComponent, MsalRedirectComponent] // Redirect component bootstrapped here
// })
// export class AppModule { }






// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule } from '@angular/router'; // Import RouterModule
// import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
// import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
// import { AppComponent } from './app.component';

// export function MSALInstanceFactory(): IPublicClientApplication {
//     return new PublicClientApplication({
//         auth: {
//             clientId: '4a45d2cc-c1a9-4a76-a31b-b4f5101d1b27',
//             redirectUri: 'http://localhost:4200/',
//             authority: 'https://login.microsoftonline.com/b7dc318e-8abb-4c84-9a6a-3ae9fff0999f',

//         }
//     });
// }


// @NgModule({
//   declarations: [
//     AppComponent,
//     // other components
//   ],
//   imports: [
//     BrowserModule,
//     RouterModule,
//     MsalModule
//   ],
//   providers: [
//     {
//     provide: MSAL_INSTANCE,
//     useFactory: MSALInstanceFactory
//   },
//   MsalService
// ],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
