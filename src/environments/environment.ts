// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiKey: 'AIzaSyD90egq99G-2w7lAIwKRdfmIpXkJrSbbCE',
  authDomain: 'online-academy-afe54.firebaseapp.com',
  databaseURL: 'https://online-academy-afe54.firebaseio.com',
  signUpUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
  loginUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
  deleteAccountUrl: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=',
  refreshTokenUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=',
  projectId: 'online-academy-afe54',
  appId: '1:1036149137733:web:a696ce537954296145de2c',
  storageBucket: 'online-academy-afe54.appspot.com',
};

export const routes = {
  users: 'users',
  courses: 'courses',
  followers: 'followers',
  comments: 'comments',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
