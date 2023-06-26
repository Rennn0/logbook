import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StatisticsEnum } from 'src/app/core/enums/statistics.enum';
import { wordsMaster } from 'src/app/core/mocks/language.mock';
import { StatisticsNavigation } from 'src/app/core/mocks/statistics.mock';
import { DataService } from 'src/app/core/services/data/data.service';
import { FunctionalService } from 'src/app/core/services/functions/functional.service';
import { StatesService } from 'src/app/core/services/states/states.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  responseData: any;
  pageInfo: any;

  filteredData: any[] = [];
  searchInput: FormControl = new FormControl();

  subscription: Subscription = new Subscription();

  APIUrlSegment: string | undefined;

  publicStatisticsEnum = StatisticsEnum;

  publicStatisticsNavigation = StatisticsNavigation;

  toggleStatisticNavigation: boolean = false;

  chosenTypeIndex: number = 0;

  statisticsEvaluationPeriod: string = '';

  //
  publicLanguageGer = wordsMaster;

  //
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.classList.contains('out-box--click')) {
      this.toggleStatisticNavigation = false;
    }
  }
  constructor(
    public statesService: StatesService,
    private dataService: DataService,
    public functionalService: FunctionalService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.getChosenStatisticConfig();

    this.getData();
  }

  getChosenStatisticConfig(): void {
    let chosenTypeIndex = StatisticsNavigation.findIndex(
      (x: any) => x.value === this.statesService.chosenStatisticsType
    );

    if (chosenTypeIndex !== -1) {
      this.pageInfo = StatisticsNavigation[chosenTypeIndex];

      if (
        StatisticsNavigation[chosenTypeIndex].value ===
        StatisticsEnum.KilometerStatistics
      ) {
        this.APIUrlSegment = 'statistics/users';
      }


      if (
        StatisticsNavigation[chosenTypeIndex].value ===
        StatisticsEnum.CommerzbankStatistics
      ) {
        this.APIUrlSegment = 'statistics/users/commerzbank';
      }

      if (
        StatisticsNavigation[chosenTypeIndex].value ===
        StatisticsEnum.VenezianerStatisticsPersonal
      ) {
        this.APIUrlSegment = 'statistics/users/venice';
      }

      // console.log(StatisticsNavigation[chosenTypeIndex].value, StatisticsEnum.VenezianerStatistics, '--------------')

      if (
        StatisticsNavigation[chosenTypeIndex].value ===
        StatisticsEnum.VenezianerStatistics
      ) {
        this.APIUrlSegment = 'statistics/boats/venice';
      }

      if (
        StatisticsNavigation[chosenTypeIndex].value !==
        StatisticsEnum.KilometerStatistics && StatisticsNavigation[chosenTypeIndex].value !== StatisticsEnum.CommerzbankStatistics && StatisticsNavigation[chosenTypeIndex].value !== StatisticsEnum.VenezianerStatisticsPersonal && StatisticsNavigation[chosenTypeIndex].value !== StatisticsEnum.VenezianerStatistics
      ) {
        this.APIUrlSegment = 'statistics/boats';
      }


      this.chosenTypeIndex = chosenTypeIndex;
      // console.log(this.APIUrlSegment, this.chosenTypeIndex, this.statesService.chosenStatisticsType);
    }
  }

  closeStatisticsPage(): void {
    this.statesService.chosenStatisticsType = null;
  }

  getData(): void {
    if (!this.APIUrlSegment) {
      // console.log('APIUrlSegment - is False - undefined');
      return;
    }

    // console.log(StatisticsNavigation[this.chosenTypeIndex].value, 'StatisticsNavigation');

    const url = `${environment.API}${this.APIUrlSegment}`;

    this.subscription.add(
      this.dataService.getData(url).subscribe(
        (Response) => {
          // console.log(Response);
          //according to type of statistics we have different response from API
          if (this.statesService.chosenStatisticsType === StatisticsEnum.CommerzbankStatistics || this.statesService.chosenStatisticsType === StatisticsEnum.VenezianerStatisticsPersonal) {
            this.responseData = Response.body;
          } else {
            this.responseData = Response.body.data;
          }

          // console.log(Response.body, this.responseData, this.chosenTypeIndex === StatisticsEnum.CommerzbankStatistics, this.chosenTypeIndex, StatisticsEnum.CommerzbankStatistics);
          // return

          this.responseData.stats.forEach((x: any) => {
            x.startDate = this.functionalService.returnDateFromUTC(x?.startDate, true);
            x.endDate = this.functionalService.returnDateFromUTC(x?.endDate, true);

            x.modifyName = [];
            // x.userModifyName = this.splitterHighestClassOnly(x.user, '(');
            x.boatModifyName = this.splitterHighestClassOnly(x.boat, '(');
            if (x.cox) {
              x.coxModifyName = this.splitterHighestClassOnly(x.cox, '(');
            }
            if (x.crew) {
              x.crew.forEach((y: any) => {
                if (x.isExternal) {
                  x.modifyName.push(y)
                } else {
                  x.modifyName.push(this.splitterHighestClassOnly(y, '('));
                }
              });
            }
          });

          //modify date for date harmonize dd.mm.yyyy
          this.statisticsEvaluationPeriod = `${this.responseData.header.date.split(' ')[0].replaceAll('-', '.')} - ${this.responseData.header.date.split(' ')[2]}`;
          if (
            StatisticsNavigation[this.chosenTypeIndex].value ===
            StatisticsEnum.KilometerStatistics || StatisticsNavigation[this.chosenTypeIndex].value === StatisticsEnum.CommerzbankStatistics
          ) {
            this.responseData.stats.sort((a: any, b: any) => b.km - a.km);
            this.responseData.header.distance = this.countResponseKilometers(
              this.responseData.stats,
              'km'
            );
          }

          if (
            StatisticsNavigation[this.chosenTypeIndex].value !==
            StatisticsEnum.KilometerStatistics
          ) {
            this.responseData.stats.sort(
              (a: any, b: any) => b.createdAt - a.createdAt
            );
          }

          //load default data
          this.filterBoats();
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  toggleStatisticNavigationDisplay(): void {
    this.toggleStatisticNavigation = !this.toggleStatisticNavigation;
  }

  countResponseKilometers(data: any[], key: string): number {
    let countedDistance = 0;
    data.forEach((x) => {
      countedDistance += x[key];
    });
    return countedDistance;
  }

  chooseAndOpenStatisticType(type: any): void {
    this.responseData = undefined;
    this.filteredData = [];
    this.searchInput.setValue('');
    this.pageInfo = undefined;
    this.statesService.chosenStatisticsType = type;
    this.APIUrlSegment = undefined;
    this.chosenTypeIndex = 0;
    this.load();
  }

  // found boats in responseData
  filterBoats(): void {
    //on load return all items
    if (!this.searchInput.value) {
      this.filteredData = this.responseData.stats;
      if (
        StatisticsNavigation[this.chosenTypeIndex].value ===
        StatisticsEnum.logbookSingleBoat
      ) {
        //
        this.responseData.header.distance = this.countResponseKilometers(
          this.filteredData,
          'distance'
        );

        this.responseData.header.sessionsCount = this.filteredData.length;
      }
      return;
    }

    //
    this.filteredData = [];

    this.responseData.header.distance = 0;

    this.responseData.stats.forEach((responseItem: any) => {
      if (
        responseItem.boat
          .toLowerCase()
          .includes(this.searchInput.value.toLowerCase())
      ) {
        //
        this.filteredData.push(responseItem);

        this.responseData.header.distance += responseItem.distance;

        this.responseData.header.sessionsCount = this.filteredData.length;
      }
    });
  }

  //
  splitterHighestClassOnly(
    text: string,
    mainSplit: string
  ): string | undefined {
    if (!text) {
      // console.log('text for split is undefined');
      return undefined;
    }

    let getElementSplitArray = text.split(' ');
    let getElementSplit = text.split(`${mainSplit}`);
    let fullName = getElementSplit[0];
    let getHighestClassArray =
      getElementSplitArray[getElementSplitArray.length - 1].split('/');
    let getHighestClassOnly =
      getHighestClassArray[getHighestClassArray.length - 1].split(')')[0].replace('(', '');
    return `${fullName} (${getHighestClassOnly})`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
