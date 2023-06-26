export interface sessionEventTypeDataInterface {
  sessionType: number | undefined;
  sessionId?: string;
  data: any;
}

export interface prefillResponseDataInterface {
  session?: any;
  booking: any;
  sessionNumber: number;
  success: boolean;
}
