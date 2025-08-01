// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  auth_url: "http://localhost:5432/auth",
  administration_url: "http://localhost:5433/admin/app",
  settings_url: "http://localhost:5434/settings/app",
  attestations_url: "http://localhost:5435/attestations/app",
  insured_url: "http://localhost:5436/insured/app",
  production: false
};

// export const environment = {
//   auth_url: "http://localhost:8080/auth",
//   administration_url: "http://localhost:8080/admin/app",
//   settings_url: "http://localhost:8080/settings/app",
//   attestations_url: "http://localhost:8080/attestations/app",
//   insured_url: "http://localhost:8080/insured/app",
//   production: false
// };


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
