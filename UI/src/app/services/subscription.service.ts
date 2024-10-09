import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Consumption/usageDetails';

  constructor(private http: HttpClient, private authService: MsalService) {}

  // Updated method to include usageStart and usageEnd in $filter
  getUsageDetails(subscriptionId: string, usageStart: string, usageEnd: string) {
    // Acquire token silently with the correct scope
    const account = this.authService.instance.getActiveAccount();
    if (account) {
      this.authService.acquireTokenSilent({
        scopes: ['https://management.azure.com/.default'],
        account
      }).subscribe((response:any) => {
        const token = response.accessToken;

        // Construct URL with filter parameters for usageStart and usageEnd
        const urlWithFilter = `${this.apiUrl.replace('{subscriptionId}', subscriptionId)}?$filter=properties/usageStart ge '${usageStart}' and properties/usageEnd le '${usageEnd}'&api-version=2023-03-01`;
        console.log(urlWithFilter)
        // Use the access token to call the API
        this.http.get(urlWithFilter, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).pipe(
          catchError(error => {
            console.error('Error fetching usage details', error);
            return of(null); // Return null or handle the error as needed
          })
        ).subscribe(data => {
          console.log('Usage details:', data);
        });
      })
    }
  }
}
