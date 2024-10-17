import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Consumption/usageDetails';

  

  constructor(private http: HttpClient, private msal_service: MsalService, private authService:AuthService,
    private router: Router,
  ) {}

  private usageDetailsSubject = new BehaviorSubject<any>(null); 
  usageDetails$ = this.usageDetailsSubject.asObservable();


  getUsageDetails(subscriptionId: string, usageStart: string, usageEnd: string): Observable<any> {
    console.log("usage start = ", usageStart);
    console.log("usage end = ", usageEnd);
    console.log("Inside GetUsageDetails func", subscriptionId);

    // Acquire token silently with the correct scope
    const account = this.authService.account;
    console.log("account = ", account);

    if (account) {
      return this.msal_service.acquireTokenSilent({
        scopes: ['https://management.azure.com/.default'],
        account
      }).pipe(
        switchMap((response: any) => {
          const token = response.accessToken;
          console.log(token);

          // Construct URL with filter parameters for usageStart and usageEnd
          const urlWithFilter = `${this.apiUrl.replace('{subscriptionId}', subscriptionId)}?$filter=properties/usageStart ge '${usageStart}' and properties/usageEnd le '${usageEnd}'&api-version=2023-03-01`;
          console.log(urlWithFilter);

          // Use the access token to call the API
          return this.http.get(urlWithFilter, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).pipe(
            catchError(error => {
              console.error('Error fetching usage details', error);
              return of(null); // Return null or handle the error as needed
            })
          );
        }),
        // Subscribe to the response and update the subject
        switchMap(data => {
          this.usageDetailsSubject.next(data);
          console.log('Usage details:', data);
          this.router.navigate(['/dashboard']);
          return of(data); // Return the data wrapped in an Observable
        })
      );
    } else {
      this.authService.login();
      return of(null); // Return null or handle as needed if account is not available
    }
  }

}
