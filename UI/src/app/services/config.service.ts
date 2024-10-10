// // auth-config.ts

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Configuration } from '@azure/msal-browser';
// import {  firstValueFrom } from 'rxjs';


// @Injectable({
//   providedIn: 'root'
// })
// export class AuthConfigService {
//     private configUrl = '/assets/config.json';
//     private config: Configuration | null = null;
  
//     constructor(private http: HttpClient) {}
  
//     loadConfig(): Promise<Configuration> {
//       return firstValueFrom(this.http.get<Configuration>(this.configUrl)).then(config => {
//         this.config = {
//           auth: {
//             clientId: this.configUrl.client_id,
//             authority: `https://login.microsoftonline.com/${config.tenantId}`,
//             redirectUri: config.redirectUri,
//           },
//           cache: {
//             cacheLocation: config.cacheLocation,
//             storeAuthStateInCookie: config.storeAuthStateInCookie,
//           }
//         };
//         return this.config;
//       });
//     }

//   getConfig(): Configuration {
//     if (!this.config) {
//       throw new Error('Configuration not loaded.');
//     }
//     return this.config;
//   }
// }

