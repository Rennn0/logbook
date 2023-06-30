import { HostListener, Pipe, PipeTransform, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { HomeComponent } from 'src/app/pages/home/home.component';

export interface CourseData {
  date: string;
  startTime: string;
  endTime: string;
  weeklyRepeat: number;
  weekDay: string;
}

export interface planCourseInterface {
  boatIDs: string[];
  courses: CourseData[];
}

@Component({
  selector: 'app-plan-course',
  templateUrl: './plan-course.component.html',
  styleUrls: ['./plan-course.component.scss'],
})
export class PlanCourseComponent {
  @HostListener('document:keydown.escape', ['$keyEvent'])
  escapeEvent(keyEvent: KeyboardEvent) {
    this.renderNO();
  }

  myBoatData: any[];
  pattern: string = '';
  render: boolean = false;
  chosenCoursesList: any[] = [];
  expandCalendar: boolean = false;
  expandedTitle: string = 'CREATE SCHEDULE';
  notExpandedTitle: string = 'CHOOSE DATE AND TIME';

  myCourseData: CourseData;
  inputsFilled = false;

  dataToRender: CourseData[] = [];
  renderCount: number = 0;

  tempCourseData: CourseData = {
    date: '',
    startTime: '',
    endTime: '',
    weeklyRepeat: 0,
    weekDay: '',
  };
  editing: boolean = false;
  editingIndex: number;
  editingData: CourseData;
  editingIcon = '../../../../assets/icons/drop-down-grey.svg';
  notEditingIcon = '../../../../assets/icons/edit.svg';

  dayName: string;
  pickedDate: string;
  minDate: string;
  constructor(private c: HomeComponent) {
    this.myBoatData = c.getFilteredData();
    const today = new Date();
    today.setDate(today.getDate() + 7);
    this.minDate = today.toISOString().split('T')[0];
    console.log(this.minDate);
  }

  saveChanges() {
    this.myCourseData = {
      date: '',
      startTime: '',
      endTime: '',
      weeklyRepeat: 0,
      weekDay: '',
    };
    this.editing = false;
    this.toggleCalendar();
    // console.log('SAVE', this.tempCourseData, this.myCourseData);
  }

  discardChanges() {
    this.dataToRender[this.editingIndex] = this.tempCourseData;
    this.editing = false;
    this.toggleCalendar();
  }

  setStartDateDisplay(time: any): void {
    const date = new Date(time.value);
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    this.dayName = dayNames[date.getDay()];
    this.pickedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.myCourseData.date = this.pickedDate;
    this.myCourseData.weekDay = this.dayName;
  }

  finalForm: planCourseInterface = {
    boatIDs: [],
    courses: [],
  };
  formSubmit() {
    console.log(this.chosenCoursesList, this.dataToRender);

    for (let item of this.chosenCoursesList) {
      this.finalForm.boatIDs.push(item._id);
    }

    this.finalForm.courses = [...this.dataToRender];

    console.log(this.finalForm);
  }

  checkInputFields() {
    for (let key in this.myCourseData) {
      if (
        this.myCourseData[key] === '' ||
        this.myCourseData[key] === 0 ||
        this.myCourseData[key] === undefined
      ) {
        return;
      }
    }
    this.inputsFilled = true;
  }

  editScheduled(data: CourseData, index: number) {
    if (
      this.editing &&
      !(this.editingData === data) &&
      !(this.editingIndex === index)
    )
      return;

    if (this.expandCalendar) return;
    this.editing = !this.editing;
    this.editingIndex = index;
    this.editingData = data;
    this.toggleCalendar(data);
  }
  deleteScheduled(data: CourseData) {
    if (!this.editing) {
      this.dataToRender = this.dataToRender.filter((item) => item !== data);
    }
  }

  onSubmit() {
    this.inputsFilled = false;
    this.dataToRender.push(this.myCourseData);
    this.renderCount++;

    this.myCourseData = {
      date: '',
      startTime: '',
      endTime: '',
      weeklyRepeat: 0,
      weekDay: '',
    };

    this.toggleCalendar();
  }

  getWeekDayName(date: string, locale: string) {
    const date_ = new Date(date);
    return date_.toLocaleDateString(locale, { weekday: 'long' });
  }

  toggleCalendar(editingData: CourseData = undefined) {
    if (this.editing && this.expandCalendar) return;

    const calDom = document.getElementById('t');
    if (this.dataToRender.length > 0) {
      calDom.style.setProperty('--border', 'none');
      const imgDom = document.getElementById('img');
      imgDom.style.setProperty('--img-size', '15px');
      const textDom = document.getElementById('title');
      textDom.style.setProperty('--text-size', 'small');
      const imgBack = document.getElementById('calendar');
      imgBack.style.setProperty('--back-rad', '28px');
      this.notExpandedTitle = 'ADD DATE';
    }

    this.expandCalendar = !this.expandCalendar;
    if (this.editing) {
      this.myCourseData = editingData;
      this.tempCourseData = {
        ...this.myCourseData,
      };
      // console.log('EDITING TOGGLE', this.tempCourseData, this.myCourseData);
      return;
    }
    this.inputsFilled = false;

    // console.log('BEFORE TOGGLE', this.myCourseData);
    this.myCourseData = {
      date: '',
      startTime: '',
      endTime: '',
      weeklyRepeat: 0,
      weekDay: '',
    };
  }

  removeFromList(data: any) {
    this.chosenCoursesList = this.chosenCoursesList.filter((obj) => {
      return obj._id !== data._id;
    });
  }

  addToList(boat: any) {
    this.chosenCoursesList.push(boat);
  }

  exit() {
    this.c.showPlanCourse();
  }

  renderOK() {
    this.render = true;
  }

  renderNO() {
    this.render = false;
  }
}

@Pipe({
  name: 'filterBoats',
})
export class FilterBoatsPipe implements PipeTransform {
  transform(boats: any[][], pattern: string): any[] {
    const flattenedBoats = boats.reduce(
      (acc, boatArray) => acc.concat(boatArray),
      []
    );

    if (!pattern) {
      return flattenedBoats.slice(0, 12);
    }

    const filteredBoats = flattenedBoats.filter((boat) =>
      boat.name.toLowerCase().includes(pattern.toLowerCase())
    );

    return filteredBoats.slice(0, 6);
  }
}
