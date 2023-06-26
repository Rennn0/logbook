import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatesService {

  chosenStatisticsType: number | null = null;

  isTrafficLightUpdateEvent$: Subject<any> = new Subject();

  isHeaderAdminFunctionsReadyToCheckEvent$: Subject<any> = new Subject();

  updateInterval: any;

  //if terminal 'health' is bad we are showing component and disabling all functions with this component
  isHealth: boolean = true;

  constructor() { }
}
