import { Injectable } from '@angular/core';
import { trafficLightEnum, trafficLightIndicatorsStates } from '../../enums/traffic_light.enum';
import { wordsMaster } from '../../mocks/language.mock';

@Injectable({
  providedIn: 'root',
})
export class TrafficLightService {
  //WASSERSTAND ROHDATEN -> WATER LEVEL RAW DATA +
  wasserstandValue: any;

  wasserstandValueIs: number = trafficLightIndicatorsStates.wasserstandValueGreen;

  //ABFLUSS -> DRAIN +
  abflussValue: any;

  abflussValueIs: number = trafficLightIndicatorsStates.abflussValueGreen;

  //WASSERTEMPERATUR -> WATER TEMPERATURE +
  wassertempValue: any;

  wassertempValueIs: number = trafficLightIndicatorsStates.wassertempValueGreen;

  //LUFTTEMPERATUR -> air temp value +
  luftTempValue: any;

  luftTempValueIs: number = trafficLightIndicatorsStates.luftTempValueGreen;

  //wind Speed Value +
  windSpeedValue: any;

  windSpeedValueIs: number = trafficLightIndicatorsStates.windSpeedValueGreen;

  //time frame when we are updating weather condition
  timeFrame: number = 600 * 1000;

  title: string = wordsMaster.wordTrafficLightTitleGreen;

  terminalState: number = trafficLightEnum.terminalGreen;

  isTrafficAutomatOn: boolean = false;

  constructor() { }

  trafficLightAlgorithmToAssignCorrectLight(): void {
    // console.log('Wassertemp above 10: ', this.wassertempValue >= 10);
    // console.log('Abfluss under 300: ', this.abflussValue < 300);
    // console.log('Windspeed under 18: ', this.windSpeedValue <= 18);
    // console.log('wasserstand under260: ', this.wasserstandValue < 260);
    // console.log('Air Temp above -2: ', this.luftTempValue > -2);

    // console.log('trafficLightAlgorithmToAssignCorrectLight');

    // Ampel rot bei mehr als 400 cbm/S
    if (
      this.abflussValue > 400 ||
      this.wasserstandValue > 260 ||
      this.windSpeedValue > 21 ||
      this.luftTempValue < -2
    ) {
      // console.log('## Entering RED LIGHT!');
      this.terminalState = trafficLightEnum.terminalRed;
      this.title = wordsMaster.wordTrafficLightTitleRed;
      return;
    }

    //if not red
    // this.luftTempValueIsBlocked = false;
    // this.abflussValueIsBlocked = false;
    // this.wasserstandValueIsBlocked = false;
    // this.windSpeedValueIsBlocked = false;

    // green traffic light
    if (
      this.wassertempValue >= 10 &&
      this.abflussValue <= 300 &&
      this.luftTempValue >= -2 &&
      this.windSpeedValue <= 13 &&
      this.wasserstandValue <= 200
    ) {
      // console.log('## Entering GREEN LIGHT!');
      this.title = wordsMaster.wordTrafficLightTitleGreen;
      this.terminalState = trafficLightEnum.terminalGreen;
      return;
    }

    // --- main traffic light yellow
    // traffic yellow no racing boat and 4 oars rule
    if (
      ((this.abflussValue > 300 && this.abflussValue <= 400) ||
        (this.wasserstandValue > 200 && this.wasserstandValue <= 260))
      && (this.wassertempValue < 10 || (this.windSpeedValue > 13 && this.windSpeedValue <= 18))
    ) {
      this.title = wordsMaster.wordTrafficLightTitleYellow1;
      this.terminalState = trafficLightEnum.terminalYellow;
      return;
    }
    // traffic light yellow no racing boat, when abflussValue and wasserstandValue and others are green
    if (
      ((this.abflussValue > 300 && this.abflussValue <= 400) ||
        (this.wasserstandValue > 200 && this.wasserstandValue <= 260))
      && this.wassertempValue > 10 && this.windSpeedValue < 13
    ) {
      this.title = wordsMaster.wordTrafficLightTitleYellow2;
      this.terminalState = trafficLightEnum.terminalYellow;
      return;
    }
    // traffic light yellow 4 oars rule, when water temp < 10 or windspeed between 13 and 18, and others are green
    if (this.abflussValue <= 300 &&
      this.wasserstandValue <= 200 &&
      (this.wassertempValue < 10 || (this.windSpeedValue > 13 && this.windSpeedValue <= 21))
    ) {
      this.title = wordsMaster.wordTrafficLightTitleYellow3;
      this.terminalState = trafficLightEnum.terminalYellow;
      return;
    }
  }
  //color coding for each value
  individualWeatherCondition(): void {
    //green condition
    // windspeed condition
    if (this.windSpeedValue <= 13) {
      this.windSpeedValueIs = trafficLightIndicatorsStates.windSpeedValueGreen;
    }

    //green water temp condition
    if (this.wassertempValue >= 10) {
      this.wassertempValueIs = trafficLightIndicatorsStates.wassertempValueGreen
    }

    //green abfluss condition
    if (this.abflussValue <= 300) {
      this.abflussValueIs = trafficLightIndicatorsStates.abflussValueGreen;
    }

    if (this.luftTempValue >= -2) {
      this.luftTempValueIs = trafficLightIndicatorsStates.luftTempValueGreen;
    }

    if (this.wasserstandValue <= 200) {
      this.wasserstandValueIs = trafficLightIndicatorsStates.wasserstandValueGreen;
    }

    //--- yellow conditions
    //yellow water temp condition
    if (this.wassertempValue < 10) {
      this.wassertempValueIs = trafficLightIndicatorsStates.wassertempValueYellow
    }
    //yellow windspeed condition
    if (this.windSpeedValue > 13 && this.windSpeedValue <= 21) {
      this.windSpeedValueIs = trafficLightIndicatorsStates.windSpeedValueYellow;
    }
    //yellow abfluss condition
    if (this.abflussValue < 400 && this.abflussValue >= 300) {
      this.abflussValueIs = trafficLightIndicatorsStates.abflussValueYellow;
    }

    //---- red conditions
    //red  temp condition
    if (this.luftTempValue < -2) {
      this.luftTempValueIs = trafficLightIndicatorsStates.luftTempValueRed;
    }

    //red water run off condition
    if (this.abflussValue > 400) {
      this.abflussValueIs = trafficLightIndicatorsStates.abflussValueRed;
    }

    //red condition
    if (this.wasserstandValue > 260) {
      this.wasserstandValueIs = trafficLightIndicatorsStates.wasserstandValueRed;
    }
    //red condition
    if (this.windSpeedValue > 21) {
      this.windSpeedValueIs = trafficLightIndicatorsStates.windSpeedValueRed;
    }
  }
}
