// export const b2cConfig = {
//   auth: {
//     clientId: "3ef8457b-ba25-4fe1-b56d-8da715d50fc8",
//     authority:
//       "https://spicustomers.ciamlogin.com/spicustomers.onmicrosoft.com/spi-entra", // ✅ Correct CIAM authority
//     knownAuthorities: ["spicustomers.ciamlogin.com"],
//     redirectUri: "http://localhost:5173", // ✅ must match Azure app registration
//     postLogoutRedirectUri: "http://localhost:5173",
//   },
//   cache: {
//     cacheLocation: "localStorage",
//     storeAuthStateInCookie: false,
//   },
// };


export const b2cConfig = {
  auth: {
    clientId: "3ef8457b-ba25-4fe1-b56d-8da715d50fc8",
    authority: "https://spicustomers.ciamlogin.com/SPiCustomers.onmicrosoft.com", // ✅ exact policy name here
    knownAuthorities: ["spicustomers.ciamlogin.com"],
    redirectUri: "https://react-app-superpi.azurewebsites.net//auth", // ✅ match Azure portal
    postLogoutRedirectUri: "https://react-app-superpi.azurewebsites.net//auth",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};
