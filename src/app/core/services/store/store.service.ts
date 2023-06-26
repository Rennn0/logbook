import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  userData: any;
  //google auth service will store in this variable user gmail
  userEmail: string | undefined;
  authInstance: any;
  isUserSignIn: boolean = false;
  localDate: Date = new Date();

  constructor() { }

  get userLocalDate() {
    return this.localDate;
  }
}
