// // auth-config.ts

// import { Configuration, LogLevel } from '@azure/msal-browser';

// export const authConfig: Configuration = {
//   auth: {
//     clientId: '4a45d2cc-c1a9-4a76-a31b-b4f5101d1b27',  // Your Azure AD client ID
//       authority: 'https://login.microsoftonline.com/b7dc318e-8abb-4c84-9a6a-3ae9fff0999f',  // Your tenant ID
//       redirectUri: 'http://localhost:4200',
//   },
//   cache: {
//     cacheLocation: 'localStorage',  // Where to store cache (localStorage/sessionStorage)
//     storeAuthStateInCookie: false,  // Set to true for Internet Explorer 11 support
//   },
//   system: {
//     loggerOptions: {
//       loggerCallback: (level: LogLevel, message: string) => {
//         console.log(message);
//       },
//       logLevel: LogLevel.Info,  // Controls the level of logging
//       piiLoggingEnabled: false,
//     }
//   }
// };
