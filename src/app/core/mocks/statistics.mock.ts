import { StatisticsEnum } from '../enums/statistics.enum';
import { StoreService } from '../services/store/store.service';
import * as moment from 'moment-timezone';
import { wordsMaster } from './language.mock';

let storeService = new StoreService();

//
function getStatisticsSelectorElementYear(date: any): string {
  let currentMonth = moment(date).format("MM");
  let toReturnYear = moment(storeService.userLocalDate).format("YYYY");
  if (Number(currentMonth) >= 11) {
    toReturnYear = moment(date).add(1, 'years').format("YYYY");
  }
  // console.log(date, moment(date).add(1, 'years'), moment(storeService.userLocalDate).format("MM"), currentMonth, toReturnYear, '----');
  return toReturnYear;
}


export const StatisticsNavigation = [
  {
    label: `${wordsMaster.wordStatisticsLabelGermania} ${getStatisticsSelectorElementYear(storeService.userLocalDate)}`,
    value: StatisticsEnum.KilometerStatistics,
  },
  {
    label: `${wordsMaster.wordStatisticsLabelCommerzban} ${getStatisticsSelectorElementYear(storeService.userLocalDate)}`,
    value: StatisticsEnum.CommerzbankStatistics,
  },
  {
    label: `${wordsMaster.wordStatisticsLabelVenezianer} ${getStatisticsSelectorElementYear(storeService.userLocalDate)}`,
    value: StatisticsEnum.VenezianerStatistics,
  },
  {
    label: `${wordsMaster.wordLabelVenezianer} ${getStatisticsSelectorElementYear(storeService.userLocalDate)}`,
    value: StatisticsEnum.VenezianerStatisticsPersonal,
  },
  {
    label: `${wordsMaster.wordStatisticsLabelFahrtenbuch} ${getStatisticsSelectorElementYear(storeService.userLocalDate)}`,
    value: StatisticsEnum.logbookStatistics,
  },
  {
    label: wordsMaster.wordStatisticsLabelEinzelboote,
    value: StatisticsEnum.logbookSingleBoat,
  },
];
