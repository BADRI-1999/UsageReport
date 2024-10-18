import { Injectable } from '@angular/core';
import { AccountInfo, AuthenticationResult, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  instance: IPublicClientApplication | undefined;
  accessToken = '';
  idToken = '';
  loggedInUser = '';
  loginType = 'msal';
  loggedIn = false
  account!: AccountInfo | null;
  constructor(
    private msalService: MsalService,
    private http: HttpClient,
    private router: Router,
    private config:ConfigService
  ) {
    this.instance = this.msalService.instance;
    // Load configuration from config.json

    this.accessToken = localStorage.getItem(this.accessToken) as string
      
      // Handle Redirect Observable for login
      this.msalService.handleRedirectObservable().subscribe({
        next: (result: AuthenticationResult | null) => {
          if (result) {
            console.log('Login successful:', result);

            // Storing tokens and user details
            this.idToken = result.idToken;
            this.accessToken = result.accessToken;
            this.loggedInUser = result.account.username;
            this.account = result.account
            console.log(this.accessToken)
            msalService.instance.setActiveAccount(this.account)

            localStorage.setItem('idToken', this.idToken);  // Storing idToken in localStorage
            localStorage.setItem('accessToken', this.accessToken);  // Storing accessToken in localStorage
            localStorage.setItem('loginType', this.loginType);  // Storing login type in localStorage
            localStorage.setItem('loggedInUser', this.loggedInUser);  // Storing loggedInUser in localStorage
            this.loggedIn = true
            // Navigate to dashboard
            this.router.navigateByUrl('/usagedetails');
          }
        },
        error: (error) => console.log(error)
      });
    
  }

  // Function to load the configuration from config.json
  

  async login() {  // No need for Observable or returning
         // Set the flag when starting the login process
        try {
            await this.instance?.initialize()
      

          
          console.log("calling login")
          console.log()
          if(this.msalService.instance.getActiveAccount() == null){
          this.msalService.loginRedirect();  
            }
        } catch (error) {
          console.error("MSAL initialization failed: ", error);
          
          // throw error;  // No need for `throwError`, just rethrow the error
        }
      }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  sendData(accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    return this.http.get('http://localhost:3000/api/protected/', { headers });
  }
}






// import { Injectable } from '@angular/core';
// import { AccountInfo, AuthenticationResult, IPublicClientApplication } from '@azure/msal-browser';
// import { MsalService } from '@azure/msal-angular';
// import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private readonly _destroying$ = new Subject<void>();
//   loginDisplay = false;
//   instance: IPublicClientApplication;
//   msalInstance: any;

//   constructor(
//     private msalService: MsalService,
//     private http: HttpClient
//   ) {
//     this.instance = this.msalService.instance;

//     // Handle the redirect promise in the constructor
//     this.instance.handleRedirectPromise().then((result: AuthenticationResult | null) => {
//       if (result) {
//         this.instance.setActiveAccount(result.account);
//         console.log('Login redirect response received', result);
//         this.loginDisplay = true; // Show login display after successful login
//       }
//     }).catch((error) => {
//       console.error('Error handling redirect:', error);
//     });
//   }

//   getAllAccounts(): AccountInfo[] {
//     return this.msalInstance.getAllAccounts();  // Make sure this returns an array of accounts
//   }

//   private loginInProgress: boolean = false;  // Add a flag for login in progress


//   async login(): Promise<void> {  // No need for Observable or returning
//     if (this.loginInProgress) {
//       console.log("Login already in progress, skipping...");
//       return;
//     }

//     this.loginInProgress = true;  // Set the flag when starting the login process
//     try {
//       await this.instance.initialize();

//       // Instead of loginPopup(), use loginRedirect() for redirect login flow
//       this.msalService.loginRedirect();  // This will handle the redirect to the Microsoft login page
//       this.loginInProgress = false;  // Reset the flag after initiating the redirect
//     } catch (error) {
//       console.error("MSAL initialization failed: ", error);
//       this.loginInProgress = false;  // Reset the flag on error
//       throw error;  // No need for `throwError`, just rethrow the error
//     }
//   }



//   logout() {
//     this.msalService.logout();
//   }

//   ngOnDestroy(): void {
//     this._destroying$.next(undefined);
//     this._destroying$.complete();
//   }


//   sendData(accessToken: string) {
//     const headers = {
//       'Authorization': `Bearer ${accessToken}`,  // Add the access token to the Authorization header
//       'Content-Type': 'application/json'         // Optional, depending on the content type
//     };
  
//     return this.http.get('http://localhost:3000/api/protected/',{ headers });
//   }



// }
