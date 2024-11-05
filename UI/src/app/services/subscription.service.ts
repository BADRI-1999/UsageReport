import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
    private apiUrl = 'https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Consumption/usageDetails';
    private baseUrls: string[] = [
      "https://management.azure.com/subscriptions/52435666-b2cb-431f-8490-6f1524da777e/resourceGroups/chatbot/providers/Microsoft.Storage/storageAccounts/dhruvabot/providers/microsoft.insights/metrics?metricnames=Transactions&timespan=2024-10-30T00:00:00Z/2024-10-31T00:00:00Z&aggregation=Count&interval=PT1H&$filter=GeoType eq 'Primary' and (ApiName eq 'Read' or ApiName eq 'Write')&api-version=2019-07-01",
      'https://management.azure.com/subscriptions/52435666-b2cb-431f-8490-6f1524da777e/resourceGroups/chatbot/providers/Microsoft.ContainerRegistry/registries/dhruvacontainer/providers/microsoft.insights/metrics?api-version=2024-02-01&metricnames=StorageUsed',
      'https://management.azure.com/subscriptions/52435666-b2cb-431f-8490-6f1524da777e/resourceGroups/chatbot/providers/Microsoft.RecoveryServices/vaults/vault-ltirtryb/providers/microsoft.insights/metrics?api-version=2024-02-01&metricnames=BackupHealthEvent,RestoreHealthEvent',
      'https://management.azure.com/subscriptions/52435666-b2cb-431f-8490-6f1524da777e/resourceGroups/chatbot/providers/Microsoft.Web/serverFarms/ASP-chatbot-ba4b?api-version=2024-04-01'   ];
    

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
          this.router.navigate(['/usagedetails']);
          return of(data); // Return the data wrapped in an Observable
        })
      );
    } else {
      this.authService.login();
      return of(null); // Return null or handle as needed if account is not available
    }
  }

  getusagereportbyHour(hour: number) {
    

    // Acquire token silently with the correct scope
    const account = this.authService.account;
  

    if (account) {
      console.log("inside account", account)
      return this.msal_service.acquireTokenSilent({
        scopes: ['https://management.azure.com/.default'],
        account
      }).subscribe((response: any )=>{
        console.log("accessstoken",response);
        const token = response.accessToken;

        const responses: (Object | null)[] = []

        for (let i = 0; i < this.baseUrls.length; i++) {

          const request =  this.http.get(this.baseUrls[i], {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).pipe(
            catchError(error => {
              console.error('Error fetching usage details', error);
              return of(null); // Return null or handle the error as needed
            })
          );

          request.subscribe(data => {
            responses.push(data);
            console.log(`Response from ${this.baseUrls[i]}:`, data);
            console.log(this.baseUrls.length,'All responses:', responses.length, );
            if (responses.length === this.baseUrls.length) {
              console.log('All responses:', responses);
              this.usageDetailsSubject.next(responses); // Store all responses in the subject
              // You can navigate or perform additional actions here if needed
            }
          })
         


        }


      }
    
    )
    } else {
      this.authService.login();
      return of(null); 
    }
}



}
