import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  formControlNames,
  formControlTypes,
} from 'src/app/core/enums/form_control_types.enum';
import {
  dropDowns,
  formElementsIndex,
  SessionWindowEnum,
} from 'src/app/core/enums/session_window.enum';
import { formFieldsObjectInterface } from 'src/app/core/interfaces/formFieldsObject.interface';
import { sessionEventTypeDataInterface } from 'src/app/core/interfaces/session-window.interface';
import { DataService } from 'src/app/core/services/data/data.service';
import { FunctionalService } from 'src/app/core/services/functions/functional.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';
import { wordsMaster } from 'src/app/core/mocks/language.mock';
import { StoreService } from 'src/app/core/services/store/store.service';
import { LockStatusEnum } from 'src/app/core/enums/boats.status.enum';

@Component({
  selector: 'app-session-window',
  templateUrl: './session-window.component.html',
  styleUrls: ['./session-window.component.scss'],
})
export class SessionWindowComponent implements OnInit, OnDestroy {
  //
  @Input() display: boolean = false;

  //
  @Input() choosenBoatData: any;

  //
  @Input() formFields: formFieldsObjectInterface[] = [];

  //
  @Input() sessionWindowType: number = 0;

  @Input() title: string = 'Fahrt beginnen';

  @Input() lockStatus = LockStatusEnum.locked;

  //
  @Output() closeSessionWinidowEvent: EventEmitter<boolean> =
    new EventEmitter();

  //
  @Output() sessionWindowEvent: EventEmitter<sessionEventTypeDataInterface> =
    new EventEmitter();

  //
  choosenBoatServerData: any;

  subscription: Subscription = new Subscription();

  isStartAndEndDateFieldsDisplayHidden: boolean = true;

  isLoaded: boolean = false;

  publicSessionWindowEnum = SessionWindowEnum;

  publicLanguageGer = wordsMaster;

  bookedHours: string[] = [];

  chairmanValues: any = [];

  //cox list and variables for it
  steuermannValues: any = [];

  filteredCox: any = [];

  selectedCoxFullName: string = '';

  isCoxDropDownDisplayActive: boolean = false;

  //***** */

  foundUserList: any[] = [];

  gustsIndexList: any[] = []; // to be removed

  gustsFullList: any[] = [];

  teamMembersList: any = [];

  foundUsersList: any[] = [];

  activeSuggestIndex: any;

  publicformElementsIndex = formElementsIndex;

  debounceTimeInterval: any;

  isCrewDisabled: boolean = false;

  isCox: boolean = false;

  date: any;

  isFormDisabled: boolean = false;

  minTime: string = '';

  maxTime: string = '';

  timeDisplay: string = '';
  startDate: string = '';
  startDateDisplay: string = '';

  selectedObman: string = '';
  externalObmanIndex: string = '';
  externalCoxIndex: string = '';
  selectedRoute: string = '';
  selectedCategoryType: string = '';
  selectedCategories: string = '';
  isDropDownDisplay: any;
  publicDropDowns = dropDowns;

  //
  minEndTime: string = '';

  maxEndTime: string = '';

  timeEndDisplay: string = '';

  isRideSelectUpdated: boolean = false;

  //
  errorMessages: string[] = [];

  rideTypeValues: any = [
    { name: 'Normale Fahrt', value: 'NORMAL' },
    { name: 'Training', value: 'TRAINING' },
    { name: 'Wanderfahrt', value: 'HIKING' },
    { name: 'Regatta', value: 'RACE' },
  ];

  //
  categoryTypes: any[] = [
    {
      name: 'RENNBOOT',
      value: 'RENNBOOT',
    },
    {
      name: 'GIGBOOT',
      value: 'GIGBOOT',
    },
    {
      name: 'COASTAL',
      value: 'COASTAL',
    },
    {
      name: 'VENEZIANER',
      value: 'VENEZIANER',
    },
  ];

  categories: any[] = [];

  //distance lists - array include key value object, this list items are rendered in session window in distance select
  routeList: any = [
    { name: 'Gerbermühle(6 km)', value: '6 km' },
    { name: 'Osthafen(4 km)', value: '4 km' },
    { name: 'Westhafen(4 km)', value: '4 km' },
    { name: 'Doppelbrücke(6 km)', value: '6 km' },
    { name: 'Autobahnbrücke(8 km)', value: '8 km' },
    { name: 'Griesheim (12 km)', value: '12 km' },
    { name: 'Griesheim kleines Pendel (14 km)', value: '14 km' },
    { name: 'Griesheim großes Pendel (16 km)', value: '16 km' },
    { name: 'Gerbermühle (8 km)', value: '8 km' },
    { name: 'Gerbermühle ein Pendel (12 km)', value: '12 km' },
    { name: 'Gerbermühle zwei Pendel (16 km)', value: '16 km' },
    { name: 'Gerbermühler kleiner pendel (10 km)', value: '10 km' },
  ];

  indexRouteList: number | undefined;

  sessionForm: FormGroup = new FormGroup({});

  //
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.classList.contains('out-box--click')) {
      this.isDropDownDisplay = undefined;
    }
  }

  constructor(
    public functionalService: FunctionalService,
    private dataService: DataService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    // console.log(this.sessionWindowType);
    if (this.sessionWindowType === SessionWindowEnum.startSession) {
      this.preFill()
        .then((response) => {
          // console.log(response.body, 'preFill - ngOnInit');

          this.isCox = response.body.isCoxed;

          // this.getObmann();

          if (this.isCox) {
            this.getSteuermann();
          }

          this.addSessionFormControlAccordingToConfig();

          this.getServerDate().then(() => {
            this.setStartValue(this.choosenBoatData, response.body.booking);
            //show form in template
            this.isLoaded = true;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.sessionWindowType === SessionWindowEnum.forgottenBoatSession) {
      this.preFill()
        .then((response) => {
          // console.log(response.body, 'preFill - ngOnInit');

          this.isCox = response.body.isCoxed;

          // this.getObmann();

          if (this.isCox) {
            this.getSteuermann();
          }

          this.addSessionFormControlAccordingToConfig();

          this.getServerDate(true).then(() => {
            this.setStartValue(
              this.choosenBoatData,
              response.body.booking,
              true
            );
            //show form in template
            this.isLoaded = true;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.sessionWindowType === SessionWindowEnum.finishSession) {
      this.getBoatSessionData()
        .then((response) => {
          console.log(
            response.body,
            response.body.session.cox,
            'preFill - ngOnInit'
          );

          if (response.body.session.cox) {
            this.isCox = true;
          } else {
            this.isCox = false;
          }

          this.addSessionFormControlAccordingToConfig();

          this.setfinishValue(this.choosenBoatData, response.body.session);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.sessionWindowType === SessionWindowEnum.editStartedBoatSession) {
      this.getBoatSessionData()
        .then((response) => {
          console.log(
            response.body,
            response.body.session.cox,
            'preFill - ngOnInit'
          );

          if (response.body.session.cox) {
            this.isCox = true;
          } else {
            this.isCox = false;
          }

          this.addSessionFormControlAccordingToConfig();

          this.setEditValue(this.choosenBoatData, response.body.session);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.sessionWindowType === SessionWindowEnum.cancelSession) {
      this.getBoatSessionData()
        .then((response) => {
          console.log(
            response.body,
            this.choosenBoatData,
            'preFill - ngOnInit'
          );

          this.addSessionFormControlAccordingToConfig();

          // this.setfinishValue(this.choosenBoatData, response.body.session);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.sessionWindowType === SessionWindowEnum.lockBoatSession) {
      console.log(this.choosenBoatData, this.choosenBoatData._id);
      this.addSessionFormControlAccordingToConfig();
      this.isLoaded = true;
    }

    if (this.sessionWindowType === SessionWindowEnum.unlockBoatSession) {
      console.log(this.choosenBoatData, this.choosenBoatData._id);
      this.addSessionFormControlAccordingToConfig();
      this.isLoaded = true;
    }

    if (this.sessionWindowType === SessionWindowEnum.externalBoatSession) {
      console.log('external session');

      this.addSessionFormControlAccordingToConfig();

      this.isLoaded = true;
    }

    this.filteredCox = this.steuermannValues;
  }

  //add data functions
  preFill(): Promise<any> {
    const url = `${environment.API}sessions/prefill`;

    if (this.choosenBoatData === undefined) {
      return new Promise((resolve, reject) => {
        reject(false);
      });
    }

    let body = {
      boat: this.choosenBoatData._id,
    };

    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.dataService.getData(url, body).subscribe(
          (Response) => {
            // console.log(Response);
            this.choosenBoatServerData = Response.body;

            this.bookedHours = Response.body.bookedHours;
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

  //according to boat seats count add seats fields
  addSessionFormControlAccordingToConfig(): void {
    this.formFields.forEach((x) => {
      if (x.controlType === formControlTypes.formControl) {
        this.sessionForm.addControl(x.formControlName, new FormControl(''));
      } else {
        this.sessionForm.addControl(x.formControlName, new FormArray([]));
      }
    });

    if (this.isCox) {
      this.sessionForm.addControl('cox', new FormControl(''));
    }
  }

  /***********get data functions */
  getBoatSessionData(): Promise<any> {
    const url = `${environment.API}sessions/boat/${this.choosenBoatData._id}`;

    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.dataService.getData(url).subscribe(
          (Response) => {
            this.choosenBoatServerData = Response.body;

            console.log(this.choosenBoatServerData, 'getBoatSessionData');
            //show form in template
            this.isLoaded = true;
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

  getObmann(): void {
    const url = `${environment.API}boats/${this.choosenBoatData._id}/helper`;

    const body = {
      limit: 1000,
      page: 1,
    };

    console.log(url, body);
    // return;
    // return new Promise((resolve, reject) => {
    this.subscription.add(
      this.dataService.getData(url, body).subscribe(
        (Response) => {
          Response.body.users.forEach((x: any) => {
            this.chairmanValues.push({ name: x.firstName, id: x._id });
          });
        },
        (error) => {
          console.log(error);
        }
      )
    );
    // });
  }

  getSteuermann(): void {
    const url = `${environment.API}users/cox`;

    const body = {
      limit: 1000,
      page: 1,
    };

    // console.log(url, body);
    // return;
    // return new Promise((resolve, reject) => {
    this.subscription.add(
      this.dataService.getData(url, body).subscribe(
        (Response) => {
          // console.log(Response, '--------------------');

          Response.body.users.forEach((x: any) => {
            this.steuermannValues.push({
              name: x.firstName,
              lastName: x.lastName,
              id: x._id,
            });
          });
          //show form in template
          this.isLoaded = true;
        },
        (error) => {
          console.log(error);
        }
      )
    );
    // });
  }

  async getServerDate(isMinTimeDisabled = false): Promise<Date> {
    const url: string = `${environment.API}users/current-time`;

    try {
      const response = await this.dataService.getData(url).toPromise();
      const formatedDate = moment
        .tz(
          response.body.time * 1000,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        )
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ');

      this.date = new Date(formatedDate);
      if (!isMinTimeDisabled) {
        this.minTime = moment(this.date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      }
      return this.date;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /*********** set - configuration functions */
  setStartValue(
    choosenBoatData: any,
    responseBookingData?: any,
    isForgotten?: boolean
  ): void {
    let choosenBoatDataKeysArray = Object.keys(choosenBoatData);

    //set boat name
    let boatNameIndex = choosenBoatDataKeysArray.indexOf('name');
    if (boatNameIndex !== -1) {
      this.sessionForm.controls[formControlNames.boatNameControler].setValue(
        this.choosenBoatData[choosenBoatDataKeysArray[boatNameIndex]]
      );
    }

    if (this.bookedHours.length) {
      let formatedDate = this.functionalService.returnDateFromUTC(
        Number(this.bookedHours[0]),
        true
      );
      // console.log(formatedDate, 'set max date');
      let t = new Date(formatedDate);
      this.maxTime = moment(t).format('yyyy-MM-DDTHH:mm:ss.SSSZ');
      if (isForgotten) {
        this.maxEndTime = moment(t).format('yyyy-MM-DDTHH:mm:ss.SSSZ');
      }
    } else {
      let changeLocalTime = moment(new Date(this.date));
      let date = moment(changeLocalTime, 'ddd MMM D YYYY HH:mm:ss ZZ');
      date.set({ h: 24, m: 0 });
      this.maxTime = moment(date).format('yyyy-MM-DDTHH:mm:ss.SSSZ');
      if (isForgotten) {
        this.maxEndTime = moment(date).format('yyyy-MM-DDTHH:mm:ss.SSSZ');
      }
    }

    //set road type
    if (!responseBookingData) {
      // console.log(
      //   this.sessionForm.controls[formControlNames.rideTypeControler],
      //   '--------------------'
      // );
      this.sessionForm.controls[formControlNames.rideTypeControler].setValue(
        this.rideTypeValues[1].value
      );

      //set date
      this.sessionForm.controls[formControlNames.startDateControler].setValue(
        moment(this.date).format('YYYY-MM-DD')
      );

      this.startDate = moment(this.date).format('DD.MM.yyyy');

      //set clock
      this.sessionForm.controls[formControlNames.startClockControler].setValue(
        moment(this.date).format('yyyy-MM-DDTHH:mm:ss.SSSZ')
      );

      this.timeDisplay = moment(this.date).format('HH:mm');

      // console.log(this.sessionForm.controls[formControlNames.startClockControler], moment(this.date).format('hh:mm:ss'));

      //disable crew
      this.isCrewDisabled = false;
    } else {
      //set date
      this.sessionForm.controls[formControlNames.startDateControler].setValue(
        moment(
          this.functionalService.returnDateFromUTC(
            responseBookingData.date,
            true
          )
        ).format('YYYY-MM-DD')
      );

      this.startDate = moment(
        this.functionalService.returnDateFromUTC(responseBookingData.date, true)
      ).format('DD.MM.yyyy');

      //set clock
      this.sessionForm.controls[formControlNames.startClockControler].setValue(
        moment(
          this.functionalService.returnDateFromUTC(
            responseBookingData.date,
            true
          )
        ).format('hh:mm:ss')
      );

      this.timeDisplay = moment(
        this.functionalService.returnDateFromUTC(responseBookingData.date, true)
      ).format('HH:mm');

      //disable crew input fields if not forgotten window
      if (!isForgotten) {
        //disable crew input fields
        this.isCrewDisabled = true;
      }
    }

    //Lfd. Nr
    if (this.choosenBoatServerData) {
      this.sessionForm.controls[formControlNames.LfdControler].setValue(
        this.choosenBoatServerData.sessionNumber
      );
      // this.sessionForm.controls[formControlNames.chairmanControler].setValue(this.chairmanValues.push({name: x.firstName, id: x._id})[0].name);
    }

    // console.log(responseBookingData);
    //set boat seats
    let boatSeatsIndex = choosenBoatDataKeysArray.indexOf('seats');
    let crewIndex = 0;

    if (boatNameIndex !== -1) {
      this.teamMembersList = this.sessionForm.get(
        formControlNames.teamControler
      ) as FormArray;
      // console.log(choosenBoatDataKeysArray[boatSeatsIndex]);
      for (
        let i = 0;
        i < this.choosenBoatData[choosenBoatDataKeysArray[boatSeatsIndex]];
        i++
      ) {
        if (responseBookingData && i === 0 && !isForgotten) {
          this.teamMembersList.push(
            new FormControl(
              `${responseBookingData.instigator.firstName} ${responseBookingData.instigator.lastName}`
            )
          );
          this.selectedObman = `${responseBookingData.instigator.firstName} ${responseBookingData.instigator.lastName}`;
          this.foundUsersList.push(responseBookingData.instigator);
          this.chairmanValues.push({
            name: responseBookingData.instigator.firstName,
            lastName: responseBookingData.instigator.lastName,
            id: responseBookingData.instigator._id,
            isSelected: true,
          });
          this.sessionForm.controls[
            formControlNames.chairmanControler
          ].setValue(responseBookingData.instigator._id);
        } else if (responseBookingData && i !== 0 && !isForgotten) {
          // console.log('---------------------');
          this.teamMembersList.push(
            new FormControl(
              `${responseBookingData.crew[crewIndex].firstName} ${responseBookingData.crew[crewIndex].lastName}`
            )
          );
          this.foundUsersList.push(responseBookingData.crew[crewIndex]);
          this.chairmanValues.push({
            name: responseBookingData.crew[crewIndex].firstName,
            lastName: responseBookingData.crew[crewIndex].lastName,
            id: responseBookingData.crew[crewIndex]._id,
            isSelected: false,
          });
          crewIndex++;
        } else {
          this.teamMembersList.push(new FormControl(''));
        }
      }
      // this.sessionForm.controls.team.setValue(this.choosenBoatData[choosenBoatDataKeysArray[boatNameIndex]]);
    }
    // console.log(crewIndex);
  }

  setTimeDisplay(time: any): void {
    console.log(time);
    this.timeDisplay = moment(time.value).format('HH:mm');
  }

  setStartDateDisplay(time: any): void {
    this.startDate = moment(time.value).format('DD.MM.yyyy');

    this.minEndTime = moment(time.value).format('yyyy-MM-DDTHH:mm:ss.SSSZ');
  }

  //
  setEndTimeDisplay(time: any): void {
    this.timeEndDisplay = moment(time.value).format('DD.MM.yyyy HH:mm');
  }

  setfinishValue(choosenBoatData: any, responseData?: any): void {
    let choosenBoatDataKeysArray = Object.keys(choosenBoatData);

    //set boat name
    let boatNameIndex = choosenBoatDataKeysArray.indexOf('name');
    if (boatNameIndex !== -1) {
      this.sessionForm.controls[formControlNames.boatNameControler].setValue(
        this.choosenBoatData[choosenBoatDataKeysArray[boatNameIndex]]
      );
    }

    //Lfd. Nr
    if (responseData) {
      this.sessionForm.controls[formControlNames.LfdControler].setValue(
        responseData.sessionNumber
      );

      // set helper
      this.sessionForm.controls[formControlNames.chairmanControler].setValue(
        responseData.helper._id
      );
      this.chairmanValues.push({
        name: responseData.helper.firstName,
        lastName: responseData.helper.lastName,
        id: responseData.helper._id,
        isSelected: true,
      });

      this.selectedObman = `${responseData.helper.firstName} ${responseData.helper.lastName}`;
      this.sessionForm.controls[formControlNames.chairmanControler].setValue(
        responseData.helper._id
      );

      //set Steuermann
      if (responseData.cox) {
        this.sessionForm.controls['cox'].setValue(responseData.cox._id);
        this.selectedCoxFullName = `${responseData.cox.firstName} ${responseData.cox.lastName}`;
      }

      //set road type
      this.sessionForm.controls[formControlNames.rideTypeControler].setValue(
        responseData.sessionType
      );

      //set route
      this.sessionForm.controls[formControlNames.destinationControler].setValue(
        responseData.route
      );
      this.selectedRoute = responseData.route;

      //set distanceControler
      this.sessionForm.controls[formControlNames.distanceControler].setValue(
        responseData.distance
      );

      //set date
      this.sessionForm.controls[formControlNames.startDateControler].setValue(
        moment(
          this.functionalService.returnDateFromUTC(responseData.startDate, true)
        ).format('YYYY-MM-DD')
      );

      this.startDate = moment(
        this.functionalService.returnDateFromUTC(responseData.startDate, true)
      ).format('DD.MM.yyyy');

      //set clock
      this.sessionForm.controls[formControlNames.startClockControler].setValue(
        moment(
          this.functionalService.returnDateFromUTC(responseData.startDate, true)
        )
      );

      this.timeDisplay = moment(
        this.functionalService.returnDateFromUTC(responseData.startDate, true)
      ).format('HH:mm');

      this.minEndTime = moment(
        this.functionalService.returnDateFromUTC(responseData.startDate, true)
      ).format('yyyy-MM-DDTHH:mm:ss.SSSZ');

      console.log(
        this.minEndTime,
        responseData.startDate,
        '==========================='
      );

      //set comment
      // this.sessionForm.controls[formControlNames.commentControler].setValue(responseData.comment);
    }

    //set boat seats
    let boatSeatsIndex = choosenBoatDataKeysArray.indexOf('seats');
    if (boatNameIndex !== -1) {
      this.teamMembersList = this.sessionForm.get(
        formControlNames.teamControler
      ) as FormArray;
      console.log(choosenBoatDataKeysArray[boatSeatsIndex]);
      for (
        let i = 0;
        i < this.choosenBoatData[choosenBoatDataKeysArray[boatSeatsIndex]];
        i++
      ) {
        if (responseData.crew[i]) {
          this.teamMembersList.push(
            new FormControl(
              `${responseData.crew[i].firstName} ${responseData.crew[i].lastName}`
            )
          );
        }

        if (responseData.guests[i]) {
          // let seatsContainer = document.getElementById('seatsContainer') as HTMLElement;
          // console.log(seatsContainer, document.getElementById('seatsContainer'), responseData.guests, i, 'გესტის დატა წესით არის აქ !!!');
          this.teamMembersList.push(
            new FormControl(this.ifExistValue(responseData.guests[i].name))
          );
        }
      }

      //add empty seats
      let membersLength = responseData.crew.length + responseData.guests.length;

      if (
        membersLength <
        this.choosenBoatData[choosenBoatDataKeysArray[boatSeatsIndex]]
      ) {
        let emptySeatsCount =
          this.choosenBoatData[choosenBoatDataKeysArray[boatSeatsIndex]] -
          membersLength;
        for (let i = 0; i < emptySeatsCount; i++) {
          this.teamMembersList.push(new FormControl(''));
        }
      }
    }
  }

  setEditValue(choosenBoatData: any, responseData?: any): void {
    let choosenBoatDataKeysArray = Object.keys(choosenBoatData);

    // console.log(choosenBoatData, responseData, '=======edit session=========');

    //set boat name
    let boatNameIndex = choosenBoatDataKeysArray.indexOf('name');
    if (boatNameIndex !== -1) {
      this.sessionForm.controls[formControlNames.boatNameControler].setValue(
        this.choosenBoatData[choosenBoatDataKeysArray[boatNameIndex]]
      );
    }

    //Lfd. Nr
    if (responseData) {
      this.sessionForm.controls[formControlNames.LfdControler].setValue(
        responseData.sessionNumber
      );

      // set helper
      this.sessionForm.controls[formControlNames.chairmanControler].setValue(
        responseData.helper._id
      );
      this.chairmanValues.push({
        name: responseData.helper.firstName,
        lastName: responseData.helper.lastName,
        id: responseData.helper._id,
        isSelected: true,
      });

      this.selectedObman = `${responseData.helper.firstName} ${responseData.helper.lastName}`;
      this.sessionForm.controls[formControlNames.chairmanControler].setValue(
        responseData.helper._id
      );

      //set Steuermann
      if (responseData.cox) {
        this.sessionForm.controls['cox'].setValue(responseData.cox._id);
        this.steuermannValues.push({
          name: responseData.cox.firstName,
          lastName: responseData.cox.lastName,
          id: responseData.cox._id,
        });

        this.selectedCoxFullName = `${responseData.cox.firstName} ${responseData.cox.lastName}`;
      }

      //set road type
      this.sessionForm.controls[formControlNames.rideTypeControler].setValue(
        responseData.sessionType
      );

      //set route
      this.sessionForm.controls[formControlNames.destinationControler].setValue(
        responseData.route
      );
      this.selectedRoute = responseData.route;

      //set distanceControler
      this.sessionForm.controls[formControlNames.distanceControler].setValue(
        responseData.distance
      );

      //set date
      this.sessionForm.controls[formControlNames.startDateControler].setValue(
        moment(
          this.functionalService.returnDateFromUTC(responseData.startDate, true)
        ).format('YYYY-MM-DD')
      );

      this.startDate = moment(
        this.functionalService.returnDateFromUTC(responseData.startDate, true)
      ).format('DD.MM.yyyy');

      //set clock
      this.sessionForm.controls[formControlNames.startClockControler].setValue(
        moment(
          this.functionalService.returnDateFromUTC(responseData.startDate, true)
        )
      );

      this.timeDisplay = moment(
        this.functionalService.returnDateFromUTC(responseData.startDate, true)
      ).format('HH:mm');

      this.minEndTime = moment(
        this.functionalService.returnDateFromUTC(responseData.startDate, true)
      ).format('yyyy-MM-DDTHH:mm:ss.SSSZ');

      console.log(
        this.minEndTime,
        responseData.startDate,
        '==========================='
      );

      //set comment
      // this.sessionForm.controls[formControlNames.commentControler].setValue(responseData.comment);
    }

    //set boat seats
    let boatSeatsIndex = choosenBoatDataKeysArray.indexOf('seats');
    if (boatNameIndex !== -1) {
      this.teamMembersList = this.sessionForm.get(
        formControlNames.teamControler
      ) as FormArray;
      console.log(choosenBoatDataKeysArray[boatSeatsIndex]);
      for (
        let i = 0;
        i < this.choosenBoatData[choosenBoatDataKeysArray[boatSeatsIndex]];
        i++
      ) {
        if (responseData.crew[i]) {
          this.teamMembersList.push(
            new FormControl(
              `${responseData.crew[i].firstName} ${responseData.crew[i].lastName}`
            )
          );
          let indexChairmanValues = this.chairmanValues.findIndex(
            (x: any) => x.id === responseData.crew[i]._id
          );
          if (indexChairmanValues === -1) {
            this.setObmanListAccordingToTeamMembers(
              responseData.crew[i].firstName,
              responseData.crew[i].lastName,
              responseData.crew[i]._id
            );
          }
          this.foundUsersList.push(responseData.crew[i]);
        }

        if (responseData.guests[i]) {
          this.teamMembersList.push(
            new FormControl(this.ifExistValue(responseData.guests[i].name))
          );

          this.gustsFullList.push({
            _id: responseData.guests[i]._id,
            name: this.ifExistValue(responseData.guests[i].name),
            seat: this.teamMembersList.value.indexOf(
              this.ifExistValue(responseData.guests[i].name)
            ),
          });
        }
      }

      //add empty seats
      let membersLength = responseData.crew.length + responseData.guests.length;

      if (
        membersLength <
        this.choosenBoatData[choosenBoatDataKeysArray[boatSeatsIndex]]
      ) {
        let emptySeatsCount =
          this.choosenBoatData[choosenBoatDataKeysArray[boatSeatsIndex]] -
          membersLength;
        for (let i = 0; i < emptySeatsCount; i++) {
          this.teamMembersList.push(new FormControl(''));
        }
      }
    }
  }

  //
  setCrewMemberValue(user: any, index: number): void {
    let teamMembers = this.sessionForm.get(
      formControlNames.teamControler
    ) as FormArray;

    let userName;
    if (user.firstName) {
      userName = `${user.firstName} ${user.lastName}`;
    } else {
      userName = user.name;
    }

    teamMembers.controls[index].setValue(userName);

    // console.log(this.foundUsersList, user, this.chairmanValues);

    let indexInfoundUsersList = this.foundUsersList.findIndex(
      (i) => i._id === user._id
    );

    let indexInChairmanList = this.chairmanValues.findIndex(
      (i: any) => i._id === user._id
    );

    let userObj = {
      name: this.foundUsersList[indexInfoundUsersList].firstName,
      lastName: this.foundUsersList[indexInfoundUsersList].lastName,
      _id: this.foundUsersList[indexInfoundUsersList]._id,
      isSelected: false,
    };

    //fill obman/helper/chairman field value
    if (index === 0 && !this.selectedObman && user.firstName) {
      userObj.isSelected = true;
      this.selectedObman = `${this.foundUsersList[indexInfoundUsersList].firstName} ${this.foundUsersList[indexInfoundUsersList].lastName}`;
      if (this.sessionForm.controls[formControlNames.chairmanControler]) {
        this.sessionForm.controls[formControlNames.chairmanControler].setValue(
          this.foundUsersList[indexInfoundUsersList]._id
        );
      }

      // else if (this.sessionForm.controls[formControlNames.chairmanFreeFieldControler]) {
      //   this.sessionForm.controls[formControlNames.chairmanFreeFieldControler].setValue(
      //     this.foundUsersList[indexInfoundUsersList]._id
      //   );
      // }
    }

    // console.log(
    //   indexInChairmanList,
    //   indexInfoundUsersList,
    //   this.chairmanValues,
    //   this.foundUsersList
    // );
    if (indexInfoundUsersList !== -1 && indexInChairmanList === -1) {
      this.chairmanValues.push(userObj);
    }
    // console.log('not exist && first element', this.foundUsersList[indexInfoundUsersList], this.sessionForm.controls[formControlNames.chairmanControler]);

    this.foundUserList = [];
  }

  //
  setExternalValue(prefillData: any): void {
    // console.log(prefillData, '--------------');
    //add fields in config for external session

    let fieldsToAdd = [
      {
        formControlName: 'boat_name',
        controlType: formControlTypes.formControl,
        isEditable: true,
      },
      { formControlName: 'Lfd', controlType: formControlTypes.formControl },
      {
        formControlName: 'freeHelper',
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: 'rideType',
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: 'startDate',
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: 'startClock',
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: 'routeText',
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: 'routeTextDistance',
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: formControlNames.startEndDate,
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: formControlNames.endEndDate,
        controlType: formControlTypes.formControl,
      },
      { formControlName: 'team', controlType: formControlTypes.formArray },
      { formControlName: 'comment', controlType: formControlTypes.formControl },
    ];

    //clear cox to select it again
    this.selectedCoxFullName = '';
    if (prefillData.preFill.isCoxed) {
      this.isCox = true;
      fieldsToAdd.push({
        formControlName: 'externalCox',
        controlType: formControlTypes.formControl,
      });
      this.steuermannValues = [];
      this.getSteuermann();
    } else {
      this.isCox = false;
    }

    //
    fieldsToAdd.forEach((field) => {
      let fieldIndexInFormFields = this.formFields.findIndex(
        (x) => x.formControlName === field.formControlName
      );
      if (fieldIndexInFormFields === -1) {
        this.formFields.push(field);
      }
    });

    this.addSessionFormControlAccordingToConfig();

    let changeLocalTime = moment(new Date(this.date));
    let date = moment(changeLocalTime, 'ddd MMM D YYYY HH:mm:ss ZZ');
    date.set({ h: 24, m: 0 });
    this.maxTime = moment(date).format('yyyy-MM-DDTHH:mm:ss.SSSZ');

    //set road type
    this.sessionForm.controls[formControlNames.rideTypeControler].setValue(
      this.rideTypeValues[1].value
    );

    //set date
    this.sessionForm.controls[formControlNames.startDateControler].setValue(
      moment(this.date).format('YYYY-MM-DD')
    );

    this.startDate = moment(this.date).format('DD.MM.yyyy');

    //set clock
    this.sessionForm.controls[formControlNames.startClockControler].setValue(
      moment(this.date).format('yyyy-MM-DDTHH:mm:ss.SSSZ')
    );

    this.timeDisplay = moment(this.date).format('HH:mm');

    // console.log(this.sessionForm.controls[formControlNames.startClockControler], moment(this.date).format('hh:mm:ss'));

    //disable crew
    this.isCrewDisabled = false;

    //Lfd. Nr
    this.sessionForm.controls[formControlNames.LfdControler].setValue(
      prefillData.preFill.sessionNumber
    );

    //set boat seats
    let boatSeatsIndex = prefillData.preFill.seats;
    this.teamMembersList = this.sessionForm.get(
      formControlNames.teamControler
    ) as FormArray;

    //claer form controls before create new
    this.teamMembersList.clear();

    for (let i = 0; i < boatSeatsIndex; i++) {
      this.teamMembersList.push(new FormControl(''));
    }
  }

  /******* edit functions *****/
  editSession(sessionType: number | undefined): void {
    // console.log(sessionType, this.choosenBoatServerData.session.sessionNumber);
    // return
    let indexRouteList = this.routeList.findIndex(
      (x: any) =>
        x.name ===
        this.sessionForm.controls[formControlNames.destinationControler].value
    );

    if (!this.routeList[indexRouteList]) {
      this.errorMessages.push(wordsMaster?.wordAllFieldsFilled);
      this.errorMessageClearInterval();
      return;
    }

    let body: any = {
      boat: this.choosenBoatData._id,
      captain:
        this.sessionForm.controls[formControlNames.teamControler].value[0],
      // comment: this.sessionForm.controls[formControlNames.commentControler].value,
      route: this.routeList[indexRouteList].name,
      crew: [],
      guests: [],
      sessionNumber: this.choosenBoatServerData.session.sessionNumber,
      sessionType:
        this.sessionForm.controls[formControlNames.rideTypeControler].value,
    };

    //
    if (
      typeof this.sessionForm.controls[formControlNames.distanceControler]
        .value === 'string'
    ) {
      body.distance = Number(
        this.sessionForm.controls[
          formControlNames.distanceControler
        ].value.split('km')[0]
      );
    } else {
      body.distance = Number(
        this.sessionForm.controls[formControlNames.distanceControler].value
      );
    }

    if (this.isCox) {
      body.cox = this.sessionForm.controls['cox'].value;
    }

    if (this.choosenBoatServerData?.booking) {
      body.booking = this.choosenBoatServerData?.booking._id;
    }

    if (this.sessionForm.controls[formControlNames.chairmanControler].value) {
      body.helper =
        this.sessionForm.controls[formControlNames.chairmanControler].value;
    }

    //set crew && guests
    this.sessionForm.controls[formControlNames.teamControler].value.forEach(
      (x: any, itemIndex: number) => {
        console.log(x, this.foundUsersList, '=========iiii==========');
        //
        let indexInfoundUsersList = this.foundUsersList.findIndex(
          (i) => `${i.firstName} ${i.lastName}` === x
        );

        // console.log(this.foundUsersList);
        // return;
        if (indexInfoundUsersList !== -1) {
          body.crew.push(this.foundUsersList[indexInfoundUsersList]._id);
        } else {
          let index = this.gustsFullList.findIndex((i: any) => {
            return i.seat === itemIndex;
          });

          if (index !== -1) {
            body.guests.push({
              id: this.gustsFullList[index]._id,
              name: x,
            });
          } else if (x) {
            body.guests.push({
              id: null,
              name: x,
            });
          }
        }
      }
    );

    //set date
    let changeLocalTime = moment(
      new Date(
        this.sessionForm.controls[formControlNames.startDateControler].value
      )
    );
    let date = moment(changeLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    // yyyy-MM-DDTHH:mm:ss.SSSZ

    let time =
      this.sessionForm.controls[formControlNames.startClockControler].value;

    date.set({
      h: Number(moment(time).format('HH')),
      m: Number(moment(time).format('mm')),
    });
    body.startDate = this.functionalService.returnDateToUTC(
      date.format('yyyy-MM-DDTHH:mm:ss')
    );

    if (!body.helper) {
      this.errorMessages.push(wordsMaster?.wordObmanError);
      this.errorMessageClearInterval();
      return;
    }

    // console.log(body, body.crew);
    // return;
    if (this.functionalService.isDuplicationInArray(body.crew)) {
      this.errorMessages.push(wordsMaster?.wordDubbleError);
      this.errorMessageClearInterval();
      return;
    } else {
      // console.log('ok', this.isFormDisabled, body, this.gustsIndexList, this.choosenBoatServerData.session.guests, this.teamMembersList.value, this.gustsFullList);
      // return;
      this.sessionWindowEvent.emit({
        sessionType: sessionType,
        sessionId: this.choosenBoatServerData.session._id,
        data: body,
      });
    }
  }

  get formData() {
    return <FormArray>this.sessionForm.get(formControlNames.teamControler);
  }

  //start session from home screen tab: Verfügbar
  startSession(sessionType: number | undefined): void {
    let indexRouteList = this.routeList.findIndex(
      (x: any) =>
        x.name ===
        this.sessionForm.controls[formControlNames.destinationControler].value
    );

    if (!this.routeList[indexRouteList]) {
      this.errorMessages.push(wordsMaster?.wordAllFieldsFilled);
      this.errorMessageClearInterval();
      return;
    }

    let body: any = {
      boat: this.choosenBoatData._id,
      competency: this.functionalService.returnCompetency(
        this.choosenBoatData.competency
      ),
      captain:
        this.sessionForm.controls[formControlNames.teamControler].value[0],
      // comment: this.sessionForm.controls[formControlNames.commentControler].value,
      route: this.routeList[indexRouteList].name,
      distance: Number(
        this.sessionForm.controls[
          formControlNames.distanceControler
        ].value.split('km')[0]
      ),
      crew: [],
      guests: [],
      sessionNumber: this.choosenBoatServerData?.sessionNumber,
      sessionType:
        this.sessionForm.controls[formControlNames.rideTypeControler].value,
    };

    if (this.isCox) {
      body.cox = this.sessionForm.controls['cox'].value;
    }

    if (this.choosenBoatServerData?.booking) {
      body.booking = this.choosenBoatServerData?.booking._id;
    }

    if (this.sessionForm.controls[formControlNames.chairmanControler].value) {
      body.helper =
        this.sessionForm.controls[formControlNames.chairmanControler].value;
    }

    //set date
    let changeLocalTime = moment(
      new Date(
        this.sessionForm.controls[formControlNames.startDateControler].value
      )
    );
    let date = moment(changeLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    // yyyy-MM-DDTHH:mm:ss.SSSZ

    let time =
      this.sessionForm.controls[formControlNames.startClockControler].value;

    date.set({
      h: Number(moment(time).format('HH')),
      m: Number(moment(time).format('mm')),
    });
    body.startDate = this.functionalService.returnDateToUTC(
      date.format('yyyy-MM-DDTHH:mm:ss')
    );

    if (!body.helper) {
      this.errorMessages.push(wordsMaster?.wordObmanError);
      this.errorMessageClearInterval();
      return;
    }

    //set crew ids
    this.sessionForm.controls[formControlNames.teamControler].value.forEach(
      (x: any) => {
        //
        let indexInfoundUsersList = this.foundUsersList.findIndex(
          (i) => `${i.firstName} ${i.lastName}` === x
        );

        let indexInGuest = body.guests.findIndex((i: any) => i.name === x);

        if (indexInfoundUsersList !== -1 && indexInGuest === -1) {
          body.crew.push(this.foundUsersList[indexInfoundUsersList]._id);
        } else if (x) {
          body.guests.push({ name: x });
        }
      }
    );

    // console.log(body);
    //concat crew and cox in one array to chack if cox was selected as team member
    let concatCrewCox: any[] = [];
    if (this.isCox) {
      concatCrewCox = [...body.crew, body.cox];
    } else {
      concatCrewCox = [...body.crew];
    }

    // console.log(concatCrewCox, body.crew);
    if (this.functionalService.isDuplicationInArray(concatCrewCox)) {
      this.errorMessages.push(wordsMaster?.wordDubbleError);
      this.errorMessageClearInterval();
      return;
    } else {
      // console.log('ok', this.isFormDisabled, body, this.choosenBoatData);
      // return;
      this.sessionWindowEvent.emit({ sessionType: sessionType, data: body });
    }
  }

  //finish sessions from home screen tab: Auf dem Wasser
  finishSession(sessionType: number | undefined): void {
    let indexRouteList = this.routeList.findIndex(
      (x: any) =>
        x.name ===
        this.sessionForm.controls[formControlNames.destinationControler].value
    );
    if (!this.routeList[indexRouteList]) {
      this.errorMessages.push(wordsMaster?.wordAllFieldsFilled);
      this.errorMessageClearInterval();
      return;
    }

    let body: any = {
      sessionId: this.choosenBoatServerData?.session._id,
      route: this.routeList[indexRouteList].name,
      // comment: this.sessionForm.controls[formControlNames.commentControler].value,
    };

    //
    if (
      typeof this.sessionForm.controls[formControlNames.distanceControler]
        .value === 'string'
    ) {
      body.distance = Number(
        this.sessionForm.controls[
          formControlNames.distanceControler
        ].value.split('km')[0]
      );
    } else {
      body.distance = Number(
        this.sessionForm.controls[formControlNames.distanceControler].value
      );
    }

    //set end date
    let changeLocalTime = moment(
      new Date(this.sessionForm.controls[formControlNames.startEndDate].value)
    );
    let date = moment(changeLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    let time = this.sessionForm.controls[formControlNames.startEndDate].value;
    date.set({
      h: Number(moment(time).format('HH')),
      m: Number(moment(time).format('mm')),
    });
    body.endDate = this.functionalService.returnDateToUTC(
      date.format('yyyy-MM-DDTHH:mm:ss')
    );

    //set startDate date
    let changeStartLocalTime = moment(
      new Date(
        this.sessionForm.controls[formControlNames.startDateControler].value
      )
    );
    let startDate = moment(changeStartLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    // yyyy-MM-DDTHH:mm:ss.SSSZ
    let startTime =
      this.sessionForm.controls[formControlNames.startClockControler].value;
    startDate.set({
      h: Number(moment(startTime).format('HH')),
      m: Number(moment(startTime).format('mm')),
    });
    body.startDate = this.functionalService.returnDateToUTC(
      startDate.format('yyyy-MM-DDTHH:mm:ss')
    );

    // console.log({ sessionType: sessionType, data: body })
    // return;
    this.sessionWindowEvent.emit({ sessionType: sessionType, data: body });
  }

  //forgotten sessions from home screen tab: Auf dem Wasser
  forgottenSession(sessionType: number | undefined): void {
    let indexRouteList = this.routeList.findIndex(
      (x: any) =>
        x.name ===
        this.sessionForm.controls[formControlNames.destinationControler].value
    );

    if (!this.routeList[indexRouteList]) {
      this.errorMessages.push(wordsMaster?.wordAllFieldsFilled);
      this.errorMessageClearInterval();
      return;
    }

    let body: any = {
      boat: this.choosenBoatData._id,
      captain:
        this.sessionForm.controls[formControlNames.teamControler].value[0],
      route: this.routeList[indexRouteList].name,
      distance: Number(
        this.sessionForm.controls[
          formControlNames.distanceControler
        ].value.split('km')[0]
      ),
      crew: [],
      guests: [],
      sessionNumber: this.choosenBoatServerData?.sessionNumber,
      sessionType:
        this.sessionForm.controls[formControlNames.rideTypeControler].value,
    };

    if (this.sessionForm.controls[formControlNames.commentControler].value) {
      body.comment =
        this.sessionForm.controls[formControlNames.commentControler].value;
    }

    if (this.isCox) {
      body.cox = this.sessionForm.controls['cox'].value;
    }

    if (this.choosenBoatServerData?.booking) {
      body.booking = this.choosenBoatServerData?.booking._id;
    }

    if (this.sessionForm.controls[formControlNames.chairmanControler].value) {
      body.helper =
        this.sessionForm.controls[formControlNames.chairmanControler].value;
    }

    //set end date
    let changeEndLocalTime = moment(
      new Date(this.sessionForm.controls[formControlNames.startEndDate].value)
    );
    let dateEnd = moment(changeEndLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    let timeEnd =
      this.sessionForm.controls[formControlNames.startEndDate].value;
    dateEnd.set({
      h: Number(moment(timeEnd).format('HH')),
      m: Number(moment(timeEnd).format('mm')),
    });
    body.endDate = this.functionalService.returnDateToUTC(
      dateEnd.format('yyyy-MM-DDTHH:mm:ss')
    );

    //set date
    let changeLocalTime = moment(
      new Date(
        this.sessionForm.controls[formControlNames.startDateControler].value
      )
    );
    let date = moment(changeLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    // yyyy-MM-DDTHH:mm:ss.SSSZ

    let time =
      this.sessionForm.controls[formControlNames.startClockControler].value;

    date.set({
      h: Number(moment(time).format('HH')),
      m: Number(moment(time).format('mm')),
    });
    body.startDate = this.functionalService.returnDateToUTC(
      date.format('yyyy-MM-DDTHH:mm:ss')
    );

    if (!body.helper) {
      this.errorMessages.push(wordsMaster?.wordObmanError);
      this.errorMessageClearInterval();
      return;
    }

    //set crew ids
    this.sessionForm.controls[formControlNames.teamControler].value.forEach(
      (x: any) => {
        //
        let indexInfoundUsersList = this.foundUsersList.findIndex(
          (i) => `${i.firstName} ${i.lastName}` === x
        );

        let indexInGuest = body.guests.findIndex((i: any) => i.name === x);

        if (indexInfoundUsersList !== -1 && indexInGuest === -1) {
          body.crew.push(this.foundUsersList[indexInfoundUsersList]._id);
        } else if (x) {
          body.guests.push({ name: x });
        }
      }
    );

    if (this.functionalService.isDuplicationInArray(body.crew)) {
      this.errorMessages.push(wordsMaster?.wordDubbleError);
      this.errorMessageClearInterval();
      return;
    } else {
      // console.log('ok', this.isFormDisabled, body);
      // return;
      this.sessionWindowEvent.emit({ sessionType: sessionType, data: body });
    }
  }

  //cancel sessions from home screen tab: Auf dem Wasser
  cancelSession(sessionType: number | undefined): void {
    console.log(
      sessionType,
      this.sessionForm.value,
      this.choosenBoatServerData
    );

    let body: any = {
      sessionId: this.choosenBoatServerData?.session._id,
      comment:
        this.sessionForm.controls[formControlNames.commentControler].value,
    };

    this.sessionWindowEvent.emit({ sessionType: sessionType, data: body });
  }

  //lock session from home screen tab: Verfügbar
  toggleLockBoatSession(sessionType: number | undefined): void {
    // console.log(
    //   sessionType,
    //   this.sessionForm.value,
    //   this.choosenBoatServerData
    // );

    let body: any = {
      lockStatus: this.lockStatus,
      boat_id: this.choosenBoatData._id,
      userId: this.storeService.userData._id,
      comment:
        this.sessionForm.controls[formControlNames.commentControler].value,
    };

    // console.log({ sessionType: sessionType, data: body })
    // return;
    this.sessionWindowEvent.emit({ sessionType: sessionType, data: body });
  }

  //save external rowing data
  saveExternalRowing(sessionType: number | undefined): void {
    //if not exist route show validation error
    if (!this.sessionForm.controls[formControlNames.textFieldControler].value) {
      this.errorMessages.push(wordsMaster?.wordAllFieldsFilled);
      this.errorMessageClearInterval();
      return;
    }

    let body: any = {
      boat: this.sessionForm.controls[formControlNames.boatNameControler].value,
      user_group: 'EXTERNAL',
      captain:
        this.sessionForm.controls[formControlNames.teamControler].value[0],
      comment:
        this.sessionForm.controls[formControlNames.commentControler].value,
      route:
        this.sessionForm.controls[formControlNames.textFieldControler].value,
      distance: Number(
        this.sessionForm.controls[
          formControlNames.routeTextDistanceControler
        ].value.split('km')[0]
      ),
      crew: [],
      externalCrew: [],
      sessionNumber:
        this.sessionForm.controls[formControlNames.LfdControler].value,
      sessionType:
        this.sessionForm.controls[formControlNames.rideTypeControler].value,
      status: 'FINISHED',
    };

    if (this.isCox) {
      // set externalCox value
      if (this.externalCoxIndex) {
        body.cox = this.externalCoxIndex;
      } else if (
        this.sessionForm.controls[formControlNames.externalCox] &&
        this.sessionForm.controls[formControlNames.externalCox].value
      ) {
        body.cox =
          this.sessionForm.controls[formControlNames.externalCox].value;
      }
    }

    // set helper value
    if (this.externalObmanIndex) {
      body.helper = this.externalObmanIndex;
    } else if (
      this.sessionForm.controls[formControlNames.chairmanFreeFieldControler] &&
      this.sessionForm.controls[formControlNames.chairmanFreeFieldControler]
        .value
    ) {
      body.helper =
        this.sessionForm.controls[
          formControlNames.chairmanFreeFieldControler
        ].value;
    }

    //set end date
    let changeEndLocalTime = moment(
      new Date(this.sessionForm.controls[formControlNames.startEndDate].value)
    );
    let dateEnd = moment(changeEndLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    let timeEnd =
      this.sessionForm.controls[formControlNames.startEndDate].value;
    dateEnd.set({
      h: Number(moment(timeEnd).format('HH')),
      m: Number(moment(timeEnd).format('mm')),
    });
    body.endDate = this.functionalService.returnDateToUTC(
      dateEnd.format('yyyy-MM-DDTHH:mm:ss')
    );

    //set date
    let changeLocalTime = moment(
      new Date(
        this.sessionForm.controls[formControlNames.startDateControler].value
      )
    );
    let date = moment(changeLocalTime, 'ddd MMM D YYYY HH:mm:ss');
    // yyyy-MM-DDTHH:mm:ss.SSSZ

    let time =
      this.sessionForm.controls[formControlNames.startClockControler].value;

    date.set({
      h: Number(moment(time).format('HH')),
      m: Number(moment(time).format('mm')),
    });
    body.startDate = this.functionalService.returnDateToUTC(
      date.format('yyyy-MM-DDTHH:mm:ss')
    );

    // if (!body.helper) {
    //   this.errorMessages.push(wordsMaster?.wordObmanError);
    //   this.errorMessageClearInterval();
    //   return;
    // }

    //set externalCrew ids
    this.sessionForm.controls[formControlNames.teamControler].value.forEach(
      (x: any) => {
        //
        let indexInfoundUsersList = this.foundUsersList.findIndex(
          (i) => `${i.firstName} ${i.lastName}` === x
        );

        let indexInGuest = body.externalCrew.findIndex((i: any) => i === x);

        if (indexInfoundUsersList !== -1 && indexInGuest === -1) {
          body.crew.push(this.foundUsersList[indexInfoundUsersList]._id);
        } else if (x) {
          body.externalCrew.push(x);
        }
      }
    );

    // console.log(body);
    //concat crew and cox in one array to chack if cox was selected as team member
    let concatCrewCox: any[] = [];
    if (this.isCox) {
      concatCrewCox = [...body.externalCrew, body.cox];
    } else {
      concatCrewCox = [...body.externalCrew];
    }

    // console.log(concatCrewCox, body.externalCrew);
    if (this.functionalService.isDuplicationInArray(concatCrewCox)) {
      this.errorMessages.push(wordsMaster?.wordDubbleError);
      this.errorMessageClearInterval();
      return;
    } else {
      // console.log('ok', this.isFormDisabled, body);
      // return;
      this.sessionWindowEvent.emit({ sessionType: sessionType, data: body });
    }
  }

  //close session window
  closeSessionWinidow(): void {
    this.display = false;
    this.closeSessionWinidowEvent.emit(false);
  }

  //
  showStartAndEndDateFieldsDisplay(): void {
    this.isStartAndEndDateFieldsDisplayHidden = false;
  }

  setDistance(event: any): void {
    this.sessionForm.controls[formControlNames.distanceControler].setValue(
      event.value
    );
  }

  //user filter function: from session window we are filtering users accroding to users first name, this data is inputed from seats input fields
  searchUserAccordingToFirstName(event: any, index?: any): void {
    this.foundUserList = [];

    //claer external obman/chairman/helper index
    this.externalObmanIndex = '';

    if (event.target.value === '') {
      this.checkObmanSelectListOnRemove();
      return;
    }

    const url = `${environment.API}users/search/firstname`;

    const body = {
      firstName: event.target.value,
    };

    if (!isNaN(index)) {
      this.activeSuggestIndex = index;
    }

    if (this.debounceTimeInterval) {
      clearInterval(this.debounceTimeInterval);
    }

    this.debounceTimeInterval = setTimeout(() => {
      this.subscription.add(
        this.dataService.putRequest(url, body).subscribe(
          (Response) => {
            this.foundUserList = Response.body.allUsers[0];
            Response.body.allUsers[0].forEach((i: any) => {
              let indexInfoundUserList = this.foundUsersList.findIndex(
                (x) => x._id === i._id
              );
              if (indexInfoundUserList === -1) {
                this.foundUsersList.push(i);
              }
            });
          },
          (error) => {
            console.log(error);
          }
        )
      );
    }, 100);

    // console.log(this.foundUsersList);
  }

  checkObmanSelectListOnRemove(): void {
    let teamMembers = this.sessionForm.get(
      formControlNames.teamControler
    ) as FormArray;

    let newChairmanValues: any = [];

    let removeUserFromObmanm: boolean = true;

    // console.log(teamMembers.value, this.selectedObman);

    //renew obmann list
    teamMembers.value.forEach((x: any) => {
      // console.log(x);

      let indexInChairmanList = this.chairmanValues.findIndex(
        (i: any) => `${i.name} ${i.lastName}` === x
      );
      if (indexInChairmanList !== -1) {
        newChairmanValues.push(this.chairmanValues[indexInChairmanList]);
      }
    });

    let selectedObmanIndex = teamMembers.value.indexOf(this.selectedObman);

    //find coxx in obmann list
    let selectedObmanIndexInChairmanValues = this.chairmanValues.findIndex(
      (x: any) => `${x.name} ${x.lastName}` === this.selectedObman
    );

    //check if obmann is not selected as crew member && cox was selected as obmann and thay are same user - if this is true, we are moveing obmann in new obmann list and disableing selected obmann remove function
    if (
      selectedObmanIndex === -1 &&
      this.selectedObman === this.selectedCoxFullName &&
      selectedObmanIndexInChairmanValues !== -1
    ) {
      newChairmanValues.push(
        this.chairmanValues[selectedObmanIndexInChairmanValues]
      );
      removeUserFromObmanm = false;
    }

    this.chairmanValues = [];
    this.chairmanValues = [...newChairmanValues];

    //remove user from selected obmann
    // console.log('remove user from selected obmann', '-------------');
    if (
      !this.chairmanValues.length ||
      (selectedObmanIndex === -1 && removeUserFromObmanm)
    ) {
      this.selectedObman = '';
      this.sessionForm.controls[formControlNames.chairmanControler].setValue(
        ''
      );
    }
  }

  setObmanListAccordingToTeamMembers(
    firstName: string,
    lastName: string,
    id: string
  ): void {
    // console.log(firstName, lastName, id, user);
    // return;

    let obj = {
      name: firstName,
      lastName: lastName,
      id: id,
      isSelected: false,
    };
    this.chairmanValues.push(obj);
  }

  setObman(user: any): void {
    this.selectedObman = `${user.name} ${user.lastName}`;
    // console.log(user);
    if (user._id) {
      this.sessionForm.controls[formControlNames.chairmanControler].setValue(
        user._id
      );
    } else {
      this.sessionForm.controls[formControlNames.chairmanControler].setValue(
        user.id
      );
    }
  }

  setSelectedRoute(route: any) {
    this.selectedRoute = route.name;
    //set route
    this.sessionForm.controls[formControlNames.destinationControler].setValue(
      route.name
    );
    this.setDistance(route);
  }

  //external rowing /****** */
  selectCategoryType(type: any): void {
    this.selectedCategoryType = type.name;
    //set selectBoatTypeControler
    this.sessionForm.controls[
      formControlNames.selectBoatTypeControler
    ].setValue(type.name);

    this.getCategoriesType(type.name);
  }

  //get boat categories by categories type
  getCategoriesType(type: string): void {
    const url = `${environment.API}boats/category?type=${type}`;

    this.selectedCategories = '';

    this.categories = [];

    this.subscription.add(
      this.dataService.getData(url).subscribe((Response) => {
        console.log(Response);

        Response.body.categories.forEach((x: string) => {
          this.categories.push({
            name: x,
            value: x,
          });
        });

        //show field
        this.formFields[
          this.functionalService.returnIndexInArray(
            this.formFields,
            'select_boat_category'
          )
        ].display = true;
      })
    );
  }

  //
  setExternalObman(externalObman: any): void {
    if (externalObman._id) {
      this.externalObmanIndex = externalObman._id;
      this.sessionForm.controls[
        formControlNames.chairmanFreeFieldControler
      ].setValue(`${externalObman?.firstName} ${externalObman?.lastName}`);
    }
    this.activeSuggestIndex = '';
  }

  setExternalCox(externalCox: any): void {
    if (externalCox.id) {
      this.externalCoxIndex = externalCox.id;
      this.sessionForm.controls[formControlNames.externalCox].setValue(
        `${externalCox?.name} ${externalCox?.lastName}`
      );
    }
    this.activeSuggestIndex = '';
  }

  //
  selectCategory(type: any): void {
    this.selectedCategories = type.name;
    //set selectBoatTypeControler
    this.sessionForm.controls[
      formControlNames.selectBoatCategoryControler
    ].setValue(type.name);

    this.getPrefillDataByCategories(type.name)
      .then((response) => {
        this.isCox = response.body.isCoxed;

        if (this.isCox) {
          this.getSteuermann();
        }

        // this.addSessionFormControlAccordingToConfig();

        this.getServerDate(true).then(() => {
          this.setExternalValue(response.body);
          //show form in template
          // this.isLoaded = true;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //get prefill data according to categories
  getPrefillDataByCategories(category: string): Promise<any> {
    const url = `${environment.API}sessions/prefill/external?category=${category}`;

    return new Promise<any>((resolve, reject) => {
      this.subscription.add(
        this.dataService.getData(url).subscribe(
          (Response) => {
            resolve(Response);
          },
          (error) => {
            reject(error);
          }
        )
      );
    });
  }

  toggleDropwDown(index: any): void {
    if (index === this.isDropDownDisplay) {
      this.isDropDownDisplay = undefined;
      return;
    }
    this.isDropDownDisplay = index;
  }

  isMemberGuest(member: string): boolean {
    try {
      let index = this.choosenBoatServerData.session.guests.findIndex(
        (x: any) => this.ifExistValue(x.name) === member
      );
      if (index !== -1) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  ifExistValue(value: any): any {
    if (value) {
      return value;
    } else {
      return '';
    }
  }

  filterCoxArray(event: any, index?: any) {
    let searchTerm = event.target.value;
    this.externalCoxIndex = '';
    // console.log(searchTerm, this.steuermannValues, '-------------');
    let result = this.steuermannValues.filter((user: any) => {
      let fullName = user.name + ' ' + user.lastName;
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (index) {
      this.activeSuggestIndex = index;
    }

    this.filteredCox = result;
    // console.log(result);
    // return result;
  }

  //this function sets cox value in form control
  setCoxInFormControl(coxData: any): void {
    // console.log(coxData, '----------setCoxInFormControl---------');
    this.selectedCoxFullName = `${coxData.name} ${coxData.lastName}`;
    this.sessionForm.controls['cox'].setValue(coxData.id);

    //call function which will check obmann state
    this.checkObmanSelectListOnRemove();

    /* add selected Coxx in chairman list - Obmann*/

    //get index of user to check if exist that user in obmann list
    let indexInChairmanList = this.chairmanValues.findIndex(
      (i: any) => i._id === coxData._id
    );

    //check if not exist cox in obman list and if not exist add this user in obman list
    if (indexInChairmanList === -1) {
      let userObj = {
        name: coxData?.name,
        lastName: coxData?.lastName,
        _id: coxData?.id,
        isSelected: false,
      };

      this.chairmanValues.push(userObj);
    }
  }

  //toggle cox dropdown display
  toggleCoxDropDownDisplay(): void {
    this.isCoxDropDownDisplayActive = !this.isCoxDropDownDisplayActive;
  }

  //
  errorMessageClearInterval(): void {
    let interval = setInterval(() => {
      this.errorMessages = [];
      clearInterval(interval);
      // console.log('---------------');
    }, 5000);
  }

  setDatePickerLocalization(): void {
    let int = setTimeout(() => {
      let elementContainer = document.getElementsByClassName(
        'owl-dt-container-buttons'
      ) as HTMLCollection;
      //cancel
      elementContainer[0].children[0].children[0].innerHTML = 'Abbruch';

      //set
      elementContainer[0].children[1].children[0].innerHTML = 'Einfügen';
      clearInterval(int);
    }, 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
