import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MsalModule, MsalService, MsalInterceptor, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalInterceptorConfiguration, MsalRedirectComponent, MsalGuard, MsalBroadcastService } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS, HttpBackend, provideHttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router'; 
import { AppRoutingModule, routes } from './app.routes';
import { LoginComponent } from './components/login/login.component';
import { ConfigService } from './services/config.service';

// MSAL Instance Factory to create PublicClientApplication
export function MSALInstanceFactory(config:ConfigService): IPublicClientApplication {
  console.log("Configuration in msal initialize",config.config)
  return new PublicClientApplication({
    auth: {
      clientId: config.config.auth.client_id,  // Your Azure AD client ID
      authority: `https://login.microsoftonline.com/${config.config.auth.tenant_id}`,  // Your tenant ID
      redirectUri: config.config.auth.redirectUri,  // Your redirect URI
    },
    cache: {
      cacheLocation: 'localStorage',  // or sessionStorage
      storeAuthStateInCookie: false,  // Recommended for IE11
    }
  });
}

// MSAL Guard Configuration Factory (for login guard configuration)
export function MSALGuardConfigFactory(config:ConfigService): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,  // Set to Popup or Redirect
    authRequest: {
      scopes: config.config.auth.scopes,
      
    }
  };
}

// MSAL Interceptor Configuration Factory (to protect API requests)
export function MSALInterceptorConfigFactory(config:ConfigService): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://management.azure.com/', ['https://management.azure.com/.default']);  // Correct audience and scope

  return {
    interactionType: InteractionType.Redirect,  // or InteractionType.Redirect
    protectedResourceMap
  };
}
export function initializeApp(configService: ConfigService, handler: HttpBackend) {
  console.log("Initializing app ")
  return ()=>configService.loadConfig(handler);
}

@NgModule({
  declarations: [
   
    AppComponent,
  ],
  imports: [
    
    AppRoutingModule,
    BrowserModule,
    RouterModule.forRoot(routes),  
    LoginComponent
  ],
  providers: [
    {
      provide:APP_INITIALIZER,
      useFactory:initializeApp,
      deps:[ConfigService, HttpBackend],
      multi:true
    },
    provideHttpClient(),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
      deps:[ConfigService]

    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
      deps:[ConfigService]

    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
      deps:[ConfigService]

    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    
    
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]  // Use MsalRedirectComponent for redirects
})
export class AppModule { }
