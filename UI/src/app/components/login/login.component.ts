import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MSAL_INSTANCE, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PublicClientApplication } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';


import { HttpClient } from '@angular/common/http';
import { SubscriptionService } from "../../services/subscription.service";
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    private readonly _destroying$ = new Subject<void>();
    loginDisplay = false;
    tokenExpiration: string = '';
    accessToken = '';
    isInteractionInProgress: boolean | undefined;
    idToken = ''
    constructor(
      private authService: AuthService,
      private msalBroadcastService: MsalBroadcastService,
      private http: HttpClient,
      private subscriptionService:SubscriptionService,
      private router: Router,
      @Inject(MSAL_INSTANCE) private msalInstance: PublicClientApplication
  
    ) {
      this.login();
      // this.callApi();
    }
  
    clearMsalCache() {
      this.msalInstance.clearCache();  
      console.log("MSAL cache cleared.");
    }
  
   

    
  
  
    ngOnDestroy(): void {
      this._destroying$.next(undefined);
      this._destroying$.complete();
    }
  
    login() {

      this.authService.login();
      
    }
    
  
    
  
    async onLogout() {
      try {
        await this.authService.logout(); // Ensure you await the logout 
        console.log("Logged out successfully.");
      } catch (error) {
        console.error("Logout error: ", error);
      }
    }
  
  
    async callApi() {
      console.log("getting usage report");
      this.subscriptionService.getUsageDetails('52435666-b2cb-431f-8490-6f1524da777e', '2024-08-01','2024-09-30')


      // this.router.navigate(['/dashboard']);
      

    }
    // sync(){
    // //   this.subscriptionService.usageDetails$.subscribe((res) => {
    // //     this.data = res;
    // //   })
    // // }
  

  }


