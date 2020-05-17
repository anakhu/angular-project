export class LoginUser {
  constructor(
    public email: string,
    public id: string,
    // tslint:disable-next-line: variable-name
    private _token: string,
    // tslint:disable-next-line: variable-name
    private _expirationDate: number,
  ) {
  }

  get token() {

    if (this._expirationDate && this._expirationDate >= new Date().getTime()) {
      return this._token;
    }

    return null;
  }
}
