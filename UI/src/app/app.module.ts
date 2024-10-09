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
      clientId: '97e55959-e1e2-4284-8a7f-6f2e067df752',  // Your Azure AD client ID
      authority: 'https://login.microsoftonline.com/adc106b6-0473-460c-ba64-d365b98c3818',  // Your tenant ID
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
    interactionType: InteractionType.Redirect,  // Set to Popup or Redirect
    authRequest: {
      scopes: ['user.read','https://management.azure.com/.default', 'https://management.core.windows.net/','https://management.core.windows.net','https://management.azure.com/','https://management.azure.com'],
      
    }
  };
}

// MSAL Interceptor Configuration Factory (to protect API requests)
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://management.azure.com/', ['https://management.azure.com/.default']);  // Correct audience and scope

  return {
    interactionType: InteractionType.Redirect,  // or InteractionType.Redirect
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
