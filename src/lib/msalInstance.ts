// // import { PublicClientApplication } from "@azure/msal-browser";
// // import { b2cConfig } from "./b2cConfig";

// // export const msalInstance = new PublicClientApplication(b2cConfig);
// // await msalInstance.initialize();
// // const msalInstance = new PublicClientApplication(b2cConfig);

// // (async () => {
// //   await msalInstance.initialize();
// // })();

// import { PublicClientApplication } from "@azure/msal-browser";

// export const b2cConfig = {
//   auth: {
//      clientId: "3ef8457b-ba25-4fe1-b56d-8da715d50fc8",
//     authority: "https://spicustomers.ciamlogin.com/SPiCustomers.onmicrosoft.com", // ✅ exact policy name here
//     knownAuthorities: ["spicustomers.ciamlogin.com"],
//     redirectUri: "https://rg-ks-prod-react.azurewebsites.net/auth", // ✅ match Azure portal
//     postLogoutRedirectUri: "https://rg-ks-prod-react.azurewebsites.net/auth",
//   },
//   cache: {
//     cacheLocation: "sessionStorage",
//     storeAuthStateInCookie: false,
//   },
// };

// // ✅ Export this instance so it can be imported in Auth.tsx
// // export const msalInstance = new PublicClientApplication(b2cConfig);

// // // ✅ Initialize it properly (no top-level await)
// // (async () => {
// //   await msalInstance.initialize();
// // })();

import { PublicClientApplication } from "@azure/msal-browser";

export const b2cConfig = {
  auth: {
    clientId: "3ef8457b-ba25-4fe1-b56d-8da715d50fc8",
    authority: "https://spicustomers.ciamlogin.com/SPiCustomers.onmicrosoft.com", // Main authority
    knownAuthorities: ["spicustomers.ciamlogin.com"], // Required for CIAM/B2C
    redirectUri: "https://react-app-superpi.azurewebsites.net/auth", // Must match Azure app registration
    postLogoutRedirectUri: "https://react-app-superpi.azurewebsites.net/auth",
  },
  cache: {
    cacheLocation: "sessionStorage", // or "localStorage" if you prefer persistent sessions
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
export const msalInstance = new PublicClientApplication(b2cConfig);

// Initialize MSAL safely before usage (React doesn’t allow top-level await)
export const initializeMsal = async () => {
  if (!msalInstance.getAllAccounts().length) {
    await msalInstance.initialize();
  }
};
