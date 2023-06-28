import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  BoatsStatusEnum,
  LockStatusEnum,
} from 'src/app/core/enums/boats.status.enum';
import {
  formControlNames,
  formControlTypes,
} from 'src/app/core/enums/form_control_types.enum';
import {
  dropDowns,
  SessionWindowEnum,
} from 'src/app/core/enums/session_window.enum';
import { trafficLightEnum } from 'src/app/core/enums/traffic_light.enum';
import { formFieldsObjectInterface } from 'src/app/core/interfaces/formFieldsObject.interface';
import { sessionEventTypeDataInterface } from 'src/app/core/interfaces/session-window.interface';
import { wordsMaster } from 'src/app/core/mocks/language.mock';
import { DataService } from 'src/app/core/services/data/data.service';
import { FunctionalService } from 'src/app/core/services/functions/functional.service';
import { StoreService } from 'src/app/core/services/store/store.service';
import { TrafficLightService } from 'src/app/core/services/traffic-light/traffic-light.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';
import { StatesService } from 'src/app/core/services/states/states.service';
import { io } from 'socket.io-client';
import { StatusCodes } from 'src/app/core/enums/base.enum';
import { MatDialog } from '@angular/material';
import { PlanCourseComponent } from 'src/app/shared/components/plan-course/plan-course.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  //responseData represent array for stored data, from cloud
  responseData: any[] = [];

  locations: any[] = [];

  filteredData: any[] = [];

  responseDataKeys: any[] = [];

  //
  errorMessages: string[] = [];

  chosenBoat: any;

  chosenBoatStartDate: string | undefined;

  //
  lockStatus = LockStatusEnum.locked;

  publicLockStatusEnum = LockStatusEnum;

  //if terminal 'health' is bad we are showing component and disabling all functions with this component
  healthInterval: any | undefined;

  boatClass: string = '';

  ignoreCategory: string = 'false';

  //session window fields config
  startSessionFieldsConfig: formFieldsObjectInterface[] = [
    { formControlName: 'boat_name', controlType: formControlTypes.formControl },
    { formControlName: 'Lfd', controlType: formControlTypes.formControl },
    { formControlName: 'helper', controlType: formControlTypes.formControl },
    { formControlName: 'rideType', controlType: formControlTypes.formControl },
    { formControlName: 'startDate', controlType: formControlTypes.formControl },
    {
      formControlName: 'startClock',
      controlType: formControlTypes.formControl,
    },
    { formControlName: 'route', controlType: formControlTypes.formControl },
    { formControlName: 'distance', controlType: formControlTypes.formControl },
    { formControlName: 'team', controlType: formControlTypes.formArray },
    // { formControlName: 'comment', controlType: formControlTypes.formControl }
  ];

  finishSessionFieldsConfig: formFieldsObjectInterface[] = [
    { formControlName: 'boat_name', controlType: formControlTypes.formControl },
    { formControlName: 'Lfd', controlType: formControlTypes.formControl },
    { formControlName: 'helper', controlType: formControlTypes.formControl },
    { formControlName: 'rideType', controlType: formControlTypes.formControl },
    { formControlName: 'startDate', controlType: formControlTypes.formControl },
    {
      formControlName: 'startClock',
      controlType: formControlTypes.formControl,
    },
    { formControlName: 'route', controlType: formControlTypes.formControl },
    { formControlName: 'distance', controlType: formControlTypes.formControl },
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

  cancelSessionFieldsConfig: formFieldsObjectInterface[] = [
    { formControlName: 'comment', controlType: formControlTypes.formControl },
  ];

  lockSessionFieldsConfig: formFieldsObjectInterface[] = [
    { formControlName: 'comment', controlType: formControlTypes.formControl },
  ];

  forgottenSessionFieldsConfig: formFieldsObjectInterface[] = [
    { formControlName: 'boat_name', controlType: formControlTypes.formControl },
    { formControlName: 'Lfd', controlType: formControlTypes.formControl },
    { formControlName: 'helper', controlType: formControlTypes.formControl },
    { formControlName: 'rideType', controlType: formControlTypes.formControl },
    { formControlName: 'startDate', controlType: formControlTypes.formControl },
    {
      formControlName: 'startClock',
      controlType: formControlTypes.formControl,
    },
    { formControlName: 'route', controlType: formControlTypes.formControl },
    { formControlName: 'distance', controlType: formControlTypes.formControl },
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

  //start session window fields config
  editStartedConfig: formFieldsObjectInterface[] = [
    { formControlName: 'boat_name', controlType: formControlTypes.formControl },
    { formControlName: 'Lfd', controlType: formControlTypes.formControl },
    { formControlName: 'helper', controlType: formControlTypes.formControl },
    { formControlName: 'rideType', controlType: formControlTypes.formControl },
    { formControlName: 'startDate', controlType: formControlTypes.formControl },
    {
      formControlName: 'startClock',
      controlType: formControlTypes.formControl,
    },
    { formControlName: 'route', controlType: formControlTypes.formControl },
    { formControlName: 'distance', controlType: formControlTypes.formControl },
    { formControlName: 'team', controlType: formControlTypes.formArray },
    // { formControlName: 'comment', controlType: formControlTypes.formControl }
  ];

  //start session window fields config
  externalRowingConfig: formFieldsObjectInterface[] = [
    {
      formControlName: 'select_boat_type',
      controlType: formControlTypes.formControl,
    },
    {
      formControlName: 'select_boat_category',
      controlType: formControlTypes.formControl,
      display: false,
    },
  ];

  isDropDownDisplay: any;

  publicDropDowns = dropDowns;

  selectedLocation: string = wordsMaster.wordAllLocation;

  // sessionFormConfig
  sessionFormConfig: formFieldsObjectInterface[] = [];

  sessionWindowType: number = 0;

  //we are storing session data here, to use it again if needed
  sessionDataStorage: any;

  //
  publicLanguageGer = wordsMaster;

  //
  searchInput: FormControl = new FormControl();

  subscription: Subscription = new Subscription();

  //set chosen boat status, default is AVAILABLE
  chosenBoatsStatus: string = 'AVAILABLE';

  chosenTabIndex: number = BoatsStatusEnum.Available;

  publicBoatsStatusEnum = BoatsStatusEnum;

  publicSessionWindowEnum = SessionWindowEnum;

  sessionWindowTitle: string = wordsMaster.wordStartRide;

  competencyErrorText: string = wordsMaster.wordBoatClassContent;

  sessionDisplay: boolean = false;

  boatClassWarrningDisplay: boolean = false;

  //
  isUserAdmin: boolean = false;

  isDataDateFilterModue: boolean = false;

  publicTrafficLightEnum: any = trafficLightEnum;

  errorUser: string = '';

  //setBookedBoats count
  bookedBoats: number = 0;

  //
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.classList.contains('out-box--click')) {
      this.isDropDownDisplay = undefined;
    }
  }
  constructor(
    private dataService: DataService,
    public functionalService: FunctionalService,
    private storeService: StoreService,
    public trafficLightService: TrafficLightService,
    public statesService: StatesService
  ) {}

  displayPlanCourse: boolean = false;

  showPlanCourse() {
    this.displayPlanCourse = !this.displayPlanCourse;
  }

  getFilteredData() {
    return this.filteredData;
  }

  ngOnInit(): void {
    // console.log('init', this.publicLanguageGer);
    this.load();
  }

  load(): void {
    //get boat list and start sync function
    this.getData();

    this.getLocationsData();

    this.isUserAdmin = this.functionalService.isUserAdmin(
      this.storeService.userData
    );

    this.healtHcheck();

    // const socket = io('https://gateway-ao5z56qcvq-ey.a.run.app:8080', { query: { id: this.storeService.userData._id } });
    // console.log(socket.connect());

    // socket.on("connect", () => {
    //   const engine = socket.io.engine;
    //   console.log(engine.transport.name); // in most cases, prints "polling"

    //   engine.once("upgrade", () => {
    //     // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    //     console.log(engine.transport.name); // in most cases, prints "websocket"
    //   });

    //   engine.on("packet", ({ type, data }) => {
    //     // called for each packet received
    //   });

    //   engine.on("packetCreate", ({ type, data }) => {
    //     // called for each packet sent
    //   });

    //   engine.on("drain", () => {
    //     // called when the write buffer is drained
    //   });

    //   engine.on("close", (reason) => {
    //     // called when the underlying connection is closed
    //   });
    // });

    // console.log(this.storeService.userData);
  }

  /*********** get data functions*/
  //getting boat list data from API
  getData(): void {
    //clear responseData to insert on it new data
    this.responseData = [];

    this.filteredData = [];

    this.responseDataKeys = [];

    this.isDataDateFilterModue = false;

    if (this.storeService.userData === undefined) {
      return;
    }

    //clear sync function interval to stop it
    clearInterval(this.statesService.updateInterval);

    //
    const url = `${environment.API}boats/status/${this.chosenBoatsStatus}/${this.storeService.userData._id}`;

    this.subscription.add(
      this.dataService.getData(url).subscribe(
        (Response) => {
          if (Response.body) {
            this.functionalService
              .getResponseDataKeys(Response.body)
              .forEach((x: any) => {
                this.responseData.push(Response.body[x]);
              });

            //
            this.responseDataKeys = this.functionalService.getResponseDataKeys(
              Response.body
            );

            //load default data
            this.filterBoats('', false, 'name');
          }

          //reload sync function
          this.loadUpdates();
        },
        (error) => {
          console.error(error);
        }
      )
    );
  }

  //getting upcoming data from API
  getUpcomingData(): void {
    //clear responseData to insert on it new data
    this.responseData = [];

    this.filteredData = [];

    this.responseDataKeys = [];

    // console.log(this.storeService.userData);

    this.isDataDateFilterModue = true;

    //
    const url = `${environment.API}bookings/upcoming`;

    this.subscription.add(
      this.dataService.getData(url).subscribe(
        (Response) => {
          // console.log(Response, '-----');
          if (Response.body) {
            let bookings = [...Response.body.bookings];
            let dateSortedArray: any[] = [];

            let dataDateSort = () => {
              // console.log(bookings, bookings.length, 'ფუნქციის დაწყება - ვამოწმებ bookings მასივს, მისი შვილების რაოდენობით');
              if (bookings.length) {
                // console.log(dateSortedArray, dateSortedArray.length, 'თუ dateSortedArray.lengt არის false, ვწერ პირველ ელემენტს და ვბრუნდები საწყოსზე');

                if (!dateSortedArray.length) {
                  dateSortedArray.push(bookings[0]);
                  bookings.splice(0, 1);
                  // console.log(dateSortedArray, bookings, bookings[0], 'ჩავწერე პირველიე ლემენტი და ვბრუნდები თავიდან')
                  dataDateSort();
                  return;
                }

                // console.log('ვეძებ პირველი ელემენტის შესაბამის ელემენტს');
                let bookingsIndex = bookings.findIndex((x: any) => {
                  // console.log(
                  //   moment(this.functionalService.returnDateFromUTC(x.date, true)).format('yyyy-MM-DD'),
                  //   moment(this.functionalService.returnDateFromUTC(dateSortedArray[0].date, true)).format('yyyy-MM-DD'),

                  //   moment(this.functionalService.returnDateFromUTC(x.date, true)).format('yyyy-MM-DD') === moment(this.functionalService.returnDateFromUTC(dateSortedArray[0].date, true)).format('yyyy-MM-DD')
                  // );
                  return (
                    moment(
                      this.functionalService.returnDateFromUTC(x.date, true)
                    ).format('yyyy-MM-DD') ===
                    moment(
                      this.functionalService.returnDateFromUTC(
                        dateSortedArray[0].date,
                        true
                      )
                    ).format('yyyy-MM-DD')
                  );
                });

                // console.log(bookingsIndex, 'bookingsIndex - თუ ვიპოვე პირველი ელემენტის შესაბამის ელემენტი ვწერ მას dateSortedArray, და ვბრუნდები თავიდან');
                if (bookingsIndex !== -1) {
                  dateSortedArray.push(bookings[bookingsIndex]);
                  bookings.splice(bookingsIndex, 1);
                  // console.log(dateSortedArray, bookings, 'ნაპონვი ელემენტი ჩავწერე dateSortedArray, ვუყურებ bookings, ვბრუნდები თავიდან');
                  dataDateSort();
                } else {
                  this.responseData.push(dateSortedArray);
                  this.responseDataKeys.push(
                    moment(
                      this.functionalService.returnDateFromUTC(
                        dateSortedArray[0].date,
                        true
                      )
                    ).format('yyyy-MM-DD')
                  );
                  dateSortedArray = [];
                  // console.log(dateSortedArray, bookings, 'მორჩა ერთი წრე ძებნის, გადავდივართ მომდევნო წრეზე, სუფთავდება dateSortedArray')
                  dataDateSort();
                }
              } else {
                if (dateSortedArray.length) {
                  this.responseData.push(dateSortedArray);
                  this.responseDataKeys.push(
                    moment(
                      this.functionalService.returnDateFromUTC(
                        dateSortedArray[0].date,
                        true
                      )
                    ).format('yyyy-MM-DD')
                  );
                  dateSortedArray = [];
                }
                // console.log('sorting done - ');
              }
            };

            dataDateSort();

            // console.log('after storting fun', this.responseData, this.responseDataKeys, bookings);

            // //load default data
            this.filterBoats('', true, 'name');
          }
          // console.log(Response, this.responseData, this.responseDataKeys);
        },
        (error) => {
          console.error(error);
        }
      )
    );
  }

  //getting location data from API
  getLocationsData(): void {
    //
    const url = `${environment.API}boats/locations`;

    this.subscription.add(
      this.dataService.getData(url).subscribe(
        (Response) => {
          this.locations = Response.body.locations;
        },
        (error) => {
          console.error(error);
        }
      )
    );
  }

  //show session window
  showSessionDisplay(sessionWindowType: undefined | number): void {
    if (sessionWindowType === SessionWindowEnum.startSession) {
      this.sessionFormConfig = this.startSessionFieldsConfig;

      this.sessionWindowType = SessionWindowEnum.startSession;

      this.sessionWindowTitle = wordsMaster.wordStartRide;
    }

    if (sessionWindowType === SessionWindowEnum.forgottenBoatSession) {
      this.sessionFormConfig = this.forgottenSessionFieldsConfig;

      this.sessionWindowType = SessionWindowEnum.forgottenBoatSession;

      this.sessionWindowTitle = wordsMaster.wordForgotten;
    }

    if (sessionWindowType === SessionWindowEnum.finishSession) {
      this.sessionFormConfig = this.finishSessionFieldsConfig;

      this.sessionWindowType = SessionWindowEnum.finishSession;

      this.sessionWindowTitle = wordsMaster.wordFinish;
    }

    if (sessionWindowType === SessionWindowEnum.cancelSession) {
      this.sessionFormConfig = this.cancelSessionFieldsConfig;

      this.sessionWindowType = SessionWindowEnum.cancelSession;

      this.sessionWindowTitle = wordsMaster.wordCancel;
    }

    if (sessionWindowType === SessionWindowEnum.lockBoatSession) {
      this.sessionFormConfig = this.lockSessionFieldsConfig;

      this.sessionWindowType = SessionWindowEnum.lockBoatSession;

      this.sessionWindowTitle = wordsMaster.wordLockBoat;

      this.lockStatus = LockStatusEnum.locked;
    }

    if (sessionWindowType === SessionWindowEnum.unlockBoatSession) {
      this.sessionFormConfig = this.lockSessionFieldsConfig;

      this.sessionWindowType = SessionWindowEnum.unlockBoatSession;

      this.sessionWindowTitle = wordsMaster.wordUnlock;

      this.lockStatus = LockStatusEnum.unlocked;
    }

    if (sessionWindowType === SessionWindowEnum.editStartedBoatSession) {
      this.sessionFormConfig = this.editStartedConfig;

      this.sessionWindowType = SessionWindowEnum.editStartedBoatSession;

      this.sessionWindowTitle = wordsMaster.wordEditSession;
    }

    if (sessionWindowType === SessionWindowEnum.externalBoatSession) {
      this.sessionFormConfig = this.externalRowingConfig;

      this.sessionWindowType = SessionWindowEnum.externalBoatSession;

      this.sessionWindowTitle = wordsMaster.wordAddExternalRowing;
    }

    this.sessionDisplay = true;
  }

  //close session window
  cancelSessionWindow(): void {
    this.sessionDisplay = false;
    this.externalRowingConfig = [
      {
        formControlName: 'select_boat_type',
        controlType: formControlTypes.formControl,
      },
      {
        formControlName: 'select_boat_category',
        controlType: formControlTypes.formControl,
        display: false,
      },
    ];
    this.chosenBoat = undefined;
  }

  // so we have one session window, and its need some middlewear to determain which way go
  sessionmiddleware(data: sessionEventTypeDataInterface): void {
    if (data.sessionType === SessionWindowEnum.startSession) {
      console.log('startSession', data);
      this.startSession(data);
    }

    if (data.sessionType === SessionWindowEnum.finishSession) {
      // console.log('finishSession', data);
      this.finishSession(data);
    }

    if (data.sessionType === SessionWindowEnum.cancelSession) {
      // console.log('cancelSession', data);
      this.cancelSession(data);
    }

    if (data.sessionType === SessionWindowEnum.editStartedBoatSession) {
      // console.log('editSession', data);
      this.editSession(data);
    }

    if (data.sessionType === SessionWindowEnum.forgottenBoatSession) {
      // console.log('forgottenBoatSession', data);
      this.forgottenBoatSession(data);
    }

    if (
      data.sessionType === SessionWindowEnum.lockBoatSession ||
      data.sessionType === SessionWindowEnum.unlockBoatSession
    ) {
      this.toggleLockSession(data);
    }

    if (data.sessionType === SessionWindowEnum.externalBoatSession) {
      // console.log('externalBoatSession', data);
      this.externalSession(data);
    }
  }

  /** according what was choose in session window we have to go on another request  */
  startSession(body: any): void {
    const url = `${environment.API}sessions/start?ignoreCategory=${this.ignoreCategory}`;

    this.sessionDataStorage = body;

    // console.log(this.sessionDataStorage, 'sessionDataStorage');

    this.subscription.add(
      this.dataService.postRequest(url, body.data).subscribe(
        (Response) => {
          console.log(Response, Response.error);

          this.cancelSessionWindow();

          this.getData();

          this.ignoreCategory = 'false';

          this.errorUser = '';

          this.closeBoatClassWarrningModal();
        },
        (error) => {
          console.log(error);
          if (error.error.errors) {
            Object.keys(error.error.errors).forEach((x) => {
              this.errorMessages.push(error.error.errors[x].msg);
              this.errorMessageClearInterval();
            });
          }

          if (error.error.reason) {
            let errorText = error.error.reason;

            if (
              error.error.type === StatusCodes.SESSION_WRONG_PERFORMANCE_CLASS
            ) {
              console.log(error, 'SESSION_WRONG_PERFORMANCE_CLASS');
              this.errorUser = error.error.reason;

              /** check if boat competency is P and user have different comptency */
              let indexCompetency =
                this.sessionDataStorage?.data?.competency.indexOf('P');

              if (indexCompetency !== -1) {
                errorText =
                  this.publicLanguageGer.wordBoatCategoryAndUserNotMatch;
                this.competencyErrorText =
                  this.publicLanguageGer.wordBoatCategoryAndUserNotMatch;
              } else {
                errorText = this.publicLanguageGer.wordBoatClassContent;
                this.competencyErrorText =
                  this.publicLanguageGer.wordBoatClassContent;
              }

              console.log(
                this.sessionDataStorage,
                this.sessionDataStorage.competency,
                indexCompetency
              );

              this.openBoatClassWarrningModal();
            }

            this.errorMessages.push(errorText);
            this.errorMessageClearInterval();
          }
        }
      )
    );
  }

  finishSession(body: any): void {
    const url = `${environment.API}sessions/stop`;

    this.subscription.add(
      this.dataService.putRequest(url, body.data).subscribe(
        (Response) => {
          console.log(Response);

          this.cancelSessionWindow();

          this.getData();
        },
        (error) => {
          console.log(error.error.errors[0].msg);
          this.errorMessages.push(error.error.errors[0].msg);
          this.errorMessageClearInterval();
        }
      )
    );
  }

  cancelSession(body: any): void {
    const url = `${environment.API}sessions/cancel`;

    this.subscription.add(
      this.dataService.putRequest(url, body.data).subscribe(
        (Response) => {
          console.log(Response);

          this.cancelSessionWindow();

          this.getData();
        },
        (error) => {
          console.log(error.error.reason);
          this.errorMessages.push(error.error.reason);
          this.errorMessageClearInterval();
        }
      )
    );
  }

  editSession(body: any): void {
    const url = `${environment.API}sessions/${body.sessionId}`;

    this.subscription.add(
      this.dataService.putRequest(url, body.data).subscribe(
        (Response) => {
          console.log(Response);

          this.cancelSessionWindow();

          this.getData();
        },
        (error) => {
          console.log(error.error.reason);
          this.errorMessages.push(error.error.reason);
          this.errorMessageClearInterval();
        }
      )
    );
  }

  forgottenBoatSession(body: any): void {
    const url = `${environment.API}sessions/complete`;

    this.subscription.add(
      this.dataService.postRequest(url, body.data).subscribe(
        (Response) => {
          console.log(Response);

          this.cancelSessionWindow();

          this.getData();
        },
        (error) => {
          console.log(error.error.errors[0].msg);
          this.errorMessages.push(error.error.errors[0].msg);
          this.errorMessageClearInterval();
        }
      )
    );
  }

  toggleLockSession(body: any): void {
    const url = `${environment.API}boats/${body.data.boat_id}/lock-status`;

    let inBody = {
      lockStatus: body.data.lockStatus,
      comment: body.data.comment,
      userId: this.storeService.userData._id,
    };

    // console.log(url, body, inBody, this.storeService.userData);
    // return;
    this.subscription.add(
      this.dataService.putRequest(url, inBody).subscribe(
        (Response) => {
          console.log(Response);

          this.cancelSessionWindow();

          this.getData();
        },
        (error) => {
          console.log(error.error.reason);
          this.errorMessages.push(error.error.reason);
          this.errorMessageClearInterval();
        }
      )
    );
  }

  externalSession(body: any): void {
    const url = `${environment.API}sessions/external`;

    this.subscription.add(
      this.dataService.postRequest(url, body.data).subscribe(
        (Response) => {
          console.log(Response);

          this.cancelSessionWindow();

          this.getData();
        },
        (error) => {
          console.log(error.error.reason);
          this.errorMessages.push(error.error.reason);
          this.errorMessageClearInterval();
        }
      )
    );
  }

  //change boat list by tab index - Tabs - BoatsStatusEnum
  setBoatsByStatus(status: string, index: any): void {
    //stop sync function
    clearInterval(this.statesService.updateInterval);

    this.chosenBoatsStatus = status;

    this.chosenTabIndex = index;

    this.chosenBoat = undefined;

    if (index === BoatsStatusEnum.upcoming) {
      this.getUpcomingData();
    } else {
      this.getData();
    }
  }

  //chose boat
  choseBoat(key: any, index: number): void {
    let i = this.responseDataKeys.indexOf(key);

    if (i !== -1) {
      this.chosenBoat = this.filteredData[i][index];
      if (this.chosenBoat.session) {
        this.chosenBoatStartDate = moment(
          this.functionalService.returnDateFromUTC(
            this.chosenBoat.session.startDate,
            true
          )
        ).format('yyyy-MM-DDTHH:mm:ss');
      }
    }
    // console.log(this.chosenBoat, this.chosenBoatStartDate, this.filteredData[i][index], '----------------------');
  }

  //
  choseDateFilterBoat(responseDataIndex: number, inArrayIndex: number): void {
    this.chosenBoat = this.filteredData[responseDataIndex][inArrayIndex].boat;
    this.chosenBoat.session = {};
    this.chosenBoat.session.crew =
      this.filteredData[responseDataIndex][inArrayIndex].crew;
    this.chosenBoat.session.guests =
      this.filteredData[responseDataIndex][inArrayIndex].guests;
    this.chosenBoat.instigator = `${this.filteredData[responseDataIndex][inArrayIndex].instigator.firstName} ${this.filteredData[responseDataIndex][inArrayIndex].instigator.lastName}`;
    if (this.chosenBoat) {
      this.chosenBoatStartDate = moment(
        this.functionalService.returnDateFromUTC(
          this.filteredData[responseDataIndex][inArrayIndex].date,
          true
        )
      ).format('yyyy-MM-DDTHH:mm:ss');
    }
    // console.log(this.chosenBoat, this.filteredData[responseDataIndex][inArrayIndex], '-----------------------');
  }

  //
  replace(str: any): string {
    return str.replace(/_/g, ' ');
  }

  // found boats in responseData
  filterBoats(
    value: string,
    isDateFilterType?: boolean,
    filterByKeys?: any
  ): void {
    // console.log(value, filterByKeys);

    if (!filterByKeys) {
      filterByKeys = 'name';
    }

    //
    if (filterByKeys === 'name') {
      this.selectedLocation = wordsMaster.wordAllLocation;
    }

    if (filterByKeys === 'location') {
      this.searchInput.setValue('');
    }

    //on load return all items
    if (!value) {
      this.filteredData = this.responseData;
      return;
    }

    //
    this.filteredData = [];

    // console.log(this.responseData, '-----------------');

    this.responseData.forEach((responseItem: any, index: number) => {
      // console.log(responseItem, index, '------');
      let item = responseItem.filter((s: any) => {
        // console.log(s[filterByKeys], filterByKeys);
        if (isDateFilterType) {
          console.log('test', s);
          return s.boat[filterByKeys]
            .toLowerCase()
            .includes(value.toLowerCase());
        } else {
          return s[filterByKeys].toLowerCase().includes(value.toLowerCase());
        }
      });

      if (item.length) {
        //
        this.filteredData[index] = item;
      }
    });
  }

  //
  locationFilter(location: any, isDateFilterType: boolean): void {
    let value = '';
    if (location !== wordsMaster.wordAllLocation) {
      value = location;
    }
    this.selectedLocation = location;

    // console.log(location, value, location !== wordsMaster.wordAllLocation);
    this.filterBoats(value, isDateFilterType, 'location');
  }

  toggleDropwDown(index: any): void {
    if (index === this.isDropDownDisplay) {
      this.isDropDownDisplay = undefined;
      return;
    }
    this.isDropDownDisplay = index;
  }

  // synchronization of logbook app to the backend, this function sets the listener to API, and if in the back side will change data this function will change the app state
  loadUpdates(): void {
    //create and modify date to send local time, after this backend will send back data according to this local time, if somthing was changed on this local time period
    let localDate = moment(new Date());
    let date = moment(localDate, 'ddd MMM D YYYY HH:mm:ss');
    let dateFormatedUTC = this.functionalService.returnDateToUTC(
      date.format('yyyy-MM-DDTHH:mm:ss')
    );
    let dateGMT = this.functionalService.returnDateFromUTC(
      dateFormatedUTC,
      true
    );

    // console.log(this.responseData, this.filteredData, this.storeService.userData, 'modify ---');

    let responsDatalength = 0;

    this.responseData.forEach((x) => {
      responsDatalength += x.length;
    });

    let url = `${environment.API}modify`;

    //on every time start new listener - clearing old interval
    if (this.statesService.updateInterval) {
      clearInterval(this.statesService.updateInterval);
    }

    this.statesService.updateInterval = setInterval(() => {
      this.subscription.add(
        this.dataService
          .getData(
            url,
            {
              boats: responsDatalength,
              bookings: this.bookedBoats,
              status: this.chosenBoatsStatus,
              location: this.storeService.userData.role,
            },
            dateGMT
          )
          .subscribe(
            (Response) => {
              // console.log(Response);

              if (Response && Response.body) {
                //set last update
                dateGMT = Response.headers.get('last-modified');
                if (
                  Response.body.modifiedData.traffic_light &&
                  Response.body.modifiedData.traffic_light.length
                ) {
                  console.log('************** update traffic light');
                  this.statesService.isTrafficLightUpdateEvent$.next({
                    isTrafficLightUpdate: true,
                  });
                }

                if (
                  Response.body.modifiedData.boats &&
                  Response.body.modifiedData.boats.length
                ) {
                  console.log('************** update boat');
                  this.getData();
                }

                //
                this.bookedBoats = Response.body.modifiedData.bookedBoats;
              }
            },
            (error) => {
              // console.log(error, '----------------------');
              // clearInterval(this.statesService.updateInterval);
            }
          )
      );
    }, 3000);
  }

  // health check function - we are sending request and if this request fail (500 internal server error or 0 there Is No Response) we will show disabled window.
  healtHcheck(): void {
    const url = `${environment.API}health`;

    let requestParams = {
      terminal_id: this.storeService.userData._id,
    };

    this.healthInterval = setInterval(() => {
      this.subscription.add(
        this.dataService.getData(url, requestParams).subscribe(
          (Response) => {
            // console.log(Response);
            this.statesService.isHealth = true;
          },
          (error) => {
            // console.log(error.status);
            if (
              error.status === StatusCodes.thereIsNoResponse ||
              error.status === StatusCodes.unexpectedCondition ||
              error.status === StatusCodes.unauthorized
            ) {
              this.statesService.isHealth = false;
            } else {
              this.statesService.isHealth = true;
            }

            // console.log(this.statesService.isHealth)

            //
            this.functionalService.onTokenExpiredGoToSignIn(error);
          }
        )
      );
    }, 10000);
  }

  //boat class warning modal display fucntions
  confirmBoatClassWarrning(): void {
    this.ignoreCategory = 'true';

    this.startSession(this.sessionDataStorage);
  }

  toggleBoatClassWarrningModal(): void {
    this.boatClassWarrningDisplay = !this.boatClassWarrningDisplay;
  }

  openBoatClassWarrningModal(): void {
    this.boatClassWarrningDisplay = true;
  }

  closeBoatClassWarrningModal(): void {
    this.boatClassWarrningDisplay = false;
  }

  //
  errorMessageClearInterval(): void {
    let interval = setInterval(() => {
      this.errorMessages = [];
      clearInterval(interval);
      // console.log('---------------');
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
