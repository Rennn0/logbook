import { Injectable } from '@angular/core';
import { formFieldsObjectInterface } from '../../interfaces/formFieldsObject.interface';
import * as moment from 'moment-timezone';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { StoreService } from '../store/store.service';
import { AppStateManageService } from '../states/app-state-manage.service';
import { DataService } from '../data/data.service';
import { GoogleSigninService } from '../google-auth/google-signin.service';
import { StatesService } from '../states/states.service';
import { wordsMaster } from '../../mocks/language.mock';
/**
 * class for base function
 */


interface GerTitle {
  [key: string]: string; // explicitly define the keys as strings
}

@Injectable({
  providedIn: 'root',
})
export class FunctionalService {
  subscription: Subscription = new Subscription();

  //
  constructor(
    private storeService: StoreService,
    private appStateManageService: AppStateManageService,
    private dataService: DataService,
    private googleSigninService: GoogleSigninService,
    private statesService: StatesService,
  ) { }

  // return keys of any object
  getResponseDataKeys(data: any[]): any {
    return Object.keys(data);
  }

  //return index if in array exist this property
  returnIndexInArray(
    array: formFieldsObjectInterface[],
    property: string
  ): number {
    return array.findIndex((x) => x.formControlName === property);
  }

  //
  textTransform(index: number, args: string[]) {
    index = Number(index) - 1;
    return args[index];
  }

  returnBoatSeatsTitleOnGer(title: string): string {
    const gerTitle: GerTitle = {
      "1": wordsMaster.wordEiner,
      "3": wordsMaster.wordDreier,
      "2": wordsMaster.wordZweier,
      "5": wordsMaster.wordFunfer,
      "4": wordsMaster.wordVierer,
      "8": wordsMaster.wordAchter,
      "Venezianer": wordsMaster.wordVenezianer,
      "Coastal": wordsMaster.wordCostal,
      "SUP": wordsMaster.wordSup
    };
    return gerTitle[title] || "";
  }

  //
  returnCompetency(data: any): string[] {
    let objectKeysArray = Object.keys(data);
    let toReturnArray: string[] = [];

    objectKeysArray.forEach((x) => {
      if (data[x]) {
        toReturnArray.push(x);
      }
    });

    return toReturnArray;
  }


  //
  isUserAdmin(data?: any): boolean {
    if (data && data.role === 'ADMIN') {
      return true;
    }
    return false
  }

  //
  textTransformIndex(index: number, args: string[]) {
    index = Number(index);
    return args[index];
  }

  //refresh page
  refresh(): void {
    window.location.reload();
  }

  //
  base64toBlob(base64Data: any, contentType: any) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  //
  validationOfCharacterLength(character: string, length: number): boolean {
    if (character.length === length) {
      return true;
    } else {
      return false;
    }
  }

  //
  validationOfLatinAndNumbers(event: any): boolean {
    let reg = new RegExp(/^[\w-_.]*$/);
    if (reg.test(event)) {
      return true;
    } else {
      return false;
    }
  }

  //
  returnDateToUTC(dateString: string): any {
    let date = new Date(dateString);
    let utcTimeStemp =
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      ) / 1000;
    return utcTimeStemp;
  }

  //
  returnDateFromUTC(dateUnix: any, isMilliseconds: boolean): any {
    let timezone, formatedDate;
    //timzone
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    //Berlin time zone - Europe/Berlin
    if (!isMilliseconds) {
      formatedDate = moment
        .tz(dateUnix, timezone)
        .format('yyyy-MM-DDTHH:mm:ss.SSSZ');
    } else {
      formatedDate = moment
        .tz(dateUnix * 1000, timezone)
        .format('yyyy-MM-DDTHH:mm:ss.SSSZ');
    }

    return formatedDate;
  }

  //
  validationOfNumber(event: any): boolean {
    let reg = new RegExp(/^\d+$/);
    if (reg.test(event)) {
      return true;
    } else {
      return false;
    }
  }

  //
  getBackSpaceDateFromat(value: string, fromFormat: string): string {
    if (value) {
      let splidetFromFormat = fromFormat.split('-');
      let splidetValue = value.split('-');

      let ddIndexInFromt = splidetFromFormat.indexOf('dd');
      let mmIndexInFromt = splidetFromFormat.indexOf('mm');
      let yIndexInFromt = splidetFromFormat.indexOf('yyyy');

      let returnValue = [
        splidetValue[yIndexInFromt],
        splidetValue[mmIndexInFromt],
        splidetValue[ddIndexInFromt],
      ];
      // console.log(returnValue);
      return returnValue.join('-');
    } else {
      return '';
    }
  }

  //check if user exist on our datebase
  checkIfUserExist(email: string): Promise<any> {
    const url = `${environment.API}users/login`;

    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.dataService
          .putRequest(url, { email: email })
          .subscribe(
            (Response) => {
              // console.log(Response, 'checkIfUserExist');
              this.storeService.userData = Response.body.user;
              this.appStateManageService.setDataInLocalStorage(
                'logbookUserAuthData',
                Response.body.user
              );

              //emit to check if user is admin 
              this.statesService.isHeaderAdminFunctionsReadyToCheckEvent$.next(true);

              resolve(Response);
            },
            (error) => {
              console.log(error);
              reject(error);
            }
          )
      );
    });
  }

  //
  onTokenExpiredGoToSignIn(error: any) {
    console.log(error.status, '-*******************-');
    if (error.status === 401) {
      console.log('Unauthorized');
      this.appStateManageService.removeDataFromLocalStorage('CredentialResponse');
      //try auto authentication
      this.googleSigninService.authenticate();
      // this._router.navigate(['sign-in']);
    }
  }

  //
  checkingRequiredObjectFields(data: any): void {
    if (data.length) {
      data.forEach((x: any) => {
        fieldLogic(x, this.isObjectEmpty, this.isFieldEmpty);
      });
    } else {
      fieldLogic(data, this.isObjectEmpty, this.isFieldEmpty);
    }

    function fieldLogic(x: any, isObjectEmpty: any, fieldEmpty: any) {
      console.log(x);
      if (
        x.isRequiredProperty &&
        !x.isDisabled &&
        !x.isNoSelected &&
        fieldEmpty(x, isObjectEmpty)
      ) {
        x.isRequired = true;
      } else {
        if (x.isRequired != undefined) {
          x.isRequired = false;
        }
      }
    }
  }

  //
  checkIfArrayIsEmpty(array: any[]): any {
    console.log(array, array.length, array[0] === '');
    if (array.length === 1 && array[0] === '') {
      array = [];
      return array;
    } else {
      return array;
    }
  }

  //
  isFieldEmpty(fieldObject: any, isObjectEmpty: any): boolean {
    //
    if (fieldObject.value === null) {
      return false;
    }

    if (
      (typeof fieldObject.value === 'string' && fieldObject.value === '') ||
      fieldObject.value.length === 0 ||
      (fieldObject.value.length && fieldObject.value[0] === '') ||
      (typeof fieldObject.value === 'object' &&
        !!isObjectEmpty(fieldObject.value))
    ) {
      return true;
    } else {
      return false;
    }
  }

  //email validation
  isValidEmail(email: string) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  //
  isDuplicationInArray(arr: any): boolean {
    let duplicates = [];

    const tempArray = [...arr].sort();

    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i + 1] === tempArray[i]) {
        duplicates.push(tempArray[i]);
      }
    }

    if (duplicates.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  //
  isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  //
  getRouterSegment(identifier: string, index: number): string {
    let indexOfIdentifier = window.location.href.split('/').indexOf(identifier);
    return window.location.href.split('/')[indexOfIdentifier - index];
  }
}
