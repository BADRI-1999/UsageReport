import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MSAL_INSTANCE, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PublicClientApplication } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;
  tokenExpiration: string = '';
  isInteractionInProgress: boolean | undefined;
  constructor(
    private authService: AuthService,
    private msalBroadcastService: MsalBroadcastService,
    @Inject(MSAL_INSTANCE) private msalInstance: PublicClientApplication
  ) {}

  clearMsalCache() {
    this.msalInstance.clearCache();  
    console.log("MSAL cache cleared.");
  }

  

  ngOnInit(): void {
    console.log("init")
    // Track interaction status using MsalBroadcastService
    this.msalBroadcastService.inProgress$
      .pipe(
        takeUntil(this._destroying$)
      )
      .subscribe((status: InteractionStatus) => {
        this.isInteractionInProgress = status !== InteractionStatus.None;
        console.log("Is interaction in progress:", this.isInteractionInProgress);
      });

     
  }
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }


  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  login() {
    console.log("Attempting login");
  
    // Check interaction status to avoid calling login during an ongoing interactive process
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => {
          if (status !== InteractionStatus.None) {
            console.log("Interaction already in progress, waiting for completion...");
            return false;  // Prevent login if interaction is in progress
          }
          return true;  // Proceed if no interaction is in progress
        }),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        console.log("No interaction in progress, proceeding with login");
  
        // Call the login method from your auth service
        this.authService.login().subscribe({
          next: () => {
            console.log('Login successful');
          },
          error: (error) => {
            console.error("Login error: ", error);  // Handle login errors
          }
        });
      }, error => {
        console.error("Interaction status check error: ", error);  // Handle any errors in the status check
      });
  }
  
  

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }


}






// import { Component } from '@angular/core';
// import { MsalService } from '@azure/msal-angular';
// import { AuthenticationResult } from '@azure/msal-browser';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'microsftauth-app';

//   constructor( private msalService: MsalService){
//   }

  

//   login() {
//     this.msalService.loginPopup().subscribe((Response: AuthenticationResult)=>{
//       this.msalService.instance.setActiveAccount(Response.account)
//     });

//   }

//   logout() {
//     this.msalService.logout();
//   }


//   isLoggedIn(): boolean{
//     return this.msalService.instance.getActiveAccount() != null;
//   }
// }
