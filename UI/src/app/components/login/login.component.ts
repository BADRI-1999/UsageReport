import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MSAL_INSTANCE, MsalBroadcastService } from '@azure/msal-angular';
import {  PublicClientApplication } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { HttpClient } from '@angular/common/http';
import { SubscriptionService } from "../../services/subscription.service";
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
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
    isLoading: boolean = false;
    constructor(
      private authService: AuthService,
      private msalBroadcastService: MsalBroadcastService,
      private http: HttpClient,
      private subscriptionService:SubscriptionService,
      private router: Router,
      @Inject(MSAL_INSTANCE) private msalInstance: PublicClientApplication
  
    ) {
      
      // this.callApi();
    }


    ngOnInit() {
      this.login();
    }
  

  
   

    
  
  
    ngOnDestroy(): void {
      this._destroying$.next(undefined);
      this._destroying$.complete();
    }


    // login() {

    //   this.authService.login();
    //   this.isLoading = true;
      
    // }

    login() {
      this.authService.login();
      this.isLoading = true;
      
      // const accounts = this.msalInstance.getAllAccounts();
      
      // if (accounts.length > 0) {
      //   console.log("User is already logged in");
       
      //   this.router.navigate(['/usagedetails']); // Redirect if logged in
      // } else {
      // this.authService.login();
      // this.isLoading = true;
      // }
  
  
    }
  
    

  
  
    // async callApi() {
    //   console.log("getting usage report");
    //   this.subscriptionService.getUsageDetails('52435666-b2cb-431f-8490-6f1524da777e', '2024-10-12T22:00:00','2024-10-12T23:00:00')

    // }
    // sync(){
    // //   this.subscriptionService.usageDetails$.subscribe((res) => {
    // //     this.data = res;
    // //   })
    // // }
  

  }


