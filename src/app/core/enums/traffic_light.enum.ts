export enum trafficLightEnum {
  terminalRed = 1,
  terminalYellow = 2,
  terminalGreen = 3,
  automatically = 4,
}

export enum trafficLightTextEnum {
  terminalRed = 'RED',
  terminalYellow = 'YELLOW',
  terminalGreen = 'GREEN',
  automatically = 'AUTOMATIC',
}

export enum trafficLightIndicatorsStates {
  wasserstandValueYellow = 0,
  wasserstandValueRed = 1,
  wasserstandValueGreen = 3,

  abflussValueYellow = 4,
  abflussValueRed = 5,
  abflussValueGreen = 6,

  wassertempValueYellow = 7,
  wassertempValueRed = 8,
  wassertempValueGreen = 9,

  luftTempValueYellow = 10,
  luftTempValueRed = 11,
  luftTempValueGreen = 12,

  windSpeedValueYellow = 13,
  windSpeedValueRed = 14,
  windSpeedValueGreen = 15,
}

export const trafficLightConfig = [
  {
    terminalStateNumber: 1,
    terminalStateText: 'RED',
  },
  {
    terminalStateNumber: 2,
    terminalStateText: 'YELLOW',
  },
  {
    terminalStateNumber: 3,
    terminalStateText: 'GREEN',
  },
  {
    terminalStateNumber: 4,
    terminalStateText: 'AUTOMATIC',
  },
];
