import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppStateManageService } from '../states/app-state-manage.service';
import { StoreService } from '../store/store.service';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { StatesService } from '../states/states.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleSigninService {

  //Data type: IdConfiguration
  IdConfiguration: google.accounts.id.IdConfiguration = {
    client_id: this.getCorrectClientId(),
    ux_mode: 'popup',
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: this.googleIdInitilizeResponse,
  }

  isUserAuthenticated: BehaviorSubject<any> = new BehaviorSubject(false);

  isLoading: boolean = false;

  constructor(
    private storeService: StoreService,
    private appStateManageService: AppStateManageService,
    private statesService: StatesService,
    private _router: Router,
    private zone: NgZone
  ) { }

  //The google.accounts.id.initialize method initializes the Sign In With Google client based on the configuration object
  async initGoogleAccounts(): Promise<void> {
    await google.accounts.id.initialize(this.IdConfiguration);
    // console.log('google accaunts initialized');
  }

  /**
  * When your callback function is invoked, a CredentialResponse object
  * is passed as the parameter.
  */
  googleIdInitilizeResponse(response: google.accounts.id.CredentialResponse): void {
    localStorage.setItem('CredentialResponse', JSON.stringify(response));
    let buttonFromDOm = document.getElementById("googleLoginBtn") as HTMLElement;
    if (buttonFromDOm) {
      this.isLoading = false;
      window.location.href = window.location.href.replace('signin', 'home');
    }
  }

  checkIfUserAuthenticated(): boolean {
    //if in app sate exist authInstance
    if (this.storeService.authInstance) {
      this.storeService.isUserSignIn = true;
      this.isLoading = false;
      return true;
    }

    //auto authenticate
    if (!this.storeService.authInstance && this.appStateManageService.getDataFromLocalStorage('CredentialResponse')) {
      this.storeService.authInstance = this.appStateManageService.getDataFromLocalStorage('CredentialResponse');
      this.storeService.isUserSignIn = true;
      this.isLoading = false;
      return true;
    }

    //usar was't autheticated 
    return false;
  }

  async authenticate(): Promise<void> {
    //show loader - spinner
    this.isLoading = true;

    //The google.accounts.id.prompt method displays the One Tap prompt or the browser native credential manager after the initialize() method is invoked
    await google.accounts.id.prompt((notification) => {

      let credentialResponse = this.appStateManageService.getDataFromLocalStorage('CredentialResponse');

      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // continue with another identity provider.
        // console.log(credentialResponse, 'continue with another identity provider');
        // console.log(notification.getNotDisplayedReason(), "The detailed reason why the UI isn't displayed.");

        if (notification.isNotDisplayed() || !notification.isDisplayed()) {
          const buttonDiv = window.document.createElement("div");
          buttonDiv.setAttribute("id", "googleLoginBtn");
          document.getElementsByTagName('body')[0].appendChild(buttonDiv);
          let buttonFromDOm = document.getElementById("googleLoginBtn") as HTMLElement;
          // console.log(buttonDiv, buttonFromDOm, document.getElementsByTagName('body')[0], document.getElementById("googleLoginBtn") as HTMLElement);
          let int = setTimeout(() => {
            google.accounts.id.renderButton(buttonFromDOm, { type: 'standard', size: 'large' });
          }, 300);
        }
      } else {
        if (credentialResponse) {
          this.storeService.isUserSignIn = true;
          this.statesService.isHealth = true;
          this.storeService.authInstance = credentialResponse;
          this.isLoading = false;
          this.isUserAuthenticated.next({ label: true });

          this.zone.run(() => {
            this._router.navigate(["home"]);
          });
        }
        // console.log(this.storeService.authInstance, credentialResponse, 'authenticate promot success')
      }
    });
  }

  // Then use this library method for decoding your access token like this:
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode.default(token);
    } catch (Error) {
      return null;
    }
  }

  //return google clientId according to domain fahrtenbuch.frg-germania.de - prod; dev.frg-germania.de - dev
  getCorrectClientId(): string {
    if (location.href.indexOf('fahrtenbuch.frg-germania.de') !== -1) {
      //master
      return '541247734652-sd07kqiphuij2jul6lbh8kuqnq9f2d8f.apps.googleusercontent.com'
    }
    //dev
    return '541247734652-m1ock7t8t3s666hetqi40puh287nqgjo.apps.googleusercontent.com';
  }

  async signOut(): Promise<void> {
    if (!this.storeService.authInstance) {
      // await this.initGoogleAuth();
    }
    return this.storeService.authInstance?.signOut();
  }
}
