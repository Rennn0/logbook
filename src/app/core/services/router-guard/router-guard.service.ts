import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { GoogleSigninService } from '../google-auth/google-signin.service';
import Swal from 'sweetalert2';
import { FunctionalService } from '../functions/functional.service';
import { StoreService } from '../store/store.service';
import { AppStateManageService } from '../states/app-state-manage.service';
import { wordsMaster } from '../../mocks/language.mock';

@Injectable({
  providedIn: 'root',
})
export class RouterGuardService implements CanActivate {
  constructor(private _router: Router, private googleAuthService: GoogleSigninService, private functionalService: FunctionalService, private storeService: StoreService, private appStateManageService: AppStateManageService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {

      if (this.googleAuthService.checkIfUserAuthenticated()) {
        this.functionalService.checkIfUserExist(
          this.googleAuthService.getDecodedAccessToken(this.storeService.authInstance.credential).email
        ).then((response) => {
          // console.log(response);
          res(true);
        }).catch((error) => {
          this.storeService.authInstance = null,
            this.storeService.userData = null;
          this.appStateManageService.removeDataFromLocalStorage('CredentialResponse');
          this.appStateManageService.removeDataFromLocalStorage('logbookUserAuthData');
          this._router.navigate(["signin"]);
          console.log(error, 'checkIfUserExist error');
          res(false);
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops... routerGuard',
          text: wordsMaster.guardErrorTitle
        })
        this._router.navigate(["signin"]);
        res(false);
      }
    });
  }
}
