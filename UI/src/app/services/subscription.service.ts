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
    'https://management.azure.com/subscriptions/52435666-b2cb-431f-8490-6f1524da777e/resourceGroups/chatbot/providers/Microsoft.Storage/storageAccounts/dhruvabot/providers/microsoft.insights/metrics?api-version=2024-02-01&metricnames=UsedCapacity&aggregation=Average',
    'https://management.azure.com/subscriptions/52435666-b2cb-431f-8490-6f1524da777e/resourceGroups/chatbot/providers/Microsoft.Web/sites/dhruvachatbot/providers/microsoft.insights/metrics?api-version=2024-02-01&metricnames=MemoryWorkingSet&aggregation=Average',
    'https://management.azure.com/subscriptions/52435666-b2cb-431f-8490-6f1524da777e/resourceGroups/chatbot/providers/Microsoft.ContainerRegistry/registries/dhruvacontainer/providers/microsoft.insights/metrics?api-version=2024-02-01&metricnames=TotalPullCount,SuccessfulPullCount,TotalPushCount,SuccessfulPushCount,RunDuration,AgentPoolCPUTime,StorageUsed&aggregation=Average'
  ];
  

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
    const timespan = `PT${hour}H`; // Constructs timespan as PT[hours]H
    const updatedUrls = this.baseUrls.map(url => `${url}&timespan=${timespan}`);

    // Log each updated URL after applying the timespan filter
    updatedUrls.forEach(url => console.log('Updated URL:', url));

    console.log("Inside getusagereportbyHour func");

    // Acquire token silently with the correct scope
    const account = this.authService.account;
  

    if (account) {
      console.log("inside account")
      return this.msal_service.acquireTokenSilent({
        scopes: ['https://management.azure.com/.default'],
        account
      }).pipe(
        switchMap((response: any) => {
          const token = response.accessToken;
          console.log("Token:", token);

          // Map each URL to an HTTP GET request with the token in the headers
          const requests = updatedUrls.map(url =>
            this.http.get(url, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).pipe(
              catchError(error => {
                console.error('Error fetching data from URL:', url, error);
                return of(null); // Return null or handle the error as needed for each URL
              })
            )
          );

          // Execute all requests in parallel and combine the results
          return forkJoin(requests).pipe(
            map((responses: any) => {
              console.log('All responses:', responses); // Log all responses
              this.usageDetailsSubject.next(responses); // Store responses in a subject or other variable
            })
          );
        }),
        // Subscribe to the response and navigate to usagedetails
        switchMap(data => {
          console.log('Final combined data:', data);
          this.router.navigate(['/usagedetails']);
          return of(data); // Return the data wrapped in an Observable
        })
      );
    } else {
      this.authService.login();
      return of(null); // Return null or handle as needed if account is not available
    }
}



}
