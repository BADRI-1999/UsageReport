import { Injectable } from '@angular/core';
import { AuthenticationResult, InteractionStatus, PublicClientApplication } from '@azure/msal-browser';

import { MsalService } from '@azure/msal-angular';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;
  instance: any;

  constructor(private msalService: MsalService) {}



  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  setLoginDisplay() {
    this.loginDisplay = this.isLoggedIn();
  }

    // Return the observable from loginPopup()
    login(): Observable<AuthenticationResult> {
      console.log(InteractionStatus)
      return this.msalService.loginPopup().pipe(
        tap((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          this.setLoginDisplay();
          console.log('LoginPopup response received', response);
        }),
        catchError(error => {
          console.error("Error during loginPopup: ", error);  // Log any errors
          return throwError(error);  // Rethrow the error after logging it
        })
      );
    }
    
  // Simplified login function using loginPopup

  // Simplified logout function
  logout() {
    this.msalService.logout();
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }
}
