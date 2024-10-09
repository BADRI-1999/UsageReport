import { Injectable } from '@angular/core';
import { AccountInfo, AuthenticationResult, IPublicClientApplication } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;
  instance: IPublicClientApplication;
  msalInstance: any;

  constructor(
    private msalService: MsalService,
    private http: HttpClient
  ) {
    this.instance = this.msalService.instance;
  }

  getAllAccounts(): AccountInfo[] {
    return this.msalInstance.getAllAccounts();  // Make sure this returns an array of accounts
  }

  private loginInProgress: boolean = false;  // Add a flag for login in progress

  async login(): Promise<Observable<AuthenticationResult>> {
    if (this.loginInProgress) {
      console.log("Login already in progress, skipping...");
      return throwError(() => new Error("Login already in progress"));
    }

    this.loginInProgress = true;  // Set the flag when starting the login process
    try {
      await this.instance.initialize();

      return this.msalService.loginPopup().pipe(
        tap((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          console.log('LoginPopup response received', response);
          this.loginInProgress = false;  // Reset the flag after login
          this.loginDisplay = true
        }),
        catchError(error => {
          console.error("Error during loginPopup: ", error);
          this.loginInProgress = false;  // Reset the flag on error
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error("MSAL initialization failed: ", error);
      this.loginInProgress = false;  // Reset the flag on error
      return throwError(() => error);
    }
  }



  logout() {
    this.msalService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }


  sendData(accessToken: string) {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,  // Add the access token to the Authorization header
      'Content-Type': 'application/json'         // Optional, depending on the content type
    };
  
    return this.http.get('http://localhost:3000/api/protected/',{ headers });
  }



}
