// 


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
  loggedIn = false;
  account!: AccountInfo | null;

  constructor(
    private msalService: MsalService,
    private http: HttpClient,
    private router: Router,
    private config: ConfigService
  ) {
    this.instance = this.msalService.instance;

    // Load configuration from config.json
    this.accessToken = localStorage.getItem(this.accessToken) as string;

    // Handle Redirect Observable for login
    this.msalService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult | null) => {
        if (result) {
          console.log('Login successful:', result);
          this.setUserDetails(result);
        }
      },
      error: (error) => console.log(error)
    });
    
    // Check if a user is already logged in
    this.checkExistingAccount();
  }

  private setUserDetails(result: AuthenticationResult) {
    this.idToken = result.idToken;
    this.accessToken = result.accessToken;
    this.loggedInUser = result.account.username;
    this.account = result.account;

    console.log(this.accessToken);
    this.msalService.instance.setActiveAccount(this.account);

    // Store tokens and user details in localStorage
    localStorage.setItem('idToken', this.idToken);
    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('loginType', this.loginType);
    localStorage.setItem('loggedInUser', this.loggedInUser);
    this.loggedIn = true;

    // Navigate to dashboard
    this.router.navigateByUrl('/usagedetails');
  }

  private checkExistingAccount() {
    const existingAccount = this.msalService.instance.getAllAccounts();

    if (existingAccount.length > 0) {
      console.log("User is already logged in");
      this.account = existingAccount[0]; // Use the first account
      this.msalService.instance.setActiveAccount(this.account);
      this.router.navigateByUrl('/usagedetails'); // Redirect if logged in
    }
  }

  async login() {  
    try {
      await this.instance?.initialize();
      console.log("Calling login");

      // Handle any redirect response
      const redirectResponse = await this.msalService.instance.handleRedirectPromise();
      if (redirectResponse !== null) {
        console.log("Redirect response: ", redirectResponse);
        this.setUserDetails(redirectResponse); // Set user details
        return; // Stop further execution if already logged in
      }

      // Only call loginRedirect if no active account exists
      if (this.msalService.instance.getActiveAccount() == null) {
        console.log("No active account, triggering loginRedirect");
        this.msalService.loginRedirect();
      } else {
        this.account = this.msalService.instance.getActiveAccount();
        console.log("Active account found");
      }
    } catch (error) {
      console.error("MSAL initialization failed: ", error);
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
