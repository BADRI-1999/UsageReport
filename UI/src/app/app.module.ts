import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MsalModule, MsalService, MsalInterceptor, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalInterceptorConfiguration, MsalRedirectComponent } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router'; 
import { routes } from './app.routes';

// MSAL Instance Factory to create PublicClientApplication
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '6e0e18c1-30d1-451d-bcf0-3dfebc97dac3',  // Your Azure AD client ID
      authority: 'https://login.microsoftonline.com/f49ab434-34c0-497d-9e86-1efcbec5b5c6',  // Your tenant ID
      redirectUri: 'http://localhost:4200',  // Your redirect URI
    },
    cache: {
      cacheLocation: 'localStorage',  // or sessionStorage
      storeAuthStateInCookie: false,  // Recommended for IE11
    }
  });
}

// MSAL Guard Configuration Factory (for login guard configuration)
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,  // Set to Popup or Redirect
    authRequest: {
      scopes: ['user.read']  // Scopes required during authentication
    }
  };
}

// MSAL Interceptor Configuration Factory (to protect API requests)
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);  // Example protected API

  return {
    interactionType: InteractionType.Popup,  // or InteractionType.Redirect
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),  
    MsalModule.forRoot(
      MSALInstanceFactory(),  // Call the MSALInstanceFactory function to return an object
      MSALGuardConfigFactory(),  // Call the GuardConfig factory
      MSALInterceptorConfigFactory()  // Call the InterceptorConfig factory
    )
  ],
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]  // Use MsalRedirectComponent for redirects
})
export class AppModule { }
