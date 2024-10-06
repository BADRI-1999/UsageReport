import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;
  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}



  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        // Do user account/UI functions here
      })
  }


  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  setLoginDisplay() {
    this.loginDisplay = this.isLoggedIn();
  }

  // Simplified login function using loginPopup
  login() {
    this.msalService.loginPopup().subscribe((response: AuthenticationResult) => {
      this.msalService.instance.setActiveAccount(response.account);
      this.setLoginDisplay(); // Update the display status after login
    });
  }

  // Simplified logout function
  logout() {
    this.msalService.logout();
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
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
