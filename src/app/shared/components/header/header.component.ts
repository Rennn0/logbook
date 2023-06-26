import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  trafficLightConfig,
  trafficLightEnum,
  trafficLightIndicatorsStates,
  trafficLightTextEnum,
} from 'src/app/core/enums/traffic_light.enum';
import { wordsMaster } from 'src/app/core/mocks/language.mock';
import { StatisticsNavigation } from 'src/app/core/mocks/statistics.mock';
import { DataService } from 'src/app/core/services/data/data.service';
import { FunctionalService } from 'src/app/core/services/functions/functional.service';
import { GoogleSigninService } from 'src/app/core/services/google-auth/google-signin.service';
import { AppStateManageService } from 'src/app/core/services/states/app-state-manage.service';
import { StatesService } from 'src/app/core/services/states/states.service';
import { StoreService } from 'src/app/core/services/store/store.service';
import { TrafficLightService } from 'src/app/core/services/traffic-light/traffic-light.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  weatherInterval: any;

  publicTrafficLightEnum: any = trafficLightEnum;

  publicTrafficLightIndicatorsStates = trafficLightIndicatorsStates;

  testNumber: number = 0;

  trafficManualDisplay: boolean = false;

  selectedTrafficLight: number = trafficLightEnum.terminalGreen;

  selectedTrafficLightText: string = '';

  isUserAdmin: boolean = false;

  weatherWas: string = trafficLightTextEnum.terminalGreen;

  weatherWasUpdated: boolean = false;

  publicStatisticsNavigation = StatisticsNavigation;

  toggleStatisticNavigation: boolean = false;

  publicwordsMaster = wordsMaster;

  //
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.classList.contains('out-box--click')) {
      // console.log(event.target);
      this.toggleStatisticNavigation = false;
    }
  }
  constructor(
    private googleSigninService: GoogleSigninService,
    private _router: Router,
    public storeService: StoreService,
    private dataService: DataService,
    public trafficLightService: TrafficLightService,
    private appStateManageService: AppStateManageService,
    private functionalService: FunctionalService,
    private statesService: StatesService,
  ) { }

  ngOnInit(): void {
    this.startLoadTraffic();

    this.listenStatesUpdate();
  }

  load(): void {
    // console.log(this.trafficLightService.timeFrame);
    //after check value of traffic
    this.getTrafficData()
      .then((response) => {
        this.getWetherData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  listenStatesUpdate(): void {
    //when in home page traffic-light will be updated from other client this subscription will be emited
    this.subscription.add(this.statesService.isTrafficLightUpdateEvent$.subscribe(Response => {
      if (Response.isTrafficLightUpdate) {
        this.startLoadTraffic();
        console.log('startLoadTraffic in listenStatesUpdate', Response);
      }
    }, error => {
      console.log(error);
    }))

    // starting listening of user data set in localStorage to check is this user admin or not
    this.subscription.add(this.statesService.isHeaderAdminFunctionsReadyToCheckEvent$.subscribe(Response => {
      if (Response) {
        this.isAuthUserAdmin();
      }
    }, error => {
      console.log(error);
    }))
  }

  //check user state and get ready to get weather data
  startLoadTraffic(): void {
    if (this.googleSigninService.checkIfUserAuthenticated()) {
      // console.log('if user authenticated loadTrafficConfig ');
      this.loadTrafficConfig();
    } else {
      // console.log('not authenticated - signIn, waiting of authentication');
      this.subscription.add(this.googleSigninService.isUserAuthenticated.subscribe(Response => {
        if (Response.label && this.googleSigninService.checkIfUserAuthenticated()) {
          this.loadTrafficConfig();
        }
      }, error => {
        console.log(error, 'user authentication error');
      }))
    }
  }

  //after getting traffic light manual data start getting weather from Public API
  loadTrafficConfig(): void {
    this.getAppTrafficState()
      .then(() => {
        this.startGetWeather(0);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //assign Wether Data To trafficLightService variables
  getTrafficData(): Promise<any> {
    const url =
      'https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/24700404.json?includeTimeseries=true&includeCurrentMeasurement=true';

    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.dataService.getDefData(url).subscribe(
          (Response) => {
            // console.log(Response);

            //assign timeSeries
            Response.timeseries.forEach((x: any) => {
              if (x.longname == 'WASSERSTAND ROHDATEN') {
                this.trafficLightService.wasserstandValue =
                  x.currentMeasurement.value;
              }
              if (x.longname == 'ABFLUSS') {
                this.trafficLightService.abflussValue =
                  x.currentMeasurement.value;
              }
              if (x.longname == 'WASSERTEMPERATUR') {
                this.trafficLightService.wassertempValue =
                  x.currentMeasurement.value;
              }
              if (x.longname == 'LUFTTEMPERATUR') {
                this.trafficLightService.luftTempValue =
                  x.currentMeasurement.value;
              }
            });

            resolve(true);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        )
      );
    });
  }

  isAuthUserAdmin(): void {
    this.isUserAdmin = this.functionalService.isUserAdmin(
      this.appStateManageService.getDataFromLocalStorage('logbookUserAuthData')
    );
  }

  getWetherData(): void {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=50.0909&longitude=8.6432&current_weather=true';

    this.subscription.add(
      this.dataService.getDefData(url).subscribe(
        (Response) => {
          // console.log(Response);
          this.trafficLightService.windSpeedValue =
            Response.current_weather.windspeed;

          this.trafficLightService.individualWeatherCondition();

          if (this.trafficLightService.isTrafficAutomatOn) {
            this.trafficLightService.trafficLightAlgorithmToAssignCorrectLight();
          }
          this.startGetWeather(this.trafficLightService.timeFrame);
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  //update data in every one hour
  startGetWeather(time: number): void {
    this.weatherInterval = setTimeout(() => {
      this.load();
      clearInterval(this.weatherInterval);
    }, time);
  }

  getAppTrafficState(): Promise<any> {
    const url = `${environment.API}traffic-light`;

    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.dataService.getData(url).subscribe(
          (Response) => {
            // console.log(Response);
            if (Response.body.currentTrafficLightValue === 'AUTOMATIC') {
              this.selectedTrafficLight = trafficLightEnum.automatically;
              this.trafficLightService.isTrafficAutomatOn = true;
            }

            if (Response.body.currentTrafficLightValue === 'RED') {
              this.trafficLightService.terminalState =
                trafficLightEnum.terminalRed;
              this.selectedTrafficLight = trafficLightEnum.terminalRed;
              this.trafficLightService.isTrafficAutomatOn = false;
              this.trafficLightService.title = wordsMaster.wordTrafficLightTitleRedType1;
            }

            if (Response.body.currentTrafficLightValue === 'GREEN') {
              this.trafficLightService.terminalState =
                trafficLightEnum.terminalGreen;
              this.selectedTrafficLight = trafficLightEnum.terminalGreen;
              this.trafficLightService.isTrafficAutomatOn = false;
              this.trafficLightService.title = wordsMaster.wordTrafficLightTitleGreen;
            }

            if (Response.body.currentTrafficLightValue === 'YELLOW') {
              this.trafficLightService.terminalState =
                trafficLightEnum.terminalYellow;
              this.selectedTrafficLight = trafficLightEnum.terminalYellow;
              this.trafficLightService.isTrafficAutomatOn = false;
              this.trafficLightService.title = wordsMaster.wordTrafficLightTitleYellow3;
            }

            this.weatherWas = Response.body.currentTrafficLightValue;
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

  singout(): void {
    this.googleSigninService.signOut().then(() => {
      //
      sessionStorage.clear(); //this clears the localStorage completely
      localStorage.clear(); //this clears the localStorage completely
      if (this.statesService.updateInterval) {
        clearInterval(this.statesService.updateInterval);
      }

      this._router.navigate(['signin']);
    });
  }

  setTrafficManual(state: number): void {
    this.selectedTrafficLight = state;

    if (this.selectedTrafficLight === trafficLightEnum.automatically) {
      this.selectedTrafficLightText = trafficLightTextEnum.automatically;
      this.trafficLightService.isTrafficAutomatOn = true;
      return;
    }

    if (this.selectedTrafficLight === trafficLightEnum.terminalRed) {
      this.selectedTrafficLightText = trafficLightTextEnum.terminalRed;
      this.trafficLightService.terminalState = trafficLightEnum.terminalRed;
      this.trafficLightService.title = wordsMaster.wordTrafficLightTitleRedType1;
    }

    if (this.selectedTrafficLight === trafficLightEnum.terminalGreen) {
      this.selectedTrafficLightText = trafficLightTextEnum.terminalGreen;
      this.trafficLightService.terminalState = trafficLightEnum.terminalGreen;
      this.trafficLightService.title = wordsMaster.wordTrafficLightTitleGreen;
    }

    if (this.selectedTrafficLight === trafficLightEnum.terminalYellow) {
      this.selectedTrafficLightText = trafficLightTextEnum.terminalYellow;
      this.trafficLightService.terminalState = trafficLightEnum.terminalYellow;
      this.trafficLightService.title = wordsMaster.wordTrafficLightTitleYellow3;
    }

    this.trafficLightService.isTrafficAutomatOn = false;
    // this.trafficLightService.terminalState = state;
  }

  saveTrafficData(): void {
    const url = `${environment.API}traffic-light`;

    // console.log(
    //   this.selectedTrafficLightText,
    //   this.selectedTrafficLight,
    //   '------------'
    // );

    this.subscription.add(
      this.dataService
        .putRequest(url, { trafficLightValue: this.selectedTrafficLightText })
        .subscribe(
          (Response) => {
            // console.log(Response);
            if (this.trafficLightService.isTrafficAutomatOn) {
              this.startGetWeather(0);
            }
            this.weatherWasUpdated = true;
            this.weatherWas = this.selectedTrafficLightText;
            this.trafficManualDisplay = false;
          },
          (error) => {
            console.log(error);
          }
        )
    );
  }

  toggleTrafficManual(): void {
    this.trafficManualDisplay = !this.trafficManualDisplay;

    if (!this.trafficManualDisplay && !this.weatherWasUpdated) {
      let trafficLightConfigIndex = trafficLightConfig.findIndex(
        (x: any) => x.terminalStateText === this.weatherWas
      );

      if (
        trafficLightConfigIndex !== -1 &&
        trafficLightConfig[trafficLightConfigIndex].terminalStateText !==
        'AUTOMATIC'
      ) {
        this.selectedTrafficLight =
          trafficLightConfig[trafficLightConfigIndex].terminalStateNumber;
        this.selectedTrafficLightText =
          trafficLightConfig[trafficLightConfigIndex].terminalStateText;
        this.trafficLightService.terminalState =
          trafficLightConfig[trafficLightConfigIndex].terminalStateNumber;
        // this.trafficLightService.isTrafficAutomatOn = false;
      }

      if (
        trafficLightConfigIndex !== -1 &&
        trafficLightConfig[trafficLightConfigIndex].terminalStateText ===
        'AUTOMATIC'
      ) {
        this.trafficLightService.isTrafficAutomatOn = true;
        this.startGetWeather(0);
        // console.log(this.trafficLightService.isTrafficAutomatOn);
      }

      this.selectedTrafficLight = trafficLightConfig[trafficLightConfigIndex].terminalStateNumber;

      // console.log(this.weatherWas);
      // console.log('close');
    }

    if (this.trafficManualDisplay) {
      this.weatherWasUpdated = false;
      // console.log('open');
    }
  }

  toggleStatisticNavigationDisplay(): void {
    this.toggleStatisticNavigation = !this.toggleStatisticNavigation;
  }

  chooseAndOpenStatisticType(type: any): void {
    this.statesService.chosenStatisticsType = type;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
