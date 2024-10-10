import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MSAL_INSTANCE, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PublicClientApplication } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
      @Inject(MSAL_INSTANCE) private msalInstance: PublicClientApplication
  
    ) {}
  
    clearMsalCache() {
      this.msalInstance.clearCache();  
      console.log("MSAL cache cleared.");
    }
  
    
  
    ngOnInit(): void {
      // console.log("init")
      // // Track interaction status using MsalBroadcastService
      // this.msalBroadcastService.inProgress$
      //   .pipe(
      //     takeUntil(this._destroying$)
      //   )
      //   .subscribe((status: InteractionStatus) => {
      //     this.isInteractionInProgress = status !== InteractionStatus.None;
      //     console.log("Is interaction in progress:", this.isInteractionInProgress);
        // });

        this.login();

  
       
    }
  
  
    ngOnDestroy(): void {
      this._destroying$.next(undefined);
      this._destroying$.complete();
    }
  
    login() {

      this.authService.login();
      // console.log("Attempting login");
    
      // // Check if interaction is in progress or if MSAL is still in startup mode
      // this.msalBroadcastService.inProgress$
      //   .pipe(
      //     filter((status: InteractionStatus) => {
      //       const isInProgress = status !== InteractionStatus.None && status !== InteractionStatus.Startup;
      //       console.log("Current interaction status:", status);
      //       if (isInProgress) {
      //         console.log("Interaction in progress or still in startup, waiting for completion...");
      //         return false;  // Do not proceed if interaction is in progress or startup
      //       }
      //       return true;  // Proceed if no interaction is in progress and not in startup
      //     }),
      //     takeUntil(this._destroying$)
      //   )
      //   .subscribe({
      //     next: async () => {
      //       console.log("No interaction in progress, proceeding with login");
    
      //       // Await the promise from the login method
      //       try {
      //         (await this.authService.login()).subscribe({
      //           next: (response: AuthenticationResult) => {
      //             console.log('Login successful #component', response);
      //             const IdToken = response.idToken;
      //             this.accessToken = response.accessToken;
      //             this.idToken = response.idToken
      //             this.authService.sendData(IdToken).subscribe(res => {
      //               console.log(res);
      //               this.loginDisplay = true;
      //             })
                  
      //           },
      //           error: (error) => {
      //             console.error("Login error: ", error);  // Handle login errors
      //           }
      //         });
      //       } catch (error) {
      //         console.error("Login promise error: ", error);
      //       }
      //       // this.callApi(this.accessToken);
      //     },
      //     error: (error) => {
      //       console.error("Interaction status check error: ", error);  // Handle status check errors
      //     }
      //   });
      //   takeUntil(this._destroying$)
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

    }
    // sync(){
    // //   this.subscriptionService.usageDetails$.subscribe((res) => {
    // //     this.data = res;
    // //   })
    // // }
  

  }


