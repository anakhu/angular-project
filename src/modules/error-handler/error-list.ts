export enum UserErrors {
  'auth/user-disabled' = 1,
  'auth/user-not-found',
  'auth/wrong-password',
  'auth/email-already-in-use',
  'auth/invalid-user-token',
  'auth/user-token-expired',
  'auth/app-not-authorized',
  'auth/network-request-failed',
  'auth/requires-recent-login',
  'auth/too-many-requests',
  'storage/unauthorized',
  'storage/unauthenticated',
  'storage/canceled',
  'api/update-failed',
  'api/write-failed',
  'api/delete-failed',
  'api/push-failed',
}
